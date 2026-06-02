const { spawn } = require("child_process");
const fs = require("fs");
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
  baseUrl = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      APP_MODE: "production",
      PUBLIC_BASE_URL: "https://techspec-smoke.example",
      BETA_ACCESS_CODE: betaCode,
      FEEDBACK_ADMIN_CODE: adminCode,
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

  const preflight = await getJson("/api/preflight");
  assert(Array.isArray(preflight.checks), "Preflight checks are missing.");
  assert(preflight.support?.pagesAvailable === true, "Support pages are not all available.");
  assert(preflight.support?.privacyUrlConfigured === true, "Privacy URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.termsUrlConfigured === true, "Terms URL should resolve from PUBLIC_BASE_URL.");
  assert(preflight.support?.websiteConfigured === true, "Support URL should resolve from PUBLIC_BASE_URL.");

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
      page: "smoke test",
      message: "Smoke test feedback entry with enough useful detail.",
      appVersion: "smoke-test"
    },
    { "X-TechSpec-Beta-Code": betaCode }
  );
  assert(sentFeedback.status === 200 && sentFeedback.body?.id, "Feedback submission failed.");

  const exported = await fetch(`${baseUrl}/api/feedback/export`, {
    headers: { "X-TechSpec-Admin-Code": adminCode }
  });
  assert(exported.status === 200, "Feedback export failed.");
  const exportBody = await exported.json();
  assert(
    Array.isArray(exportBody.feedback) && exportBody.feedback.some(entry => entry.id === sentFeedback.body.id),
    "Export did not include the smoke feedback entry."
  );

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
  setTimeout(() => process.exit(exitCode), 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
