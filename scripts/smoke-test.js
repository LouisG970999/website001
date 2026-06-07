const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");

const root = path.join(__dirname, "..");
const betaCode = "smoke-beta-code";
const adminCode = "smoke-admin-code";
const feedbackFile = path.join(root, ".data", "feedback.json");
const originalFeedback = readExistingFeedback();
let port = 0;
let baseUrl = "";
let child = null;
let webhookServer = null;
let webhookPort = 0;
const webhookEvents = [];
let output = "";

runSmokeTest()
  .then(() => {
    console.log("Smoke test passed.");
    cleanup(0);
  })
  .catch(error => {
    console.error(error.message || error);
    if (output.trim()) console.error(output.trim());
    cleanup(1);
  });

async function runSmokeTest() {
  port = await resolvePort();
  do {
    webhookPort = await resolvePort();
  } while (webhookPort === port);
  baseUrl = `http://127.0.0.1:${port}`;
  webhookServer = await startWebhookServer(webhookPort);
  child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      APP_MODE: "production",
      PUBLIC_BASE_URL: "https://techspec-smoke.example",
      SUPPORT_EMAIL: "support@techspec-smoke.example",
      SUPPORT_WEBSITE: "https://techspec-smoke.example/support/",
      SUPPORT_PRIVACY_CHOICES_URL: "https://techspec-smoke.example/support/privacy-choices.html",
      PUBLISHER_NAME: "TechSpec Smoke Publisher",
      PRIVACY_PUBLICATION_DATE: "2026-06-02",
      BETA_ACCESS_CODE: betaCode,
      FEEDBACK_ADMIN_CODE: adminCode,
      AUTOMATION_FEEDBACK_WEBHOOK_URL: `http://127.0.0.1:${webhookPort}/feedback`,
      AUTOMATION_WEBHOOK_SECRET: "smoke-automation-secret",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "smoke-test-placeholder"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", chunk => {
    output += chunk.toString();
  });
  child.stderr.on("data", chunk => {
    output += chunk.toString();
  });

  await main();
}

async function main() {
  await waitForServer();

  const health = await getJson("/api/health");
  assert(health.ok === true, "Health endpoint did not report ok.");
  assert(health.appMode === "production", "Smoke server did not start in production mode.");
  assert(health.betaAccessRequired === true, "Beta access should be required during smoke test.");
  assert(Array.isArray(health.localAccessUrls) && health.localAccessUrls.length === 0, "Production health endpoint exposed local network addresses.");
  assert(health.automation?.feedbackWebhookConfigured === true, "Feedback automation webhook should be configured during smoke test.");

  const preflight = await getJson("/api/preflight");
  assert(Array.isArray(preflight.checks), "Preflight checks are missing.");
  assert(preflight.support?.pagesAvailable === true, "Support pages are not all available.");
  assert(preflight.support?.privacyUrlConfigured === true, "Privacy URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.privacyChoicesUrlConfigured === true, "Privacy choices URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.termsUrlConfigured === true, "Terms URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.websiteConfigured === true, "Support URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.emailConfigured === true, "Support email should use the hosted environment override.");
  assert(preflight.support?.privacyPublished === true, "Privacy publication date should use the hosted environment override.");

  const supportConfig = await fetch(`${baseUrl}/support/support-config.js`);
  assert(supportConfig.status === 200, "Generated support config did not load.");
  const supportConfigText = await supportConfig.text();
  assert(supportConfigText.includes("support@techspec-smoke.example"), "Generated support config is missing SUPPORT_EMAIL.");
  assert(supportConfigText.includes("TechSpec Smoke Publisher"), "Generated support config is missing PUBLISHER_NAME.");
  assert(supportConfigText.includes("/support/privacy-choices.html"), "Generated support config is missing the privacy choices URL.");

  const privacyChoicesPage = await fetch(`${baseUrl}/support/privacy-choices.html`);
  assert(privacyChoicesPage.status === 200, "Privacy choices page did not load.");
  assert((await privacyChoicesPage.text()).includes("Your data choices"), "Privacy choices page content is missing.");

  const adminPage = await fetch(`${baseUrl}/support/admin-feedback.html`);
  assert(adminPage.status === 200, "Admin feedback page did not load.");
  assert(
    /noindex/i.test(adminPage.headers.get("x-robots-tag") || ""),
    "Admin feedback page is missing noindex X-Robots-Tag."
  );
  const adminPageText = await adminPage.text();
  assert(adminPageText.includes("feedbackTriagePanel"), "Admin feedback page is missing the triage panel.");
  assert(adminPageText.includes("copyFeedbackTriageBtn"), "Admin feedback page is missing the copy triage action.");

  const appShell = await fetch(`${baseUrl}/`);
  assert(appShell.status === 200, "App shell did not load.");
  assert(
    /noindex/i.test(appShell.headers.get("x-robots-tag") || ""),
    "Private beta app shell is missing noindex X-Robots-Tag."
  );
  assert(appShell.headers.get("x-frame-options") === "DENY", "App shell is missing X-Frame-Options protection.");
  assert(appShell.headers.get("cross-origin-opener-policy") === "same-origin", "App shell is missing Cross-Origin-Opener-Policy.");

  const robots = await fetch(`${baseUrl}/robots.txt`);
  assert(robots.status === 200, "robots.txt did not load.");
  assert((await robots.text()).includes("Disallow: /"), "robots.txt should disallow indexing during private beta.");

  const blockedFeedback = await postJson("/api/feedback", {
    category: "bug",
    message: "This should be blocked because the beta code is missing."
  });
  assert(blockedFeedback.status === 403, "Feedback without beta code should be blocked.");

  const sentFeedback = await postJson(
    "/api/feedback",
    {
      category: "bug",
      rating: "4",
      verdict: "partly-correct",
      page: "smoke test",
      message: "Smoke test feedback entry with enough useful detail.",
      appVersion: "smoke-test"
    },
    { "X-TechSpec-Beta-Code": betaCode }
  );
  assert(sentFeedback.status === 200 && sentFeedback.body?.id, "Feedback submission failed.");
  const webhookEvent = await waitForWebhookEvent();
  assert(webhookEvent?.body?.event === "beta_feedback_received", "Automation webhook did not receive the feedback event.");
  assert(webhookEvent?.body?.feedback?.verdict === "partly-correct", "Automation webhook did not preserve the verdict.");
  assert(webhookEvent?.headers?.["x-techspec-automation-secret"] === "smoke-automation-secret", "Automation webhook secret header is missing.");
  const webhookText = JSON.stringify(webhookEvent.body);
  assert(!webhookText.includes(betaCode), "Automation webhook exposed the beta access code.");
  assert(!webhookText.includes(adminCode), "Automation webhook exposed the feedback admin code.");

  const exported = await fetch(`${baseUrl}/api/feedback/export`, {
    headers: { "X-TechSpec-Admin-Code": adminCode }
  });
  assert(exported.status === 200, "Feedback export failed.");
  const exportBody = await exported.json();
  assert(
    Array.isArray(exportBody.feedback) && exportBody.feedback.some(entry => entry.id === sentFeedback.body.id),
    "Export did not include the smoke feedback entry."
  );
  const exportedEntry = exportBody.feedback.find(entry => entry.id === sentFeedback.body.id);
  assert(exportedEntry?.verdict === "partly-correct", "Export did not preserve the structured identification verdict.");

  const deleted = await postJson(
    "/api/feedback/delete",
    { id: sentFeedback.body.id },
    { "X-TechSpec-Admin-Code": adminCode }
  );
  assert(deleted.status === 200 && deleted.body?.deletedId === sentFeedback.body.id, "Feedback deletion failed.");
}

function resolvePort() {
  const requested = Number(process.env.SMOKE_TEST_PORT || 0);
  if (requested > 0) return Promise.resolve(requested);

  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const selectedPort = typeof address === "object" && address ? address.port : 0;
      probe.close(() => {
        if (!selectedPort) {
          reject(new Error("Could not reserve a smoke-test port."));
          return;
        }
        resolve(selectedPort);
      });
    });
  });
}

function startWebhookServer(selectedPort) {
  return new Promise((resolve, reject) => {
    const receiver = http.createServer((req, res) => {
      let body = "";
      req.setEncoding("utf8");
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = null;
        }
        webhookEvents.push({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: parsed
        });
        res.writeHead(204);
        res.end();
      });
    });
    receiver.on("error", reject);
    receiver.listen(selectedPort, "127.0.0.1", () => resolve(receiver));
  });
}

async function waitForWebhookEvent() {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (webhookEvents.length) return webhookEvents[0];
    await sleep(50);
  }
  throw new Error("Automation webhook did not receive feedback in time.");
}

async function waitForServer() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Smoke server did not become ready in time.");
}

async function getJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  assert(response.ok, `${pathname} returned ${response.status}.`);
  return response.json();
}

async function postJson(pathname, body, headers = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
  let parsed = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }
  return { status: response.status, body: parsed };
}

function readExistingFeedback() {
  try {
    return fs.readFileSync(feedbackFile, "utf8");
  } catch {
    return null;
  }
}

function restoreFeedback() {
  if (originalFeedback === null) {
    try {
      fs.rmSync(feedbackFile, { force: true });
    } catch {
      // Best effort cleanup only.
    }
    return;
  }
  fs.mkdirSync(path.dirname(feedbackFile), { recursive: true });
  fs.writeFileSync(feedbackFile, originalFeedback);
}

function cleanup(exitCode) {
  restoreFeedback();
  if (child) child.kill();
  if (webhookServer) webhookServer.close();
  setTimeout(() => process.exit(exitCode), 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
