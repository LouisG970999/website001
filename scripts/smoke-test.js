const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const port = Number(process.env.SMOKE_TEST_PORT || 31_000 + Math.floor(Math.random() * 4_000));
const baseUrl = `http://127.0.0.1:${port}`;
const betaCode = "smoke-beta-code";
const adminCode = "smoke-admin-code";
const feedbackFile = path.join(root, ".data", "feedback.json");
const originalFeedback = readExistingFeedback();

const child = spawn(process.execPath, ["server.js"], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(port),
    APP_MODE: "production",
    PUBLIC_BASE_URL: baseUrl,
    BETA_ACCESS_CODE: betaCode,
    FEEDBACK_ADMIN_CODE: adminCode,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "smoke-test-placeholder"
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
child.stdout.on("data", chunk => {
  output += chunk.toString();
});
child.stderr.on("data", chunk => {
  output += chunk.toString();
});

main()
  .then(() => {
    console.log("Smoke test passed.");
    cleanup(0);
  })
  .catch(error => {
    console.error(error.message || error);
    if (output.trim()) console.error(output.trim());
    cleanup(1);
  });

async function main() {
  await waitForServer();

  const health = await getJson("/api/health");
  assert(health.ok === true, "Health endpoint did not report ok.");
  assert(health.appMode === "production", "Smoke server did not start in production mode.");
  assert(health.betaAccessRequired === true, "Beta access should be required during smoke test.");

  const preflight = await getJson("/api/preflight");
  assert(Array.isArray(preflight.checks), "Preflight checks are missing.");
  assert(preflight.support?.pagesAvailable === true, "Support pages are not all available.");

  const adminPage = await fetch(`${baseUrl}/support/admin-feedback.html`);
  assert(adminPage.status === 200, "Admin feedback page did not load.");
  assert(
    /noindex/i.test(adminPage.headers.get("x-robots-tag") || ""),
    "Admin feedback page is missing noindex X-Robots-Tag."
  );

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
  child.kill();
  setTimeout(() => process.exit(exitCode), 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
