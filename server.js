const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const root = __dirname;
const publicDir = path.join(root, "public");
const dataDir = path.join(root, ".data");
const usageFile = path.join(dataDir, "usage.json");
const feedbackFile = path.join(dataDir, "feedback.json");
loadEnv(path.join(root, ".env"));

const SERVER_VERSION = "20260605-2";
const SERVER_STARTED_AT = new Date().toISOString();
const PORT = Number(process.env.PORT || 3000);
const APP_MODE = normalizeAppMode(process.env.APP_MODE);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_FAST_MODEL = process.env.GEMINI_FAST_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_STRONG_MODEL = process.env.GEMINI_STRONG_MODEL || "gemini-2.5-flash";
const DAILY_SCAN_LIMIT = Number(process.env.DAILY_SCAN_LIMIT || 80);
const MONTHLY_SCAN_LIMIT = Number(process.env.MONTHLY_SCAN_LIMIT || 800);
const DAILY_WARNING_LIMIT = Number(process.env.DAILY_WARNING_LIMIT || Math.floor(DAILY_SCAN_LIMIT * 0.8));
const MONTHLY_WARNING_LIMIT = Number(process.env.MONTHLY_WARNING_LIMIT || Math.floor(MONTHLY_SCAN_LIMIT * 0.8));
const INSTALL_DAILY_SCAN_LIMIT = Number(process.env.INSTALL_DAILY_SCAN_LIMIT || 25);
const INSTALL_MONTHLY_SCAN_LIMIT = Number(process.env.INSTALL_MONTHLY_SCAN_LIMIT || 250);
const INSTALL_DAILY_WARNING_LIMIT = Number(process.env.INSTALL_DAILY_WARNING_LIMIT || Math.floor(INSTALL_DAILY_SCAN_LIMIT * 0.8));
const INSTALL_MONTHLY_WARNING_LIMIT = Number(process.env.INSTALL_MONTHLY_WARNING_LIMIT || Math.floor(INSTALL_MONTHLY_SCAN_LIMIT * 0.8));
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 12);
const MAX_ANALYZE_BODY_BYTES = Number(process.env.MAX_ANALYZE_BODY_BYTES || 14 * 1024 * 1024);
const MAX_FEEDBACK_BODY_BYTES = Number(process.env.MAX_FEEDBACK_BODY_BYTES || 128 * 1024);
const MAX_IMAGE_BASE64_CHARS = Number(process.env.MAX_IMAGE_BASE64_CHARS || 6_500_000);
const BETA_ACCESS_CODE = (process.env.BETA_ACCESS_CODE || "").trim();
const FEEDBACK_ADMIN_CODE = (process.env.FEEDBACK_ADMIN_CODE || "").trim();
const rateLimitBuckets = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      const installId = getInstallId(req);
      sendJson(res, 200, {
        ok: true,
        geminiConfigured: Boolean(GEMINI_API_KEY),
        model: GEMINI_FAST_MODEL,
        strongModel: GEMINI_STRONG_MODEL,
        appMode: APP_MODE,
        betaAccessRequired: isBetaAccessRequired(),
        serverVersion: SERVER_VERSION,
        startedAt: SERVER_STARTED_AT,
        localAccessUrls: getLocalAccessUrls(),
        usage: getUsageSnapshot(undefined, installId),
        preflight: getPreflightSnapshot(req)
      });
      return;
    }

    if (req.method === "GET" && req.url === "/api/preflight") {
      sendJson(res, 200, getPreflightSnapshot(req));
      return;
    }

    if (req.method === "GET" && req.url === "/api/usage") {
      sendJson(res, 200, getUsageSnapshot(undefined, getInstallId(req)));
      return;
    }

    if (req.method === "POST" && req.url === "/api/beta-access") {
      await handleBetaAccess(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/feedback") {
      await handleFeedback(req, res);
      return;
    }

    if (req.method === "GET" && req.url === "/api/feedback/export") {
      handleFeedbackExport(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/feedback/delete") {
      await handleFeedbackDelete(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/analyze") {
      await handleAnalyze(req, res);
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendError(res, 405, "METHOD_NOT_ALLOWED", "Method not allowed.");
  } catch (error) {
    console.error(error);
    sendError(
      res,
      error.statusCode || 500,
      error.code || "SERVER_ERROR",
      error.publicMessage || "Something went wrong while processing the request."
    );
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TechSpec Scanner running at http://localhost:${PORT}`);
  console.log("Use your laptop's local IP address to open it from an iPhone on the same Wi-Fi.");
});

async function handleAnalyze(req, res) {
  const installId = getInstallId(req);
  if (!hasValidBetaAccess(req)) {
    sendError(res, 403, "BETA_ACCESS_REQUIRED", "A valid beta access code is required for this app build.");
    return;
  }

  const clientId = `${getClientId(req)}:${installId}`;
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    sendError(res, 429, "RATE_LIMITED", "Too many scan requests. Please wait a moment and try again.", {
      retryAfterSeconds: rateCheck.retryAfterSeconds,
      usage: getUsageSnapshot(undefined, installId)
    });
    return;
  }

  const limitCheck = checkUsageLimit(installId);
  if (!limitCheck.allowed) {
    sendError(res, 429, limitCheck.code || "USAGE_LIMIT_REACHED", limitCheck.message, {
      usage: getUsageSnapshot(undefined, installId)
    });
    return;
  }

  const body = await readJsonBody(req, MAX_ANALYZE_BODY_BYTES);
  const { notes, projectName } = body;
  const scanMode = normalizeScanMode(body.scanMode);
  const photoChecklist = normalizeChecklist(body.photoChecklist);
  const measurements = normalizeMeasurements(body.measurements);
  const language = normalizeLanguage(body.language);
  const images = normalizeImages(body);

  if (!images.length) {
    sendError(res, 400, "MISSING_IMAGE", "Missing image data.");
    return;
  }

  const model = chooseModel({ scanMode, images, measurements });
  const usage = incrementUsage({ model, source: GEMINI_API_KEY ? "gemini" : "demo", installId });

  if (!GEMINI_API_KEY) {
    sendJson(res, 200, {
      source: "demo",
      model,
      usage,
      result: demoComponentResult(notes, scanMode, language)
    });
    return;
  }

  const result = await analyzeWithGemini({ images, notes, scanMode, photoChecklist, measurements, projectName, language, model });
  sendJson(res, 200, {
    source: "gemini",
    model,
    usage,
    result
  });
}

async function handleBetaAccess(req, res) {
  const body = await readJsonBody(req, MAX_FEEDBACK_BODY_BYTES);
  const code = String(body.code || "").trim();

  if (!isBetaAccessRequired()) {
    sendJson(res, 200, { ok: true, required: false });
    return;
  }

  if (code && safeEqual(code, BETA_ACCESS_CODE)) {
    sendJson(res, 200, { ok: true, required: true });
    return;
  }

  sendError(res, 403, "INVALID_BETA_CODE", "Invalid beta access code.");
}

async function handleFeedback(req, res) {
  const installId = getInstallId(req);
  if (!hasValidBetaAccess(req)) {
    sendError(res, 403, "BETA_ACCESS_REQUIRED", "A valid beta access code is required to send beta feedback.");
    return;
  }

  const clientId = `${getClientId(req)}:${installId}:feedback`;
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    sendError(res, 429, "RATE_LIMITED", "Too many feedback requests. Please wait a moment and try again.", {
      retryAfterSeconds: rateCheck.retryAfterSeconds
    });
    return;
  }

  const body = await readJsonBody(req, MAX_FEEDBACK_BODY_BYTES);
  const entry = {
    id: `fb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    installId,
    category: sanitizeText(body.category, 48) || "general",
    rating: clampNumber(body.rating, 1, 5) || null,
    page: sanitizeText(body.page, 80),
    message: sanitizeText(body.message, 2400),
    contact: sanitizeText(body.contact, 160),
    appVersion: sanitizeText(body.appVersion, 80),
    browserOnline: typeof body.browserOnline === "boolean" ? body.browserOnline : null,
    screen: sanitizeText(body.screen, 40),
    userAgent: sanitizeText(req.headers["user-agent"], 300)
  };

  if (!entry.message || entry.message.length < 8) {
    sendError(res, 400, "FEEDBACK_TOO_SHORT", "Please include a little more detail in your feedback.");
    return;
  }

  const feedback = readJsonArray(feedbackFile).slice(-499);
  feedback.push(entry);
  writeJsonFile(feedbackFile, feedback);
  sendJson(res, 200, { ok: true, id: entry.id });
}

function handleFeedbackExport(req, res) {
  if (!hasValidFeedbackAdminAccess(req)) {
    sendError(res, 403, "ADMIN_ACCESS_REQUIRED", "A valid feedback admin code is required.");
    return;
  }

  const feedback = readJsonArray(feedbackFile);
  sendJson(res, 200, {
    ok: true,
    generatedAt: new Date().toISOString(),
    count: feedback.length,
    feedback
  });
}

async function handleFeedbackDelete(req, res) {
  if (!hasValidFeedbackAdminAccess(req)) {
    sendError(res, 403, "ADMIN_ACCESS_REQUIRED", "A valid feedback admin code is required.");
    return;
  }

  const body = await readJsonBody(req, MAX_FEEDBACK_BODY_BYTES);
  const id = sanitizeText(body.id, 120);
  if (!id) {
    sendError(res, 400, "MISSING_FEEDBACK_ID", "Missing feedback id.");
    return;
  }

  const feedback = readJsonArray(feedbackFile);
  const nextFeedback = feedback.filter(entry => entry.id !== id);
  if (nextFeedback.length === feedback.length) {
    sendError(res, 404, "FEEDBACK_NOT_FOUND", "Feedback entry not found.");
    return;
  }

  writeJsonFile(feedbackFile, nextFeedback);
  sendJson(res, 200, {
    ok: true,
    deletedId: id,
    count: nextFeedback.length
  });
}

async function analyzeWithGemini({ images, notes, scanMode, photoChecklist, measurements, projectName, language, model }) {
  const schema = {
    type: "object",
    properties: {
      componentName: { type: "string" },
      detectedCategory: { type: "string" },
      componentFamily: { type: "string" },
      category: { type: "string" },
      evidenceSummary: { type: "string" },
      likelyFunction: { type: "string" },
      visibleFeatures: {
        type: "array",
        items: { type: "string" }
      },
      possibleMaterial: { type: "string" },
      possibleStandardOrPartNumber: { type: "string" },
      markingsText: { type: "string" },
      measurementClues: {
        type: "array",
        items: { type: "string" }
      },
      likelyStandards: {
        type: "array",
        items: { type: "string" }
      },
      identificationAlternatives: {
        type: "array",
        items: { type: "string" }
      },
      recommendedChecks: {
        type: "array",
        items: { type: "string" }
      },
      missingEvidence: {
        type: "array",
        items: { type: "string" }
      },
      confidence: { type: "number" },
      uncertaintyWarnings: {
        type: "array",
        items: { type: "string" }
      },
      recommendedNextPhoto: { type: "string" }
    },
    required: [
      "componentName",
      "detectedCategory",
      "componentFamily",
      "category",
      "evidenceSummary",
      "likelyFunction",
      "visibleFeatures",
      "possibleMaterial",
      "possibleStandardOrPartNumber",
      "markingsText",
      "measurementClues",
      "likelyStandards",
      "identificationAlternatives",
      "recommendedChecks",
      "missingEvidence",
      "confidence",
      "uncertaintyWarnings",
      "recommendedNextPhoto"
    ]
  };

  const prompt = [
    "Identify the mechanical component shown in the provided image or images.",
    "This is for a mechanical/industrial component scanner used with real workshop photos.",
    `Answer language: ${language.label}. Return every user-facing string in this language, including lists, warnings, and recommended checks.`,
    `Selected scan mode: ${scanMode.label}.`,
    scanMode.prompt,
    photoChecklist.length
      ? `The user says these photo types are included: ${photoChecklist.join(", ")}.`
      : "The user did not mark which photo types are included.",
    projectName ? `Project/session: ${projectName}.` : "Project/session: none.",
    measurements.length
      ? `Manual measurements and confirmed details: ${measurements.join("; ")}.`
      : "No manual measurements were provided.",
    "Use all images together if more than one is provided: overview, markings, side view, and scale may be split across images.",
    "If scan mode is Auto, first classify the component family internally, then apply the most relevant specialist analysis.",
    "Be careful: if exact identification is not possible, say so clearly.",
    "Base the answer only on visible evidence in the provided images plus the user's notes and measurements. Do not rely on earlier scans or assumed examples.",
    "Distinguish generic component family from exact part number: componentName may be a useful generic name, while possibleStandardOrPartNumber should only claim exact markings, standards, or part numbers when visible or strongly supported.",
    "Prefer practical engineering language over marketing language. Avoid overclaiming a specific standard, size, or manufacturer if it is not visible.",
    "Pay special attention to stamped text, engravings, thread geometry, bearing seals, shaft features, gear teeth, fastener head shapes, fittings, sensors, rollers, seals, springs, brackets, linear guides, and scale references.",
    "If the part is a fastener, include likely fastener type and what evidence supports it. If the part is a bearing, include bearing subtype and visible seal/row/alignment clues.",
    "If the part belongs to hydraulics/pneumatics, focus on fitting type, port/thread shape, sealing surface, hose/tube connection, and pressure-related clues.",
    "If the part is electrical/mechatronic, focus on connector style, sensor body, actuator features, cable exit, labels, and mounting form.",
    "If markings are unreadable, set markingsText to a short statement saying that no readable markings are visible.",
    "evidenceSummary should explain the main visual clues behind the identification in one short paragraph.",
    "visibleFeatures should name concrete observed features, not assumptions.",
    "identificationAlternatives should list plausible alternatives only when they are genuinely possible from the image, with a short reason for each.",
    "recommendedChecks should be practical next steps a technician can do, such as measure OD/ID/width, thread pitch, count teeth, inspect markings, or photograph a side view.",
    "missingEvidence should list the information that prevents exact identification.",
    "Confidence must be a number from 0 to 1. Keep confidence under 0.75 when no readable markings or scale are visible, and under 0.6 when the image is blurry, cropped, or shows only one ambiguous view.",
    notes ? `User notes: ${notes}` : "User notes: none"
  ].join("\n");

  const imageParts = images.map(image => ({
    inline_data: {
      mime_type: image.mimeType,
      data: image.imageBase64
    }
  }));

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                ...imageParts
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
          }
        })
      }
    );
  } catch (error) {
    throw createHttpError(502, "GEMINI_NETWORK", "Could not reach Google Gemini from the server.", error.message);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const code = geminiErrorCode(response.status);
    throw createHttpError(response.status, code, geminiPublicMessage(code), data.error?.message || "Gemini request failed.");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw createHttpError(502, "GEMINI_EMPTY_RESPONSE", "Gemini returned no structured text result.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw createHttpError(502, "GEMINI_INVALID_JSON", "Gemini returned a result that could not be parsed.", error.message);
  }
}

function normalizeImages(body) {
  const rawImages = Array.isArray(body.images)
    ? body.images
    : [{ imageBase64: body.imageBase64, mimeType: body.mimeType }];
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
  const normalized = [];

  for (const image of rawImages.slice(0, 4)) {
    if (!image || !image.imageBase64 || !image.mimeType) continue;

    const mimeType = String(image.mimeType).toLowerCase();
    const imageBase64 = String(image.imageBase64);
    if (!allowedTypes.has(mimeType)) {
      throw createHttpError(415, "UNSUPPORTED_IMAGE_TYPE", `Unsupported image type: ${mimeType}. Use JPEG, PNG, WebP, HEIC, or HEIF.`);
    }
    if (imageBase64.length > MAX_IMAGE_BASE64_CHARS) {
      throw createHttpError(413, "IMAGE_TOO_LARGE", "Image is too large. Take a smaller photo or use fewer images.");
    }

    normalized.push({ imageBase64, mimeType });
  }

  return normalized;
}

function geminiErrorCode(status) {
  if (status === 400) return "GEMINI_BAD_REQUEST";
  if (status === 401 || status === 403) return "GEMINI_AUTH";
  if (status === 404) return "GEMINI_MODEL_NOT_FOUND";
  if (status === 408 || status === 504) return "GEMINI_TIMEOUT";
  if (status === 409 || status === 429) return "GEMINI_QUOTA_OR_RATE_LIMIT";
  if (status >= 500) return "GEMINI_SERVER_ERROR";
  return "GEMINI_REQUEST_FAILED";
}

function geminiPublicMessage(code) {
  const messages = {
    GEMINI_BAD_REQUEST: "Gemini rejected the request format.",
    GEMINI_AUTH: "Gemini rejected the API key or project access.",
    GEMINI_MODEL_NOT_FOUND: "Configured Gemini model was not found.",
    GEMINI_TIMEOUT: "Gemini request timed out.",
    GEMINI_QUOTA_OR_RATE_LIMIT: "Gemini quota or rate limit was reached.",
    GEMINI_SERVER_ERROR: "Gemini returned a temporary server error.",
    GEMINI_REQUEST_FAILED: "Gemini request failed."
  };
  return messages[code] || messages.GEMINI_REQUEST_FAILED;
}

function chooseModel({ scanMode, images, measurements }) {
  const mode = scanMode?.label || "";
  const hasManyImages = images.length >= 3;
  const hasMeasurements = measurements.length > 0;
  const specialistMode = /Bearing|Hydraulic|pneumatic|Sensor|actuator|Linear/i.test(mode);
  if (hasManyImages || specialistMode || hasMeasurements) {
    return GEMINI_STRONG_MODEL;
  }
  return GEMINI_FAST_MODEL;
}

function normalizeLanguage(value) {
  const key = String(value || "en").toLowerCase();
  if (key === "de") {
    return { code: "de", label: "German" };
  }
  if (key === "fr") {
    return { code: "fr", label: "French" };
  }
  if (key === "es") {
    return { code: "es", label: "Spanish" };
  }
  return { code: "en", label: "English" };
}

function normalizeAppMode(value) {
  return String(value || "development").toLowerCase() === "production" ? "production" : "development";
}

function normalizeScanMode(value) {
  const modes = {
    auto: {
      label: "Auto detect",
      prompt: "First classify the component family, then use the best specialist analysis for that family. Do not force the part into a user-selected category."
    },
    general: {
      label: "General component",
      prompt: "Use broad mechanical identification across fasteners, bearings, gears, shafts, rollers, fittings, sensors, and machine parts."
    },
    fastener: {
      label: "Fastener or threaded part",
      prompt: "Prioritize head style, thread type, thread pitch clues, shank shape, washer/nut relationship, drive type, and likely fastener standard."
    },
    bearing: {
      label: "Bearing",
      prompt: "Prioritize bearing subtype, row count, seal/shield/open condition, raceway geometry, bore/OD/width clues, cage material, and visible markings."
    },
    gear: {
      label: "Gear or sprocket",
      prompt: "Prioritize tooth profile, tooth count clues, bore/keyway/set screw details, chain or belt compatibility, and visible wear patterns."
    },
    shaft: {
      label: "Shaft or turned part",
      prompt: "Prioritize shoulders, grooves, threads, keyways, retaining ring grooves, bearing seats, surface finish, and diameter step clues."
    },
    conveyor: {
      label: "Conveyor or roller part",
      prompt: "Prioritize roller, pulley, bearing housing, shaft end, guide rail, bracket, belt/chain interface, and mounting features."
    },
    fluid: {
      label: "Hydraulic or pneumatic part",
      prompt: "Prioritize fitting type, thread/port form, hose or tube connection, sealing surface, valve features, regulator/filter/lubricator clues, and pressure markings."
    },
    sensor: {
      label: "Sensor or actuator",
      prompt: "Prioritize sensor type, actuator body, connector, cable exit, mounting pattern, labels, target surface, and electrical/mechatronic clues."
    },
    seal: {
      label: "Seal, gasket, or O-ring",
      prompt: "Prioritize cross-section, lip geometry, groove fit, material clues, wear pattern, profile, and whether it appears to be a gasket, radial seal, wiper, or O-ring."
    },
    spring: {
      label: "Spring",
      prompt: "Prioritize compression/extension/torsion form, wire diameter clues, end style, coil count, material, and likely function."
    },
    bracket: {
      label: "Bracket or mounting part",
      prompt: "Prioritize mounting holes, slots, bends, welds, gussets, material thickness, load direction, and machine-frame interface clues."
    },
    linear: {
      label: "Linear guide or rail",
      prompt: "Prioritize carriage/rail geometry, rolling-element tracks, mounting holes, preload/adjustment features, wipers, and visible markings."
    },
    cutting: {
      label: "Cutting tool or insert",
      prompt: "Prioritize tool holder style, insert shape, clamp/screw geometry, cutting edge condition, carbide insert markings, shank size, and likely ISO insert or holder family."
    },
    belt: {
      label: "Belt or chain drive part",
      prompt: "Prioritize tooth or chain profile, pitch clues, pulley/sprocket grooves, belt width, bore/keyway details, wear pattern, and visible markings."
    },
    valve: {
      label: "Valve or pipe fitting",
      prompt: "Prioritize port count, thread or flange clues, flow arrow, actuator handle, sealing surfaces, material, pressure markings, and likely pneumatic, hydraulic, or plumbing standard."
    },
    motor: {
      label: "Motor or gearbox",
      prompt: "Prioritize nameplate data, shaft and keyway, mounting flange or foot pattern, housing style, connector/terminal details, ratio or power markings, and manufacturer clues."
    },
    profile: {
      label: "Profile or extrusion",
      prompt: "Prioritize cross-section shape, slot geometry, hole pattern, wall thickness clues, material finish, cut length, and compatible framing/profile systems."
    }
  };

  return modes[value] || modes.auto;
}

function normalizeChecklist(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => String(item).trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeMeasurements(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  const labels = {
    lengthMm: "length",
    widthMm: "width",
    diameterMm: "diameter",
    boreMm: "bore diameter",
    threadPitchMm: "thread pitch",
    weightG: "weight",
    materialConfirmed: "confirmed material",
    measuredBy: "measured by"
  };

  return Object.entries(labels)
    .map(([key, label]) => {
      const raw = String(value[key] || "").trim();
      if (!raw) return "";
      const unit = key.endsWith("Mm") ? " mm" : key === "weightG" ? " g" : "";
      return `${label}: ${raw}${unit}`;
    })
    .filter(Boolean);
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const safePath = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
  const filePath = path.normalize(path.join(publicDir, safePath));

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      sendStaticFile(path.join(filePath, "index.html"), res);
      return;
    }

    if (!statError && stats.isFile()) {
      sendStaticFile(filePath, res);
      return;
    }

    if (!path.extname(filePath)) {
      sendStaticFile(path.join(publicDir, "index.html"), res);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  });
}

function sendStaticFile(filePath, res) {
  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
  if (relativePath === "support/support-config.js") {
    sendSupportConfigJs(res);
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    res.writeHead(200, {
      ...securityHeaders(),
      ...staticFileHeaders(filePath),
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(content);
  });
}

function sendSupportConfigJs(res) {
  res.writeHead(200, {
    ...securityHeaders(),
    "Content-Type": "text/javascript; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(`window.TechSpecSupport = ${JSON.stringify(readSupportConfigValues(), null, 2)};\n`);
}

function staticFileHeaders(filePath) {
  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
  const privateSupportPages = new Set([
    "index.html",
    "support/admin-feedback.html",
    "support/beta.html",
    "support/feedback.html"
  ]);

  if (!privateSupportPages.has(relativePath)) return {};
  return {
    "X-Robots-Tag": "noindex, nofollow"
  };
}

function readJsonBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let raw = "";

    req.on("data", chunk => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(createHttpError(413, "REQUEST_TOO_LARGE", "Request body is too large."));
        req.destroy();
        return;
      }
      raw += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(createHttpError(400, "INVALID_JSON", "Invalid JSON request body."));
      }
    });

    req.on("error", reject);
  });
}

function getClientId(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim();
}

function getInstallId(req) {
  const raw = String(req.headers["x-techspec-install-id"] || "anonymous").trim();
  const normalized = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  return normalized || "anonymous";
}

function checkRateLimit(clientId) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientId) || { windowStart: now, count: 0 };
  if (now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    bucket.windowStart = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  rateLimitBuckets.set(clientId, bucket);

  for (const [key, value] of rateLimitBuckets) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW_MS * 3) {
      rateLimitBuckets.delete(key);
    }
  }

  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.windowStart)) / 1000)
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

function checkUsageLimit(installId) {
  const snapshot = getUsageSnapshot(undefined, installId);
  if (snapshot.daily.count >= snapshot.daily.limit) {
    return { allowed: false, code: "SERVER_DAILY_LIMIT", message: "Daily scan limit reached. Increase DAILY_SCAN_LIMIT on the server to continue." };
  }
  if (snapshot.monthly.count >= snapshot.monthly.limit) {
    return { allowed: false, code: "SERVER_MONTHLY_LIMIT", message: "Monthly scan limit reached. Increase MONTHLY_SCAN_LIMIT on the server to continue." };
  }
  if (snapshot.installation?.daily.count >= snapshot.installation.daily.limit) {
    return { allowed: false, code: "DEVICE_DAILY_LIMIT", message: "This device reached its daily scan limit. Increase INSTALL_DAILY_SCAN_LIMIT on the server to continue." };
  }
  if (snapshot.installation?.monthly.count >= snapshot.installation.monthly.limit) {
    return { allowed: false, code: "DEVICE_MONTHLY_LIMIT", message: "This device reached its monthly scan limit. Increase INSTALL_MONTHLY_SCAN_LIMIT on the server to continue." };
  }
  return { allowed: true, message: "" };
}

function incrementUsage({ model, source, installId }) {
  const usage = readUsage();
  const keys = currentUsageKeys();
  if (usage.dailyKey !== keys.dailyKey) {
    usage.dailyKey = keys.dailyKey;
    usage.dailyCount = 0;
  }
  if (usage.monthlyKey !== keys.monthlyKey) {
    usage.monthlyKey = keys.monthlyKey;
    usage.monthlyCount = 0;
  }

  usage.dailyCount += 1;
  usage.monthlyCount += 1;
  usage.totalCount = Number(usage.totalCount || 0) + 1;
  usage.lastScanAt = new Date().toISOString();
  usage.models = usage.models || {};
  usage.models[model] = Number(usage.models[model] || 0) + 1;
  usage.sources = usage.sources || {};
  usage.sources[source] = Number(usage.sources[source] || 0) + 1;
  incrementInstallUsage(usage, installId, model, source, keys);
  cleanupInstallations(usage);
  writeUsage(usage);
  return getUsageSnapshot(usage, installId);
}

function getUsageSnapshot(existingUsage, installId = "anonymous") {
  const usage = existingUsage || readUsage();
  const keys = currentUsageKeys();
  const dailyCount = usage.dailyKey === keys.dailyKey ? Number(usage.dailyCount || 0) : 0;
  const monthlyCount = usage.monthlyKey === keys.monthlyKey ? Number(usage.monthlyCount || 0) : 0;
  const installUsage = getInstallUsageSnapshot(usage, installId, keys);

  return {
    daily: {
      key: keys.dailyKey,
      count: dailyCount,
      limit: DAILY_SCAN_LIMIT,
      warningAt: DAILY_WARNING_LIMIT,
      remaining: Math.max(0, DAILY_SCAN_LIMIT - dailyCount),
      status: usageStatus(dailyCount, DAILY_SCAN_LIMIT, DAILY_WARNING_LIMIT)
    },
    monthly: {
      key: keys.monthlyKey,
      count: monthlyCount,
      limit: MONTHLY_SCAN_LIMIT,
      warningAt: MONTHLY_WARNING_LIMIT,
      remaining: Math.max(0, MONTHLY_SCAN_LIMIT - monthlyCount),
      status: usageStatus(monthlyCount, MONTHLY_SCAN_LIMIT, MONTHLY_WARNING_LIMIT)
    },
    totalCount: Number(usage.totalCount || 0),
    lastScanAt: usage.lastScanAt || null,
    models: usage.models || {},
    sources: usage.sources || {},
    installation: installUsage,
    rateLimit: {
      windowSeconds: Math.round(RATE_LIMIT_WINDOW_MS / 1000),
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    },
    requestLimitBytes: MAX_ANALYZE_BODY_BYTES
  };
}

function incrementInstallUsage(usage, installId, model, source, keys) {
  usage.installations = usage.installations || {};
  const current = usage.installations[installId] || defaultInstallUsage(keys);
  if (current.dailyKey !== keys.dailyKey) {
    current.dailyKey = keys.dailyKey;
    current.dailyCount = 0;
  }
  if (current.monthlyKey !== keys.monthlyKey) {
    current.monthlyKey = keys.monthlyKey;
    current.monthlyCount = 0;
  }

  current.dailyCount = Number(current.dailyCount || 0) + 1;
  current.monthlyCount = Number(current.monthlyCount || 0) + 1;
  current.totalCount = Number(current.totalCount || 0) + 1;
  current.lastScanAt = new Date().toISOString();
  current.models = current.models || {};
  current.models[model] = Number(current.models[model] || 0) + 1;
  current.sources = current.sources || {};
  current.sources[source] = Number(current.sources[source] || 0) + 1;
  usage.installations[installId] = current;
}

function getInstallUsageSnapshot(usage, installId, keys = currentUsageKeys()) {
  const install = usage.installations?.[installId] || defaultInstallUsage(keys);
  const dailyCount = install.dailyKey === keys.dailyKey ? Number(install.dailyCount || 0) : 0;
  const monthlyCount = install.monthlyKey === keys.monthlyKey ? Number(install.monthlyCount || 0) : 0;
  return {
    id: installId,
    daily: {
      key: keys.dailyKey,
      count: dailyCount,
      limit: INSTALL_DAILY_SCAN_LIMIT,
      warningAt: INSTALL_DAILY_WARNING_LIMIT,
      remaining: Math.max(0, INSTALL_DAILY_SCAN_LIMIT - dailyCount),
      status: usageStatus(dailyCount, INSTALL_DAILY_SCAN_LIMIT, INSTALL_DAILY_WARNING_LIMIT)
    },
    monthly: {
      key: keys.monthlyKey,
      count: monthlyCount,
      limit: INSTALL_MONTHLY_SCAN_LIMIT,
      warningAt: INSTALL_MONTHLY_WARNING_LIMIT,
      remaining: Math.max(0, INSTALL_MONTHLY_SCAN_LIMIT - monthlyCount),
      status: usageStatus(monthlyCount, INSTALL_MONTHLY_SCAN_LIMIT, INSTALL_MONTHLY_WARNING_LIMIT)
    },
    totalCount: Number(install.totalCount || 0),
    lastScanAt: install.lastScanAt || null,
    models: install.models || {},
    sources: install.sources || {}
  };
}

function cleanupInstallations(usage) {
  const entries = Object.entries(usage.installations || {});
  if (entries.length <= 400) return;
  const sorted = entries.sort(([, a], [, b]) => String(b.lastScanAt || "").localeCompare(String(a.lastScanAt || "")));
  usage.installations = Object.fromEntries(sorted.slice(0, 400));
}

function usageStatus(count, limit, warningAt) {
  if (count >= limit) return "blocked";
  if (count >= warningAt) return "warning";
  return "ok";
}

function currentUsageKeys() {
  const now = new Date();
  const dailyKey = now.toISOString().slice(0, 10);
  const monthlyKey = now.toISOString().slice(0, 7);
  return { dailyKey, monthlyKey };
}

function readUsage() {
  try {
    const parsed = JSON.parse(fs.readFileSync(usageFile, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : defaultUsage();
  } catch {
    return defaultUsage();
  }
}

function writeUsage(usage) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2));
}

function readJsonArray(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function isBetaAccessRequired() {
  return Boolean(BETA_ACCESS_CODE);
}

function hasValidBetaAccess(req) {
  if (!isBetaAccessRequired()) return true;
  const provided = String(req.headers["x-techspec-beta-code"] || "").trim();
  return Boolean(provided && safeEqual(provided, BETA_ACCESS_CODE));
}

function hasValidFeedbackAdminAccess(req) {
  if (!FEEDBACK_ADMIN_CODE) return false;
  const provided = String(req.headers["x-techspec-admin-code"] || "").trim();
  return Boolean(provided && safeEqual(provided, FEEDBACK_ADMIN_CODE));
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && cryptoSafeCompare(left, right);
}

function cryptoSafeCompare(left, right) {
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }
  return mismatch === 0;
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(min, number));
}

function defaultUsage() {
  const keys = currentUsageKeys();
  return {
    dailyKey: keys.dailyKey,
    monthlyKey: keys.monthlyKey,
    dailyCount: 0,
    monthlyCount: 0,
    totalCount: 0,
    lastScanAt: null,
    models: {},
    sources: {},
    installations: {}
  };
}

function defaultInstallUsage(keys = currentUsageKeys()) {
  return {
    dailyKey: keys.dailyKey,
    monthlyKey: keys.monthlyKey,
    dailyCount: 0,
    monthlyCount: 0,
    totalCount: 0,
    lastScanAt: null,
    models: {},
    sources: {}
  };
}

function getPreflightSnapshot(req) {
  const publicBaseUrl = String(process.env.PUBLIC_BASE_URL || "").trim();
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  const requestIsHttps = forwardedProto === "https" || Boolean(req.socket.encrypted);
  const support = readSupportConfigSnapshot();
  const checks = [
    {
      id: "app-mode",
      ok: APP_MODE === "production",
      severity: "critical",
      message: APP_MODE === "production"
        ? "APP_MODE is set to production."
        : "Set APP_MODE=production before public release so developer tools stay hidden."
    },
    {
      id: "gemini-key",
      ok: Boolean(GEMINI_API_KEY),
      severity: "critical",
      message: GEMINI_API_KEY ? "Gemini API key is configured." : "Gemini API key is not configured."
    },
    {
      id: "public-base-url",
      ok: /^https:\/\//i.test(publicBaseUrl),
      severity: "critical",
      message: /^https:\/\//i.test(publicBaseUrl)
        ? "PUBLIC_BASE_URL is HTTPS."
        : "Set PUBLIC_BASE_URL to the final HTTPS production URL before public release."
    },
    {
      id: "request-https",
      ok: requestIsHttps,
      severity: "warning",
      message: requestIsHttps ? "Current request is HTTPS." : "Current request is not HTTPS; local testing is expected, production must use HTTPS."
    },
    {
      id: "support-email",
      ok: support.emailConfigured,
      severity: "critical",
      message: support.emailConfigured ? "Support email is configured." : "Support email still uses a placeholder."
    },
    {
      id: "support-website",
      ok: support.websiteConfigured,
      severity: "critical",
      message: support.websiteConfigured ? "Support website is configured." : "Support website still points to a local path."
    },
    {
      id: "privacy-url",
      ok: support.privacyUrlConfigured,
      severity: "critical",
      message: support.privacyUrlConfigured ? "Privacy policy URL is configured." : "Privacy policy URL still points to a local path."
    },
    {
      id: "terms-url",
      ok: support.termsUrlConfigured,
      severity: "critical",
      message: support.termsUrlConfigured ? "Terms of Use URL is configured." : "Terms of Use URL still points to a local path."
    },
    {
      id: "privacy-publication-date",
      ok: support.privacyPublished,
      severity: "warning",
      message: support.privacyPublished ? "Privacy policy publication date is set." : "Privacy policy is still marked as draft."
    },
    {
      id: "support-pages",
      ok: support.pagesAvailable,
      severity: "critical",
      message: support.pagesAvailable ? "Support, beta guide, privacy, terms, legal, and feedback pages are available." : "A required support/beta/legal/feedback page is missing."
    },
    {
      id: "beta-access",
      ok: APP_MODE !== "production" || isBetaAccessRequired(),
      severity: "warning",
      message: isBetaAccessRequired()
        ? "Beta access code protection is enabled."
        : "Set BETA_ACCESS_CODE before sharing a private beta link outside trusted local testing."
    },
    {
      id: "feedback-admin",
      ok: APP_MODE !== "production" || Boolean(FEEDBACK_ADMIN_CODE),
      severity: "warning",
      message: FEEDBACK_ADMIN_CODE
        ? "Feedback export admin code is configured."
        : "Set FEEDBACK_ADMIN_CODE before relying on hosted beta feedback collection."
    },
    {
      id: "limits",
      ok: DAILY_SCAN_LIMIT > 0 && MONTHLY_SCAN_LIMIT > 0 && RATE_LIMIT_MAX_REQUESTS > 0,
      severity: "critical",
      message: "Server rate and usage limits are configured."
    }
  ];
  const blockingChecks = checks.filter(check => !check.ok && check.severity === "critical");

  return {
    ok: blockingChecks.length === 0,
    generatedAt: new Date().toISOString(),
    publicBaseUrl: publicBaseUrl || null,
    localAccessUrls: getLocalAccessUrls(),
    serverVersion: SERVER_VERSION,
    appMode: APP_MODE,
    betaAccessRequired: isBetaAccessRequired(),
    support,
    checks,
    blockingCount: blockingChecks.length
  };
}

function readSupportConfigSnapshot() {
  const publicBaseUrl = String(process.env.PUBLIC_BASE_URL || "").trim();
  const supportIndexPath = path.join(publicDir, "support", "index.html");
  const betaPath = path.join(publicDir, "support", "beta.html");
  const privacyPath = path.join(publicDir, "support", "privacy.html");
  const termsPath = path.join(publicDir, "support", "terms.html");
  const legalPath = path.join(publicDir, "support", "legal.html");
  const feedbackPath = path.join(publicDir, "support", "feedback.html");
  const config = readSupportConfigValues();
  const supportEmail = config.supportEmail;
  const supportWebsite = config.supportWebsite;
  const privacyUrl = config.privacyUrl;
  const termsUrl = config.termsUrl;
  const resolvedSupportWebsite = resolveConfiguredUrl(supportWebsite, publicBaseUrl);
  const resolvedPrivacyUrl = resolveConfiguredUrl(privacyUrl, publicBaseUrl);
  const resolvedTermsUrl = resolveConfiguredUrl(termsUrl, publicBaseUrl);
  const publicationDate = config.publicationDate;

  return {
    emailConfigured: Boolean(supportEmail && !/support@example\.com/i.test(supportEmail)),
    websiteConfigured: Boolean(resolvedSupportWebsite),
    privacyUrlConfigured: Boolean(resolvedPrivacyUrl),
    termsUrlConfigured: Boolean(resolvedTermsUrl),
    privacyPublished: Boolean(publicationDate && !/^draft$/i.test(publicationDate)),
    pagesAvailable: fs.existsSync(supportIndexPath) && fs.existsSync(betaPath) && fs.existsSync(privacyPath) && fs.existsSync(termsPath) && fs.existsSync(legalPath) && fs.existsSync(feedbackPath),
    resolvedUrls: {
      supportWebsite: resolvedSupportWebsite || null,
      privacyUrl: resolvedPrivacyUrl || null,
      termsUrl: resolvedTermsUrl || null
    },
    placeholders: {
      supportEmail: !supportEmail || /support@example\.com/i.test(supportEmail),
      supportWebsite: !resolvedSupportWebsite,
      privacyUrl: !resolvedPrivacyUrl,
      termsUrl: !resolvedTermsUrl,
      publicationDate: !publicationDate || /^draft$/i.test(publicationDate)
    }
  };
}

function readSupportConfigValues() {
  const publicBaseUrl = String(process.env.PUBLIC_BASE_URL || "").trim();
  const configPath = path.join(publicDir, "support", "support-config.js");
  const text = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const fallback = {
    appName: "TechSpec Scanner",
    publisherName: "TechSpec Scanner",
    supportEmail: "support@example.com",
    supportWebsite: "/support/",
    betaGuideUrl: "/support/beta.html",
    privacyUrl: "/support/privacy.html",
    termsUrl: "/support/terms.html",
    legalUrl: "/support/legal.html",
    feedbackUrl: "/support/feedback.html",
    publicationDate: "Draft"
  };
  const values = {};
  for (const key of Object.keys(fallback)) {
    values[key] = matchConfigString(text, key) || fallback[key];
  }

  const envOverrides = {
    publisherName: process.env.PUBLISHER_NAME,
    supportEmail: process.env.SUPPORT_EMAIL,
    supportWebsite: process.env.SUPPORT_WEBSITE,
    publicationDate: process.env.PRIVACY_PUBLICATION_DATE || process.env.SUPPORT_PUBLICATION_DATE
  };
  for (const [key, value] of Object.entries(envOverrides)) {
    if (String(value || "").trim()) values[key] = String(value).trim();
  }

  for (const key of ["supportWebsite", "betaGuideUrl", "privacyUrl", "termsUrl", "legalUrl", "feedbackUrl"]) {
    values[key] = resolveConfiguredUrl(values[key], publicBaseUrl) || values[key];
  }

  return values;
}

function resolveConfiguredUrl(value, publicBaseUrl) {
  const raw = String(value || "").trim();
  if (/^https:\/\//i.test(raw)) return raw;
  if (!raw.startsWith("/") || !/^https:\/\//i.test(publicBaseUrl)) return "";
  try {
    return new URL(raw, publicBaseUrl).toString();
  } catch {
    return "";
  }
}

function matchConfigString(text, key) {
  const match = text.match(new RegExp(`${escapeRegExp(key)}\\s*:\\s*["']([^"']*)["']`, "i"));
  return match ? match[1].trim() : "";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    ...securityHeaders(),
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

function securityHeaders() {
  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'none'",
      "frame-ancestors 'none'"
    ].join("; "),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "geolocation=(), microphone=(), payment=()"
  };
}

function getLocalAccessUrls() {
  const interfaces = os.networkInterfaces();
  const urls = [];
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family !== "IPv4" || entry.internal || !entry.address) continue;
      urls.push(`http://${entry.address}:${PORT}`);
    }
  }
  return Array.from(new Set(urls)).sort();
}

function sendError(res, status, code, message, extra = {}) {
  sendJson(res, status, {
    ok: false,
    code,
    error: message,
    ...extra
  });
}

function createHttpError(statusCode, code, publicMessage, details = "") {
  const error = new Error(details || publicMessage);
  error.statusCode = statusCode;
  error.code = code;
  error.publicMessage = publicMessage;
  return error;
}

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsAt = trimmed.indexOf("=");
    if (equalsAt === -1) continue;
    const key = trimmed.slice(0, equalsAt).trim();
    const value = trimmed.slice(equalsAt + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function demoComponentResult(notes, scanMode = normalizeScanMode("general"), language = normalizeLanguage("en")) {
  if (language.code === "de") {
    return {
      componentName: "Demo-Ergebnis: Rillenkugellager",
      detectedCategory: "Lager",
      componentFamily: "Waelzlager",
      category: scanMode.label,
      evidenceSummary: "Die Demo-Antwort nutzt lagerartige visuelle Merkmale wie kreisfoermige Ringe und eine zentrale Bohrung.",
      likelyFunction: "Stuetzt eine rotierende Welle und reduziert Reibung zwischen bewegten Teilen.",
      visibleFeatures: [
        "kreisfoermiger Aussenring",
        "zentrale Bohrung",
        "metallische Oberflaeche",
        "symmetrische Geometrie eines rotierenden Bauteils"
      ],
      possibleMaterial: "gehaerteter Stahl oder Edelstahl",
      possibleStandardOrPartNumber: "Aus dem aktuellen Bild nicht lesbar",
      markingsText: "Im Demo-Modus sind keine lesbaren Markierungen sichtbar",
      measurementClues: [
        "Aussendurchmesser, Bohrungsdurchmesser und Breite waeren fuer eine genaue Groesse noetig"
      ],
      likelyStandards: [
        "ISO-Massreihen fuer Lager koennten zutreffen, sind aus dem Demo-Bild aber nicht bestaetigbar"
      ],
      identificationAlternatives: [
        "Schraegkugellager",
        "Pendelkugellager",
        "allgemeines Waelzlager"
      ],
      recommendedChecks: [
        "gestempelte Markierungen fotografieren",
        "Bohrungsdurchmesser, Aussendurchmesser und Breite messen",
        "pruefen, ob das Lager abgedichtet, geschirmt oder offen ist"
      ],
      missingEvidence: [
        "lesbare Markierungen",
        "Massstabsreferenz",
        "Seitenansicht mit Breite und Dichtungsausfuehrung"
      ],
      confidence: 0.62,
      uncertaintyWarnings: [
        "Dies ist eine Demo-Antwort, weil GEMINI_API_KEY nicht konfiguriert ist.",
        "Eine genaue Identifikation braucht lesbare Markierungen, Massstab und eine schaerfere Nahaufnahme."
      ],
      recommendedNextPhoto: notes
        ? "Mache eine gerade Nahaufnahme vorhandener Markierungen und lege ein Lineal als Massstab dazu."
        : "Mache eine Nahaufnahme der Markierungen und eine Seitenansicht mit Lineal als Massstab."
    };
  }

  return {
    componentName: "Demo result: deep-groove ball bearing",
    detectedCategory: "bearing",
    componentFamily: "rolling-element bearing",
    category: scanMode.label,
    evidenceSummary: "The demo response uses bearing-like visual features such as circular rings and a central bore.",
    likelyFunction: "Supports a rotating shaft while reducing friction between moving parts.",
    visibleFeatures: [
      "circular outer ring",
      "central bore",
      "metallic finish",
      "symmetrical rotating component geometry"
    ],
    possibleMaterial: "hardened steel or stainless steel",
    possibleStandardOrPartNumber: "Not readable from the current image",
    markingsText: "No readable markings visible in demo mode",
    measurementClues: [
      "outer diameter, bore diameter, and width would be needed for exact sizing"
    ],
    likelyStandards: [
      "ISO bearing dimensional series may apply, but cannot be confirmed from the demo image"
    ],
    identificationAlternatives: [
      "angular-contact bearing",
      "self-aligning bearing",
      "generic rolling-element bearing"
    ],
    recommendedChecks: [
      "photograph stamped markings",
      "measure bore diameter, outside diameter, and width",
      "check whether the bearing is sealed, shielded, or open"
    ],
    missingEvidence: [
      "readable markings",
      "scale reference",
      "side view showing width and seal configuration"
    ],
    confidence: 0.62,
    uncertaintyWarnings: [
      "This is a demo response because GEMINI_API_KEY is not configured.",
      "Exact identification requires readable markings, scale, and a sharper close-up."
    ],
    recommendedNextPhoto: notes
      ? "Take a straight-on close-up of any stamped markings and include a ruler for scale."
      : "Take one close-up of markings and one side view with a ruler for scale."
  };
}
