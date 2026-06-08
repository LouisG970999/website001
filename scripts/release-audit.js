const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const metadata = readJson("release-metadata.json");
const manifest = readJson("public/manifest.webmanifest");
const packageJson = readJson("package.json");
const remoteEnabled = process.argv.includes("--remote");
const strictEnabled = process.argv.includes("--strict");
const results = [];

run()
  .then(() => {
    printReport();
    const failures = results.filter(result => result.level === "FAIL");
    const warnings = results.filter(result => result.level === "WARN");
    if (failures.length || (strictEnabled && warnings.length)) process.exitCode = 1;
  })
  .catch(error => {
    console.error(`Release audit crashed: ${error.message || error}`);
    process.exitCode = 1;
  });

async function run() {
  checkRequiredFiles();
  checkReleaseIdentity();
  checkManifest();
  checkAppStoreIcon();
  checkBuildVersions();
  checkPublicContent();
  checkSecrets();
  checkReleaseReadiness();
  if (remoteEnabled) await checkRemoteRelease();
}

function checkRequiredFiles() {
  const required = [
    "server.js",
    "public/index.html",
    "public/app.js",
    "public/styles.css",
    "public/manifest.webmanifest",
    "public/icons/icon-1024.png",
    "public/support/index.html",
    "public/support/privacy.html",
    "public/support/privacy-choices.html",
    "public/support/terms.html",
    "public/support/legal.html",
    "docs/app-store-listing-draft.md",
    "docs/app-store-privacy-worksheet.md",
    "docs/ios-packaging-handoff.md",
    "docs/testflight-submission-packet.md"
  ];
  const missing = required.filter(relativePath => !fs.existsSync(path.join(root, relativePath)));
  add(missing.length ? "FAIL" : "PASS", "Required release files", missing.length ? `Missing: ${missing.join(", ")}` : `${required.length} required files found.`);
}

function checkReleaseIdentity() {
  const app = metadata.app || {};
  const contact = metadata.contact || {};
  const urls = metadata.urls || {};
  add(app.name === "TechSpec Scanner" ? "PASS" : "FAIL", "App name", app.name || "Missing app name.");
  add(/^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/i.test(app.bundleIdentifier || "") ? "PASS" : "FAIL", "Bundle identifier", app.bundleIdentifier || "Missing bundle identifier.");
  add(/^\d+\.\d+\.\d+$/.test(app.marketingVersion || "") ? "PASS" : "FAIL", "Marketing version", app.marketingVersion || "Missing marketing version.");
  add(/^\d+$/.test(app.buildNumber || "") ? "PASS" : "FAIL", "Build number", app.buildNumber || "Missing build number.");
  add(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.supportEmail || "") ? "PASS" : "FAIL", "Support email", contact.supportEmail || "Missing support email.");

  for (const [key, value] of Object.entries(urls)) {
    add(isHttpsUrl(value) ? "PASS" : "FAIL", `HTTPS URL: ${key}`, value || "Missing URL.");
  }
}

function checkManifest() {
  add(manifest.name === metadata.app.name ? "PASS" : "FAIL", "Manifest app name", manifest.name || "Missing manifest name.");
  add(manifest.display === "standalone" ? "PASS" : "FAIL", "Standalone display", `display=${manifest.display || "missing"}`);
  add(manifest.scope === "/" ? "PASS" : "FAIL", "Manifest scope", `scope=${manifest.scope || "missing"}`);
  const iconSizes = new Set((manifest.icons || []).map(icon => icon.sizes));
  add(iconSizes.has("192x192") && iconSizes.has("512x512") && iconSizes.has("1024x1024") ? "PASS" : "FAIL", "Manifest icon set", Array.from(iconSizes).join(", ") || "No icons.");
}

function checkAppStoreIcon() {
  const iconPath = path.join(root, "public", "icons", "icon-1024.png");
  if (!fs.existsSync(iconPath)) {
    add("FAIL", "App Store icon", "icon-1024.png is missing.");
    return;
  }
  const png = fs.readFileSync(iconPath);
  const validSignature = png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!validSignature || png.length < 26) {
    add("FAIL", "App Store icon", "The 1024 icon is not a valid PNG.");
    return;
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const colorType = png[25];
  const hasAlphaChannel = colorType === 4 || colorType === 6;
  add(width === 1024 && height === 1024 ? "PASS" : "FAIL", "App Store icon dimensions", `${width}x${height}`);
  add(!hasAlphaChannel ? "PASS" : "FAIL", "App Store icon transparency", hasAlphaChannel ? `PNG color type ${colorType} contains alpha.` : `PNG color type ${colorType} has no alpha channel.`);
}

function checkBuildVersions() {
  const serverText = readText("server.js");
  const appText = readText("public/app.js");
  const indexText = readText("public/index.html");
  const swText = readText("public/sw.js");
  const serverVersion = match(serverText, /SERVER_VERSION\s*=\s*"([^"]+)"/);
  const appVersion = match(appText, /appBuildVersion\s*=\s*"([^"]+)"/);
  const indexAppVersion = match(indexText, /app\.js\?v=([^"]+)/);
  const indexCssVersion = match(indexText, /styles\.css\?v=([^"]+)/);
  const swAppVersion = match(swText, /app\.js\?v=([^"]+)/);
  const versions = [serverVersion, appVersion, indexAppVersion, indexCssVersion, swAppVersion];
  add(versions.every(Boolean) && new Set(versions).size === 1 ? "PASS" : "FAIL", "Build version consistency", versions.map(value => value || "missing").join(" / "));
  add(packageJson.private === true ? "PASS" : "FAIL", "Private source package", `package.json private=${packageJson.private}`);
}

function checkPublicContent() {
  const publicFiles = listFiles(path.join(root, "public")).filter(file => /\.(html|js|webmanifest)$/i.test(file));
  const forbidden = [
    { label: "placeholder support email", pattern: /support@example\.com/i },
    { label: "draft publication marker", pattern: />\s*Draft\s*</i },
    { label: "production-domain placeholder", pattern: /your-production-domain\.example/i },
    { label: "outdated release instruction", pattern: /replace placeholder support email/i }
  ];
  const issues = [];
  for (const file of publicFiles) {
    const relativePath = path.relative(root, file).replace(/\\/g, "/");
    const text = fs.readFileSync(file, "utf8");
    for (const rule of forbidden) {
      if (rule.pattern.test(text)) issues.push(`${relativePath}: ${rule.label}`);
    }
  }
  add(issues.length ? "FAIL" : "PASS", "Public placeholder scan", issues.length ? issues.join("; ") : `${publicFiles.length} public text files checked.`);
}

function checkSecrets() {
  const publicFiles = listFiles(path.join(root, "public")).filter(file => /\.(html|js|css|json|webmanifest)$/i.test(file));
  const patterns = [
    /AIza[0-9A-Za-z_-]{20,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /ghp_[0-9A-Za-z]{30,}/,
    /github_pat_[0-9A-Za-z_]{30,}/
  ];
  const hits = [];
  for (const file of publicFiles) {
    const text = fs.readFileSync(file, "utf8");
    if (patterns.some(pattern => pattern.test(text))) hits.push(path.relative(root, file).replace(/\\/g, "/"));
  }
  add(hits.length ? "FAIL" : "PASS", "Frontend secret scan", hits.length ? `Potential secret in: ${hits.join(", ")}` : `${publicFiles.length} frontend files checked.`);
}

function checkReleaseReadiness() {
  const readiness = metadata.releaseReadiness || {};
  const pending = Object.entries(readiness).filter(([, complete]) => !complete).map(([key]) => key);
  add(pending.length ? "WARN" : "PASS", "Manual release readiness", pending.length ? `Pending: ${pending.join(", ")}` : "All manual release items confirmed.");
  add(metadata.publisher?.legalNameConfirmed ? "PASS" : "WARN", "Legal publisher identity", metadata.publisher?.legalNameConfirmed ? metadata.publisher.displayName : "Final legal publisher name is not confirmed.");
  add(metadata.releaseChannel === "private-beta" ? "WARN" : "PASS", "Release channel", `Current channel: ${metadata.releaseChannel}`);
}

async function checkRemoteRelease() {
  const baseUrl = String(metadata.urls?.publicBaseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) {
    add("FAIL", "Remote release", "publicBaseUrl is missing.");
    return;
  }
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`, { headers: { "User-Agent": "TechSpec-Release-Audit/1.0" } });
    const health = await healthResponse.json();
    add(healthResponse.ok && health.ok ? "PASS" : "FAIL", "Remote health", `${healthResponse.status} server=${health.serverVersion || "unknown"}`);
    add(health.preflight?.blockingCount === 0 ? "PASS" : "FAIL", "Remote preflight", `blocking=${health.preflight?.blockingCount ?? "unknown"}`);
    add(Array.isArray(health.localAccessUrls) && health.localAccessUrls.length === 0 ? "PASS" : "FAIL", "Remote network privacy", `localAccessUrls=${JSON.stringify(health.localAccessUrls)}`);
    add(health.serverVersion === getLocalBuildVersion() ? "PASS" : "WARN", "Deployed build version", `local=${getLocalBuildVersion()} remote=${health.serverVersion || "unknown"}`);

    for (const [key, url] of Object.entries(metadata.urls || {})) {
      if (key === "publicBaseUrl") continue;
      const response = await fetch(url, { redirect: "follow" });
      add(response.ok ? "PASS" : "FAIL", `Remote page: ${key}`, `${response.status} ${url}`);
      if (key === "support") {
        add(response.headers.get("x-frame-options") === "DENY" ? "PASS" : "FAIL", "Remote anti-framing header", response.headers.get("x-frame-options") || "Missing X-Frame-Options.");
      }
    }
  } catch (error) {
    add("FAIL", "Remote release", error.message || String(error));
  }
}

function getLocalBuildVersion() {
  return match(readText("server.js"), /SERVER_VERSION\s*=\s*"([^"]+)"/);
}

function printReport() {
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  results.sort((a, b) => order[a.level] - order[b.level]);
  console.log("\nTechSpec Scanner release audit");
  console.log(`Mode: ${remoteEnabled ? "local + hosted" : "local"}${strictEnabled ? " (strict)" : ""}\n`);
  for (const result of results) {
    console.log(`[${result.level}] ${result.name}: ${result.detail}`);
  }
  const totals = {
    pass: results.filter(result => result.level === "PASS").length,
    warn: results.filter(result => result.level === "WARN").length,
    fail: results.filter(result => result.level === "FAIL").length
  };
  console.log(`\nSummary: ${totals.pass} passed, ${totals.warn} warnings, ${totals.fail} failed.`);
}

function add(level, name, detail) {
  results.push({ level, name, detail });
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function match(text, pattern) {
  return text.match(pattern)?.[1] || "";
}
