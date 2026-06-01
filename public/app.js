const historyKey = "component-scanner-history-v1";
const databaseKey = "component-scanner-known-parts-v1";
const projectKey = "component-scanner-projects-v1";
const selectedProjectKey = "component-scanner-selected-project-v1";
const languageKey = "component-scanner-language-v1";
const themeKey = "component-scanner-theme-v1";
const screenshotModeKey = "component-scanner-screenshot-mode-v1";
const testLogKey = "component-scanner-test-log-v1";
const readinessKey = "component-scanner-readiness-v1";
const installIdKey = "component-scanner-install-id-v1";
const safetyAckKey = "component-scanner-safety-ack-v1";
const betaAccessCodeKey = "techspec-beta-access-code-v1";
const appBuildVersion = "20260531-1";
const maxHistoryItems = 8;
const maxDatabaseMatches = 4;
const maxTestLogItems = 200;
const minimumUsefulImageSide = 900;

const slotOrder = ["overview", "markings", "side", "scale"];
const slotChecklistMap = {
  overview: "overview photo",
  markings: "markings close-up",
  side: "side view",
  scale: "scale or ruler reference"
};

const measurementPresetMap = {
  auto: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  general: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  fastener: ["lengthMm", "diameterMm", "threadPitchMm", "materialConfirmed"],
  bearing: ["diameterMm", "boreMm", "widthMm", "materialConfirmed"],
  gear: ["diameterMm", "boreMm", "widthMm", "materialConfirmed"],
  shaft: ["lengthMm", "diameterMm", "materialConfirmed"],
  conveyor: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  fluid: ["diameterMm", "threadPitchMm", "materialConfirmed"],
  sensor: ["lengthMm", "diameterMm", "materialConfirmed"],
  seal: ["diameterMm", "boreMm", "widthMm", "materialConfirmed"],
  spring: ["lengthMm", "diameterMm", "materialConfirmed"],
  bracket: ["lengthMm", "widthMm", "materialConfirmed"],
  linear: ["lengthMm", "widthMm", "materialConfirmed"],
  cutting: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  belt: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  valve: ["diameterMm", "threadPitchMm", "materialConfirmed"],
  motor: ["lengthMm", "widthMm", "diameterMm", "materialConfirmed"],
  profile: ["lengthMm", "widthMm", "materialConfirmed"]
};

const measurementPresetText = {
  auto: "Useful basics: length, width, diameter, and confirmed material.",
  general: "Useful basics: length, width, diameter, and confirmed material.",
  fastener: "For fasteners, measure length, outside diameter, and thread pitch.",
  bearing: "For bearings, measure outside diameter, bore, and width.",
  gear: "For gears or pulleys, measure outside diameter, bore, and width.",
  shaft: "For shafts, measure length, diameter, and material if known.",
  conveyor: "For conveyor parts, measure roller or part diameter, width, and length.",
  fluid: "For fluid parts, measure port diameter, thread pitch, and material.",
  sensor: "For sensors, measure body length, diameter, and housing material.",
  seal: "For seals, measure outside diameter, inside diameter, and width.",
  spring: "For springs, measure free length, outside diameter, and material if known.",
  bracket: "For brackets, measure length, width, thickness if visible, and material.",
  linear: "For linear guides, measure rail length, width, and material if known.",
  cutting: "For cutting tools, capture insert geometry, holder size, markings, and cutting edge detail.",
  belt: "For belt or chain drives, capture tooth/chain profile, pitch clues, width, and pulley or sprocket markings.",
  valve: "For valves and fittings, capture port size, thread, flow arrow, material, and stamped codes.",
  motor: "For motors or gearboxes, capture the nameplate, shaft, mounting face, and connector details.",
  profile: "For profiles or extrusions, capture the cross-section, length, hole pattern, and material."
};

const measurementPresetTextDe = {
  auto: "Sinnvolle Basiswerte: Laenge, Breite, Durchmesser und bestaetigtes Material.",
  general: "Sinnvolle Basiswerte: Laenge, Breite, Durchmesser und bestaetigtes Material.",
  fastener: "Bei Schrauben: Laenge, Aussendurchmesser und Gewindesteigung messen.",
  bearing: "Bei Lagern: Aussendurchmesser, Bohrung und Breite messen.",
  gear: "Bei Zahnraedern oder Scheiben: Aussendurchmesser, Bohrung und Breite messen.",
  shaft: "Bei Wellen: Laenge, Durchmesser und Material messen, falls bekannt.",
  conveyor: "Bei Foerderteilen: Rollen- oder Teiledurchmesser, Breite und Laenge messen.",
  fluid: "Bei Fluidteilen: Anschlussdurchmesser, Gewindesteigung und Material messen.",
  sensor: "Bei Sensoren: Gehaeuselaenge, Durchmesser und Material messen.",
  seal: "Bei Dichtungen: Aussen-, Innendurchmesser und Breite messen.",
  spring: "Bei Federn: freie Laenge, Aussendurchmesser und Material messen.",
  bracket: "Bei Haltern: Laenge, Breite, sichtbare Dicke und Material messen.",
  linear: "Bei LinearFuehrungen: Schienenlaenge, Breite und Material messen, falls bekannt.",
  cutting: "Bei Zerspanungswerkzeugen: Plattengeometrie, Haltergroesse, Markierungen und Schneidkante erfassen.",
  belt: "Bei Riemen- oder Kettenantrieben: Zahn-/Kettenprofil, Teilungshinweise, Breite und Markierungen erfassen.",
  valve: "Bei Ventilen und Fittings: Anschlussgroesse, Gewinde, Flusspfeil, Material und Codes erfassen.",
  motor: "Bei Motoren oder Getrieben: Typenschild, Welle, Montageflaeche und Anschluesse erfassen.",
  profile: "Bei Profilen: Querschnitt, Laenge, Lochbild und Material erfassen."
};

const measurementPresetTextFr = {
  auto: "Bases utiles : longueur, largeur, diametre et materiau confirme.",
  general: "Bases utiles : longueur, largeur, diametre et materiau confirme.",
  fastener: "Pour les fixations, mesurez longueur, diametre exterieur et pas de filetage.",
  bearing: "Pour les roulements, mesurez diametre exterieur, alesage et largeur.",
  gear: "Pour engrenages ou poulies, mesurez diametre exterieur, alesage et largeur.",
  shaft: "Pour les arbres, mesurez longueur, diametre et materiau si connu.",
  conveyor: "Pour convoyeurs, mesurez diametre, largeur et longueur du galet ou de la piece.",
  fluid: "Pour elements fluides, mesurez diametre de port, pas de filetage et materiau.",
  sensor: "Pour capteurs, mesurez longueur du boitier, diametre et materiau.",
  seal: "Pour joints, mesurez diametre exterieur, interieur et largeur.",
  spring: "Pour ressorts, mesurez longueur libre, diametre exterieur et materiau si connu.",
  bracket: "Pour supports, mesurez longueur, largeur, epaisseur visible et materiau.",
  linear: "Pour guidages lineaires, mesurez longueur du rail, largeur et materiau si connu.",
  cutting: "Pour outils de coupe, capturez geometrie de plaquette, taille du porte-outil, marquages et arete.",
  belt: "Pour transmissions, capturez profil dent/chaine, pas, largeur et marquages.",
  valve: "Pour vannes et raccords, capturez taille de port, filetage, fleche de flux, materiau et codes.",
  motor: "Pour moteurs ou reducteurs, capturez plaque signaletique, arbre, face de montage et connecteurs.",
  profile: "Pour profiles, capturez section, longueur, motif de trous et materiau."
};

const measurementPresetTextEs = {
  auto: "Basicos utiles: longitud, anchura, diametro y material confirmado.",
  general: "Basicos utiles: longitud, anchura, diametro y material confirmado.",
  fastener: "Para fijaciones, mide longitud, diametro exterior y paso de rosca.",
  bearing: "Para rodamientos, mide diametro exterior, agujero y anchura.",
  gear: "Para engranajes o poleas, mide diametro exterior, agujero y anchura.",
  shaft: "Para ejes, mide longitud, diametro y material si se conoce.",
  conveyor: "Para piezas de transportador, mide diametro, anchura y longitud.",
  fluid: "Para piezas fluidicas, mide diametro de puerto, paso de rosca y material.",
  sensor: "Para sensores, mide longitud del cuerpo, diametro y material.",
  seal: "Para sellos, mide diametro exterior, interior y anchura.",
  spring: "Para resortes, mide longitud libre, diametro exterior y material si se conoce.",
  bracket: "Para soportes, mide longitud, anchura, espesor visible y material.",
  linear: "Para guias lineales, mide longitud del rail, anchura y material si se conoce.",
  cutting: "Para herramientas de corte, captura geometria del inserto, tamano del soporte, marcas y filo.",
  belt: "Para transmisiones, captura perfil de diente/cadena, paso, anchura y marcas.",
  valve: "Para valvulas y racores, captura tamano de puerto, rosca, flecha de flujo, material y codigos.",
  motor: "Para motores o reductores, captura placa, eje, cara de montaje y conectores.",
  profile: "Para perfiles, captura seccion, longitud, patron de agujeros y material."
};

const measurementLabelText = {
  en: {
    lengthMm: "Length mm",
    widthMm: "Width mm",
    diameterMm: "Diameter mm",
    boreMm: "Bore mm",
    threadPitchMm: "Thread pitch mm",
    weightG: "Weight g",
    materialConfirmed: "Material confirmed",
    measuredBy: "Measured by"
  },
  de: {
    lengthMm: "Laenge mm",
    widthMm: "Breite mm",
    diameterMm: "Durchmesser mm",
    boreMm: "Bohrung mm",
    threadPitchMm: "Gewindesteigung mm",
    weightG: "Gewicht g",
    materialConfirmed: "Material bestaetigt",
    measuredBy: "Gemessen von"
  },
  fr: {
    lengthMm: "Longueur mm",
    widthMm: "Largeur mm",
    diameterMm: "Diametre mm",
    boreMm: "Alesage mm",
    threadPitchMm: "Pas de filetage mm",
    weightG: "Poids g",
    materialConfirmed: "Materiau confirme",
    measuredBy: "Mesure par"
  },
  es: {
    lengthMm: "Longitud mm",
    widthMm: "Anchura mm",
    diameterMm: "Diametro mm",
    boreMm: "Agujero mm",
    threadPitchMm: "Paso de rosca mm",
    weightG: "Peso g",
    materialConfirmed: "Material confirmado",
    measuredBy: "Medido por"
  }
};

const translations = {
  en: {
    appName: "TechSpec Scanner",
    appSubtitle: "Identify mechanical parts from an iPhone camera photo.",
    navScan: "Scan",
    navLibrary: "Library",
    navReports: "Reports",
    navTesting: "Testing",
    navSettings: "Settings",
    guidedScan: "Guided scan",
    guidedScanHelp: "Add the views that are available. Overview is enough to start.",
    slotOverview: "Overview",
    slotOverviewHelp: "Whole component",
    slotMarkings: "Markings",
    slotMarkingsHelp: "Text, logo, code",
    slotSide: "Side view",
    slotSideHelp: "Profile and width",
    slotScale: "Scale",
    slotScaleHelp: "Ruler or reference",
    pasteHelp: "Tip: copy an image, click a scan slot, then press Ctrl+V to paste it here.",
    aiFocus: "AI focus",
    modeAuto: "Auto detect",
    modeGeneral: "General component",
    modeFastener: "Bolt / screw / nut",
    modeBearing: "Bearing",
    modeGear: "Gear / sprocket / pulley",
    modeShaft: "Shaft / coupling",
    modeConveyor: "Conveyor / roller part",
    modeFluid: "Hydraulic / pneumatic part",
    modeSensor: "Sensor / actuator",
    modeSeal: "Seal / gasket / O-ring",
    modeSpring: "Spring",
    modeBracket: "Bracket / mounting part",
    modeLinear: "Linear guide / rail",
    modeCutting: "Cutting tool / insert",
    modeBelt: "Belt / chain drive",
    modeValve: "Valve / fitting",
    modeMotor: "Motor / gearbox",
    modeProfile: "Profile / extrusion",
    project: "Project",
    newProjectName: "New project name",
    add: "Add",
    optionalScanDetails: "Optional scan details",
    measurements: "Measurements",
    photoChecklist: "Photo checklist",
    measureMaterialPlaceholder: "e.g. steel",
    measureMeasuredByPlaceholder: "name",
    contextNotes: "Context notes",
    contextNotesPlaceholder: "Example: part from roller conveyor, about 40 mm wide, metal, markings on side...",
    analyzeComponent: "Analyze component",
    loadDemoScan: "Load screenshot demo",
    clearDemoScan: "Clear screenshot demo",
    demoScanLoaded: "Screenshot demo loaded.",
    demoScanCleared: "Screenshot demo cleared.",
    betaAccessPrompt: "Enter the beta access code to use AI scans.",
    betaAccessInvalid: "Invalid beta access code.",
    betaAccessRequired: "A beta access code is required before scanning.",
    firstScanGuideTitle: "Best first scan",
    firstScanGuideHelp: "Start with one sharp overview, then add markings and a ruler if they exist.",
    firstScanGuideOne: "Fill the overview slot.",
    firstScanGuideTwo: "Add markings or labels.",
    firstScanGuideThree: "Add a scale for dimensions.",
    knownParts: "Known parts",
    recentScans: "Recent scans",
    clear: "Clear",
    readyFirstScan: "Ready for first scan",
    readyFirstScanHelp: "After analysis, the result appears here with confidence, visible clues, and the next best photo to take.",
    inspectingImage: "Inspecting image...",
    confidence: "confidence",
    confidenceExplanation: "Confidence explanation",
    confidenceHigh: "Strong identification. Still verify dimensions, markings, and fit before use.",
    confidenceMedium: "Useful identification, but one or more important clues should be checked.",
    confidenceLow: "Treat this as a starting point only. More photos or measurements are needed.",
    confidenceReasonGemini: "Analyzed with Gemini from your submitted scan.",
    confidenceReasonDemo: "Demo result, not a live AI analysis.",
    confidenceReasonFeatures: "Visible features were found.",
    confidenceReasonWarnings: "Uncertainty warnings are present.",
    confidenceReasonMissingEvidence: "Some evidence is missing.",
    confidenceReasonMeasurements: "Manual measurements are attached.",
    copyResult: "Copy result",
    shareResult: "Share result",
    exportPdf: "Export PDF",
    resultFeedback: "Send feedback",
    downloadJson: "Download JSON",
    editResult: "Edit result",
    saveEdits: "Save edits",
    saveKnownPart: "Save known part",
    reviewSave: "Review & save",
    reviewSaveHelp: "Verify, correct, add notes, and save to the library.",
    moreActions: "More actions",
    moreActionsHelp: "Developer and structured export options.",
    verification: "Verification",
    unverified: "Unverified",
    needsMeasurement: "Needs measurement",
    verified: "Verified",
    verificationChecklist: "Verification checklist",
    verificationChecklistHelp: "Confirm the evidence before saving the part as known.",
    verifyMarkings: "Markings checked",
    verifyDimensions: "Dimensions checked",
    verifyMaterial: "Material checked",
    verifyPartNumber: "Part number checked",
    correctResult: "Correct result",
    correctName: "Correct name",
    correctCategory: "Correct category",
    correctPartNumber: "Confirmed part number",
    correctMaterial: "Confirmed material",
    correctNamePlaceholder: "e.g. Indexable milling cutter",
    correctCategoryPlaceholder: "e.g. Cutting tool",
    correctPartNumberPlaceholder: "e.g. manufacturer code",
    correctMaterialPlaceholder: "e.g. carbide / steel",
    applyCorrection: "Apply correction",
    correctionApplied: "Correction applied.",
    evaluationTitle: "Scan evaluation",
    evaluationHelp: "Use real-world checks to track where the scanner performs well or needs tuning.",
    evaluationVerdict: "Result quality",
    evaluationNotEvaluated: "Not evaluated",
    evaluationCorrect: "Correct",
    evaluationPartly: "Partly correct",
    evaluationWrong: "Wrong",
    evaluationCorrectName: "True component name",
    evaluationCorrectNamePlaceholder: "e.g. M8 hex bolt",
    evaluationReasons: "Reason tags",
    reasonBadLighting: "Bad lighting",
    reasonBlurry: "Blurry photo",
    reasonMarkings: "Unreadable markings",
    reasonScale: "Missing scale",
    reasonAngle: "Wrong angle",
    reasonSimilarPart: "Similar part confused",
    evaluationNotes: "Evaluation notes",
    evaluationNotesPlaceholder: "What was right, wrong, or unclear?",
    saveEvaluation: "Save evaluation",
    evaluationSaved: "Evaluation saved.",
    chooseEvaluation: "Choose an evaluation first.",
    technicianNotes: "Technician notes",
    technicianNotesPlaceholder: "Add manual notes, measurements, confirmed part number, or correction...",
    possibleMatches: "Possible database matches",
    possibleMatchesHelp: "Based on saved known parts in this browser.",
    likelyFunction: "Likely function",
    material: "Material",
    partNumber: "Part number",
    markings: "Markings",
    detectedFamily: "Detected family",
    componentFamily: "Component family",
    nextPhoto: "Next photo",
    evidenceSummary: "Evidence summary",
    visibleFeatures: "Visible features",
    measurementClues: "Measurement clues",
    likelyStandards: "Likely standards",
    alternatives: "Alternatives",
    recommendedChecks: "Recommended checks",
    uncertainty: "Uncertainty",
    missingEvidence: "Missing evidence",
    libraryTitle: "Known Parts Library",
    libraryHelp: "Saved and verified components stay in this browser for matching future scans.",
    exportLibrary: "Export library",
    importLibrary: "Import library",
    reportsTitle: "Reports",
    reportsHelp: "Reopen recent scans and export reports.",
    clearHistory: "Clear history",
    testingTitle: "Testing",
    testingHelp: "Track scan accuracy from real components and export the test log for later improvement work.",
    exportTestLog: "Export test log",
    exportTestCsv: "Export CSV",
    clearTestLog: "Clear test log",
    testTotal: "Tests",
    testCorrect: "Correct",
    testPartly: "Partly correct",
    testWrong: "Wrong",
    testAccuracy: "Strict accuracy",
    noTestLog: "No evaluated scans yet. Run a scan, mark it correct, partly correct, or wrong, then save the evaluation.",
    reportsEvaluationSummary: "{total} evaluated scans: {correct} correct, {partly} partly correct, {wrong} wrong.",
    predicted: "Predicted",
    trueName: "True",
    open: "Open",
    load: "Load",
    edit: "Edit",
    use: "Use",
    delete: "Delete",
    itemDeleted: "Item deleted.",
    confirmDeleteItem: "Delete \"{name}\" from this device?",
    cannotDeleteDefaultProject: "The General project cannot be deleted.",
    reportPreviewTitle: "Report preview",
    reportPreviewHelp: "Review the report, then print or save it as a PDF.",
    backToApp: "Back to app",
    done: "Done",
    reportPreviewTip: "Print opens a system dialog. When it closes, the app returns to the scan page.",
    printSavePdf: "Print / Save PDF",
    returnedFromPrint: "Returned to the app after the print dialog closed.",
    settingsTitle: "Settings",
    settingsHelp: "Local test server and app data status.",
    backend: "Backend",
    checkBackend: "Check backend",
    settingsGroupUsage: "Usage & connection",
    settingsGroupUsageHelp: "Daily scan allowance and backend status.",
    settingsGroupData: "Data & preferences",
    settingsGroupDataHelp: "Local storage, backup, language, and appearance.",
    settingsGroupSupport: "Support & trust",
    settingsGroupSupportHelp: "Help, privacy, installation, and AI safety information.",
    settingsGroupDeveloper: "Developer & release",
    settingsGroupDeveloperHelp: "Publishing preparation tools hidden from production users.",
    settingsGroupProjects: "Projects",
    settingsGroupProjectsHelp: "Organize scans by machine, assembly, or test setup.",
    usageTitle: "Usage limits",
    freeScansToday: "Free scans remaining today",
    freeScansNotChecked: "Check backend to see today's remaining scans.",
    freeScansRemaining: "{remaining} of {limit}",
    freeScansUnlimited: "Available",
    usageNotChecked: "Not checked yet.",
    usageDaily: "Daily",
    usageMonthly: "Monthly",
    usageServerDaily: "Server daily",
    usageServerMonthly: "Server monthly",
    usageDeviceDaily: "Device daily",
    usageDeviceMonthly: "Device monthly",
    installIdLabel: "Install ID",
    usageOk: "Usage is within the configured limits.",
    usageWarning: "Usage is close to the configured limit.",
    usageBlocked: "Usage limit reached. Scans are blocked until the limit resets or the server limit is raised.",
    usageLastScan: "Last scan: {value}",
    localData: "Local data",
    dataManagementTitle: "Data management",
    dataManagementHelp: "Export or restore a full local backup. Page-specific delete actions stay on their own pages.",
    exportBackup: "Export backup",
    importBackup: "Import backup",
    backupExported: "Backup exported.",
    backupImported: "Backup imported.",
    backupImportFailed: "Could not import that backup file.",
    clearReadiness: "Clear readiness checklist",
    clearPreferences: "Reset preferences",
    clearAllLocalData: "Clear all local data",
    dataCleared: "Local data updated.",
    confirmClearAllLocalData: "Clear all local app data on this device? This cannot be undone unless you exported a backup.",
    confirmClearHistory: "Clear all scan history on this device?",
    confirmClearKnownParts: "Clear all known parts saved on this device?",
    confirmClearTestLog: "Clear the complete test log on this device?",
    confirmClearReadiness: "Clear the release readiness checklist?",
    confirmResetPreferences: "Reset language, theme, and local preferences?",
    languageTitle: "Language",
    languageHelp: "Choose the interface and AI result language.",
    themeTitle: "Appearance",
    themeHelp: "Choose a calmer light view or a darker workshop-style view.",
    themeLight: "Light",
    themeDark: "Dark",
    themeWorkshop: "Workshop",
    screenshotModeTitle: "Screenshot mode",
    screenshotModeHelp: "Hide local testing details for App Store screenshots.",
    screenshotModeToggle: "Hide local diagnostics",
    installTitle: "Install",
    installHelp: "On iPhone, open this page in Safari, tap Share, then Add to Home Screen.",
    supportTitle: "Support & privacy",
    supportHelp: "Open support and privacy information inside the app.",
    supportPage: "Support",
    privacyPolicy: "Privacy policy",
    safetyEyebrow: "Before scanning",
    safetyTitle: "AI and privacy acknowledgement",
    safetyIntro: "TechSpec Scanner is an AI-assisted tool. Review these points before using it with real components.",
    safetyAi: "AI results can be incomplete or incorrect and must be verified with measurements, markings, manufacturer documentation, and engineering judgment.",
    safetyPrivacy: "Photos and scan context you submit are sent through the backend to Google Gemini for analysis.",
    safetyNoSoleUse: "Do not use the result as the sole basis for safety-critical, purchasing, repair, or design decisions.",
    safetySecrets: "Do not submit API keys, passwords, private documents, or unrelated personal data.",
    safetyAgree: "I understand and will verify AI results before use.",
    safetyAccept: "Acknowledge",
    safetySettingsTitle: "AI safety acknowledgement",
    safetyAckMissing: "Not acknowledged on this device yet.",
    safetyAckDone: "Acknowledged on {date}.",
    reviewSafety: "Review notice",
    resetAcknowledgement: "Reset",
    safetyReset: "Safety acknowledgement reset on this device.",
    supportAppHelp: "Help and contact information for TechSpec Scanner.",
    backToSettings: "Back to settings",
    supportContact: "Contact",
    supportContactHelp: "For help, feedback, or privacy questions, use the support contact configured for the public support page.",
    betaFeedback: "Beta feedback",
    betaFeedbackHelp: "Send structured feedback about wrong results, bugs, confusing screens, or feature wishes.",
    betaGuide: "Beta guide",
    betaGuideHelp: "A short checklist for testers so feedback is focused and useful.",
    openPublicSupport: "Open public support page",
    supportIncludeTitle: "When contacting support",
    supportIncludeVersion: "Include your app version.",
    supportIncludeDevice: "Include your device model.",
    supportIncludeIssue: "Describe whether the issue happened during scanning, analysis, report export, or installation.",
    supportIncludeSecret: "Do not send private API keys, passwords, or unrelated personal documents.",
    aiDisclaimerTitle: "AI result disclaimer",
    aiDisclaimerText: "AI results can be incomplete or incorrect. Verify with physical measurements, markings, manufacturer documentation, and engineering judgment before use.",
    privacyAppHelp: "Summary of the current privacy behavior for the local-first scanner.",
    privacyDataTitle: "Data processed",
    privacyDataPhotos: "Component photos you choose to submit for analysis.",
    privacyDataNotes: "Notes, measurements, projects, corrections, and evaluation labels you enter.",
    privacyDataUsage: "Anonymous install ID, usage counters, and server-side scan limits.",
    privacyDataLocal: "Local app settings, scan history, known parts, and testing entries stored in this browser.",
    privacyAiTitle: "AI processing",
    privacyAiText: "When AI analysis is enabled, submitted component images and scan context are sent through the backend to Google Gemini for processing.",
    privacyLocalTitle: "Local-first storage",
    privacyLocalText: "Scan history, known parts, projects, test logs, language, and theme remain in local browser storage unless you export or delete them.",
    privacyFullTitle: "Full public policy",
    privacyFullText: "The public privacy page is still available for publishing and App Store review.",
    openPublicPrivacy: "Open public privacy page",
    appStoreTitle: "App Store readiness",
    appStoreHelp: "Items to prepare before a real release.",
    readinessProgress: "{done} / {total} ready",
    readinessProgressHelp: "Release preparation progress",
    readyPrivacy: "Privacy policy and data handling text",
    readySupport: "Support URL and contact email",
    readyScreenshots: "App Store screenshots",
    readyCosts: "Usage limits and billing alerts",
    readyReview: "AI disclaimer and manual verification wording",
    publishingPackTitle: "Publishing pack",
    publishingPackHelp: "Generate review notes, privacy summary, store listing copy, and a release checklist from the current app state.",
    releaseBlockersChecking: "Checking release blockers...",
    releaseBlockersReady: "No obvious release blockers detected.",
    releaseBlockersFound: "{count} release blocker(s) need attention.",
    releaseBlockerReadiness: "Readiness checklist is not complete.",
    releaseBlockerBackend: "Production backend status has not been verified.",
    releaseBlockerAppMode: "APP_MODE is still development. Production release should hide developer tools.",
    releaseBlockerPublicBaseUrl: "Production PUBLIC_BASE_URL is not set to a final HTTPS URL.",
    releaseBlockerLocalUrl: "Current access URL is local or non-HTTPS. Public release needs HTTPS production URLs.",
    releaseBlockerSupportEmail: "Support email still uses a placeholder.",
    releaseBlockerSupportWebsite: "Support website still points to a local path.",
    releaseBlockerPrivacyUrl: "Privacy policy URL still points to a local path.",
    releaseBlockerTermsUrl: "Terms of Use URL still points to a local path.",
    releaseBlockerPrivacyDraft: "Privacy policy is still marked as draft.",
    releaseBlockerSupportPages: "Support or privacy page is missing.",
    preflightTitle: "Backend preflight",
    preflightHelp: "Server-side release checks from /api/preflight.",
    preflightUnknown: "Run backend check to load preflight results.",
    preflightPassed: "Passed",
    preflightWarning: "Warning",
    preflightCritical: "Critical",
    preflightCheckAppMode: "Production app mode",
    preflightCheckGeminiKey: "Gemini API key",
    preflightCheckPublicBaseUrl: "Production HTTPS URL",
    preflightCheckRequestHttps: "Current HTTPS request",
    preflightCheckSupportEmail: "Support email",
    preflightCheckSupportWebsite: "Support website",
    preflightCheckPrivacyUrl: "Privacy policy URL",
    preflightCheckTermsUrl: "Terms of Use URL",
    preflightCheckPrivacyPublicationDate: "Privacy publication date",
    preflightCheckSupportPages: "Support pages",
    preflightCheckBetaAccess: "Beta access",
    preflightCheckLimits: "Usage and rate limits",
    reviewNotesTitle: "Review notes",
    reviewNotesHelp: "Short App Store reviewer context.",
    privacySummaryTitle: "Privacy summary",
    privacySummaryHelp: "Data handling points to align with privacy labels.",
    releaseChecklistTitle: "Release checklist",
    releaseChecklistHelp: "Exportable launch tasks for final submission.",
    storeListingTitle: "Store listing",
    storeListingHelp: "Draft App Store text for the product page.",
    productionEnvTitle: "Production env",
    productionEnvHelp: "Safe backend variable template without secrets.",
    supportConfigTitle: "Support config",
    supportConfigHelp: "Template for public support, privacy, and terms URLs.",
    copyReviewNotes: "Copy review notes",
    copyPrivacySummary: "Copy privacy summary",
    copyStoreListing: "Copy store listing",
    copyProductionEnv: "Copy env template",
    copySupportConfig: "Copy support config",
    downloadReleaseChecklist: "Download release checklist",
    reviewNotesCopied: "Review notes copied.",
    privacySummaryCopied: "Privacy summary copied.",
    storeListingCopied: "Store listing copied.",
    productionEnvCopied: "Production environment template copied.",
    supportConfigCopied: "Support config template copied.",
    releaseChecklistDownloaded: "Release checklist downloaded.",
    projectsTitle: "Projects",
    projectsHelp: "Group scans by machine, assembly, or test setup.",
    projectName: "Project name",
    addProject: "Add project",
    qualityNeedsPhoto: "Needs photo",
    qualityNeedsPhotoText: "Add an overview photo to start the scan.",
    qualityReady: "Ready",
    qualityReadyText: "The scan can run now. More evidence will improve the result.",
    qualityNeedsSharper: "Needs sharper photo",
    qualityNeedsSharperText: "At least one photo is below {size}px on its longest side. Retake it closer or use the original photo for better AI results.",
    qualityStrong: "Strong scan",
    qualityStrongText: "Good evidence captured. One more detail view may help.",
    qualityExcellent: "Excellent scan",
    qualityExcellentText: "This has the key evidence Gemini needs.",
    qualitySharpness: "Sharp photo",
    captureGuideTitle: "Photo capture guide",
    captureGuideLight: "Use bright, even light.",
    captureGuideBackground: "Place the part on a plain background.",
    captureGuideMarkings: "Take a sharp close-up of markings.",
    captureGuideScale: "Add a ruler or known reference when size matters.",
    noImagePaste: "Clipboard does not contain an image.",
    pastedImage: "Image pasted into {slot}.",
    imageOptimized: "Optimized: {width}x{height}, {size}",
    pasteFailed: "Could not paste that image.",
    chooseImage: "Please choose an image file.",
    imageReadFailed: "Could not read the selected image.",
    imageLoadFailed: "Could not load the selected image.",
    analysisFailed: "Analysis failed.",
    errorServerOffline: "Server is not reachable. Check that the local server is running and that your phone is on the same Wi-Fi.",
    errorRequestTooLarge: "The photo upload is too large. Use fewer photos or retake smaller images.",
    errorImageTooLarge: "One image is too large. Retake it at a lower resolution or use fewer images.",
    errorUnsupportedImage: "This image format is not supported for analysis. Use JPEG, PNG, WebP, HEIC, or HEIF.",
    errorMissingImage: "No image was received by the server. Add or retake a photo and try again.",
    errorRateLimited: "Too many scan requests in a short time. Wait a moment and try again.",
    errorUsageLimit: "A scan limit has been reached. Check Settings > Usage limits or raise the server limit.",
    errorGeminiAuth: "Gemini rejected the API key or project access. Check the API key, Gemini API enablement, and Google Cloud permissions.",
    errorGeminiQuota: "Gemini quota or rate limit was reached. Wait, reduce scans, or check Google billing/quota settings.",
    errorGeminiNetwork: "The server could not reach Gemini. Check internet access on the laptop/server.",
    errorGeminiServer: "Gemini returned a temporary server error. Try again shortly.",
    errorGeminiResponse: "Gemini responded, but the result was incomplete. Retake the photo or try again.",
    errorInvalidRequest: "The scan request was invalid. Refresh the app and try again.",
    copied: "Result copied.",
    copyBlocked: "Could not copy the result. Your browser may block clipboard access.",
    shareUnavailable: "Sharing is not available here. Result copied instead.",
    shareFailed: "Could not open sharing. Result copied instead.",
    pdfBlocked: "The browser blocked the PDF report window. Allow pop-ups for this page and try again.",
    editsSaved: "Edits saved in this result.",
    knownPartSaved: "Known part saved locally.",
    libraryImported: "Library imported.",
    libraryImportFailed: "Could not import that library file.",
    backendChecking: "Checking...",
    backendOnline: "Online. Mode: {appMode}. Gemini key: {keyStatus}. Fast model: {model}. Strong model: {strongModel}. Server: {serverVersion}.",
    backendMissing: "missing",
    backendConfigured: "configured",
    backendUnhealthy: "Backend responded, but did not report healthy status.",
    backendOffline: "Backend is not reachable.",
    diagnosticsTitle: "App diagnostics",
    diagnosticsHelp: "Useful details for support and iPhone testing.",
    diagnosticsVersion: "Version",
    diagnosticsInstallMode: "Install mode",
    diagnosticsServiceWorker: "Offline cache",
    diagnosticsNetwork: "Network",
    diagnosticsPhoneUrl: "iPhone URL",
    diagnosticsInstalled: "Home Screen / standalone",
    diagnosticsBrowser: "Browser tab",
    diagnosticsSwReady: "Ready",
    diagnosticsSwInstalling: "Installing",
    diagnosticsSwUnsupported: "Not supported",
    diagnosticsOnline: "Online",
    diagnosticsOffline: "Offline",
    copyDiagnostics: "Copy diagnostics",
    copyPhoneUrl: "Copy iPhone URL",
    downloadSupportBundle: "Download support bundle",
    diagnosticsCopied: "Diagnostics copied.",
    phoneUrlCopied: "iPhone URL copied.",
    supportBundleDownloaded: "Support bundle downloaded.",
    phoneUrlUnavailable: "Check backend first",
    storageStatus: "{projects} projects, {scans} recent scans, {parts} known parts, {tests} test entries stored locally in this browser.",
    noReports: "No reports yet. Analyze a component first.",
    noKnownParts: "No known parts saved yet.",
    noDetails: "No details returned.",
    unknownComponent: "Unknown component",
    uncategorized: "Uncategorized",
    unknown: "Unknown",
    notVisible: "Not visible",
    notEnoughEvidence: "Not enough visual evidence.",
    noReadableMarkings: "No readable markings reported.",
    noEvidenceSummary: "No evidence summary returned.",
    sharperPhoto: "Take a sharper close-up from another angle.",
    reportGenerated: "Generated by TechSpec Scanner. AI results should be verified with physical measurements, markings, and engineering documentation before use."
  },
  de: {
    appName: "TechSpec Scanner",
    appSubtitle: "Mechanische Bauteile anhand eines iPhone-Kamerafotos identifizieren.",
    navScan: "Scan",
    navLibrary: "Bibliothek",
    navReports: "Berichte",
    navTesting: "Tests",
    navSettings: "Einstellungen",
    guidedScan: "Gefuehrter Scan",
    guidedScanHelp: "Fuege die verfuegbaren Ansichten hinzu. Eine Uebersicht reicht zum Starten.",
    slotOverview: "Uebersicht",
    slotOverviewHelp: "Ganzes Bauteil",
    slotMarkings: "Markierungen",
    slotMarkingsHelp: "Text, Logo, Code",
    slotSide: "Seitenansicht",
    slotSideHelp: "Profil und Breite",
    slotScale: "Massstab",
    slotScaleHelp: "Lineal oder Referenz",
    pasteHelp: "Tipp: Bild kopieren, Scan-Feld anklicken und mit Strg+V einfuegen.",
    aiFocus: "KI-Fokus",
    modeAuto: "Automatisch erkennen",
    modeGeneral: "Allgemeines Bauteil",
    modeFastener: "Schraube / Mutter / Gewinde",
    modeBearing: "Lager",
    modeGear: "Zahnrad / Kettenrad / Riemenscheibe",
    modeShaft: "Welle / Kupplung",
    modeConveyor: "Foerdertechnik / Rolle",
    modeFluid: "Hydraulik / Pneumatik",
    modeSensor: "Sensor / Aktor",
    modeSeal: "Dichtung / O-Ring",
    modeSpring: "Feder",
    modeBracket: "Halter / Befestigungsteil",
    modeLinear: "Linearführung / Schiene",
    modeCutting: "Zerspanungswerkzeug / Wendeplatte",
    modeBelt: "Riemen- / Kettenantrieb",
    modeValve: "Ventil / Fitting",
    modeMotor: "Motor / Getriebe",
    modeProfile: "Profil / Strangpressprofil",
    project: "Projekt",
    newProjectName: "Neuer Projektname",
    add: "Hinzufuegen",
    optionalScanDetails: "Optionale Scan-Details",
    measurements: "Messwerte",
    photoChecklist: "Foto-Checkliste",
    measureMaterialPlaceholder: "z. B. Stahl",
    measureMeasuredByPlaceholder: "Name",
    contextNotes: "Kontextnotizen",
    contextNotesPlaceholder: "Beispiel: Bauteil aus Rollenfoerderer, ca. 40 mm breit, Metall, Markierungen seitlich...",
    analyzeComponent: "Bauteil analysieren",
    loadDemoScan: "Screenshot-Demo laden",
    clearDemoScan: "Screenshot-Demo leeren",
    demoScanLoaded: "Screenshot-Demo geladen.",
    demoScanCleared: "Screenshot-Demo geleert.",
    betaAccessPrompt: "Beta-Zugangscode eingeben, um KI-Scans zu nutzen.",
    betaAccessInvalid: "Ungueltiger Beta-Zugangscode.",
    betaAccessRequired: "Vor dem Scannen ist ein Beta-Zugangscode erforderlich.",
    firstScanGuideTitle: "Bester erster Scan",
    firstScanGuideHelp: "Starte mit einer scharfen Uebersicht, danach Markierungen und Lineal ergaenzen, falls vorhanden.",
    firstScanGuideOne: "Uebersichtsfeld fuellen.",
    firstScanGuideTwo: "Markierungen oder Labels ergaenzen.",
    firstScanGuideThree: "Massstab fuer Abmessungen ergaenzen.",
    knownParts: "Bekannte Teile",
    recentScans: "Letzte Scans",
    clear: "Leeren",
    readyFirstScan: "Bereit fuer den ersten Scan",
    readyFirstScanHelp: "Nach der Analyse erscheint hier das Ergebnis mit Sicherheit, sichtbaren Hinweisen und dem naechsten Foto.",
    inspectingImage: "Bild wird geprueft...",
    confidence: "Sicherheit",
    confidenceExplanation: "Sicherheit erklaert",
    confidenceHigh: "Starke Erkennung. Masse, Markierungen und Passung trotzdem vor Verwendung pruefen.",
    confidenceMedium: "Nuetzliche Erkennung, aber ein oder mehrere wichtige Hinweise sollten geprueft werden.",
    confidenceLow: "Nur als Ausgangspunkt verwenden. Mehr Fotos oder Messwerte sind noetig.",
    confidenceReasonGemini: "Mit Gemini anhand deines Scans analysiert.",
    confidenceReasonDemo: "Demo-Ergebnis, keine Live-KI-Analyse.",
    confidenceReasonFeatures: "Sichtbare Merkmale wurden gefunden.",
    confidenceReasonWarnings: "Unsicherheitswarnungen sind vorhanden.",
    confidenceReasonMissingEvidence: "Einige Hinweise fehlen.",
    confidenceReasonMeasurements: "Manuelle Messwerte sind angehaengt.",
    copyResult: "Ergebnis kopieren",
    shareResult: "Ergebnis teilen",
    exportPdf: "PDF exportieren",
    resultFeedback: "Feedback senden",
    downloadJson: "JSON herunterladen",
    editResult: "Ergebnis bearbeiten",
    saveEdits: "Aenderungen speichern",
    saveKnownPart: "Bekanntes Teil speichern",
    reviewSave: "Pruefen & speichern",
    reviewSaveHelp: "Verifizieren, korrigieren, Notizen ergaenzen und in der Bibliothek speichern.",
    moreActions: "Weitere Aktionen",
    moreActionsHelp: "Entwickler- und strukturierte Exportoptionen.",
    verification: "Pruefung",
    unverified: "Ungeprueft",
    needsMeasurement: "Messung noetig",
    verified: "Geprueft",
    verificationChecklist: "Pruef-Checkliste",
    verificationChecklistHelp: "Bestaetige die Hinweise, bevor du das Teil als bekannt speicherst.",
    verifyMarkings: "Markierungen geprueft",
    verifyDimensions: "Masse geprueft",
    verifyMaterial: "Material geprueft",
    verifyPartNumber: "Teilenummer geprueft",
    correctResult: "Ergebnis korrigieren",
    correctName: "Korrekter Name",
    correctCategory: "Korrekte Kategorie",
    correctPartNumber: "Bestaetigte Teilenummer",
    correctMaterial: "Bestaetigtes Material",
    correctNamePlaceholder: "z. B. Fraeswerkzeug mit Wendeschneidplatten",
    correctCategoryPlaceholder: "z. B. Zerspanungswerkzeug",
    correctPartNumberPlaceholder: "z. B. Herstellercode",
    correctMaterialPlaceholder: "z. B. Hartmetall / Stahl",
    applyCorrection: "Korrektur anwenden",
    correctionApplied: "Korrektur angewendet.",
    evaluationTitle: "Scan-Bewertung",
    evaluationHelp: "Nutze echte Pruefungen, um zu sehen, wo der Scanner gut ist oder nachjustiert werden muss.",
    evaluationVerdict: "Ergebnisqualitaet",
    evaluationNotEvaluated: "Nicht bewertet",
    evaluationCorrect: "Richtig",
    evaluationPartly: "Teilweise richtig",
    evaluationWrong: "Falsch",
    evaluationCorrectName: "Tatsaechlicher Bauteilname",
    evaluationCorrectNamePlaceholder: "z. B. M8-Sechskantschraube",
    evaluationReasons: "Grund-Tags",
    reasonBadLighting: "Schlechtes Licht",
    reasonBlurry: "Unscharfes Foto",
    reasonMarkings: "Markierungen unlesbar",
    reasonScale: "Massstab fehlt",
    reasonAngle: "Falscher Winkel",
    reasonSimilarPart: "Aehnliches Teil verwechselt",
    evaluationNotes: "Bewertungsnotizen",
    evaluationNotesPlaceholder: "Was war richtig, falsch oder unklar?",
    saveEvaluation: "Bewertung speichern",
    evaluationSaved: "Bewertung gespeichert.",
    chooseEvaluation: "Waehle zuerst eine Bewertung aus.",
    technicianNotes: "Technikernotizen",
    technicianNotesPlaceholder: "Manuelle Notizen, Messwerte, bestaetigte Teilenummer oder Korrektur ergaenzen...",
    possibleMatches: "Moegliche Datenbanktreffer",
    possibleMatchesHelp: "Basierend auf lokal gespeicherten bekannten Teilen.",
    likelyFunction: "Wahrscheinliche Funktion",
    material: "Material",
    partNumber: "Teilenummer",
    markings: "Markierungen",
    detectedFamily: "Erkannte Familie",
    componentFamily: "Bauteilfamilie",
    nextPhoto: "Naechstes Foto",
    evidenceSummary: "Hinweiszusammenfassung",
    visibleFeatures: "Sichtbare Merkmale",
    measurementClues: "Messhinweise",
    likelyStandards: "Moegliche Normen",
    alternatives: "Alternativen",
    recommendedChecks: "Empfohlene Pruefungen",
    uncertainty: "Unsicherheit",
    missingEvidence: "Fehlende Hinweise",
    libraryTitle: "Bibliothek bekannter Teile",
    libraryHelp: "Gespeicherte und gepruefte Bauteile bleiben in diesem Browser fuer kuenftige Treffer.",
    exportLibrary: "Bibliothek exportieren",
    importLibrary: "Bibliothek importieren",
    reportsTitle: "Berichte",
    reportsHelp: "Letzte Scans erneut oeffnen und Berichte exportieren.",
    clearHistory: "Verlauf leeren",
    testingTitle: "Tests",
    testingHelp: "Erfasse die Scan-Genauigkeit mit echten Bauteilen und exportiere das Testprotokoll fuer spaetere Verbesserungen.",
    exportTestLog: "Testprotokoll exportieren",
    exportTestCsv: "CSV exportieren",
    clearTestLog: "Testprotokoll leeren",
    testTotal: "Tests",
    testCorrect: "Richtig",
    testPartly: "Teilweise richtig",
    testWrong: "Falsch",
    testAccuracy: "Strikte Genauigkeit",
    noTestLog: "Noch keine bewerteten Scans. Fuehre einen Scan aus, markiere ihn als richtig, teilweise richtig oder falsch und speichere die Bewertung.",
    reportsEvaluationSummary: "{total} bewertete Scans: {correct} richtig, {partly} teilweise richtig, {wrong} falsch.",
    predicted: "Erkannt",
    trueName: "Tatsaechlich",
    open: "Oeffnen",
    load: "Laden",
    edit: "Bearbeiten",
    use: "Nutzen",
    delete: "Loeschen",
    itemDeleted: "Eintrag geloescht.",
    confirmDeleteItem: "\"{name}\" von diesem Geraet loeschen?",
    cannotDeleteDefaultProject: "Das Projekt General kann nicht geloescht werden.",
    reportPreviewTitle: "Berichtsvorschau",
    reportPreviewHelp: "Pruefe den Bericht und drucke oder speichere ihn danach als PDF.",
    backToApp: "Zurueck zur App",
    done: "Fertig",
    reportPreviewTip: "Drucken oeffnet einen Systemdialog. Wenn er geschlossen wird, kehrt die App zur Scan-Seite zurueck.",
    printSavePdf: "Drucken / PDF speichern",
    returnedFromPrint: "Nach dem Schliessen des Druckdialogs zur App zurueckgekehrt.",
    settingsTitle: "Einstellungen",
    settingsHelp: "Status von lokalem Testserver und App-Daten.",
    backend: "Backend",
    checkBackend: "Backend pruefen",
    settingsGroupUsage: "Nutzung & Verbindung",
    settingsGroupUsageHelp: "Taegliches Scan-Kontingent und Backend-Status.",
    settingsGroupData: "Daten & Einstellungen",
    settingsGroupDataHelp: "Lokale Speicherung, Backup, Sprache und Darstellung.",
    settingsGroupSupport: "Support & Vertrauen",
    settingsGroupSupportHelp: "Hilfe, Datenschutz, Installation und KI-Sicherheit.",
    settingsGroupDeveloper: "Entwicklung & Release",
    settingsGroupDeveloperHelp: "Publishing-Werkzeuge, die in Produktion ausgeblendet werden.",
    settingsGroupProjects: "Projekte",
    settingsGroupProjectsHelp: "Scans nach Maschine, Baugruppe oder Testaufbau ordnen.",
    usageTitle: "Nutzungslimits",
    freeScansToday: "Freie Scans heute",
    freeScansNotChecked: "Backend pruefen, um die heute verbleibenden Scans zu sehen.",
    freeScansRemaining: "{remaining} von {limit}",
    freeScansUnlimited: "Verfuegbar",
    usageNotChecked: "Noch nicht geprueft.",
    usageDaily: "Taeglich",
    usageMonthly: "Monatlich",
    usageServerDaily: "Server taeglich",
    usageServerMonthly: "Server monatlich",
    usageDeviceDaily: "Geraet taeglich",
    usageDeviceMonthly: "Geraet monatlich",
    installIdLabel: "Installations-ID",
    usageOk: "Nutzung liegt innerhalb der konfigurierten Limits.",
    usageWarning: "Nutzung ist nahe am konfigurierten Limit.",
    usageBlocked: "Nutzungslimit erreicht. Scans sind blockiert, bis das Limit zurueckgesetzt oder am Server erhoeht wird.",
    usageLastScan: "Letzter Scan: {value}",
    localData: "Lokale Daten",
    dataManagementTitle: "Datenverwaltung",
    dataManagementHelp: "Vollstaendiges lokales Backup exportieren oder wiederherstellen. Seitenspezifische Loeschaktionen bleiben auf den jeweiligen Seiten.",
    exportBackup: "Backup exportieren",
    importBackup: "Backup importieren",
    backupExported: "Backup exportiert.",
    backupImported: "Backup importiert.",
    backupImportFailed: "Diese Backup-Datei konnte nicht importiert werden.",
    clearReadiness: "Checkliste loeschen",
    clearPreferences: "Einstellungen zuruecksetzen",
    clearAllLocalData: "Alle lokalen Daten loeschen",
    dataCleared: "Lokale Daten aktualisiert.",
    confirmClearAllLocalData: "Alle lokalen App-Daten auf diesem Geraet loeschen? Das kann ohne exportiertes Backup nicht rueckgaengig gemacht werden.",
    confirmClearHistory: "Den gesamten Scanverlauf auf diesem Geraet loeschen?",
    confirmClearKnownParts: "Alle bekannten Teile auf diesem Geraet loeschen?",
    confirmClearTestLog: "Das komplette Testprotokoll auf diesem Geraet loeschen?",
    confirmClearReadiness: "Die Release-Readiness-Checkliste loeschen?",
    confirmResetPreferences: "Sprache, Darstellung und lokale Einstellungen zuruecksetzen?",
    languageTitle: "Sprache",
    languageHelp: "Sprache fuer Oberflaeche und KI-Ergebnis waehlen.",
    themeTitle: "Darstellung",
    themeHelp: "Waehle eine ruhige helle Ansicht oder eine dunklere Werkstatt-Ansicht.",
    themeLight: "Hell",
    themeDark: "Dunkel",
    themeWorkshop: "Werkstatt",
    screenshotModeTitle: "Screenshot-Modus",
    screenshotModeHelp: "Lokale Testdetails fuer App-Store-Screenshots ausblenden.",
    screenshotModeToggle: "Lokale Diagnose ausblenden",
    installTitle: "Installieren",
    installHelp: "Auf dem iPhone diese Seite in Safari oeffnen, Teilen antippen und dann Zum Home-Bildschirm waehlen.",
    supportTitle: "Support & Datenschutz",
    supportHelp: "Oeffne Support- und Datenschutzinformationen direkt in der App.",
    supportPage: "Support",
    privacyPolicy: "Datenschutz",
    safetyEyebrow: "Vor dem Scannen",
    safetyTitle: "KI- und Datenschutzbestaetigung",
    safetyIntro: "TechSpec Scanner ist ein KI-gestuetztes Werkzeug. Pruefe diese Punkte, bevor du es mit echten Bauteilen nutzt.",
    safetyAi: "KI-Ergebnisse koennen unvollstaendig oder falsch sein und muessen mit Messwerten, Markierungen, Herstellerdokumentation und technischem Urteil geprueft werden.",
    safetyPrivacy: "Fotos und Scankontext, die du einreichst, werden ueber das Backend zur Analyse an Google Gemini gesendet.",
    safetyNoSoleUse: "Nutze das Ergebnis nicht als alleinige Grundlage fuer sicherheitskritische Entscheidungen, Einkauf, Reparatur oder Konstruktion.",
    safetySecrets: "Keine API-Schluessel, Passwoerter, privaten Dokumente oder fremden personenbezogenen Daten einreichen.",
    safetyAgree: "Ich verstehe das und werde KI-Ergebnisse vor Verwendung pruefen.",
    safetyAccept: "Bestaetigen",
    safetySettingsTitle: "KI-Sicherheitsbestaetigung",
    safetyAckMissing: "Auf diesem Geraet noch nicht bestaetigt.",
    safetyAckDone: "Bestaetigt am {date}.",
    reviewSafety: "Hinweis ansehen",
    resetAcknowledgement: "Zuruecksetzen",
    safetyReset: "Sicherheitsbestaetigung auf diesem Geraet zurueckgesetzt.",
    supportAppHelp: "Hilfe und Kontaktinformationen fuer TechSpec Scanner.",
    backToSettings: "Zurueck zu Einstellungen",
    supportContact: "Kontakt",
    supportContactHelp: "Fuer Hilfe, Feedback oder Datenschutzfragen nutze den Supportkontakt der oeffentlichen Supportseite.",
    betaFeedback: "Beta-Feedback",
    betaFeedbackHelp: "Sende strukturiertes Feedback zu falschen Ergebnissen, Fehlern, unklaren Ansichten oder Funktionswuenschen.",
    betaGuide: "Beta-Anleitung",
    betaGuideHelp: "Eine kurze Checkliste fuer Tester, damit Feedback gezielt und nuetzlich ist.",
    openPublicSupport: "Oeffentliche Supportseite oeffnen",
    supportIncludeTitle: "Bei Supportanfragen",
    supportIncludeVersion: "App-Version angeben.",
    supportIncludeDevice: "Geraetemodell angeben.",
    supportIncludeIssue: "Beschreiben, ob das Problem beim Scannen, Analysieren, Berichtsexport oder Installieren passiert ist.",
    supportIncludeSecret: "Keine privaten API-Schluessel, Passwoerter oder fremde persoenliche Dokumente senden.",
    aiDisclaimerTitle: "KI-Hinweis",
    aiDisclaimerText: "KI-Ergebnisse koennen unvollstaendig oder falsch sein. Vor Verwendung mit Messwerten, Markierungen, Herstellerdokumentation und technischem Urteil pruefen.",
    privacyAppHelp: "Zusammenfassung des aktuellen Datenschutzverhaltens fuer den lokal ausgerichteten Scanner.",
    privacyDataTitle: "Verarbeitete Daten",
    privacyDataPhotos: "Bauteilfotos, die du zur Analyse einreichst.",
    privacyDataNotes: "Notizen, Messwerte, Projekte, Korrekturen und Bewertungslabels, die du eingibst.",
    privacyDataUsage: "Anonyme Installations-ID, Nutzungszaehler und serverseitige Scanlimits.",
    privacyDataLocal: "Lokale App-Einstellungen, Scanverlauf, bekannte Teile und Testeintraege in diesem Browser.",
    privacyAiTitle: "KI-Verarbeitung",
    privacyAiText: "Wenn KI-Analyse aktiviert ist, werden eingereichte Bauteilbilder und Scankontext ueber das Backend an Google Gemini gesendet.",
    privacyLocalTitle: "Lokale Speicherung",
    privacyLocalText: "Scanverlauf, bekannte Teile, Projekte, Testlogs, Sprache und Darstellung bleiben im lokalen Browserspeicher, sofern du sie nicht exportierst oder loeschst.",
    privacyFullTitle: "Vollstaendige oeffentliche Richtlinie",
    privacyFullText: "Die oeffentliche Datenschutzseite bleibt fuer Veroeffentlichung und App-Store-Pruefung verfuegbar.",
    openPublicPrivacy: "Oeffentliche Datenschutzseite oeffnen",
    appStoreTitle: "App-Store-Vorbereitung",
    appStoreHelp: "Punkte, die vor einem echten Release vorbereitet werden sollten.",
    readinessProgress: "{done} / {total} bereit",
    readinessProgressHelp: "Fortschritt der Release-Vorbereitung",
    readyPrivacy: "Datenschutzrichtlinie und Datenverarbeitungstext",
    readySupport: "Support-URL und Kontakt-E-Mail",
    readyScreenshots: "App-Store-Screenshots",
    readyCosts: "Nutzungslimits und Abrechnungswarnungen",
    readyReview: "KI-Hinweis und manuelle Pruefung klar formulieren",
    publishingPackTitle: "Publishing-Paket",
    publishingPackHelp: "Review-Notizen, Datenschutz-Zusammenfassung, Store-Text und Release-Checkliste aus dem aktuellen App-Status erstellen.",
    releaseBlockersChecking: "Release-Blocker werden geprueft...",
    releaseBlockersReady: "Keine offensichtlichen Release-Blocker erkannt.",
    releaseBlockersFound: "{count} Release-Blocker muessen geprueft werden.",
    releaseBlockerReadiness: "Die Readiness-Checkliste ist nicht vollstaendig.",
    releaseBlockerBackend: "Produktions-Backend-Status wurde noch nicht geprueft.",
    releaseBlockerAppMode: "APP_MODE ist noch development. Fuer den Release sollten Entwicklerwerkzeuge ausgeblendet sein.",
    releaseBlockerPublicBaseUrl: "Produktionswert PUBLIC_BASE_URL ist nicht auf eine finale HTTPS-URL gesetzt.",
    releaseBlockerLocalUrl: "Aktuelle Zugriffs-URL ist lokal oder nicht HTTPS. Fuer den Release braucht es oeffentliche HTTPS-URLs.",
    releaseBlockerSupportEmail: "Support-E-Mail nutzt noch einen Platzhalter.",
    releaseBlockerSupportWebsite: "Support-Webseite zeigt noch auf einen lokalen Pfad.",
    releaseBlockerPrivacyUrl: "Datenschutz-URL zeigt noch auf einen lokalen Pfad.",
    releaseBlockerTermsUrl: "Nutzungsbedingungen-URL zeigt noch auf einen lokalen Pfad.",
    releaseBlockerPrivacyDraft: "Datenschutzrichtlinie ist noch als Entwurf markiert.",
    releaseBlockerSupportPages: "Support- oder Datenschutzseite fehlt.",
    preflightTitle: "Backend-Preflight",
    preflightHelp: "Serverseitige Release-Pruefungen aus /api/preflight.",
    preflightUnknown: "Backend pruefen, um Preflight-Ergebnisse zu laden.",
    preflightPassed: "Bestanden",
    preflightWarning: "Warnung",
    preflightCritical: "Kritisch",
    preflightCheckAppMode: "Produktionsmodus",
    preflightCheckGeminiKey: "Gemini-API-Schluessel",
    preflightCheckPublicBaseUrl: "Produktions-HTTPS-URL",
    preflightCheckRequestHttps: "Aktuelle HTTPS-Anfrage",
    preflightCheckSupportEmail: "Support-E-Mail",
    preflightCheckSupportWebsite: "Support-Webseite",
    preflightCheckPrivacyUrl: "Datenschutz-URL",
    preflightCheckTermsUrl: "Nutzungsbedingungen-URL",
    preflightCheckPrivacyPublicationDate: "Datenschutz-Veroeffentlichungsdatum",
    preflightCheckSupportPages: "Support-Seiten",
    preflightCheckBetaAccess: "Beta-Zugang",
    preflightCheckLimits: "Nutzungs- und Ratenlimits",
    reviewNotesTitle: "Review-Notizen",
    reviewNotesHelp: "Kurzer Kontext fuer App-Store-Pruefer.",
    privacySummaryTitle: "Datenschutz-Zusammenfassung",
    privacySummaryHelp: "Datenverarbeitungspunkte passend zu Datenschutzlabels.",
    releaseChecklistTitle: "Release-Checkliste",
    releaseChecklistHelp: "Exportierbare Launch-Aufgaben fuer die finale Einreichung.",
    storeListingTitle: "Store-Text",
    storeListingHelp: "Entwurf fuer den App-Store-Produkteintrag.",
    productionEnvTitle: "Produktions-Env",
    productionEnvHelp: "Sichere Backend-Variablenvorlage ohne echte Secrets.",
    supportConfigTitle: "Support-Konfig",
    supportConfigHelp: "Vorlage fuer oeffentliche Support-, Datenschutz- und Nutzungsbedingungen-URLs.",
    copyReviewNotes: "Review-Notizen kopieren",
    copyPrivacySummary: "Datenschutz-Zusammenfassung kopieren",
    copyStoreListing: "Store-Text kopieren",
    copyProductionEnv: "Env-Vorlage kopieren",
    copySupportConfig: "Support-Konfig kopieren",
    downloadReleaseChecklist: "Release-Checkliste herunterladen",
    reviewNotesCopied: "Review-Notizen kopiert.",
    privacySummaryCopied: "Datenschutz-Zusammenfassung kopiert.",
    storeListingCopied: "Store-Text kopiert.",
    productionEnvCopied: "Produktions-Env-Vorlage kopiert.",
    supportConfigCopied: "Support-Konfig-Vorlage kopiert.",
    releaseChecklistDownloaded: "Release-Checkliste heruntergeladen.",
    projectsTitle: "Projekte",
    projectsHelp: "Scans nach Maschine, Baugruppe oder Testaufbau gruppieren.",
    projectName: "Projektname",
    addProject: "Projekt hinzufuegen",
    qualityNeedsPhoto: "Foto benoetigt",
    qualityNeedsPhotoText: "Fuege eine Uebersicht hinzu, um den Scan zu starten.",
    qualityReady: "Bereit",
    qualityReadyText: "Der Scan kann laufen. Mehr Hinweise verbessern das Ergebnis.",
    qualityNeedsSharper: "Schaerferes Foto noetig",
    qualityNeedsSharperText: "Mindestens ein Foto liegt unter {size}px an der laengsten Seite. Naeher neu aufnehmen oder das Originalfoto nutzen.",
    qualityStrong: "Starker Scan",
    qualityStrongText: "Gute Hinweise erfasst. Eine weitere Detailansicht kann helfen.",
    qualityExcellent: "Sehr guter Scan",
    qualityExcellentText: "Die wichtigsten Hinweise fuer Gemini sind vorhanden.",
    qualitySharpness: "Scharfes Foto",
    captureGuideTitle: "Foto-Anleitung",
    captureGuideLight: "Nutze helles, gleichmaessiges Licht.",
    captureGuideBackground: "Lege das Teil auf einen ruhigen Hintergrund.",
    captureGuideMarkings: "Fotografiere Markierungen scharf aus der Naehe.",
    captureGuideScale: "Fuege ein Lineal oder eine bekannte Referenz hinzu, wenn Masse wichtig sind.",
    noImagePaste: "In der Zwischenablage ist kein Bild.",
    pastedImage: "Bild in {slot} eingefuegt.",
    imageOptimized: "Optimiert: {width}x{height}, {size}",
    pasteFailed: "Dieses Bild konnte nicht eingefuegt werden.",
    chooseImage: "Bitte eine Bilddatei auswaehlen.",
    imageReadFailed: "Das ausgewaehlte Bild konnte nicht gelesen werden.",
    imageLoadFailed: "Das ausgewaehlte Bild konnte nicht geladen werden.",
    analysisFailed: "Analyse fehlgeschlagen.",
    errorServerOffline: "Server ist nicht erreichbar. Pruefe, ob der lokale Server laeuft und ob dein Handy im gleichen WLAN ist.",
    errorRequestTooLarge: "Der Foto-Upload ist zu gross. Nutze weniger Fotos oder kleinere Bilder.",
    errorImageTooLarge: "Ein Bild ist zu gross. Nimm es mit geringerer Aufloesung neu auf oder nutze weniger Bilder.",
    errorUnsupportedImage: "Dieses Bildformat wird fuer die Analyse nicht unterstuetzt. Nutze JPEG, PNG, WebP, HEIC oder HEIF.",
    errorMissingImage: "Beim Server ist kein Bild angekommen. Fuege ein Foto hinzu oder nimm es neu auf.",
    errorRateLimited: "Zu viele Scan-Anfragen in kurzer Zeit. Warte kurz und versuche es erneut.",
    errorUsageLimit: "Ein Scanlimit wurde erreicht. Pruefe Einstellungen > Nutzungslimits oder erhoehe das Serverlimit.",
    errorGeminiAuth: "Gemini hat API-Schluessel oder Projektzugriff abgelehnt. Pruefe API-Schluessel, Gemini-API-Aktivierung und Google-Cloud-Berechtigungen.",
    errorGeminiQuota: "Gemini-Kontingent oder Ratenlimit wurde erreicht. Warte, reduziere Scans oder pruefe Google-Abrechnung/Kontingente.",
    errorGeminiNetwork: "Der Server konnte Gemini nicht erreichen. Pruefe die Internetverbindung am Laptop/Server.",
    errorGeminiServer: "Gemini hat einen temporaeren Serverfehler gemeldet. Versuche es gleich erneut.",
    errorGeminiResponse: "Gemini hat geantwortet, aber das Ergebnis war unvollstaendig. Foto neu aufnehmen oder erneut versuchen.",
    errorInvalidRequest: "Die Scan-Anfrage war ungueltig. App neu laden und erneut versuchen.",
    copied: "Ergebnis kopiert.",
    copyBlocked: "Ergebnis konnte nicht kopiert werden. Der Browser blockiert eventuell die Zwischenablage.",
    shareUnavailable: "Teilen ist hier nicht verfuegbar. Ergebnis wurde stattdessen kopiert.",
    shareFailed: "Teilen konnte nicht geoeffnet werden. Ergebnis wurde stattdessen kopiert.",
    pdfBlocked: "Der Browser hat das PDF-Fenster blockiert. Pop-ups fuer diese Seite erlauben und erneut versuchen.",
    editsSaved: "Aenderungen in diesem Ergebnis gespeichert.",
    knownPartSaved: "Bekanntes Teil lokal gespeichert.",
    libraryImported: "Bibliothek importiert.",
    libraryImportFailed: "Diese Bibliotheksdatei konnte nicht importiert werden.",
    backendChecking: "Pruefe...",
    backendOnline: "Online. Modus: {appMode}. Gemini-Schluessel: {keyStatus}. Schnelles Modell: {model}. Starkes Modell: {strongModel}. Server: {serverVersion}.",
    backendMissing: "fehlt",
    backendConfigured: "konfiguriert",
    backendUnhealthy: "Backend antwortet, meldet aber keinen gesunden Status.",
    backendOffline: "Backend ist nicht erreichbar.",
    diagnosticsTitle: "App-Diagnose",
    diagnosticsHelp: "Nuetzliche Details fuer Support und iPhone-Tests.",
    diagnosticsVersion: "Version",
    diagnosticsInstallMode: "Installationsmodus",
    diagnosticsServiceWorker: "Offline-Cache",
    diagnosticsNetwork: "Netzwerk",
    diagnosticsPhoneUrl: "iPhone-URL",
    diagnosticsInstalled: "Home-Bildschirm / Standalone",
    diagnosticsBrowser: "Browser-Tab",
    diagnosticsSwReady: "Bereit",
    diagnosticsSwInstalling: "Wird installiert",
    diagnosticsSwUnsupported: "Nicht unterstuetzt",
    diagnosticsOnline: "Online",
    diagnosticsOffline: "Offline",
    copyDiagnostics: "Diagnose kopieren",
    copyPhoneUrl: "iPhone-URL kopieren",
    downloadSupportBundle: "Support-Bundle herunterladen",
    diagnosticsCopied: "Diagnose kopiert.",
    phoneUrlCopied: "iPhone-URL kopiert.",
    supportBundleDownloaded: "Support-Bundle heruntergeladen.",
    phoneUrlUnavailable: "Zuerst Backend pruefen",
    storageStatus: "{projects} Projekte, {scans} letzte Scans, {parts} bekannte Teile, {tests} Testeintraege lokal in diesem Browser gespeichert.",
    noReports: "Noch keine Berichte. Analysiere zuerst ein Bauteil.",
    noKnownParts: "Noch keine bekannten Teile gespeichert.",
    noDetails: "Keine Details erhalten.",
    unknownComponent: "Unbekanntes Bauteil",
    uncategorized: "Nicht kategorisiert",
    unknown: "Unbekannt",
    notVisible: "Nicht sichtbar",
    notEnoughEvidence: "Nicht genug visuelle Hinweise.",
    noReadableMarkings: "Keine lesbaren Markierungen gemeldet.",
    noEvidenceSummary: "Keine Hinweiszusammenfassung erhalten.",
    sharperPhoto: "Mache eine schaerfere Nahaufnahme aus einem anderen Winkel.",
    reportGenerated: "Erstellt mit TechSpec Scanner. KI-Ergebnisse sollten vor der Verwendung mit Messwerten, Markierungen und technischer Dokumentation geprueft werden."
  }
};

translations.fr = {
  ...translations.en,
  appName: "TechSpec Scanner",
  appSubtitle: "Identifier des pieces mecaniques a partir d'une photo iPhone.",
  navScan: "Scan",
  navLibrary: "Bibliotheque",
  navReports: "Rapports",
  navTesting: "Tests",
  navSettings: "Reglages",
  guidedScan: "Scan guide",
  guidedScanHelp: "Ajoutez les vues disponibles. Une vue d'ensemble suffit pour commencer.",
  slotOverview: "Vue generale",
  slotOverviewHelp: "Piece complete",
  slotMarkings: "Marquages",
  slotMarkingsHelp: "Texte, logo, code",
  slotSide: "Vue de cote",
  slotSideHelp: "Profil et largeur",
  slotScale: "Echelle",
  slotScaleHelp: "Regle ou reference",
  pasteHelp: "Astuce : copiez une image, cliquez sur un emplacement, puis appuyez sur Ctrl+V.",
  aiFocus: "Focus IA",
  modeAuto: "Detection automatique",
  modeGeneral: "Composant general",
  modeFastener: "Boulon / vis / ecrou",
  modeBearing: "Roulement",
  modeGear: "Engrenage / pignon / poulie",
  modeShaft: "Arbre / accouplement",
  modeConveyor: "Convoyeur / galet",
  modeFluid: "Hydraulique / pneumatique",
  modeSensor: "Capteur / actionneur",
  modeSeal: "Joint / joint torique",
  modeSpring: "Ressort",
  modeBracket: "Support / piece de fixation",
  modeLinear: "Guidage lineaire / rail",
  modeCutting: "Outil de coupe / plaquette",
  modeBelt: "Transmission courroie / chaine",
  modeValve: "Vanne / raccord",
  modeMotor: "Moteur / reducteur",
  modeProfile: "Profile / extrusion",
  project: "Projet",
  newProjectName: "Nouveau nom de projet",
  add: "Ajouter",
  optionalScanDetails: "Details de scan optionnels",
  measurements: "Mesures",
  photoChecklist: "Checklist photo",
  measureMaterialPlaceholder: "p. ex. acier",
  measureMeasuredByPlaceholder: "nom",
  contextNotes: "Notes de contexte",
  contextNotesPlaceholder: "Exemple : piece de convoyeur, env. 40 mm de large, metal, marquage sur le cote...",
  loadDemoScan: "Charger la demo capture",
  clearDemoScan: "Effacer la demo capture",
  demoScanLoaded: "Demo de capture chargee.",
  demoScanCleared: "Demo de capture effacee.",
  betaAccessPrompt: "Entrez le code beta pour utiliser les scans IA.",
  betaAccessInvalid: "Code beta invalide.",
  betaAccessRequired: "Un code beta est requis avant le scan.",
  firstScanGuideTitle: "Meilleur premier scan",
  firstScanGuideHelp: "Commencez par une vue generale nette, puis ajoutez marquages et regle si disponibles.",
  firstScanGuideOne: "Remplir la vue generale.",
  firstScanGuideTwo: "Ajouter marquages ou etiquettes.",
  firstScanGuideThree: "Ajouter une echelle pour les dimensions.",
  knownParts: "Pieces connues",
  recentScans: "Scans recents",
  clear: "Effacer",
  readyFirstScan: "Pret pour le premier scan",
  readyFirstScanHelp: "Apres analyse, le resultat apparait ici avec confiance, indices visibles et prochaine photo utile.",
  inspectingImage: "Inspection de l'image...",
  languageTitle: "Langue",
  languageHelp: "Choisir la langue de l'interface et du resultat IA.",
  themeTitle: "Apparence",
  themeHelp: "Choisir un affichage clair, sombre ou atelier.",
  themeLight: "Clair",
  themeDark: "Sombre",
  themeWorkshop: "Atelier",
  analyzeComponent: "Analyser le composant",
  confidence: "confiance",
  confidenceExplanation: "Explication de confiance",
  confidenceHigh: "Identification forte. Verifiez quand meme les dimensions, les marquages et l'ajustement avant utilisation.",
  confidenceMedium: "Identification utile, mais certains indices importants doivent etre verifies.",
  confidenceLow: "A traiter comme point de depart. Des photos ou mesures supplementaires sont necessaires.",
  confidenceReasonGemini: "Analyse avec Gemini a partir du scan envoye.",
  confidenceReasonDemo: "Resultat de demo, pas une analyse IA en direct.",
  confidenceReasonFeatures: "Des caracteristiques visibles ont ete trouvees.",
  confidenceReasonWarnings: "Des avertissements d'incertitude sont presents.",
  confidenceReasonMissingEvidence: "Certaines preuves manquent.",
  confidenceReasonMeasurements: "Des mesures manuelles sont jointes.",
  copyResult: "Copier le resultat",
  shareResult: "Partager le resultat",
  exportPdf: "Exporter PDF",
  resultFeedback: "Envoyer feedback",
  downloadJson: "Telecharger JSON",
  editResult: "Modifier le resultat",
  saveEdits: "Enregistrer les modifications",
  saveKnownPart: "Enregistrer comme piece connue",
  reviewSave: "Verifier et enregistrer",
  reviewSaveHelp: "Verifier, corriger, ajouter des notes et enregistrer dans la bibliotheque.",
  moreActions: "Plus d'actions",
  moreActionsHelp: "Options developpeur et export structure.",
  verification: "Verification",
  unverified: "Non verifie",
  needsMeasurement: "Mesure necessaire",
  verified: "Verifie",
  verificationChecklist: "Liste de verification",
  verificationChecklistHelp: "Confirmez les preuves avant d'enregistrer la piece comme connue.",
  verifyMarkings: "Marquages verifies",
  verifyDimensions: "Dimensions verifiees",
  verifyMaterial: "Materiau verifie",
  verifyPartNumber: "Reference verifiee",
  correctResult: "Corriger le resultat",
  correctName: "Nom correct",
  correctCategory: "Categorie correcte",
  correctPartNumber: "Reference confirmee",
  correctMaterial: "Materiau confirme",
  correctNamePlaceholder: "p. ex. fraise a plaquettes",
  correctCategoryPlaceholder: "p. ex. outil de coupe",
  correctPartNumberPlaceholder: "p. ex. code fabricant",
  correctMaterialPlaceholder: "p. ex. carbure / acier",
  applyCorrection: "Appliquer la correction",
  correctionApplied: "Correction appliquee.",
  evaluationTitle: "Evaluation du scan",
  evaluationHelp: "Utilisez des controles reels pour suivre les points forts et faibles du scanner.",
  evaluationVerdict: "Qualite du resultat",
  evaluationNotEvaluated: "Non evalue",
  evaluationCorrect: "Correct",
  evaluationPartly: "Partiellement correct",
  evaluationWrong: "Faux",
  evaluationCorrectName: "Nom reel du composant",
  evaluationCorrectNamePlaceholder: "p. ex. boulon hexagonal M8",
  evaluationReasons: "Tags de raison",
  reasonBadLighting: "Mauvais eclairage",
  reasonBlurry: "Photo floue",
  reasonMarkings: "Marquages illisibles",
  reasonScale: "Echelle manquante",
  reasonAngle: "Mauvais angle",
  reasonSimilarPart: "Piece similaire confondue",
  evaluationNotes: "Notes d'evaluation",
  evaluationNotesPlaceholder: "Qu'est-ce qui etait juste, faux ou peu clair ?",
  saveEvaluation: "Enregistrer l'evaluation",
  evaluationSaved: "Evaluation enregistree.",
  chooseEvaluation: "Choisissez d'abord une evaluation.",
  technicianNotes: "Notes technicien",
  technicianNotesPlaceholder: "Ajouter notes, mesures, reference confirmee ou correction...",
  possibleMatches: "Correspondances possibles",
  possibleMatchesHelp: "Basees sur les pieces connues enregistrees localement.",
  likelyFunction: "Fonction probable",
  material: "Materiau",
  partNumber: "Reference",
  markings: "Marquages",
  detectedFamily: "Famille detectee",
  componentFamily: "Famille du composant",
  nextPhoto: "Prochaine photo",
  evidenceSummary: "Resume des preuves",
  visibleFeatures: "Caracteristiques visibles",
  measurementClues: "Indices de mesure",
  likelyStandards: "Normes probables",
  alternatives: "Alternatives",
  recommendedChecks: "Controles recommandes",
  uncertainty: "Incertitude",
  missingEvidence: "Preuves manquantes",
  libraryTitle: "Bibliotheque de pieces connues",
  libraryHelp: "Les composants enregistres et verifies restent dans ce navigateur pour les prochains scans.",
  exportLibrary: "Exporter la bibliotheque",
  importLibrary: "Importer la bibliotheque",
  reportsTitle: "Rapports",
  reportsHelp: "Rouvrir les scans recents et exporter des rapports.",
  clearHistory: "Effacer l'historique",
  testingTitle: "Tests",
  testingHelp: "Suivre la precision des scans avec de vraies pieces et exporter le journal de test.",
  exportTestLog: "Exporter le journal",
  exportTestCsv: "Exporter CSV",
  clearTestLog: "Effacer le journal",
  testTotal: "Tests",
  testCorrect: "Corrects",
  testPartly: "Partiels",
  testWrong: "Faux",
  testAccuracy: "Precision stricte",
  noTestLog: "Aucun scan evalue pour l'instant.",
  reportsEvaluationSummary: "{total} scans evalues : {correct} corrects, {partly} partiels, {wrong} faux.",
  predicted: "Prevu",
  trueName: "Reel",
  open: "Ouvrir",
  load: "Charger",
  edit: "Modifier",
  use: "Utiliser",
  delete: "Supprimer",
  itemDeleted: "Element supprime.",
  confirmDeleteItem: "Supprimer \"{name}\" de cet appareil ?",
  cannotDeleteDefaultProject: "Le projet General ne peut pas etre supprime.",
  reportPreviewTitle: "Apercu du rapport",
  reportPreviewHelp: "Verifiez le rapport, puis imprimez ou enregistrez-le en PDF.",
  backToApp: "Retour a l'app",
  done: "Termine",
  reportPreviewTip: "L'impression ouvre une fenetre systeme. Quand elle se ferme, l'app revient au scan.",
  printSavePdf: "Imprimer / enregistrer PDF",
  returnedFromPrint: "Retour a l'app apres fermeture de la fenetre d'impression.",
  settingsTitle: "Reglages",
  settingsHelp: "Etat du serveur de test local et des donnees de l'app.",
  backend: "Backend",
  checkBackend: "Verifier le backend",
  settingsGroupUsage: "Utilisation et connexion",
  settingsGroupUsageHelp: "Quota de scans quotidien et etat du backend.",
  settingsGroupData: "Donnees et preferences",
  settingsGroupDataHelp: "Stockage local, sauvegarde, langue et apparence.",
  settingsGroupSupport: "Support et confiance",
  settingsGroupSupportHelp: "Aide, confidentialite, installation et securite IA.",
  settingsGroupDeveloper: "Developpement et release",
  settingsGroupDeveloperHelp: "Outils de publication masques aux utilisateurs en production.",
  settingsGroupProjects: "Projets",
  settingsGroupProjectsHelp: "Organiser les scans par machine, assemblage ou banc d'essai.",
  usageTitle: "Limites d'utilisation",
  freeScansToday: "Scans gratuits restants aujourd'hui",
  freeScansNotChecked: "Verifiez le backend pour voir les scans restants aujourd'hui.",
  freeScansRemaining: "{remaining} sur {limit}",
  freeScansUnlimited: "Disponible",
  usageNotChecked: "Pas encore verifie.",
  usageDaily: "Quotidien",
  usageMonthly: "Mensuel",
  usageServerDaily: "Serveur quotidien",
  usageServerMonthly: "Serveur mensuel",
  usageDeviceDaily: "Appareil quotidien",
  usageDeviceMonthly: "Appareil mensuel",
  installIdLabel: "ID d'installation",
  usageOk: "L'utilisation est dans les limites configurees.",
  usageWarning: "L'utilisation approche la limite configuree.",
  usageBlocked: "Limite atteinte. Les scans sont bloques jusqu'a reinitialisation ou augmentation de la limite.",
  usageLastScan: "Dernier scan : {value}",
  localData: "Donnees locales",
  dataManagementTitle: "Gestion des donnees",
  dataManagementHelp: "Exporter ou restaurer une sauvegarde locale complete. Les suppressions par page restent sur leur page.",
  exportBackup: "Exporter sauvegarde",
  importBackup: "Importer sauvegarde",
  backupExported: "Sauvegarde exportee.",
  backupImported: "Sauvegarde importee.",
  backupImportFailed: "Impossible d'importer cette sauvegarde.",
  clearReadiness: "Effacer la checklist",
  clearPreferences: "Reinitialiser preferences",
  clearAllLocalData: "Effacer toutes les donnees",
  dataCleared: "Donnees locales mises a jour.",
  confirmClearAllLocalData: "Effacer toutes les donnees locales de cet appareil ? Cette action est irreversible sans sauvegarde.",
  confirmClearHistory: "Effacer tout l'historique des scans sur cet appareil ?",
  confirmClearKnownParts: "Effacer toutes les pieces connues sur cet appareil ?",
  confirmClearTestLog: "Effacer tout le journal de test sur cet appareil ?",
  confirmClearReadiness: "Effacer la checklist de preparation release ?",
  confirmResetPreferences: "Reinitialiser langue, apparence et preferences locales ?",
  supportPage: "Support",
  privacyPolicy: "Confidentialite",
  screenshotModeTitle: "Mode capture",
  screenshotModeHelp: "Masquer les details de test locaux pour les captures App Store.",
  screenshotModeToggle: "Masquer les diagnostics locaux",
  installTitle: "Installation",
  installHelp: "Sur iPhone, ouvrez cette page dans Safari, touchez Partager puis Ajouter a l'ecran d'accueil.",
  supportTitle: "Support et confidentialite",
  supportHelp: "Ouvrir les informations de support et confidentialite dans l'app.",
  safetyEyebrow: "Avant le scan",
  safetyTitle: "Validation IA et confidentialite",
  safetyIntro: "TechSpec Scanner est un outil assiste par IA. Verifiez ces points avant de l'utiliser avec de vraies pieces.",
  safetyAi: "Les resultats IA peuvent etre incomplets ou incorrects et doivent etre verifies avec mesures, marquages, documentation fabricant et jugement technique.",
  safetyPrivacy: "Les photos et le contexte de scan soumis sont envoyes via le backend a Google Gemini pour analyse.",
  safetyNoSoleUse: "N'utilisez pas le resultat comme seule base pour des decisions critiques, achat, reparation ou conception.",
  safetySecrets: "Ne soumettez pas de cles API, mots de passe, documents prives ou donnees personnelles non liees.",
  safetyAgree: "Je comprends et verifierai les resultats IA avant utilisation.",
  safetyAccept: "Valider",
  safetySettingsTitle: "Validation de securite IA",
  safetyAckMissing: "Pas encore valide sur cet appareil.",
  safetyAckDone: "Valide le {date}.",
  reviewSafety: "Voir l'avis",
  resetAcknowledgement: "Reinitialiser",
  safetyReset: "Validation de securite reinitialisee sur cet appareil.",
  supportAppHelp: "Aide et contact pour TechSpec Scanner.",
  backToSettings: "Retour aux reglages",
  supportContact: "Contact",
  supportContactHelp: "Pour aide, retour ou questions de confidentialite, utilisez le contact configure sur la page support publique.",
  betaFeedback: "Feedback beta",
  betaFeedbackHelp: "Envoyez un retour structure sur resultats faux, bugs, ecrans confus ou idees.",
  betaGuide: "Guide beta",
  betaGuideHelp: "Checklist courte pour rendre les retours plus utiles.",
  openPublicSupport: "Ouvrir la page support publique",
  supportIncludeTitle: "Pour contacter le support",
  supportIncludeVersion: "Incluez la version de l'app.",
  supportIncludeDevice: "Incluez le modele de l'appareil.",
  supportIncludeIssue: "Precisez si le probleme vient du scan, de l'analyse, de l'export rapport ou de l'installation.",
  supportIncludeSecret: "N'envoyez pas de cles API, mots de passe ou documents personnels non lies.",
  aiDisclaimerTitle: "Avertissement resultat IA",
  aiDisclaimerText: "Les resultats IA peuvent etre incomplets ou incorrects. Verifiez avec mesures physiques, marquages, documentation fabricant et jugement technique.",
  privacyAppHelp: "Resume du comportement actuel de confidentialite du scanner local-first.",
  privacyDataTitle: "Donnees traitees",
  privacyDataPhotos: "Photos de composants que vous choisissez d'envoyer pour analyse.",
  privacyDataNotes: "Notes, mesures, projets, corrections et etiquettes d'evaluation saisies.",
  privacyDataUsage: "ID d'installation anonyme, compteurs d'utilisation et limites serveur.",
  privacyDataLocal: "Reglages locaux, historique, pieces connues et tests stockes dans ce navigateur.",
  privacyAiTitle: "Traitement IA",
  privacyAiText: "Quand l'analyse IA est activee, les images et le contexte sont envoyes via le backend a Google Gemini.",
  privacyLocalTitle: "Stockage local-first",
  privacyLocalText: "Historique, pieces connues, projets, journaux de test, langue et theme restent dans le stockage local sauf export ou suppression.",
  privacyFullTitle: "Politique publique complete",
  privacyFullText: "La page publique de confidentialite reste disponible pour la publication et la revue App Store.",
  openPublicPrivacy: "Ouvrir la confidentialite publique",
  appStoreTitle: "Preparation App Store",
  appStoreHelp: "Elements a preparer avant une vraie publication.",
  readinessProgress: "{done} / {total} prets",
  readinessProgressHelp: "Progression de preparation release",
  readyPrivacy: "Politique de confidentialite et texte de donnees",
  readySupport: "URL support et e-mail de contact",
  readyScreenshots: "Captures App Store",
  readyCosts: "Limites d'utilisation et alertes de facturation",
  readyReview: "Avertissement IA et verification manuelle",
  publishingPackTitle: "Pack de publication",
  publishingPackHelp: "Generer notes de revue, resume confidentialite, texte Store et checklist release.",
  releaseBlockersChecking: "Verification des blocages release...",
  releaseBlockersReady: "Aucun blocage release evident detecte.",
  releaseBlockersFound: "{count} blocage(s) release a traiter.",
  releaseBlockerReadiness: "La checklist de preparation n'est pas complete.",
  releaseBlockerBackend: "Le backend production n'a pas encore ete verifie.",
  releaseBlockerAppMode: "APP_MODE est encore en development. La production doit masquer les outils developpeur.",
  releaseBlockerPublicBaseUrl: "PUBLIC_BASE_URL de production n'est pas une URL HTTPS finale.",
  releaseBlockerLocalUrl: "L'URL actuelle est locale ou non HTTPS. La release publique exige HTTPS.",
  releaseBlockerSupportEmail: "L'e-mail support utilise encore un placeholder.",
  releaseBlockerSupportWebsite: "Le site support pointe encore vers un chemin local.",
  releaseBlockerPrivacyUrl: "L'URL confidentialite pointe encore vers un chemin local.",
  releaseBlockerTermsUrl: "L'URL des conditions pointe encore vers un chemin local.",
  releaseBlockerPrivacyDraft: "La politique de confidentialite est encore en brouillon.",
  releaseBlockerSupportPages: "Une page support, confidentialite ou conditions manque.",
  preflightTitle: "Preflight backend",
  preflightHelp: "Controles release serveur depuis /api/preflight.",
  preflightUnknown: "Verifier le backend pour charger les resultats preflight.",
  preflightPassed: "Valide",
  preflightWarning: "Avertissement",
  preflightCritical: "Critique",
  preflightCheckAppMode: "Mode production",
  preflightCheckGeminiKey: "Cle API Gemini",
  preflightCheckPublicBaseUrl: "URL HTTPS production",
  preflightCheckRequestHttps: "Requete HTTPS actuelle",
  preflightCheckSupportEmail: "E-mail support",
  preflightCheckSupportWebsite: "Site support",
  preflightCheckPrivacyUrl: "URL confidentialite",
  preflightCheckTermsUrl: "URL conditions",
  preflightCheckPrivacyPublicationDate: "Date publication confidentialite",
  preflightCheckSupportPages: "Pages support",
  preflightCheckBetaAccess: "Acces beta",
  preflightCheckLimits: "Limites d'utilisation et debit",
  reviewNotesTitle: "Notes de revue",
  reviewNotesHelp: "Court contexte pour les reviewers App Store.",
  privacySummaryTitle: "Resume confidentialite",
  privacySummaryHelp: "Points de traitement des donnees pour les labels de confidentialite.",
  releaseChecklistTitle: "Checklist release",
  releaseChecklistHelp: "Taches de lancement exportables pour la soumission finale.",
  storeListingTitle: "Texte Store",
  storeListingHelp: "Brouillon de fiche App Store.",
  productionEnvTitle: "Env production",
  productionEnvHelp: "Modele de variables backend sans secrets reels.",
  supportConfigTitle: "Config support",
  supportConfigHelp: "Modele pour URLs publiques support, confidentialite et conditions.",
  copyReviewNotes: "Copier notes revue",
  copyPrivacySummary: "Copier resume confidentialite",
  copyStoreListing: "Copier texte Store",
  copyProductionEnv: "Copier modele env",
  copySupportConfig: "Copier config support",
  downloadReleaseChecklist: "Telecharger checklist release",
  reviewNotesCopied: "Notes de revue copiees.",
  privacySummaryCopied: "Resume confidentialite copie.",
  storeListingCopied: "Texte Store copie.",
  productionEnvCopied: "Modele env production copie.",
  supportConfigCopied: "Modele config support copie.",
  releaseChecklistDownloaded: "Checklist release telechargee.",
  projectsTitle: "Projets",
  projectsHelp: "Regrouper les scans par machine, assemblage ou banc d'essai.",
  projectName: "Nom du projet",
  addProject: "Ajouter projet",
  diagnosticsTitle: "Diagnostics app",
  diagnosticsHelp: "Details utiles pour support et tests iPhone.",
  diagnosticsVersion: "Version",
  diagnosticsInstallMode: "Mode d'installation",
  diagnosticsServiceWorker: "Cache hors ligne",
  diagnosticsNetwork: "Reseau",
  diagnosticsPhoneUrl: "URL iPhone",
  diagnosticsInstalled: "Ecran d'accueil / standalone",
  diagnosticsBrowser: "Onglet navigateur",
  diagnosticsSwReady: "Pret",
  diagnosticsSwInstalling: "Installation",
  diagnosticsSwUnsupported: "Non supporte",
  diagnosticsOnline: "En ligne",
  diagnosticsOffline: "Hors ligne",
  copyDiagnostics: "Copier diagnostics",
  copyPhoneUrl: "Copier URL iPhone",
  downloadSupportBundle: "Telecharger bundle support",
  diagnosticsCopied: "Diagnostics copies.",
  phoneUrlCopied: "URL iPhone copiee.",
  supportBundleDownloaded: "Bundle support telecharge.",
  phoneUrlUnavailable: "Verifier d'abord le backend",
  storageStatus: "{projects} projets, {scans} scans recents, {parts} pieces connues, {tests} tests stockes localement.",
  noReports: "Aucun rapport. Analysez d'abord un composant.",
  noKnownParts: "Aucune piece connue enregistree.",
  noDetails: "Aucun detail recu.",
  unknownComponent: "Composant inconnu",
  uncategorized: "Non categorise",
  unknown: "Inconnu",
  notVisible: "Non visible",
  notEnoughEvidence: "Pas assez de preuves visuelles.",
  noReadableMarkings: "Aucun marquage lisible signale.",
  noEvidenceSummary: "Aucun resume des preuves recu.",
  sharperPhoto: "Prenez une photo rapprochee plus nette sous un autre angle.",
  backendChecking: "Verification...",
  backendOnline: "En ligne. Mode : {appMode}. Cle Gemini : {keyStatus}. Modele rapide : {model}. Modele fort : {strongModel}. Serveur : {serverVersion}.",
  backendMissing: "manquante",
  backendConfigured: "configuree",
  backendUnhealthy: "Le backend repond, mais ne signale pas un etat sain.",
  backendOffline: "Backend inaccessible.",
  reportGenerated: "Genere par TechSpec Scanner. Les resultats IA doivent etre verifies avec mesures, marquages et documentation technique avant utilisation."
};

translations.es = {
  ...translations.en,
  appName: "TechSpec Scanner",
  appSubtitle: "Identifica componentes mecanicos desde una foto del iPhone.",
  navScan: "Escanear",
  navLibrary: "Biblioteca",
  navReports: "Informes",
  navTesting: "Pruebas",
  navSettings: "Ajustes",
  guidedScan: "Escaneo guiado",
  guidedScanHelp: "Anade las vistas disponibles. Una vista general basta para empezar.",
  slotOverview: "Vista general",
  slotOverviewHelp: "Componente completo",
  slotMarkings: "Marcas",
  slotMarkingsHelp: "Texto, logo, codigo",
  slotSide: "Vista lateral",
  slotSideHelp: "Perfil y anchura",
  slotScale: "Escala",
  slotScaleHelp: "Regla o referencia",
  pasteHelp: "Consejo: copia una imagen, pulsa un espacio de scan y presiona Ctrl+V.",
  aiFocus: "Enfoque IA",
  modeAuto: "Detectar automaticamente",
  modeGeneral: "Componente general",
  modeFastener: "Perno / tornillo / tuerca",
  modeBearing: "Rodamiento",
  modeGear: "Engranaje / pinon / polea",
  modeShaft: "Eje / acoplamiento",
  modeConveyor: "Transportador / rodillo",
  modeFluid: "Hidraulico / neumatico",
  modeSensor: "Sensor / actuador",
  modeSeal: "Sello / junta / O-ring",
  modeSpring: "Resorte",
  modeBracket: "Soporte / pieza de montaje",
  modeLinear: "Guia lineal / rail",
  modeCutting: "Herramienta de corte / inserto",
  modeBelt: "Transmision correa / cadena",
  modeValve: "Valvula / racor",
  modeMotor: "Motor / reductor",
  modeProfile: "Perfil / extrusion",
  project: "Proyecto",
  newProjectName: "Nuevo nombre de proyecto",
  add: "Anadir",
  optionalScanDetails: "Detalles opcionales del scan",
  measurements: "Medidas",
  photoChecklist: "Checklist de fotos",
  measureMaterialPlaceholder: "p. ej. acero",
  measureMeasuredByPlaceholder: "nombre",
  contextNotes: "Notas de contexto",
  contextNotesPlaceholder: "Ejemplo: pieza de transportador, aprox. 40 mm de ancho, metal, marcas en el lateral...",
  loadDemoScan: "Cargar demo de captura",
  clearDemoScan: "Borrar demo de captura",
  demoScanLoaded: "Demo de captura cargada.",
  demoScanCleared: "Demo de captura borrada.",
  betaAccessPrompt: "Introduce el codigo beta para usar scans IA.",
  betaAccessInvalid: "Codigo beta no valido.",
  betaAccessRequired: "Se requiere codigo beta antes de escanear.",
  firstScanGuideTitle: "Mejor primer scan",
  firstScanGuideHelp: "Empieza con una vista general nitida y luego anade marcas y regla si existen.",
  firstScanGuideOne: "Rellenar vista general.",
  firstScanGuideTwo: "Anadir marcas o etiquetas.",
  firstScanGuideThree: "Anadir escala para dimensiones.",
  knownParts: "Piezas conocidas",
  recentScans: "Scans recientes",
  clear: "Borrar",
  readyFirstScan: "Listo para el primer scan",
  readyFirstScanHelp: "Despues del analisis, el resultado aparece aqui con confianza, pistas visibles y la siguiente foto recomendada.",
  inspectingImage: "Inspeccionando imagen...",
  languageTitle: "Idioma",
  languageHelp: "Elige el idioma de la interfaz y del resultado de IA.",
  themeTitle: "Apariencia",
  themeHelp: "Elige vista clara, oscura o taller.",
  themeLight: "Claro",
  themeDark: "Oscuro",
  themeWorkshop: "Taller",
  analyzeComponent: "Analizar componente",
  confidence: "confianza",
  confidenceExplanation: "Explicacion de confianza",
  confidenceHigh: "Identificacion fuerte. Verifica dimensiones, marcas y ajuste antes de usar.",
  confidenceMedium: "Identificacion util, pero algunos indicios importantes deben revisarse.",
  confidenceLow: "Usalo solo como punto de partida. Se necesitan mas fotos o medidas.",
  confidenceReasonGemini: "Analizado con Gemini a partir del scan enviado.",
  confidenceReasonDemo: "Resultado de demo, no es analisis IA en vivo.",
  confidenceReasonFeatures: "Se encontraron caracteristicas visibles.",
  confidenceReasonWarnings: "Hay advertencias de incertidumbre.",
  confidenceReasonMissingEvidence: "Faltan algunas evidencias.",
  confidenceReasonMeasurements: "Hay medidas manuales adjuntas.",
  copyResult: "Copiar resultado",
  shareResult: "Compartir resultado",
  exportPdf: "Exportar PDF",
  resultFeedback: "Enviar feedback",
  downloadJson: "Descargar JSON",
  editResult: "Editar resultado",
  saveEdits: "Guardar cambios",
  saveKnownPart: "Guardar pieza conocida",
  reviewSave: "Revisar y guardar",
  reviewSaveHelp: "Verificar, corregir, anadir notas y guardar en la biblioteca.",
  moreActions: "Mas acciones",
  moreActionsHelp: "Opciones de desarrollo y exportacion estructurada.",
  verification: "Verificacion",
  unverified: "No verificado",
  needsMeasurement: "Necesita medicion",
  verified: "Verificado",
  verificationChecklist: "Lista de verificacion",
  verificationChecklistHelp: "Confirma la evidencia antes de guardar la pieza como conocida.",
  verifyMarkings: "Marcas verificadas",
  verifyDimensions: "Dimensiones verificadas",
  verifyMaterial: "Material verificado",
  verifyPartNumber: "Referencia verificada",
  correctResult: "Corregir resultado",
  correctName: "Nombre correcto",
  correctCategory: "Categoria correcta",
  correctPartNumber: "Referencia confirmada",
  correctMaterial: "Material confirmado",
  correctNamePlaceholder: "p. ej. fresa con insertos",
  correctCategoryPlaceholder: "p. ej. herramienta de corte",
  correctPartNumberPlaceholder: "p. ej. codigo fabricante",
  correctMaterialPlaceholder: "p. ej. carburo / acero",
  applyCorrection: "Aplicar correccion",
  correctionApplied: "Correccion aplicada.",
  evaluationTitle: "Evaluacion del scan",
  evaluationHelp: "Usa comprobaciones reales para seguir donde el scanner funciona bien o necesita ajustes.",
  evaluationVerdict: "Calidad del resultado",
  evaluationNotEvaluated: "No evaluado",
  evaluationCorrect: "Correcto",
  evaluationPartly: "Parcialmente correcto",
  evaluationWrong: "Incorrecto",
  evaluationCorrectName: "Nombre real del componente",
  evaluationCorrectNamePlaceholder: "p. ej. perno hexagonal M8",
  evaluationReasons: "Etiquetas de motivo",
  reasonBadLighting: "Mala iluminacion",
  reasonBlurry: "Foto borrosa",
  reasonMarkings: "Marcas ilegibles",
  reasonScale: "Falta escala",
  reasonAngle: "Angulo incorrecto",
  reasonSimilarPart: "Confundido con pieza similar",
  evaluationNotes: "Notas de evaluacion",
  evaluationNotesPlaceholder: "Que fue correcto, incorrecto o poco claro?",
  saveEvaluation: "Guardar evaluacion",
  evaluationSaved: "Evaluacion guardada.",
  chooseEvaluation: "Elige primero una evaluacion.",
  technicianNotes: "Notas tecnicas",
  technicianNotesPlaceholder: "Anade notas, medidas, referencia confirmada o correccion...",
  possibleMatches: "Coincidencias posibles",
  possibleMatchesHelp: "Basado en piezas conocidas guardadas localmente.",
  likelyFunction: "Funcion probable",
  material: "Material",
  partNumber: "Referencia",
  markings: "Marcas",
  detectedFamily: "Familia detectada",
  componentFamily: "Familia del componente",
  nextPhoto: "Siguiente foto",
  evidenceSummary: "Resumen de evidencia",
  visibleFeatures: "Caracteristicas visibles",
  measurementClues: "Pistas de medida",
  likelyStandards: "Normas probables",
  alternatives: "Alternativas",
  recommendedChecks: "Comprobaciones recomendadas",
  uncertainty: "Incertidumbre",
  missingEvidence: "Evidencia faltante",
  libraryTitle: "Biblioteca de piezas conocidas",
  libraryHelp: "Los componentes guardados y verificados quedan en este navegador para futuros scans.",
  exportLibrary: "Exportar biblioteca",
  importLibrary: "Importar biblioteca",
  reportsTitle: "Informes",
  reportsHelp: "Reabrir scans recientes y exportar informes.",
  clearHistory: "Borrar historial",
  testingTitle: "Pruebas",
  testingHelp: "Registra la precision de scans con piezas reales y exporta el log de pruebas.",
  exportTestLog: "Exportar log",
  exportTestCsv: "Exportar CSV",
  clearTestLog: "Borrar log de pruebas",
  testTotal: "Pruebas",
  testCorrect: "Correctas",
  testPartly: "Parciales",
  testWrong: "Incorrectas",
  testAccuracy: "Precision estricta",
  noTestLog: "Aun no hay scans evaluados.",
  reportsEvaluationSummary: "{total} scans evaluados: {correct} correctos, {partly} parciales, {wrong} incorrectos.",
  predicted: "Predicho",
  trueName: "Real",
  open: "Abrir",
  load: "Cargar",
  edit: "Editar",
  use: "Usar",
  delete: "Eliminar",
  itemDeleted: "Elemento eliminado.",
  confirmDeleteItem: "Eliminar \"{name}\" de este dispositivo?",
  cannotDeleteDefaultProject: "El proyecto General no se puede eliminar.",
  reportPreviewTitle: "Vista previa del informe",
  reportPreviewHelp: "Revisa el informe y luego imprime o guardalo como PDF.",
  backToApp: "Volver a la app",
  done: "Listo",
  reportPreviewTip: "Imprimir abre un dialogo del sistema. Al cerrarlo, la app vuelve al scan.",
  printSavePdf: "Imprimir / guardar PDF",
  returnedFromPrint: "Regresaste a la app despues de cerrar el dialogo de impresion.",
  settingsTitle: "Ajustes",
  settingsHelp: "Estado del servidor local de prueba y datos de la app.",
  backend: "Backend",
  checkBackend: "Verificar backend",
  settingsGroupUsage: "Uso y conexion",
  settingsGroupUsageHelp: "Cupo diario de scans y estado del backend.",
  settingsGroupData: "Datos y preferencias",
  settingsGroupDataHelp: "Almacenamiento local, copias, idioma y apariencia.",
  settingsGroupSupport: "Soporte y confianza",
  settingsGroupSupportHelp: "Ayuda, privacidad, instalacion y seguridad IA.",
  settingsGroupDeveloper: "Desarrollo y release",
  settingsGroupDeveloperHelp: "Herramientas de publicacion ocultas para usuarios en produccion.",
  settingsGroupProjects: "Proyectos",
  settingsGroupProjectsHelp: "Organiza scans por maquina, conjunto o banco de prueba.",
  usageTitle: "Limites de uso",
  freeScansToday: "Scans gratis restantes hoy",
  freeScansNotChecked: "Verifica el backend para ver los scans restantes de hoy.",
  freeScansRemaining: "{remaining} de {limit}",
  freeScansUnlimited: "Disponible",
  usageNotChecked: "Aun no verificado.",
  usageDaily: "Diario",
  usageMonthly: "Mensual",
  usageServerDaily: "Servidor diario",
  usageServerMonthly: "Servidor mensual",
  usageDeviceDaily: "Dispositivo diario",
  usageDeviceMonthly: "Dispositivo mensual",
  installIdLabel: "ID de instalacion",
  usageOk: "El uso esta dentro de los limites configurados.",
  usageWarning: "El uso esta cerca del limite configurado.",
  usageBlocked: "Limite alcanzado. Los scans estan bloqueados hasta reiniciar o aumentar el limite.",
  usageLastScan: "Ultimo scan: {value}",
  localData: "Datos locales",
  dataManagementTitle: "Gestion de datos",
  dataManagementHelp: "Exportar o restaurar una copia local completa. Las acciones por pagina quedan en sus paginas.",
  exportBackup: "Exportar copia",
  importBackup: "Importar copia",
  backupExported: "Copia exportada.",
  backupImported: "Copia importada.",
  backupImportFailed: "No se pudo importar esa copia.",
  clearReadiness: "Borrar checklist",
  clearPreferences: "Restablecer preferencias",
  clearAllLocalData: "Borrar todos los datos",
  dataCleared: "Datos locales actualizados.",
  confirmClearAllLocalData: "Borrar todos los datos locales de este dispositivo? No se puede deshacer sin copia exportada.",
  confirmClearHistory: "Borrar todo el historial de scans en este dispositivo?",
  confirmClearKnownParts: "Borrar todas las piezas conocidas de este dispositivo?",
  confirmClearTestLog: "Borrar todo el log de pruebas de este dispositivo?",
  confirmClearReadiness: "Borrar la checklist de preparacion release?",
  confirmResetPreferences: "Restablecer idioma, apariencia y preferencias locales?",
  supportPage: "Soporte",
  privacyPolicy: "Privacidad",
  screenshotModeTitle: "Modo captura",
  screenshotModeHelp: "Oculta detalles locales de prueba para capturas App Store.",
  screenshotModeToggle: "Ocultar diagnosticos locales",
  installTitle: "Instalar",
  installHelp: "En iPhone, abre esta pagina en Safari, toca Compartir y luego Anadir a pantalla de inicio.",
  supportTitle: "Soporte y privacidad",
  supportHelp: "Abre informacion de soporte y privacidad dentro de la app.",
  safetyEyebrow: "Antes de escanear",
  safetyTitle: "Confirmacion de IA y privacidad",
  safetyIntro: "TechSpec Scanner es una herramienta asistida por IA. Revisa estos puntos antes de usarla con componentes reales.",
  safetyAi: "Los resultados de IA pueden ser incompletos o incorrectos y deben verificarse con medidas, marcas, documentacion del fabricante y criterio tecnico.",
  safetyPrivacy: "Las fotos y el contexto enviados pasan por el backend a Google Gemini para analisis.",
  safetyNoSoleUse: "No uses el resultado como unica base para decisiones criticas, compra, reparacion o diseno.",
  safetySecrets: "No envies claves API, contrasenas, documentos privados o datos personales no relacionados.",
  safetyAgree: "Entiendo y verificare los resultados de IA antes de usarlos.",
  safetyAccept: "Confirmar",
  safetySettingsTitle: "Confirmacion de seguridad IA",
  safetyAckMissing: "Aun no confirmado en este dispositivo.",
  safetyAckDone: "Confirmado el {date}.",
  reviewSafety: "Ver aviso",
  resetAcknowledgement: "Restablecer",
  safetyReset: "Confirmacion de seguridad restablecida en este dispositivo.",
  supportAppHelp: "Ayuda e informacion de contacto para TechSpec Scanner.",
  backToSettings: "Volver a ajustes",
  supportContact: "Contacto",
  supportContactHelp: "Para ayuda, comentarios o privacidad, usa el contacto configurado en la pagina publica de soporte.",
  betaFeedback: "Feedback beta",
  betaFeedbackHelp: "Envia feedback estructurado sobre resultados erroneos, errores, pantallas confusas o ideas.",
  betaGuide: "Guia beta",
  betaGuideHelp: "Checklist breve para que el feedback sea claro y util.",
  openPublicSupport: "Abrir soporte publico",
  supportIncludeTitle: "Al contactar soporte",
  supportIncludeVersion: "Incluye la version de la app.",
  supportIncludeDevice: "Incluye el modelo del dispositivo.",
  supportIncludeIssue: "Describe si el problema ocurrio al escanear, analizar, exportar informe o instalar.",
  supportIncludeSecret: "No envies claves API, contrasenas ni documentos personales no relacionados.",
  aiDisclaimerTitle: "Aviso de resultado IA",
  aiDisclaimerText: "Los resultados de IA pueden ser incompletos o incorrectos. Verifica con medidas fisicas, marcas, documentacion del fabricante y criterio tecnico.",
  privacyAppHelp: "Resumen del comportamiento actual de privacidad del scanner local-first.",
  privacyDataTitle: "Datos procesados",
  privacyDataPhotos: "Fotos de componentes que eliges enviar para analisis.",
  privacyDataNotes: "Notas, medidas, proyectos, correcciones y etiquetas de evaluacion que introduces.",
  privacyDataUsage: "ID anonimo de instalacion, contadores de uso y limites del servidor.",
  privacyDataLocal: "Ajustes locales, historial, piezas conocidas y pruebas guardadas en este navegador.",
  privacyAiTitle: "Procesamiento IA",
  privacyAiText: "Cuando el analisis IA esta activo, las imagenes y el contexto se envian via backend a Google Gemini.",
  privacyLocalTitle: "Almacenamiento local-first",
  privacyLocalText: "Historial, piezas conocidas, proyectos, logs, idioma y tema permanecen en almacenamiento local salvo exportacion o borrado.",
  privacyFullTitle: "Politica publica completa",
  privacyFullText: "La pagina publica de privacidad sigue disponible para publicacion y revision App Store.",
  openPublicPrivacy: "Abrir privacidad publica",
  appStoreTitle: "Preparacion App Store",
  appStoreHelp: "Elementos a preparar antes de una publicacion real.",
  readinessProgress: "{done} / {total} listos",
  readinessProgressHelp: "Progreso de preparacion release",
  readyPrivacy: "Politica de privacidad y texto de datos",
  readySupport: "URL de soporte y e-mail de contacto",
  readyScreenshots: "Capturas App Store",
  readyCosts: "Limites de uso y alertas de costes",
  readyReview: "Aviso IA y verificacion manual",
  publishingPackTitle: "Pack de publicacion",
  publishingPackHelp: "Genera notas de revision, resumen de privacidad, texto Store y checklist release.",
  releaseBlockersChecking: "Comprobando bloqueos release...",
  releaseBlockersReady: "No se detectaron bloqueos evidentes.",
  releaseBlockersFound: "{count} bloqueo(s) release requieren atencion.",
  releaseBlockerReadiness: "La checklist de preparacion no esta completa.",
  releaseBlockerBackend: "El backend de produccion aun no fue verificado.",
  releaseBlockerAppMode: "APP_MODE sigue en development. Produccion debe ocultar herramientas de desarrollo.",
  releaseBlockerPublicBaseUrl: "PUBLIC_BASE_URL de produccion no es una URL HTTPS final.",
  releaseBlockerLocalUrl: "La URL actual es local o no HTTPS. La release publica necesita HTTPS.",
  releaseBlockerSupportEmail: "El e-mail de soporte aun usa placeholder.",
  releaseBlockerSupportWebsite: "El sitio de soporte aun apunta a una ruta local.",
  releaseBlockerPrivacyUrl: "La URL de privacidad aun apunta a una ruta local.",
  releaseBlockerTermsUrl: "La URL de terminos aun apunta a una ruta local.",
  releaseBlockerPrivacyDraft: "La politica de privacidad aun esta como borrador.",
  releaseBlockerSupportPages: "Falta pagina de soporte, privacidad o terminos.",
  preflightTitle: "Preflight backend",
  preflightHelp: "Comprobaciones release del servidor desde /api/preflight.",
  preflightUnknown: "Verifica el backend para cargar resultados preflight.",
  preflightPassed: "Aprobado",
  preflightWarning: "Advertencia",
  preflightCritical: "Critico",
  preflightCheckAppMode: "Modo produccion",
  preflightCheckGeminiKey: "Clave API Gemini",
  preflightCheckPublicBaseUrl: "URL HTTPS produccion",
  preflightCheckRequestHttps: "Solicitud HTTPS actual",
  preflightCheckSupportEmail: "E-mail soporte",
  preflightCheckSupportWebsite: "Sitio soporte",
  preflightCheckPrivacyUrl: "URL privacidad",
  preflightCheckTermsUrl: "URL terminos",
  preflightCheckPrivacyPublicationDate: "Fecha publicacion privacidad",
  preflightCheckSupportPages: "Paginas soporte",
  preflightCheckBetaAccess: "Acceso beta",
  preflightCheckLimits: "Limites de uso y tasa",
  reviewNotesTitle: "Notas de revision",
  reviewNotesHelp: "Contexto breve para revisores App Store.",
  privacySummaryTitle: "Resumen privacidad",
  privacySummaryHelp: "Puntos de datos para etiquetas de privacidad.",
  releaseChecklistTitle: "Checklist release",
  releaseChecklistHelp: "Tareas exportables para la entrega final.",
  storeListingTitle: "Texto Store",
  storeListingHelp: "Borrador para la ficha App Store.",
  productionEnvTitle: "Env produccion",
  productionEnvHelp: "Plantilla segura de variables backend sin secretos.",
  supportConfigTitle: "Config soporte",
  supportConfigHelp: "Plantilla para URLs publicas de soporte, privacidad y terminos.",
  copyReviewNotes: "Copiar notas revision",
  copyPrivacySummary: "Copiar resumen privacidad",
  copyStoreListing: "Copiar texto Store",
  copyProductionEnv: "Copiar plantilla env",
  copySupportConfig: "Copiar config soporte",
  downloadReleaseChecklist: "Descargar checklist release",
  reviewNotesCopied: "Notas de revision copiadas.",
  privacySummaryCopied: "Resumen de privacidad copiado.",
  storeListingCopied: "Texto Store copiado.",
  productionEnvCopied: "Plantilla env produccion copiada.",
  supportConfigCopied: "Plantilla config soporte copiada.",
  releaseChecklistDownloaded: "Checklist release descargada.",
  projectsTitle: "Proyectos",
  projectsHelp: "Agrupa scans por maquina, conjunto o banco de prueba.",
  projectName: "Nombre del proyecto",
  addProject: "Anadir proyecto",
  diagnosticsTitle: "Diagnosticos app",
  diagnosticsHelp: "Detalles utiles para soporte y pruebas iPhone.",
  diagnosticsVersion: "Version",
  diagnosticsInstallMode: "Modo instalacion",
  diagnosticsServiceWorker: "Cache offline",
  diagnosticsNetwork: "Red",
  diagnosticsPhoneUrl: "URL iPhone",
  diagnosticsInstalled: "Pantalla de inicio / standalone",
  diagnosticsBrowser: "Pestana navegador",
  diagnosticsSwReady: "Listo",
  diagnosticsSwInstalling: "Instalando",
  diagnosticsSwUnsupported: "No soportado",
  diagnosticsOnline: "En linea",
  diagnosticsOffline: "Sin conexion",
  copyDiagnostics: "Copiar diagnosticos",
  copyPhoneUrl: "Copiar URL iPhone",
  downloadSupportBundle: "Descargar bundle soporte",
  diagnosticsCopied: "Diagnosticos copiados.",
  phoneUrlCopied: "URL iPhone copiada.",
  supportBundleDownloaded: "Bundle soporte descargado.",
  phoneUrlUnavailable: "Verifica primero backend",
  storageStatus: "{projects} proyectos, {scans} scans recientes, {parts} piezas conocidas, {tests} pruebas guardadas localmente.",
  noReports: "Aun no hay informes. Analiza primero un componente.",
  noKnownParts: "Aun no hay piezas conocidas.",
  noDetails: "No se recibieron detalles.",
  unknownComponent: "Componente desconocido",
  uncategorized: "Sin categoria",
  unknown: "Desconocido",
  notVisible: "No visible",
  notEnoughEvidence: "No hay suficiente evidencia visual.",
  noReadableMarkings: "No se informaron marcas legibles.",
  noEvidenceSummary: "No se recibio resumen de evidencia.",
  sharperPhoto: "Toma una foto mas nitida desde otro angulo.",
  backendChecking: "Verificando...",
  backendOnline: "En linea. Modo: {appMode}. Clave Gemini: {keyStatus}. Modelo rapido: {model}. Modelo fuerte: {strongModel}. Servidor: {serverVersion}.",
  backendMissing: "falta",
  backendConfigured: "configurada",
  backendUnhealthy: "El backend responde, pero no indica estado sano.",
  backendOffline: "Backend no disponible.",
  reportGenerated: "Generado por TechSpec Scanner. Los resultados IA deben verificarse con medidas, marcas y documentacion tecnica antes de usarlos."
};

const elements = {
  appSplash: document.querySelector("#appSplash"),
  toastBox: document.querySelector("#toastBox"),
  safetyDialog: document.querySelector("#safetyDialog"),
  safetyAgreeInput: document.querySelector("#safetyAgreeInput"),
  acceptSafetyBtn: document.querySelector("#acceptSafetyBtn"),
  reviewPrivacyFromSafetyBtn: document.querySelector("#reviewPrivacyFromSafetyBtn"),
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  pages: Array.from(document.querySelectorAll(".app-page")),
  slotInputs: Array.from(document.querySelectorAll(".slot-input")),
  slotCards: Array.from(document.querySelectorAll("[data-slot-card]")),
  previewWrap: document.querySelector("#previewWrap"),
  previewGrid: document.querySelector("#previewGrid"),
  notes: document.querySelector("#notes"),
  analyzeBtn: document.querySelector("#analyzeBtn"),
  demoScanBtn: document.querySelector("#demoScanBtn"),
  scanMode: document.querySelector("#scanMode"),
  projectSelect: document.querySelector("#projectSelect"),
  newProjectName: document.querySelector("#newProjectName"),
  addProjectBtn: document.querySelector("#addProjectBtn"),
  measurementInputs: Array.from(document.querySelectorAll("[data-measure]")),
  measurementLabels: Array.from(document.querySelectorAll("[data-measure-label]")),
  measurementHint: document.querySelector("#measurementHint"),
  checklistInputs: Array.from(document.querySelectorAll(".advanced-scan-panel .checklist-field .checklist-options input[type='checkbox']")),
  scanQualityLabel: document.querySelector("#scanQualityLabel"),
  scanQualityText: document.querySelector("#scanQualityText"),
  scanQualityList: document.querySelector("#scanQualityList"),
  emptyState: document.querySelector("#emptyState"),
  loadingState: document.querySelector("#loadingState"),
  resultCard: document.querySelector("#resultCard"),
  errorBox: document.querySelector("#errorBox"),
  copyResultBtn: document.querySelector("#copyResultBtn"),
  shareResultBtn: document.querySelector("#shareResultBtn"),
  exportPdfBtn: document.querySelector("#exportPdfBtn"),
  resultFeedbackBtn: document.querySelector("#resultFeedbackBtn"),
  downloadResultBtn: document.querySelector("#downloadResultBtn"),
  editResultBtn: document.querySelector("#editResultBtn"),
  saveEditsBtn: document.querySelector("#saveEditsBtn"),
  saveKnownPartBtn: document.querySelector("#saveKnownPartBtn"),
  verificationStatus: document.querySelector("#verificationStatus"),
  verificationInputs: Array.from(document.querySelectorAll("[data-verify]")),
  correctName: document.querySelector("#correctName"),
  correctCategory: document.querySelector("#correctCategory"),
  correctPartNumber: document.querySelector("#correctPartNumber"),
  correctMaterial: document.querySelector("#correctMaterial"),
  applyCorrectionBtn: document.querySelector("#applyCorrectionBtn"),
  evaluationVerdict: document.querySelector("#evaluationVerdict"),
  evaluationCorrectName: document.querySelector("#evaluationCorrectName"),
  evaluationReasonInputs: Array.from(document.querySelectorAll("[data-eval-reason]")),
  evaluationNotes: document.querySelector("#evaluationNotes"),
  saveEvaluationBtn: document.querySelector("#saveEvaluationBtn"),
  resultNotes: document.querySelector("#resultNotes"),
  resultSource: document.querySelector("#resultSource"),
  componentName: document.querySelector("#componentName"),
  category: document.querySelector("#category"),
  confidenceValue: document.querySelector("#confidenceValue"),
  confidencePanel: document.querySelector("#confidencePanel"),
  confidenceLabel: document.querySelector("#confidenceLabel"),
  confidenceText: document.querySelector("#confidenceText"),
  confidenceReasons: document.querySelector("#confidenceReasons"),
  likelyFunction: document.querySelector("#likelyFunction"),
  possibleMaterial: document.querySelector("#possibleMaterial"),
  partNumber: document.querySelector("#partNumber"),
  markingsText: document.querySelector("#markingsText"),
  componentFamily: document.querySelector("#componentFamily"),
  evidenceSummary: document.querySelector("#evidenceSummary"),
  nextPhoto: document.querySelector("#nextPhoto"),
  featuresList: document.querySelector("#featuresList"),
  measurementList: document.querySelector("#measurementList"),
  standardsList: document.querySelector("#standardsList"),
  alternativesList: document.querySelector("#alternativesList"),
  checksList: document.querySelector("#checksList"),
  warningsList: document.querySelector("#warningsList"),
  missingList: document.querySelector("#missingList"),
  matchesPanel: document.querySelector("#matchesPanel"),
  matchesList: document.querySelector("#matchesList"),
  databasePanel: document.querySelector("#databasePanel"),
  databaseList: document.querySelector("#databaseList"),
  clearDatabaseBtn: document.querySelector("#clearDatabaseBtn"),
  exportDatabaseBtn: document.querySelector("#exportDatabaseBtn"),
  importDatabaseInput: document.querySelector("#importDatabaseInput"),
  libraryList: document.querySelector("#libraryList"),
  historyPanel: document.querySelector("#historyPanel"),
  historyList: document.querySelector("#historyList"),
  clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
  clearReportsBtn: document.querySelector("#clearReportsBtn"),
  reportsList: document.querySelector("#reportsList"),
  reportsEvaluationSummary: document.querySelector("#reportsEvaluationSummary"),
  reportPreview: document.querySelector("#reportPreview"),
  backFromReportBtn: document.querySelector("#backFromReportBtn"),
  reportDoneBtn: document.querySelector("#reportDoneBtn"),
  printReportBtn: document.querySelector("#printReportBtn"),
  openSupportInfoBtn: document.querySelector("#openSupportInfoBtn"),
  openPrivacyInfoBtn: document.querySelector("#openPrivacyInfoBtn"),
  backFromSupportBtn: document.querySelector("#backFromSupportBtn"),
  backFromPrivacyBtn: document.querySelector("#backFromPrivacyBtn"),
  exportTestLogBtn: document.querySelector("#exportTestLogBtn"),
  exportTestCsvBtn: document.querySelector("#exportTestCsvBtn"),
  clearTestLogBtn: document.querySelector("#clearTestLogBtn"),
  testTotal: document.querySelector("#testTotal"),
  testCorrect: document.querySelector("#testCorrect"),
  testPartly: document.querySelector("#testPartly"),
  testWrong: document.querySelector("#testWrong"),
  testAccuracy: document.querySelector("#testAccuracy"),
  testLogList: document.querySelector("#testLogList"),
  projectPageName: document.querySelector("#projectPageName"),
  projectPageAddBtn: document.querySelector("#projectPageAddBtn"),
  projectList: document.querySelector("#projectList"),
  backendStatus: document.querySelector("#backendStatus"),
  checkBackendBtn: document.querySelector("#checkBackendBtn"),
  appVersionText: document.querySelector("#appVersionText"),
  installModeText: document.querySelector("#installModeText"),
  serviceWorkerText: document.querySelector("#serviceWorkerText"),
  networkStatusText: document.querySelector("#networkStatusText"),
  phoneUrlText: document.querySelector("#phoneUrlText"),
  copyDiagnosticsBtn: document.querySelector("#copyDiagnosticsBtn"),
  copyPhoneUrlBtn: document.querySelector("#copyPhoneUrlBtn"),
  downloadSupportBundleBtn: document.querySelector("#downloadSupportBundleBtn"),
  diagnosticsStatus: document.querySelector("#diagnosticsStatus"),
  usageStatus: document.querySelector("#usageStatus"),
  freeScansRemainingText: document.querySelector("#freeScansRemainingText"),
  freeScansRemainingHelp: document.querySelector("#freeScansRemainingHelp"),
  installIdText: document.querySelector("#installIdText"),
  dailyUsageText: document.querySelector("#dailyUsageText"),
  dailyUsageBar: document.querySelector("#dailyUsageBar"),
  monthlyUsageText: document.querySelector("#monthlyUsageText"),
  monthlyUsageBar: document.querySelector("#monthlyUsageBar"),
  deviceDailyUsageText: document.querySelector("#deviceDailyUsageText"),
  deviceDailyUsageBar: document.querySelector("#deviceDailyUsageBar"),
  deviceMonthlyUsageText: document.querySelector("#deviceMonthlyUsageText"),
  deviceMonthlyUsageBar: document.querySelector("#deviceMonthlyUsageBar"),
  readinessInputs: Array.from(document.querySelectorAll("[data-readiness]")),
  readinessSummary: document.querySelector("#readinessSummary"),
  readinessProgressBar: document.querySelector("#readinessProgressBar"),
  releaseBlockerPanel: document.querySelector("#releaseBlockerPanel"),
  releaseBlockerSummary: document.querySelector("#releaseBlockerSummary"),
  releaseBlockerList: document.querySelector("#releaseBlockerList"),
  preflightPanel: document.querySelector("#preflightPanel"),
  preflightList: document.querySelector("#preflightList"),
  copyReviewNotesBtn: document.querySelector("#copyReviewNotesBtn"),
  copyPrivacySummaryBtn: document.querySelector("#copyPrivacySummaryBtn"),
  copyStoreListingBtn: document.querySelector("#copyStoreListingBtn"),
  copyProductionEnvBtn: document.querySelector("#copyProductionEnvBtn"),
  copySupportConfigBtn: document.querySelector("#copySupportConfigBtn"),
  downloadReleaseChecklistBtn: document.querySelector("#downloadReleaseChecklistBtn"),
  exportAllDataBtn: document.querySelector("#exportAllDataBtn"),
  importAllDataInput: document.querySelector("#importAllDataInput"),
  clearReadinessDataBtn: document.querySelector("#clearReadinessDataBtn"),
  clearPreferencesDataBtn: document.querySelector("#clearPreferencesDataBtn"),
  clearAllLocalDataBtn: document.querySelector("#clearAllLocalDataBtn"),
  safetyAckStatus: document.querySelector("#safetyAckStatus"),
  reviewSafetyBtn: document.querySelector("#reviewSafetyBtn"),
  resetSafetyAckBtn: document.querySelector("#resetSafetyAckBtn"),
  storageStatus: document.querySelector("#storageStatus"),
  languageSelect: document.querySelector("#languageSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  screenshotModeToggle: document.querySelector("#screenshotModeToggle")
};

let preparedImages = [];
let latestResult = null;
let editMode = false;
let editingKnownPartId = null;
let screenshotDemoActive = false;
let activePasteSlot = null;
let safetyPrivacyReviewActive = false;
let reportPrintPending = false;
let focusBeforeSafetyDialog = null;
let latestHealth = null;
let latestAppMode = "development";
let supportConfigText = "";

hideAppSplashWhenReady();
registerServiceWorker();
ensureDefaultProject();
if (elements.languageSelect) {
  elements.languageSelect.value = getLanguage();
}
if (elements.themeSelect) {
  elements.themeSelect.value = getTheme();
}
if (elements.screenshotModeToggle) {
  elements.screenshotModeToggle.checked = getScreenshotMode();
}
applyTheme();
applyAppMode();
applyScreenshotMode();
applyLanguage();
renderProjects();
renderHistory();
renderDatabase();
renderReports();
renderTestLog();
renderStorageStatus();
renderReadiness();
renderSafetyAckStatus();
renderInstallId();
renderAppDiagnostics();
updateReleaseBlockers();
updateMeasurementPreset();
updateScanQuality();
showInitialPageFromUrl();
showSafetyDialogIfNeeded();
checkBackend();

for (const button of elements.navButtons) {
  button.addEventListener("click", () => showPage(button.dataset.page));
}

for (const input of elements.slotInputs) {
  input.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    const slot = event.target.dataset.slot;
    const label = getSlotLabel(slot);
    clearError();

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError(t("chooseImage"));
      return;
    }

    try {
      await addImageFile(file, slot, label);
    } catch (error) {
      showError(error.message);
    }
  });
}

for (const card of elements.slotCards) {
  const slot = card.dataset.slotCard;
  card.addEventListener("focus", () => {
    activePasteSlot = slot;
  });
  card.addEventListener("pointerdown", () => {
    activePasteSlot = slot;
  });
  card.addEventListener("paste", handlePaste);
}

document.addEventListener("paste", handlePaste);

elements.scanMode.addEventListener("change", updateMeasurementPreset);
if (elements.languageSelect) {
  elements.languageSelect.addEventListener("change", () => {
    localStorage.setItem(languageKey, elements.languageSelect.value);
    applyLanguage();
  });
}
if (elements.themeSelect) {
  elements.themeSelect.addEventListener("change", () => {
    localStorage.setItem(themeKey, elements.themeSelect.value);
    applyTheme();
  });
}
if (elements.screenshotModeToggle) {
  elements.screenshotModeToggle.addEventListener("change", () => {
    localStorage.setItem(screenshotModeKey, elements.screenshotModeToggle.checked ? "1" : "0");
    applyScreenshotMode();
    renderInstallId();
    renderAppDiagnostics();
    renderUsage(latestHealth?.usage);
  });
}
elements.notes.addEventListener("input", updateScanQuality);
for (const input of elements.measurementInputs) {
  input.addEventListener("input", updateScanQuality);
}
for (const input of elements.checklistInputs) {
  input.addEventListener("change", updateScanQuality);
}

elements.analyzeBtn.addEventListener("click", async () => {
  if (!preparedImages.length) return;
  if (!hasSafetyAcknowledgement()) {
    showSafetyDialog({ force: true });
    return;
  }

  setLoading(true);
  clearError();
  setEditMode(false);

  try {
    const betaAccessReady = await ensureBetaAccess();
    if (!betaAccessReady) {
      showError(t("betaAccessRequired"));
      return;
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TechSpec-Install-Id": getInstallId(),
        "X-TechSpec-Beta-Code": getBetaAccessCode()
      },
      body: JSON.stringify({
        images: preparedImages.map(({ imageBase64, mimeType }) => ({ imageBase64, mimeType })),
        scanMode: getScanMode(),
        photoChecklist: getPhotoChecklist(),
        projectName: getSelectedProjectName(),
        measurements: getMeasurements(),
        language: getLanguage(),
        notes: elements.notes.value.trim()
      })
    });

    const payload = await readApiPayload(response);
    if (!response.ok) {
      throw new Error(apiErrorMessage(payload, response.status));
    }
    if (payload.usage) {
      renderUsage(payload.usage);
    }

    const meta = {
      projectId: elements.projectSelect.value,
      projectName: getSelectedProjectName(),
      measurements: getMeasurements()
    };
    renderResult(payload.result, payload.source, preparedImages.map(image => image.previewUrl), meta);
    saveHistory(payload.result, payload.source, preparedImages[0]?.previewUrl, { ...meta, scanId: latestResult.scanId });
  } catch (error) {
    const message = error instanceof TypeError ? t("errorServerOffline") : error.message || t("analysisFailed");
    showError(message);
  } finally {
    setLoading(false);
  }
});

elements.demoScanBtn.addEventListener("click", loadScreenshotDemo);

elements.clearHistoryBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearHistory"))) return;
  localStorage.removeItem(historyKey);
  renderHistory();
});

elements.clearDatabaseBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearKnownParts"))) return;
  localStorage.removeItem(databaseKey);
  renderDatabase();
  renderMatches();
  renderStorageStatus();
});

elements.exportDatabaseBtn.addEventListener("click", () => {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    projects: getProjects(),
    knownParts: getDatabase()
  };
  downloadJson(payload, "techspec-scanner-library.json");
});

elements.importDatabaseInput.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const payload = JSON.parse(await file.text());
    const incomingParts = Array.isArray(payload.knownParts) ? payload.knownParts : Array.isArray(payload) ? payload : [];
    const incomingProjects = Array.isArray(payload.projects) ? payload.projects : [];
    const mergedParts = [...incomingParts, ...getDatabase()].slice(0, 120);
    const mergedProjects = mergeProjects(getProjects(), incomingProjects);
    localStorage.setItem(databaseKey, JSON.stringify(mergedParts));
    localStorage.setItem(projectKey, JSON.stringify(mergedProjects));
    renderProjects();
    renderDatabase();
    renderMatches();
    renderStorageStatus();
    showToast(t("libraryImported"));
  } catch {
    showError(t("libraryImportFailed"));
  } finally {
    event.target.value = "";
  }
});

elements.clearReportsBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearHistory"))) return;
  localStorage.removeItem(historyKey);
  renderHistory();
  renderReports();
  renderStorageStatus();
});

elements.addProjectBtn.addEventListener("click", () => addProjectFromInput(elements.newProjectName));
elements.projectPageAddBtn.addEventListener("click", () => addProjectFromInput(elements.projectPageName));
elements.projectSelect.addEventListener("change", () => {
  localStorage.setItem(selectedProjectKey, elements.projectSelect.value);
  renderProjects();
});

elements.checkBackendBtn.addEventListener("click", checkBackend);
elements.copyDiagnosticsBtn.addEventListener("click", copyDiagnostics);
elements.copyPhoneUrlBtn.addEventListener("click", copyPhoneUrl);
elements.downloadSupportBundleBtn.addEventListener("click", downloadSupportBundle);
elements.copyReviewNotesBtn.addEventListener("click", () => copyPublishingText(buildReviewNotesText(), t("reviewNotesCopied")));
elements.copyPrivacySummaryBtn.addEventListener("click", () => copyPublishingText(buildPrivacySummaryText(), t("privacySummaryCopied")));
elements.copyStoreListingBtn.addEventListener("click", () => copyPublishingText(buildStoreListingText(), t("storeListingCopied")));
elements.copyProductionEnvBtn.addEventListener("click", () => copyPublishingText(buildProductionEnvTemplate(), t("productionEnvCopied")));
elements.copySupportConfigBtn.addEventListener("click", () => copyPublishingText(buildSupportConfigTemplate(), t("supportConfigCopied")));
elements.downloadReleaseChecklistBtn.addEventListener("click", () => {
  downloadText(buildReleaseChecklistText(), `techspec-release-checklist-${dateStamp()}.md`, "text/markdown;charset=utf-8");
  showToast(t("releaseChecklistDownloaded"));
});

window.addEventListener("online", renderAppDiagnostics);
window.addEventListener("offline", renderAppDiagnostics);

elements.copyResultBtn.addEventListener("click", async () => {
  if (!latestResult) return;
  syncResultFromUi();

  const text = formatResultText(latestResult.result, latestResult.source);
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("copied"));
  } catch {
    showError(t("copyBlocked"));
  }
});

elements.shareResultBtn.addEventListener("click", async () => {
  if (!latestResult) return;
  syncResultFromUi();

  const text = formatResultText(latestResult.result, latestResult.source);
  const title = latestResult.result?.componentName || "TechSpec Scanner result";
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
      await copyTextFallback(text, t("shareFailed"));
      return;
    }
  }

  await copyTextFallback(text, t("shareUnavailable"));
});

elements.downloadResultBtn.addEventListener("click", () => {
  if (!latestResult) return;
  syncResultFromUi();

  const payload = {
    exportedAt: new Date().toISOString(),
    scanId: latestResult.scanId,
    projectId: latestResult.projectId,
    projectName: latestResult.projectName,
    measurements: latestResult.measurements,
    verificationChecklist: latestResult.verificationChecklist,
    verificationStatus: elements.verificationStatus.value,
    technicianNotes: elements.resultNotes.value.trim(),
    evaluation: latestResult.evaluation,
    source: latestResult.source,
    result: latestResult.result
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const name = latestResult.result?.componentName || "component-scan";
  link.href = url;
  link.download = `${slugify(name)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

elements.exportPdfBtn.addEventListener("click", () => {
  if (!latestResult) return;
  syncResultFromUi();
  showReportPreview(latestResult);
});

elements.resultFeedbackBtn.addEventListener("click", () => {
  if (!latestResult) return;
  syncResultFromUi();
  window.location.href = buildResultFeedbackUrl();
});

elements.backFromReportBtn.addEventListener("click", returnFromReportPreview);
elements.reportDoneBtn.addEventListener("click", returnFromReportPreview);
elements.printReportBtn.addEventListener("click", () => {
  reportPrintPending = true;
  window.print();
});
elements.openSupportInfoBtn.addEventListener("click", () => showPage("support-app"));
elements.openPrivacyInfoBtn.addEventListener("click", () => showPage("privacy-app"));
elements.backFromSupportBtn.addEventListener("click", () => showPage("settings"));
elements.backFromPrivacyBtn.addEventListener("click", () => {
  if (safetyPrivacyReviewActive && !hasSafetyAcknowledgement()) {
    safetyPrivacyReviewActive = false;
    showPage("scan");
    showSafetyDialog({ force: true });
    return;
  }
  showPage("settings");
});

elements.editResultBtn.addEventListener("click", () => {
  setEditMode(true);
});

elements.saveEditsBtn.addEventListener("click", () => {
  syncResultFromUi();
  setEditMode(false);
  renderMatches();
  showToast(t("editsSaved"));
});

elements.saveKnownPartBtn.addEventListener("click", () => {
  if (!latestResult) return;
  syncResultFromUi();
  saveKnownPart();
});

elements.applyCorrectionBtn.addEventListener("click", () => {
  if (!latestResult) return;
  applyCorrection();
});

elements.saveEvaluationBtn.addEventListener("click", () => {
  if (!latestResult) return;
  saveEvaluation();
});

elements.exportTestLogBtn.addEventListener("click", () => {
  downloadJson({
    exportedAt: new Date().toISOString(),
    version: 1,
    testLog: getTestLog()
  }, "techspec-scanner-test-log.json");
});

elements.exportTestCsvBtn.addEventListener("click", () => {
  downloadText(buildTestLogCsv(getTestLog()), "techspec-scanner-test-log.csv", "text/csv;charset=utf-8");
});

elements.clearTestLogBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearTestLog"))) return;
  localStorage.removeItem(testLogKey);
  renderTestLog();
  renderStorageStatus();
});

for (const input of elements.verificationInputs) {
  input.addEventListener("change", syncVerificationStatus);
}

for (const input of elements.readinessInputs) {
  input.addEventListener("change", saveReadiness);
}

document.addEventListener("keydown", handleSafetyDialogKeydown);

window.addEventListener("afterprint", () => {
  if (!reportPrintPending) return;
  reportPrintPending = false;
  returnFromReportPreview({ showMessage: true });
});

window.addEventListener("focus", () => {
  if (!reportPrintPending || !document.body.classList.contains("is-report-preview")) return;
  window.setTimeout(() => {
    if (!reportPrintPending) return;
    reportPrintPending = false;
    returnFromReportPreview({ showMessage: true });
  }, 500);
});

elements.safetyAgreeInput.addEventListener("change", () => {
  elements.acceptSafetyBtn.disabled = !elements.safetyAgreeInput.checked;
});

elements.acceptSafetyBtn.addEventListener("click", () => {
  acceptSafetyAcknowledgement();
});

elements.reviewPrivacyFromSafetyBtn.addEventListener("click", () => {
  safetyPrivacyReviewActive = true;
  hideSafetyDialog();
  showPage("privacy-app");
});

elements.reviewSafetyBtn.addEventListener("click", () => {
  showSafetyDialog({ force: true });
});

elements.resetSafetyAckBtn.addEventListener("click", () => {
  localStorage.removeItem(safetyAckKey);
  renderSafetyAckStatus();
  showToast(t("safetyReset"));
  showSafetyDialog({ force: true });
});

elements.exportAllDataBtn.addEventListener("click", () => {
  exportAllLocalData();
});

elements.importAllDataInput.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const payload = JSON.parse(await file.text());
    importAllLocalData(payload);
    showToast(t("backupImported"));
  } catch {
    showError(t("backupImportFailed"));
  } finally {
    event.target.value = "";
  }
});

elements.clearReadinessDataBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearReadiness"))) return;
  localStorage.removeItem(readinessKey);
  refreshLocalDataViews();
  showToast(t("dataCleared"));
});

elements.clearPreferencesDataBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmResetPreferences"))) return;
  localStorage.removeItem(languageKey);
  localStorage.removeItem(themeKey);
  localStorage.removeItem(screenshotModeKey);
  elements.languageSelect.value = getLanguage();
  elements.themeSelect.value = getTheme();
  elements.screenshotModeToggle.checked = getScreenshotMode();
  applyTheme();
  applyScreenshotMode();
  applyLanguage();
  refreshLocalDataViews();
  showToast(t("dataCleared"));
});

elements.clearAllLocalDataBtn.addEventListener("click", () => {
  if (!window.confirm(t("confirmClearAllLocalData"))) return;
  clearAllLocalData();
  refreshLocalDataViews();
  showSafetyDialog({ force: true });
  showToast(t("dataCleared"));
});

function hideAppSplashWhenReady() {
  const startedAt = performance.now();
  window.addEventListener("load", () => {
    const remaining = Math.max(0, 650 - (performance.now() - startedAt));
    window.setTimeout(() => {
      elements.appSplash?.classList.add("is-hidden");
    }, remaining);
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(() => {
      renderAppDiagnostics();
    }).catch(() => {
      // Non-critical during local testing.
    });
  });
  navigator.serviceWorker.ready.then(renderAppDiagnostics).catch(() => {});
}

function showSafetyDialogIfNeeded() {
  if (hasSafetyAcknowledgement()) return;
  window.setTimeout(() => {
    showSafetyDialog();
  }, 760);
}

function showInitialPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("page") || window.location.hash.replace(/^#/, "")).trim();
  const allowedPages = new Set(elements.navButtons.map(button => button.dataset.page).filter(Boolean));
  if (allowedPages.has(requested)) {
    showPage(requested);
  }
}

function hasSafetyAcknowledgement() {
  try {
    const value = JSON.parse(localStorage.getItem(safetyAckKey) || "null");
    return Boolean(value?.acceptedAt);
  } catch {
    return false;
  }
}

function getSafetyAcknowledgement() {
  try {
    const value = JSON.parse(localStorage.getItem(safetyAckKey) || "null");
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function showSafetyDialog({ force = false } = {}) {
  if (!force && hasSafetyAcknowledgement()) return;
  focusBeforeSafetyDialog = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  elements.safetyAgreeInput.checked = false;
  elements.acceptSafetyBtn.disabled = true;
  elements.safetyDialog.classList.remove("is-hidden");
  window.setTimeout(() => elements.safetyAgreeInput.focus(), 0);
}

function hideSafetyDialog({ restoreFocus = true } = {}) {
  elements.safetyDialog.classList.add("is-hidden");
  if (restoreFocus && focusBeforeSafetyDialog && document.contains(focusBeforeSafetyDialog)) {
    focusBeforeSafetyDialog.focus();
  }
  focusBeforeSafetyDialog = null;
}

function acceptSafetyAcknowledgement() {
  if (!elements.safetyAgreeInput.checked) return;
  localStorage.setItem(safetyAckKey, JSON.stringify({
    acceptedAt: new Date().toISOString(),
    version: 1,
    language: getLanguage()
  }));
  hideSafetyDialog();
  renderSafetyAckStatus();
}

function handleSafetyDialogKeydown(event) {
  if (elements.safetyDialog.classList.contains("is-hidden")) return;

  if (event.key === "Escape") {
    if (hasSafetyAcknowledgement()) {
      hideSafetyDialog();
    }
    event.preventDefault();
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = getSafetyDialogFocusable();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    last.focus();
    event.preventDefault();
  } else if (!event.shiftKey && document.activeElement === last) {
    first.focus();
    event.preventDefault();
  }
}

function getSafetyDialogFocusable() {
  return Array.from(elements.safetyDialog.querySelectorAll("button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"))
    .filter(element => !element.disabled && element.offsetParent !== null);
}

function renderSafetyAckStatus() {
  if (!elements.safetyAckStatus) return;
  const acknowledgement = getSafetyAcknowledgement();
  if (!acknowledgement?.acceptedAt) {
    elements.safetyAckStatus.textContent = t("safetyAckMissing");
    elements.safetyAckStatus.dataset.status = "missing";
    return;
  }

  const formattedDate = new Intl.DateTimeFormat(getLanguage(), {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(acknowledgement.acceptedAt));
  elements.safetyAckStatus.textContent = t("safetyAckDone", { date: formattedDate });
  elements.safetyAckStatus.dataset.status = "accepted";
}

function getLanguage() {
  const value = localStorage.getItem(languageKey) || "en";
  return translations[value] ? value : "en";
}

function getTheme() {
  const value = localStorage.getItem(themeKey) || "light";
  return ["light", "dark", "workshop"].includes(value) ? value : "light";
}

function getAppMode() {
  return latestAppMode === "production" ? "production" : "development";
}

function getScreenshotMode() {
  return localStorage.getItem(screenshotModeKey) === "1";
}

function applyScreenshotMode() {
  document.body.classList.toggle("screenshot-mode", getScreenshotMode());
}

function applyAppMode() {
  document.body.classList.toggle("production-mode", getAppMode() === "production");
  if (getAppMode() === "production" && document.querySelector(".app-page.is-active.dev-only")) {
    showPage("scan");
  }
}

function getInstallId() {
  let value = localStorage.getItem(installIdKey);
  if (!value) {
    const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    value = `ts-${random}`.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
    localStorage.setItem(installIdKey, value);
  }
  return value;
}

function getBetaAccessCode() {
  return localStorage.getItem(betaAccessCodeKey) || "";
}

async function ensureBetaAccess() {
  if (!latestHealth) {
    await checkBackend();
  }
  if (!latestHealth?.betaAccessRequired) return true;

  const existing = getBetaAccessCode();
  if (existing && await validateBetaAccess(existing)) return true;

  const entered = window.prompt(t("betaAccessPrompt"));
  if (!entered) return false;
  const code = entered.trim();
  if (await validateBetaAccess(code)) {
    localStorage.setItem(betaAccessCodeKey, code);
    return true;
  }

  localStorage.removeItem(betaAccessCodeKey);
  showError(t("betaAccessInvalid"));
  return false;
}

async function validateBetaAccess(code) {
  if (!code) return false;
  try {
    const response = await fetch("/api/beta-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TechSpec-Install-Id": getInstallId()
      },
      body: JSON.stringify({ code })
    });
    const payload = await response.json().catch(() => ({}));
    return response.ok && payload.ok;
  } catch {
    return false;
  }
}

function renderInstallId() {
  if (elements.installIdText) {
    elements.installIdText.textContent = getScreenshotMode() ? "hidden-for-screenshot" : getInstallId();
  }
}

function renderAppDiagnostics() {
  if (elements.appVersionText) {
    elements.appVersionText.textContent = `${appBuildVersion} (${getAppMode()})`;
  }
  if (elements.installModeText) {
    elements.installModeText.textContent = isStandaloneMode() ? t("diagnosticsInstalled") : t("diagnosticsBrowser");
  }
  if (elements.serviceWorkerText) {
    elements.serviceWorkerText.textContent = getServiceWorkerStatus();
  }
  if (elements.networkStatusText) {
    elements.networkStatusText.textContent = navigator.onLine ? t("diagnosticsOnline") : t("diagnosticsOffline");
    elements.networkStatusText.dataset.status = navigator.onLine ? "ok" : "blocked";
  }
  if (elements.phoneUrlText) {
    elements.phoneUrlText.textContent = getScreenshotMode() ? "Hidden for screenshot" : getPreferredLocalAccessUrl() || t("phoneUrlUnavailable");
  }
}

function isStandaloneMode() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function getServiceWorkerStatus() {
  if (!("serviceWorker" in navigator)) return t("diagnosticsSwUnsupported");
  return navigator.serviceWorker.controller ? t("diagnosticsSwReady") : t("diagnosticsSwInstalling");
}

async function copyDiagnostics() {
  const text = buildDiagnosticsText();
  try {
    await navigator.clipboard.writeText(text);
    if (elements.diagnosticsStatus) {
      elements.diagnosticsStatus.textContent = t("diagnosticsCopied");
    }
  } catch {
    if (elements.diagnosticsStatus) {
      elements.diagnosticsStatus.textContent = t("copyBlocked");
    }
  }
}

async function copyPhoneUrl() {
  const url = getPreferredLocalAccessUrl();
  if (!url) {
    if (elements.diagnosticsStatus) {
      elements.diagnosticsStatus.textContent = t("phoneUrlUnavailable");
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    if (elements.diagnosticsStatus) {
      elements.diagnosticsStatus.textContent = t("phoneUrlCopied");
    }
    showToast(t("phoneUrlCopied"));
  } catch {
    if (elements.diagnosticsStatus) {
      elements.diagnosticsStatus.textContent = t("copyBlocked");
    }
  }
}

function getPreferredLocalAccessUrl() {
  const urls = Array.isArray(latestHealth?.localAccessUrls) ? latestHealth.localAccessUrls : [];
  return urls[0] || "";
}

async function updateReleaseBlockers() {
  if (!elements.releaseBlockerList || !elements.releaseBlockerSummary) return;
  if (!supportConfigText) {
    try {
      const response = await fetch("/support/support-config.js", { cache: "no-store" });
      supportConfigText = response.ok ? await response.text() : "unavailable";
    } catch {
      supportConfigText = "unavailable";
    }
  }
  renderReleaseBlockers();
}

function renderReleaseBlockers() {
  if (!elements.releaseBlockerList || !elements.releaseBlockerSummary) return;
  const blockers = getReleaseBlockers();
  elements.releaseBlockerList.replaceChildren();
  elements.releaseBlockerPanel?.classList.toggle("is-clear", blockers.length === 0);
  elements.releaseBlockerPanel?.classList.toggle("is-blocked", blockers.length > 0);
  elements.releaseBlockerSummary.textContent = blockers.length
    ? t("releaseBlockersFound", { count: blockers.length })
    : t("releaseBlockersReady");

  for (const blocker of blockers) {
    const item = document.createElement("li");
    item.textContent = blocker;
    elements.releaseBlockerList.appendChild(item);
  }
  renderPreflightChecks();
}

function getReleaseBlockers() {
  const blockers = [];
  const readiness = getReadiness();
  const preflightChecks = new Map((latestHealth?.preflight?.checks || []).map(check => [check.id, check]));
  if (elements.readinessInputs.some(input => !readiness[input.dataset.readiness])) {
    blockers.push(t("releaseBlockerReadiness"));
  }
  if (!latestHealth?.ok) {
    blockers.push(t("releaseBlockerBackend"));
  }
  if (preflightChecks.get("public-base-url")?.ok === false) {
    blockers.push(t("releaseBlockerPublicBaseUrl"));
  }
  if (preflightChecks.get("app-mode")?.ok === false) {
    blockers.push(t("releaseBlockerAppMode"));
  }
  const accessUrl = getPreferredLocalAccessUrl() || window.location.href;
  if (!/^https:\/\//i.test(accessUrl)) {
    blockers.push(t("releaseBlockerLocalUrl"));
  }
  if (/support@example\.com/i.test(supportConfigText)) {
    blockers.push(t("releaseBlockerSupportEmail"));
  }
  if (/supportWebsite:\s*["']\/support\/["']/i.test(supportConfigText)) {
    blockers.push(t("releaseBlockerSupportWebsite"));
  }
  if (latestHealth?.preflight?.support?.placeholders?.privacyUrl || /privacyUrl:\s*["']\/support\/privacy\.html["']/i.test(supportConfigText)) {
    blockers.push(t("releaseBlockerPrivacyUrl"));
  }
  if (latestHealth?.preflight?.support?.placeholders?.termsUrl || /termsUrl:\s*["']\/support\/terms\.html["']/i.test(supportConfigText)) {
    blockers.push(t("releaseBlockerTermsUrl"));
  }
  if (/publicationDate:\s*["']Draft["']/i.test(supportConfigText)) {
    blockers.push(t("releaseBlockerPrivacyDraft"));
  }
  if (preflightChecks.get("support-pages")?.ok === false) {
    blockers.push(t("releaseBlockerSupportPages"));
  }
  return blockers;
}

function renderPreflightChecks() {
  if (!elements.preflightList) return;
  const checks = latestHealth?.preflight?.checks;
  elements.preflightList.replaceChildren();
  elements.preflightPanel?.classList.toggle("is-empty", !Array.isArray(checks) || checks.length === 0);

  if (!Array.isArray(checks) || !checks.length) {
    const empty = document.createElement("p");
    empty.className = "preflight-empty";
    empty.textContent = t("preflightUnknown");
    elements.preflightList.appendChild(empty);
    return;
  }

  for (const check of checks) {
    const row = document.createElement("div");
    const status = check.ok ? "passed" : check.severity === "warning" ? "warning" : "critical";
    row.className = "preflight-row";
    row.dataset.status = status;
    row.innerHTML = `
      <span>${escapeHtml(preflightCheckLabel(check.id, check.message))}</span>
      <strong>${escapeHtml(t(status === "passed" ? "preflightPassed" : status === "warning" ? "preflightWarning" : "preflightCritical"))}</strong>
      <small>${escapeHtml(check.message || "")}</small>
    `;
    elements.preflightList.appendChild(row);
  }
}

function preflightCheckLabel(id, fallback = "") {
  const keys = {
    "app-mode": "preflightCheckAppMode",
    "gemini-key": "preflightCheckGeminiKey",
    "public-base-url": "preflightCheckPublicBaseUrl",
    "request-https": "preflightCheckRequestHttps",
    "support-email": "preflightCheckSupportEmail",
    "support-website": "preflightCheckSupportWebsite",
    "privacy-url": "preflightCheckPrivacyUrl",
    "terms-url": "preflightCheckTermsUrl",
    "privacy-publication-date": "preflightCheckPrivacyPublicationDate",
    "support-pages": "preflightCheckSupportPages",
    "beta-access": "preflightCheckBetaAccess",
    limits: "preflightCheckLimits"
  };
  return keys[id] ? t(keys[id]) : fallback || id || t("unknown");
}

function buildDiagnosticsText() {
  const phoneUrl = getPreferredLocalAccessUrl();
  const lines = [
    "TechSpec Scanner diagnostics",
    `Version: ${appBuildVersion}`,
    `Language: ${getLanguage()}`,
    `Theme: ${getTheme()}`,
    `Install mode: ${isStandaloneMode() ? "standalone" : "browser"}`,
    `Service worker: ${getServiceWorkerStatus()}`,
    `Network: ${navigator.onLine ? "online" : "offline"}`,
    `iPhone URL: ${phoneUrl || "unknown"}`,
    `URL: ${window.location.href}`,
    `Install ID: ${getInstallId()}`,
    `Backend: ${elements.backendStatus?.textContent || ""}`,
    `Usage: ${elements.usageStatus?.textContent || ""}`,
    `User agent: ${navigator.userAgent}`
  ];
  return lines.join("\n");
}

function downloadSupportBundle() {
  const payload = {
    app: "TechSpec Scanner",
    type: "support-bundle",
    exportedAt: new Date().toISOString(),
    appBuildVersion,
    diagnostics: {
      language: getLanguage(),
      theme: getTheme(),
      installMode: isStandaloneMode() ? "standalone" : "browser",
      serviceWorker: getServiceWorkerStatus(),
      online: navigator.onLine,
      currentUrl: window.location.href,
      preferredLocalAccessUrl: getPreferredLocalAccessUrl() || null,
      installId: getInstallId(),
      userAgent: navigator.userAgent
    },
    backend: latestHealth ? {
      ok: Boolean(latestHealth.ok),
      geminiConfigured: Boolean(latestHealth.geminiConfigured),
      model: latestHealth.model,
      strongModel: latestHealth.strongModel,
      serverVersion: latestHealth.serverVersion,
      startedAt: latestHealth.startedAt,
      localAccessUrls: latestHealth.localAccessUrls || [],
      usage: latestHealth.usage || null,
      preflight: latestHealth.preflight || null,
      rateLimit: latestHealth.rateLimit || null,
      requestLimitBytes: latestHealth.requestLimitBytes || null
    } : null,
    localCounts: {
      projects: getProjects().length,
      scans: getHistory().length,
      knownParts: getDatabase().length,
      testEntries: getTestLog().length
    },
    readiness: getReadiness(),
    releaseBlockers: getReleaseBlockers()
  };
  downloadJson(payload, `techspec-support-bundle-${dateStamp()}.json`);
  showToast(t("supportBundleDownloaded"));
}

async function copyPublishingText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    showError(t("copyBlocked"));
  }
}

async function copyTextFallback(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    showError(t("copyBlocked"));
  }
}

function buildReviewNotesText() {
  const usageText = elements.usageStatus?.textContent || t("usageNotChecked");
  return [
    "TechSpec Scanner - App Review Notes",
    "",
    "Purpose:",
    "TechSpec Scanner is an AI-assisted tool for identifying mechanical and industrial components from user-submitted photos.",
    "",
    "AI behavior:",
    "- The app sends selected component photos and scan context to a backend, which calls Google Gemini.",
    "- Results are suggestions and are shown with confidence, visible evidence, missing evidence, recommended checks, and uncertainty warnings.",
    "- The app repeatedly states that AI results must be verified with measurements, markings, manufacturer documentation, and engineering judgment.",
    "",
    "Safety scope:",
    "- The app is not intended as the sole basis for safety-critical, purchasing, repair, or design decisions.",
    "- The first-run acknowledgement requires the user to accept this before scanning.",
    "",
    "Data and API key handling:",
    "- The Gemini API key is stored only on the backend, not in frontend code.",
    "- Local scan history, known parts, projects, preferences, and test logs are stored in browser local storage unless exported or deleted by the user.",
    "- Usage limits and request size limits are enforced by the backend.",
    "",
    `Current app build: ${appBuildVersion}`,
    `Current backend status: ${elements.backendStatus?.textContent || t("backendOffline")}`,
    `Usage status: ${usageText}`,
    `Local test URL: ${getPreferredLocalAccessUrl() || window.location.origin}`,
    "",
    "Reviewer path:",
    "1. Open the app.",
    "2. Review and accept the AI/privacy acknowledgement.",
    "3. Add or take a component photo on the Scan page.",
    "4. Run Analyze component.",
    "5. Review result evidence, uncertainty, recommended checks, export/report features, and local data controls in Settings."
  ].join("\n");
}

function buildPrivacySummaryText() {
  return [
    "TechSpec Scanner - Privacy Summary",
    "",
    "Data processed:",
    "- Component photos selected by the user for analysis.",
    "- Optional context notes, measurements, projects, corrections, verification labels, and evaluation notes entered by the user.",
    "- Anonymous install ID and usage counters for rate limiting, cost control, diagnostics, and abuse prevention.",
    "- Local app settings, scan history, known parts, test logs, language, theme, and readiness checklist data stored in this browser.",
    "- Screenshot mode preference, when enabled, hides local testing details in the interface for App Store screenshots.",
    "",
    "AI processing:",
    "- When analysis is used, submitted images and scan context are sent to the backend and then to Google Gemini for processing.",
    "- The Gemini API key is kept on the backend and is not embedded in the frontend.",
    "",
    "Storage:",
    "- Scan history, known parts, projects, and preferences are stored locally in the browser unless exported or deleted.",
    "- Full local backup export/import and local deletion controls are available in Settings.",
    "",
    "Potential App Store privacy label areas to verify before submission:",
    "- User Content: photos and text entered for scan analysis.",
    "- Identifiers: anonymous install ID if retained in production.",
    "- Usage Data: scan counts, request limits, and diagnostic usage counters.",
    "- Diagnostics: app/server version and error context if support diagnostics are collected.",
    "",
    "Not currently included unless added later:",
    "- Accounts, cloud sync, advertising tracking, contacts, location, payment data, or third-party analytics SDKs."
  ].join("\n");
}

function buildStoreListingText() {
  return [
    "TechSpec Scanner - App Store Listing Draft",
    "",
    "Name:",
    "TechSpec Scanner",
    "",
    "Subtitle:",
    "AI component identification",
    "",
    "Promotional text:",
    "Scan mechanical components, review AI-assisted evidence, add technician notes, and export structured reports.",
    "",
    "Short description:",
    "TechSpec Scanner helps technicians and makers identify mechanical and industrial components from photos. Capture guided views, add measurements or context, review visible evidence and uncertainty, save known parts locally, and export reports for documentation.",
    "",
    "Key features:",
    "- Guided scan slots for overview, markings, side view, and scale reference.",
    "- AI-assisted component identification through a backend-protected Gemini API key.",
    "- Confidence, visible features, missing evidence, alternatives, and recommended verification checks.",
    "- Technician notes, manual corrections, local known-parts library, and scan evaluation log.",
    "- PDF, JSON, CSV, and local backup exports.",
    "- English/German interface with French/Spanish AI-language scaffolding, light/dark/workshop appearance, and local-first records.",
    "",
    "Important disclaimer:",
    "AI results can be incomplete or incorrect. Verify results with measurements, markings, manufacturer documentation, and engineering judgment before using them for safety-critical, purchasing, repair, or design decisions.",
    "",
    "Suggested keywords:",
    "mechanical,scanner,parts,components,maintenance,engineering,workshop,bearing,fastener,inspection,documentation,AI",
    "",
    "Support URL:",
    latestHealth?.preflight?.publicBaseUrl ? `${latestHealth.preflight.publicBaseUrl}/support/` : "Replace with final HTTPS support URL.",
    "",
    "Privacy URL:",
    latestHealth?.preflight?.publicBaseUrl ? `${latestHealth.preflight.publicBaseUrl}/support/privacy.html` : "Replace with final HTTPS privacy policy URL."
  ].join("\n");
}

function buildProductionEnvTemplate() {
  const publicBaseUrl = latestHealth?.preflight?.publicBaseUrl || "https://your-production-domain.example";
  return [
    "# TechSpec Scanner production backend environment",
    "# Do not paste real secrets into frontend files or public repositories.",
    "",
    "PORT=3000",
    "APP_MODE=production",
    `PUBLIC_BASE_URL=${publicBaseUrl}`,
    "GEMINI_API_KEY=replace_with_production_secret_in_host_dashboard",
    "BETA_ACCESS_CODE=private_beta_code_if_beta_is_enabled",
    "FEEDBACK_ADMIN_CODE=private_owner_only_feedback_code",
    "GEMINI_FAST_MODEL=gemini-2.5-flash-lite",
    "GEMINI_STRONG_MODEL=gemini-2.5-flash",
    "DAILY_SCAN_LIMIT=500",
    "MONTHLY_SCAN_LIMIT=10000",
    "DAILY_WARNING_LIMIT=400",
    "MONTHLY_WARNING_LIMIT=8000",
    "INSTALL_DAILY_SCAN_LIMIT=25",
    "INSTALL_MONTHLY_SCAN_LIMIT=250",
    "INSTALL_DAILY_WARNING_LIMIT=20",
    "INSTALL_MONTHLY_WARNING_LIMIT=200",
    "RATE_LIMIT_WINDOW_MS=60000",
    "RATE_LIMIT_MAX_REQUESTS=12",
    "MAX_ANALYZE_BODY_BYTES=14680064",
    "MAX_IMAGE_BASE64_CHARS=6500000"
  ].join("\n");
}

function buildSupportConfigTemplate() {
  const publicBaseUrl = latestHealth?.preflight?.publicBaseUrl || "https://your-production-domain.example";
  const today = new Date().toISOString().slice(0, 10);
  return [
    "window.TechSpecSupport = {",
    '  appName: "TechSpec Scanner",',
    '  publisherName: "TechSpec Scanner",',
    '  supportEmail: "support@your-production-domain.example",',
    `  supportWebsite: "${publicBaseUrl}/support/",`,
    `  betaGuideUrl: "${publicBaseUrl}/support/beta.html",`,
    `  privacyUrl: "${publicBaseUrl}/support/privacy.html",`,
    `  termsUrl: "${publicBaseUrl}/support/terms.html",`,
    `  legalUrl: "${publicBaseUrl}/support/legal.html",`,
    `  feedbackUrl: "${publicBaseUrl}/support/feedback.html",`,
    `  publicationDate: "${today}"`,
    "};"
  ].join("\n");
}

function buildReleaseChecklistText() {
  const readiness = getReadiness();
  const readinessLines = elements.readinessInputs.map(input => {
    const label = input.nextElementSibling?.textContent || input.dataset.readiness;
    return `- [${readiness[input.dataset.readiness] ? "x" : " "}] ${label}`;
  });
  const blockers = getReleaseBlockers();
  const blockerLines = blockers.length
    ? blockers.map(blocker => `- [ ] ${blocker}`)
    : ["- [x] No obvious release blockers detected in the local checklist."];
  return [
    "# TechSpec Scanner Release Checklist",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `App build: ${appBuildVersion}`,
    `Backend: ${elements.backendStatus?.textContent || t("backendOffline")}`,
    `Testing URL: ${getPreferredLocalAccessUrl() || window.location.origin}`,
    `Release blockers: ${blockers.length}`,
    "",
    "## Current Release Blockers",
    ...blockerLines,
    "",
    "## Readiness",
    ...readinessLines,
    "",
    "## Required Before Public Submission",
    "- [ ] Replace support@example.com with the final support email.",
    "- [ ] Publish the support page and privacy policy over HTTPS.",
    "- [ ] Publish the Terms of Use page over HTTPS.",
    "- [ ] Replace support-config.js with final public support/privacy/terms URLs.",
    "- [ ] Confirm final publisher/business name.",
    "- [ ] Confirm App Store privacy labels match actual production behavior.",
    "- [ ] Confirm Google Cloud billing alerts and Gemini quotas are active.",
    "- [ ] Confirm API key restrictions and key rotation process.",
    "- [ ] Confirm Terms of Use if paid plans, accounts, or subscriptions are added.",
    "- [ ] Capture final App Store screenshots from the production build.",
    "- [ ] Test scanning, report export, backup export/import, local deletion, language switch, and light/dark/workshop appearance on iPhone.",
    "- [ ] Verify all AI disclaimers and acknowledgement flow on a fresh install.",
    "",
    "## Production Backend",
    "- [ ] Deploy backend to a production host.",
    "- [ ] Use HTTPS only.",
    "- [ ] Store Gemini API key as a server-side secret.",
    "- [ ] Enable request body limits, rate limits, daily/monthly limits, and monitoring.",
    "- [ ] Test Gemini auth, quota, network, server, and invalid image error paths.",
    "",
    "## App Store Review Notes",
    buildReviewNotesText()
  ].join("\n");
}

function exportAllLocalData() {
  const payload = {
    app: "TechSpec Scanner",
    type: "local-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      history: getHistory(),
      knownParts: getDatabase(),
      projects: getProjects(),
      selectedProjectId: localStorage.getItem(selectedProjectKey) || "general",
      testLog: getTestLog(),
      readiness: getReadiness(),
      language: getLanguage(),
      theme: getTheme(),
      screenshotMode: getScreenshotMode(),
      installId: getInstallId(),
      safetyAcknowledgement: getSafetyAcknowledgement()
    }
  };
  downloadJson(payload, `techspec-scanner-backup-${dateStamp()}.json`);
  showToast(t("backupExported"));
}

function importAllLocalData(payload) {
  if (!payload || payload.type !== "local-backup" || !payload.data || typeof payload.data !== "object") {
    throw new Error("Invalid backup.");
  }

  const data = payload.data;
  localStorage.setItem(historyKey, JSON.stringify(Array.isArray(data.history) ? data.history.slice(0, maxHistoryItems) : []));
  localStorage.setItem(databaseKey, JSON.stringify(Array.isArray(data.knownParts) ? data.knownParts.slice(0, 120) : []));
  const projects = normalizeImportedProjects(data.projects);
  localStorage.setItem(projectKey, JSON.stringify(projects));
  const selectedProject = projects.some(project => project.id === data.selectedProjectId) ? data.selectedProjectId : projects[0].id;
  localStorage.setItem(selectedProjectKey, selectedProject);
  localStorage.setItem(testLogKey, JSON.stringify(Array.isArray(data.testLog) ? data.testLog.slice(0, maxTestLogItems) : []));
  localStorage.setItem(readinessKey, JSON.stringify(data.readiness && typeof data.readiness === "object" ? data.readiness : {}));

  if (translations[data.language]) {
    localStorage.setItem(languageKey, data.language);
  }
  if (["dark", "light", "workshop"].includes(data.theme)) {
    localStorage.setItem(themeKey, data.theme);
  }
  localStorage.setItem(screenshotModeKey, data.screenshotMode ? "1" : "0");
  if (typeof data.installId === "string" && data.installId.startsWith("ts-")) {
    localStorage.setItem(installIdKey, data.installId.slice(0, 80));
  }
  if (data.safetyAcknowledgement?.acceptedAt) {
    localStorage.setItem(safetyAckKey, JSON.stringify(data.safetyAcknowledgement));
  } else {
    localStorage.removeItem(safetyAckKey);
  }

  elements.languageSelect.value = getLanguage();
  elements.themeSelect.value = getTheme();
  elements.screenshotModeToggle.checked = getScreenshotMode();
  applyTheme();
  applyScreenshotMode();
  applyLanguage();
  refreshLocalDataViews();
}

function normalizeImportedProjects(value) {
  const incoming = Array.isArray(value) ? value : [];
  const cleaned = incoming
    .filter(project => project && typeof project === "object" && typeof project.id === "string" && typeof project.name === "string")
    .map(project => ({
      id: project.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || createProjectId(project.name),
      name: project.name.trim().slice(0, 80) || "Project",
      createdAt: project.createdAt || new Date().toISOString()
    }));

  if (!cleaned.some(project => project.id === "general")) {
    cleaned.unshift({ id: "general", name: "General", createdAt: new Date().toISOString() });
  }

  const seen = new Set();
  return cleaned.filter(project => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  }).slice(0, 80);
}

function clearAllLocalData() {
  for (const key of [
    historyKey,
    databaseKey,
    projectKey,
    selectedProjectKey,
    testLogKey,
    readinessKey,
    languageKey,
    themeKey,
    screenshotModeKey,
    installIdKey,
    safetyAckKey
  ]) {
    localStorage.removeItem(key);
  }
  ensureDefaultProject();
  elements.languageSelect.value = getLanguage();
  elements.themeSelect.value = getTheme();
  elements.screenshotModeToggle.checked = getScreenshotMode();
  applyTheme();
  applyScreenshotMode();
  applyLanguage();
  renderInstallId();
}

function resetProjects() {
  localStorage.removeItem(projectKey);
  localStorage.removeItem(selectedProjectKey);
  ensureDefaultProject();
}

function refreshLocalDataViews() {
  renderProjects();
  renderHistory();
  renderDatabase();
  renderReports();
  renderTestLog();
  renderReadiness();
  renderStorageStatus();
  renderSafetyAckStatus();
  renderInstallId();
  renderAppDiagnostics();
  updateReleaseBlockers();
  renderMatches();
}

function applyTheme() {
  const theme = getTheme();
  document.documentElement.dataset.theme = theme;
  const themeColors = {
    light: "#eaf4ff",
    dark: "#071d38",
    workshop: "#101820"
  };
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", themeColors[theme] || themeColors.light);
}

function t(key, replacements = {}) {
  const dictionary = translations[getLanguage()] || translations.en;
  let value = dictionary[key] || translations.en[key] || key;
  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function applyLanguage() {
  document.documentElement.lang = getLanguage();
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  }
  for (const element of document.querySelectorAll("[data-i18n-label]")) {
    const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = t(element.dataset.i18nLabel);
    }
  }
  updateMeasurementPreset();
  updateScanQuality();
  updateDemoScanButton();
  paintResult();
  renderProjects();
  renderHistory();
  renderDatabase();
  renderReports();
  renderTestLog();
  renderStorageStatus();
  renderSafetyAckStatus();
  renderAppDiagnostics();
  renderUsage(latestHealth?.usage);
  updateReleaseBlockers();
}

function getScanMode() {
  return elements.scanMode.value || "auto";
}

function getPhotoChecklist() {
  return elements.checklistInputs
    .filter(input => input.checked)
    .map(input => input.value);
}

async function readApiPayload(response) {
  try {
    return await response.json();
  } catch {
    return {
      code: "INVALID_SERVER_RESPONSE",
      error: response.ok ? "" : "Server returned a non-JSON response."
    };
  }
}

function apiErrorMessage(payload = {}, status = 0) {
  const code = payload.code || "";
  const codeMap = {
    RATE_LIMITED: "errorRateLimited",
    SERVER_DAILY_LIMIT: "errorUsageLimit",
    SERVER_MONTHLY_LIMIT: "errorUsageLimit",
    DEVICE_DAILY_LIMIT: "errorUsageLimit",
    DEVICE_MONTHLY_LIMIT: "errorUsageLimit",
    USAGE_LIMIT_REACHED: "errorUsageLimit",
    REQUEST_TOO_LARGE: "errorRequestTooLarge",
    IMAGE_TOO_LARGE: "errorImageTooLarge",
    UNSUPPORTED_IMAGE_TYPE: "errorUnsupportedImage",
    MISSING_IMAGE: "errorMissingImage",
    INVALID_JSON: "errorInvalidRequest",
    GEMINI_AUTH: "errorGeminiAuth",
    GEMINI_QUOTA_OR_RATE_LIMIT: "errorGeminiQuota",
    GEMINI_NETWORK: "errorGeminiNetwork",
    GEMINI_SERVER_ERROR: "errorGeminiServer",
    GEMINI_TIMEOUT: "errorGeminiServer",
    GEMINI_EMPTY_RESPONSE: "errorGeminiResponse",
    GEMINI_INVALID_JSON: "errorGeminiResponse",
    GEMINI_BAD_REQUEST: "errorInvalidRequest"
  };
  if (codeMap[code]) return t(codeMap[code]);
  if (status === 413) return t("errorRequestTooLarge");
  if (status === 429) return t("errorRateLimited");
  if (status >= 500) return t("errorGeminiServer");
  return payload.error || payload.details || t("analysisFailed");
}

function getMeasurements() {
  const values = {};
  for (const input of elements.measurementInputs) {
    const value = input.value.trim();
    if (value) values[input.dataset.measure] = value;
  }
  return values;
}

function updateMeasurementPreset() {
  const mode = getScanMode();
  const suggested = new Set(measurementPresetMap[mode] || measurementPresetMap.auto);
  const hintsByLanguage = {
    en: measurementPresetText,
    de: measurementPresetTextDe,
    fr: measurementPresetTextFr,
    es: measurementPresetTextEs
  };
  const hints = hintsByLanguage[getLanguage()] || measurementPresetText;
  const labels = measurementLabelText[getLanguage()] || measurementLabelText.en;

  for (const label of elements.measurementLabels) {
    label.classList.toggle("is-suggested", suggested.has(label.dataset.measureLabel));
    const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode && labels[label.dataset.measureLabel]) {
      textNode.textContent = labels[label.dataset.measureLabel];
    }
  }

  if (elements.measurementHint) {
    elements.measurementHint.textContent = hints[mode] || hints.auto;
  }
}

function updateScanQuality() {
  if (!elements.scanQualityList) return;

  const slots = new Set(preparedImages.map(image => image.slot));
  const measurements = getMeasurements();
  const checklist = new Set(getPhotoChecklist());
  const hasLowResolutionImage = preparedImages.some(image => Math.max(image.width || 0, image.height || 0) < minimumUsefulImageSide);
  const checks = [
    {
      label: t("slotOverview"),
      ok: slots.has("overview") || checklist.has("overview photo")
    },
    {
      label: t("slotMarkings"),
      ok: slots.has("markings") || checklist.has("markings close-up") || elements.notes.value.trim().length > 8
    },
    {
      label: t("slotScale"),
      ok: slots.has("scale") || checklist.has("scale or ruler reference") || Object.keys(measurements).length > 0
    },
    {
      label: t("slotSide"),
      ok: slots.has("side") || checklist.has("side view") || preparedImages.length > 1
    },
    {
      label: t("qualitySharpness"),
      ok: preparedImages.length > 0 && !hasLowResolutionImage
    }
  ];
  const completed = checks.filter(check => check.ok).length;

  elements.scanQualityList.replaceChildren();
  for (const check of checks) {
    const item = document.createElement("span");
    item.className = check.ok ? "is-done" : "";
    item.textContent = check.label;
    elements.scanQualityList.appendChild(item);
  }

  if (!preparedImages.length) {
    elements.scanQualityLabel.textContent = t("qualityNeedsPhoto");
    elements.scanQualityText.textContent = t("qualityNeedsPhotoText");
  } else if (hasLowResolutionImage) {
    elements.scanQualityLabel.textContent = t("qualityNeedsSharper");
    elements.scanQualityText.textContent = t("qualityNeedsSharperText", { size: minimumUsefulImageSide });
  } else if (completed <= 2) {
    elements.scanQualityLabel.textContent = t("qualityReady");
    elements.scanQualityText.textContent = t("qualityReadyText");
  } else if (completed <= 4) {
    elements.scanQualityLabel.textContent = t("qualityStrong");
    elements.scanQualityText.textContent = t("qualityStrongText");
  } else {
    elements.scanQualityLabel.textContent = t("qualityExcellent");
    elements.scanQualityText.textContent = t("qualityExcellentText");
  }
}

function getSelectedProjectName() {
  const project = getProjects().find(item => item.id === elements.projectSelect.value);
  return project?.name || "General";
}

function checkPhotoType(slot) {
  const value = slotChecklistMap[slot];
  const checkbox = elements.checklistInputs.find(input => input.value === value);
  if (checkbox) checkbox.checked = true;
}

function markSlotComplete(slot) {
  const card = elements.slotCards.find(item => item.dataset.slotCard === slot);
  if (card) card.classList.add("is-complete");
}

function resetPhotoInputs() {
  for (const input of elements.slotInputs) {
    input.value = "";
  }
  for (const card of elements.slotCards) {
    card.classList.remove("is-complete");
  }
  for (const checkbox of elements.checklistInputs) {
    checkbox.checked = false;
  }
}

async function addImageFile(file, slot, label) {
  if (!file.type.startsWith("image/")) {
    throw new Error(t("chooseImage"));
  }

  if (screenshotDemoActive) {
    screenshotDemoActive = false;
    updateDemoScanButton();
  }

  const prepared = await prepareImage(file, slot, label);
  preparedImages = preparedImages.filter(image => image.slot !== slot);
  preparedImages.push(prepared);
  preparedImages.sort((a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot));
  markSlotComplete(slot);
  checkPhotoType(slot);
  renderPreviews(preparedImages);
  elements.analyzeBtn.disabled = preparedImages.length === 0;
  updateScanQuality();
}

async function handlePaste(event) {
  const items = Array.from(event.clipboardData?.items || []);
  const files = Array.from(event.clipboardData?.files || []);
  const imageItem = items.find(item => item.type.startsWith("image/"));
  const clipboardFile = files.find(file => file.type.startsWith("image/"));
  if (!imageItem && !clipboardFile) return;

  event.preventDefault();
  event.stopPropagation();
  clearError();

  const file = clipboardFile || imageItem.getAsFile();
  if (!file) {
    showError(t("noImagePaste"));
    return;
  }

  const slot = choosePasteSlot();
  try {
    await addImageFile(file, slot, getSlotLabel(slot));
    showToast(t("pastedImage", { slot: getSlotLabel(slot) }));
  } catch (error) {
    showError(error.message || t("pasteFailed"));
  }
}

function choosePasteSlot() {
  if (activePasteSlot && slotOrder.includes(activePasteSlot)) return activePasteSlot;
  const used = new Set(preparedImages.map(image => image.slot));
  return slotOrder.find(slot => !used.has(slot)) || "overview";
}

function getSlotLabel(slot) {
  const labels = {
    overview: t("slotOverview"),
    markings: t("slotMarkings"),
    side: t("slotSide"),
    scale: t("slotScale")
  };
  return labels[slot] || slot;
}

async function prepareImage(file, slot, slotLabel) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxSide = slot === "markings" ? 1600 : 1400;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);

  const outputMimeType = "image/jpeg";
  const targetChars = slot === "markings" ? 1_900_000 : 1_550_000;
  let quality = slot === "markings" ? 0.88 : 0.84;
  let compressed = canvas.toDataURL(outputMimeType, quality);
  while (compressed.length > targetChars && quality > 0.64) {
    quality = Math.max(0.64, quality - 0.06);
    compressed = canvas.toDataURL(outputMimeType, quality);
  }

  return {
    slot,
    slotLabel,
    fileName: file.name || `${slotLabel} photo`,
    mimeType: outputMimeType,
    imageBase64: compressed.split(",")[1],
    previewUrl: compressed,
    width,
    height,
    originalBytes: file.size || 0,
    compressedBytes: dataUrlByteLength(compressed),
    quality: Number(quality.toFixed(2))
  };
}

function renderPreviews(images) {
  elements.previewGrid.replaceChildren();
  if (!images.length) {
    elements.previewWrap.classList.add("is-hidden");
    return;
  }

  for (const image of images) {
    const item = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");
    const title = document.createElement("strong");
    const details = document.createElement("small");
    img.src = image.previewUrl;
    img.alt = `${image.slotLabel} component photo`;
    title.textContent = image.slotLabel;
    details.textContent = t("imageOptimized", {
      width: image.width || "?",
      height: image.height || "?",
      size: formatBytes(image.compressedBytes || 0)
    });
    caption.append(title, details);
    item.append(img, caption);
    elements.previewGrid.appendChild(item);
  }

  elements.previewWrap.classList.remove("is-hidden");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(t("imageReadFailed")));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(t("imageLoadFailed")));
    image.src = src;
  });
}

function dataUrlByteLength(value) {
  const base64 = String(value || "").split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function loadScreenshotDemo() {
  clearError();
  if (screenshotDemoActive) {
    clearScreenshotDemo();
    return;
  }

  resetPhotoInputs();
  const previewUrl = createDemoComponentImage();
  preparedImages = [{
    slot: "overview",
    slotLabel: getSlotLabel("overview"),
    mimeType: "image/png",
    imageBase64: previewUrl.split(",")[1],
    previewUrl,
    width: 1200,
    height: 820,
    originalBytes: dataUrlByteLength(previewUrl),
    compressedBytes: dataUrlByteLength(previewUrl),
    quality: 1
  }];
  markSlotComplete("overview");
  checkPhotoType("overview");
  elements.notes.value = getLanguage() === "de"
    ? "Demo fuer App-Store-Screenshots: Lagergehaeuse einer Foerderanlage, Markierungen und Masse muessen in der Praxis geprueft werden."
    : "Demo for App Store screenshots: conveyor bearing housing, markings and dimensions must be verified in real use.";
  elements.scanMode.value = "bearing";
  updateMeasurementPreset();
  renderPreviews(preparedImages);
  elements.analyzeBtn.disabled = false;
  updateScanQuality();
  renderResult(buildScreenshotDemoResult(), "demo", [previewUrl], {
    scanId: "TS-DEMO-SCREENSHOT",
    projectId: "general",
    projectName: "Demo",
    verificationStatus: "needs-measurement",
    technicianNotes: getLanguage() === "de"
      ? "Demo-Datensatz fuer Screenshots. Nicht als reale Identifikation verwenden."
      : "Demo record for screenshots. Do not use as a real identification."
  });
  screenshotDemoActive = true;
  updateDemoScanButton();
  showToast(t("demoScanLoaded"));
}

function clearScreenshotDemo() {
  clearError();
  preparedImages = [];
  latestResult = null;
  editingKnownPartId = null;
  screenshotDemoActive = false;
  elements.notes.value = "";
  elements.scanMode.value = "auto";
  resetPhotoInputs();
  fillVerificationChecklist({});
  fillCorrectionFields({});
  fillEvaluation(null);
  fillMeasurements({});
  elements.verificationStatus.value = "unverified";
  elements.resultNotes.value = "";
  updateMeasurementPreset();
  renderPreviews(preparedImages);
  elements.analyzeBtn.disabled = true;
  elements.loadingState.classList.add("is-hidden");
  elements.resultCard.classList.add("is-hidden");
  elements.emptyState.classList.remove("is-hidden");
  elements.matchesPanel.classList.add("is-hidden");
  setEditMode(false);
  updateScanQuality();
  updateDemoScanButton();
  showToast(t("demoScanCleared"));
}

function updateDemoScanButton() {
  if (!elements.demoScanBtn) return;
  const key = screenshotDemoActive ? "clearDemoScan" : "loadDemoScan";
  elements.demoScanBtn.dataset.i18n = key;
  elements.demoScanBtn.textContent = t(key);
}

function buildScreenshotDemoResult() {
  if (getLanguage() === "de") {
    return {
      componentName: "Stehlagergehaeuse mit Einsatzlager",
      detectedCategory: "Lagerbaugruppe",
      componentFamily: "Gehaeuselager",
      category: "Bearing assembly",
      evidenceSummary: "Die Bauform zeigt ein geteiltes Gehaeuse mit zentraler Wellenbohrung, Befestigungsflaechen und sichtbarem Einsatzlager. Exakte Teilenummer und Groesse sind ohne lesbare Markierung und Messwerte nicht sicher bestimmbar.",
      likelyFunction: "Fuehrt und stuetzt eine rotierende Welle in einer Foerder- oder Maschinenbaugruppe.",
      visibleFeatures: ["Gehaeuseform mit Montageflaechen", "Zentrale Lagerbohrung", "Angedeutete Schraubpunkte", "Technische Demo-Grafik statt reales Foto"],
      possibleMaterial: "Wahrscheinlich Grauguss oder Stahlguss fuer das Gehaeuse, Lagerstahl fuer das Einsatzlager.",
      possibleStandardOrPartNumber: "Nicht aus der Demo-Grafik bestimmbar.",
      markingsText: "Keine lesbaren Markierungen sichtbar.",
      measurementClues: ["Aussendurchmesser, Bohrung und Gehaeusebreite messen", "Lochabstand der Befestigung pruefen", "Wellen- und Lagerkennzeichnung ablesen"],
      likelyStandards: ["UC/UCP-Gehaeuselagerfamilie moeglich, aber nicht bestaetigt"],
      identificationAlternatives: ["Flanschlager oder Sonderlagergehaeuse, falls Montageflaechen anders ausgefuehrt sind"],
      recommendedChecks: ["Nahaufnahme der Markierung aufnehmen", "Bohrung und Lochabstand messen", "Herstellerdokumentation vergleichen"],
      missingEvidence: ["Reales Foto", "Lesbare Markierung", "Masse", "Herstellerangabe"],
      confidence: 0.72,
      uncertaintyWarnings: ["Demo-Datensatz fuer Screenshots", "Keine exakte Teilenummer ohne reale Markierungen"],
      recommendedNextPhoto: "Scharfe Nahaufnahme der seitlichen Markierung und ein Foto mit Lineal aufnehmen."
    };
  }

  return {
    componentName: "Pillow block bearing housing",
    detectedCategory: "Bearing assembly",
    componentFamily: "Mounted bearing",
    category: "Bearing assembly",
    evidenceSummary: "The shape suggests a mounted bearing housing with a central shaft bore, base mounting surfaces, and an insert bearing. Exact part number and size cannot be confirmed without readable markings and measurements.",
    likelyFunction: "Supports and locates a rotating shaft in a conveyor or machine assembly.",
    visibleFeatures: ["Housing form with mounting base", "Central bearing bore", "Suggested bolt mounting points", "Technical demo graphic rather than a real photo"],
    possibleMaterial: "Likely cast iron or cast steel housing with bearing steel insert.",
    possibleStandardOrPartNumber: "Not discernible from the demo graphic.",
    markingsText: "No readable markings visible.",
    measurementClues: ["Measure bore, housing width, and mounting-hole spacing", "Check shaft diameter", "Read bearing and housing markings"],
    likelyStandards: ["UC/UCP mounted bearing family possible, not confirmed"],
    identificationAlternatives: ["Flange bearing or custom bearing housing if mounting surfaces differ"],
    recommendedChecks: ["Take a close-up of markings", "Measure bore and mounting-hole spacing", "Compare with manufacturer documentation"],
    missingEvidence: ["Real photo", "Readable marking", "Dimensions", "Manufacturer information"],
    confidence: 0.72,
    uncertaintyWarnings: ["Demo record for screenshots", "No exact part number without real markings"],
    recommendedNextPhoto: "Take a sharp close-up of side markings and one photo with a ruler."
  };
}

function createDemoComponentImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 820;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 1200, 820);
  gradient.addColorStop(0, "#eef7ff");
  gradient.addColorStop(1, "#dbeafe");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#102033";
  ctx.font = "700 42px Arial";
  ctx.fillText("TechSpec Scanner Demo", 58, 82);
  ctx.fillStyle = "#5a6b7d";
  ctx.font = "24px Arial";
  ctx.fillText("Mounted bearing housing - screenshot sample", 58, 120);

  ctx.save();
  ctx.translate(600, 430);
  ctx.fillStyle = "#7d8fa4";
  ctx.strokeStyle = "#26384c";
  ctx.lineWidth = 14;
  roundRect(ctx, -360, 80, 720, 135, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#9aa9b8";
  roundRect(ctx, -245, -165, 490, 325, 80);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 128, 0, Math.PI * 2);
  ctx.fillStyle = "#d8e2ec";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.fillStyle = "#f8fbff";
  ctx.fill();
  ctx.stroke();

  for (const x of [-250, 250]) {
    ctx.beginPath();
    ctx.arc(x, 148, 38, 0, Math.PI * 2);
    ctx.fillStyle = "#eef7ff";
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "#1d4ed8";
  ctx.font = "700 24px Arial";
  ctx.fillText("Visible clues", 58, 650);
  ctx.fillStyle = "#26384c";
  ctx.font = "22px Arial";
  ["central bore", "mounting base", "bearing housing geometry", "dimensions still required"].forEach((text, index) => {
    ctx.fillText(`- ${text}`, 58, 690 + index * 30);
  });

  return canvas.toDataURL("image/png");
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function renderResult(result, source, previewUrls = [], meta = {}) {
  latestResult = {
    result: normalizeResult(result),
    source,
    previewUrls,
    scanId: meta.scanId || createScanId(),
    projectId: meta.projectId || elements.projectSelect.value,
    projectName: meta.projectName || getSelectedProjectName(),
    measurements: meta.measurements || {},
    verificationChecklist: meta.verificationChecklist || {},
    evaluation: meta.evaluation || null
  };
  editingKnownPartId = meta.knownPartId || null;
  elements.verificationStatus.value = meta.verificationStatus || "unverified";
  elements.resultNotes.value = meta.technicianNotes || "";
  fillVerificationChecklist(latestResult.verificationChecklist);
  fillCorrectionFields(latestResult.result);
  fillEvaluation(latestResult.evaluation);
  fillMeasurements(latestResult.measurements);
  updateScanQuality();
  if (latestResult.projectId && Array.from(elements.projectSelect.options).some(option => option.value === latestResult.projectId)) {
    elements.projectSelect.value = latestResult.projectId;
    localStorage.setItem(selectedProjectKey, latestResult.projectId);
  }

  elements.emptyState.classList.add("is-hidden");
  elements.resultCard.classList.remove("is-hidden");
  elements.resultSource.textContent = source === "gemini" ? "Gemini" : "Demo";
  setEditMode(false);
  paintResult();
  renderMatches();
}

function paintResult() {
  if (!latestResult) return;
  const result = latestResult.result;
  elements.componentName.textContent = result.componentName || t("unknownComponent");
  elements.category.textContent = result.detectedCategory || result.category || t("uncategorized");
  const confidence = Number(result.confidence || 0);
  elements.confidenceValue.textContent = `${Math.round(confidence * 100)}%`;
  elements.confidenceValue.parentElement.classList.toggle("is-low", confidence < 0.55);
  elements.confidenceValue.parentElement.classList.toggle("is-medium", confidence >= 0.55 && confidence < 0.78);
  elements.confidenceValue.parentElement.classList.toggle("is-high", confidence >= 0.78);
  elements.likelyFunction.textContent = result.likelyFunction || t("notEnoughEvidence");
  elements.possibleMaterial.textContent = result.possibleMaterial || t("unknown");
  elements.partNumber.textContent = result.possibleStandardOrPartNumber || t("notVisible");
  elements.markingsText.textContent = result.markingsText || t("noReadableMarkings");
  elements.componentFamily.textContent = result.componentFamily || result.category || t("unknown");
  elements.evidenceSummary.textContent = result.evidenceSummary || t("noEvidenceSummary");
  elements.nextPhoto.textContent = result.recommendedNextPhoto || t("sharperPhoto");
  renderConfidenceExplanation(result);

  renderList(elements.featuresList, result.visibleFeatures);
  renderList(elements.measurementList, result.measurementClues);
  renderList(elements.standardsList, result.likelyStandards);
  renderList(elements.alternativesList, result.identificationAlternatives);
  renderList(elements.checksList, result.recommendedChecks);
  renderList(elements.warningsList, result.uncertaintyWarnings);
  renderList(elements.missingList, result.missingEvidence);
}

function renderConfidenceExplanation(result) {
  if (!elements.confidencePanel || !elements.confidenceLabel || !elements.confidenceText || !elements.confidenceReasons) return;
  const confidence = Number(result.confidence || 0);
  const reasonKeys = [];
  elements.confidenceLabel.textContent = t("confidenceExplanation");
  elements.confidenceText.textContent = confidence >= 0.78
    ? t("confidenceHigh")
    : confidence >= 0.55
      ? t("confidenceMedium")
      : t("confidenceLow");

  reasonKeys.push(latestResult?.source === "gemini" ? "confidenceReasonGemini" : "confidenceReasonDemo");
  if (toArray(result.visibleFeatures).length) reasonKeys.push("confidenceReasonFeatures");
  if (Object.keys(getMeasurementsWithFallback(latestResult?.measurements || {})).length) reasonKeys.push("confidenceReasonMeasurements");
  if (toArray(result.uncertaintyWarnings).length) reasonKeys.push("confidenceReasonWarnings");
  if (toArray(result.missingEvidence).length) reasonKeys.push("confidenceReasonMissingEvidence");

  elements.confidenceReasons.replaceChildren();
  for (const key of [...new Set(reasonKeys)]) {
    const item = document.createElement("li");
    item.textContent = t(key);
    elements.confidenceReasons.appendChild(item);
  }
}

function normalizeResult(result) {
  return {
    componentName: result.componentName || "",
    detectedCategory: result.detectedCategory || result.category || "",
    componentFamily: result.componentFamily || "",
    category: result.category || "",
    evidenceSummary: result.evidenceSummary || "",
    likelyFunction: result.likelyFunction || "",
    possibleMaterial: result.possibleMaterial || "",
    possibleStandardOrPartNumber: result.possibleStandardOrPartNumber || "",
    markingsText: result.markingsText || "",
    recommendedNextPhoto: result.recommendedNextPhoto || "",
    confidence: Number(result.confidence || 0),
    visibleFeatures: toArray(result.visibleFeatures),
    measurementClues: toArray(result.measurementClues),
    likelyStandards: toArray(result.likelyStandards),
    identificationAlternatives: toArray(result.identificationAlternatives),
    recommendedChecks: toArray(result.recommendedChecks),
    uncertaintyWarnings: toArray(result.uncertaintyWarnings),
    missingEvidence: toArray(result.missingEvidence)
  };
}

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function setEditMode(isEditing) {
  editMode = isEditing;
  elements.resultCard.classList.toggle("is-editing", isEditing);
  elements.editResultBtn.classList.toggle("is-hidden", isEditing);
  elements.saveEditsBtn.classList.toggle("is-hidden", !isEditing);

  for (const element of editableTextElements()) {
    element.contentEditable = String(isEditing);
  }
  for (const list of editableLists()) {
    for (const item of Array.from(list.children)) {
      item.contentEditable = String(isEditing);
    }
  }
}

function editableTextElements() {
  return [
    elements.componentName,
    elements.category,
    elements.likelyFunction,
    elements.possibleMaterial,
    elements.partNumber,
    elements.markingsText,
    elements.componentFamily,
    elements.evidenceSummary,
    elements.nextPhoto
  ];
}

function editableLists() {
  return [
    elements.featuresList,
    elements.measurementList,
    elements.standardsList,
    elements.alternativesList,
    elements.checksList,
    elements.warningsList,
    elements.missingList
  ];
}

function syncResultFromUi() {
  if (!latestResult) return;
  latestResult.measurements = getMeasurementsWithFallback(latestResult.measurements);
  latestResult.verificationChecklist = getVerificationChecklist();
  latestResult.projectId = elements.projectSelect.value;
  latestResult.projectName = getSelectedProjectName();
  latestResult.evaluation = getEvaluationFromUi();

  latestResult.result = {
    ...latestResult.result,
    componentName: readText(elements.componentName),
    detectedCategory: readText(elements.category),
    category: readText(elements.category),
    likelyFunction: readText(elements.likelyFunction),
    possibleMaterial: readText(elements.possibleMaterial),
    possibleStandardOrPartNumber: readText(elements.partNumber),
    markingsText: readText(elements.markingsText),
    componentFamily: readText(elements.componentFamily),
    evidenceSummary: readText(elements.evidenceSummary),
    recommendedNextPhoto: readText(elements.nextPhoto),
    visibleFeatures: readList(elements.featuresList),
    measurementClues: readList(elements.measurementList),
    likelyStandards: readList(elements.standardsList),
    identificationAlternatives: readList(elements.alternativesList),
    recommendedChecks: readList(elements.checksList),
    uncertaintyWarnings: readList(elements.warningsList),
    missingEvidence: readList(elements.missingList)
  };
}

function getEvaluationFromUi() {
  return {
    verdict: elements.evaluationVerdict.value,
    correctName: elements.evaluationCorrectName.value.trim(),
    reasons: elements.evaluationReasonInputs
      .filter(input => input.checked)
      .map(input => input.dataset.evalReason),
    notes: elements.evaluationNotes.value.trim()
  };
}

function getMeasurementsWithFallback(fallback = {}) {
  const current = getMeasurements();
  return Object.keys(current).length ? current : fallback;
}

function fillMeasurements(measurements = {}) {
  for (const input of elements.measurementInputs) {
    input.value = measurements[input.dataset.measure] || "";
  }
}

function fillVerificationChecklist(checklist = {}) {
  for (const input of elements.verificationInputs) {
    input.checked = Boolean(checklist[input.dataset.verify]);
  }
}

function getVerificationChecklist() {
  const checklist = {};
  for (const input of elements.verificationInputs) {
    checklist[input.dataset.verify] = input.checked;
  }
  return checklist;
}

function syncVerificationStatus() {
  const checklist = getVerificationChecklist();
  const completed = Object.values(checklist).filter(Boolean).length;
  if (completed === elements.verificationInputs.length && completed > 0) {
    elements.verificationStatus.value = "verified";
  } else if (completed > 0 && elements.verificationStatus.value === "unverified") {
    elements.verificationStatus.value = "needs-measurement";
  }
}

function fillCorrectionFields(result = {}) {
  elements.correctName.value = result.componentName || "";
  elements.correctCategory.value = result.detectedCategory || result.category || "";
  elements.correctPartNumber.value = result.possibleStandardOrPartNumber || "";
  elements.correctMaterial.value = result.possibleMaterial || "";
}

function fillEvaluation(evaluation = {}) {
  elements.evaluationVerdict.value = evaluation?.verdict || "";
  elements.evaluationCorrectName.value = evaluation?.correctName || "";
  for (const input of elements.evaluationReasonInputs) {
    input.checked = Array.isArray(evaluation?.reasons) && evaluation.reasons.includes(input.dataset.evalReason);
  }
  elements.evaluationNotes.value = evaluation?.notes || "";
}

function applyCorrection() {
  const name = elements.correctName.value.trim();
  const category = elements.correctCategory.value.trim();
  const partNumber = elements.correctPartNumber.value.trim();
  const material = elements.correctMaterial.value.trim();

  if (name) {
    latestResult.result.componentName = name;
  }
  if (category) {
    latestResult.result.detectedCategory = category;
    latestResult.result.category = category;
  }
  if (partNumber) {
    latestResult.result.possibleStandardOrPartNumber = partNumber;
  }
  if (material) {
    latestResult.result.possibleMaterial = material;
  }

  const noteParts = [];
  if (name) noteParts.push(`${t("correctName")}: ${name}`);
  if (category) noteParts.push(`${t("correctCategory")}: ${category}`);
  if (partNumber) noteParts.push(`${t("correctPartNumber")}: ${partNumber}`);
  if (material) noteParts.push(`${t("correctMaterial")}: ${material}`);
  if (noteParts.length) {
    const existing = elements.resultNotes.value.trim();
    elements.resultNotes.value = [existing, noteParts.join("; ")].filter(Boolean).join("\n");
  }

  paintResult();
  renderMatches();
  showToast(t("correctionApplied"));
}

function readText(element) {
  return element.textContent.trim();
}

function readList(list) {
  return Array.from(list.children)
    .map(item => item.textContent.trim())
    .filter(Boolean);
}

function renderList(target, items) {
  target.replaceChildren();
  const values = Array.isArray(items) && items.length ? items : [t("noDetails")];

  for (const item of values) {
    const li = document.createElement("li");
    li.textContent = item;
    li.contentEditable = String(editMode);
    target.appendChild(li);
  }
}

function formatResultText(result, source) {
  return [
    `Scan ID: ${latestResult?.scanId || "Not assigned"}`,
    `Source: ${source}`,
    `Project: ${latestResult?.projectName || "General"}`,
    `Verification: ${elements.verificationStatus.value}`,
    `Component: ${result.componentName || "Unknown"}`,
    `Detected category: ${result.detectedCategory || result.category || "Uncategorized"}`,
    `Component family: ${result.componentFamily || "Unknown"}`,
    `Confidence: ${Math.round(Number(result.confidence || 0) * 100)}%`,
    "",
    `Technician notes: ${elements.resultNotes.value.trim() || "None"}`,
    `Measurements: ${formatMeasurementsText(latestResult?.measurements || {})}`,
    "",
    `Evidence: ${result.evidenceSummary || "Not provided"}`,
    `Likely function: ${result.likelyFunction || "Not provided"}`,
    `Material: ${result.possibleMaterial || "Unknown"}`,
    `Part number: ${result.possibleStandardOrPartNumber || "Not visible"}`,
    `Markings: ${result.markingsText || "No readable markings reported"}`,
    "",
    formatTextList("Visible features", result.visibleFeatures),
    formatTextList("Measurement clues", result.measurementClues),
    formatTextList("Likely standards", result.likelyStandards),
    formatTextList("Alternatives", result.identificationAlternatives),
    formatTextList("Recommended checks", result.recommendedChecks),
    formatTextList("Uncertainty", result.uncertaintyWarnings),
    formatTextList("Missing evidence", result.missingEvidence),
    "",
    `Next photo: ${result.recommendedNextPhoto || "Not provided"}`
  ].join("\n");
}

function buildResultFeedbackUrl() {
  const result = latestResult?.result || {};
  const confidence = Math.round(Number(result.confidence || 0) * 100);
  const params = new URLSearchParams({
    category: "wrong-result",
    page: "scan result",
    message: [
      `Scan ID: ${latestResult?.scanId || "not assigned"}`,
      `Component shown: ${result.componentName || "unknown"}`,
      `Category: ${result.detectedCategory || result.category || "unknown"}`,
      `Confidence: ${confidence}%`,
      `Source: ${latestResult?.source || "unknown"}`,
      `Project: ${latestResult?.projectName || "General"}`,
      "",
      "What felt wrong, confusing, or useful?"
    ].join("\n")
  });
  return `/support/feedback.html?${params.toString()}`;
}

function formatTextList(label, items) {
  const values = Array.isArray(items) && items.length ? items : [t("noDetails")];
  return `${label}:\n${values.map(item => `- ${item}`).join("\n")}`;
}

function formatMeasurementsText(measurements) {
  const entries = Object.entries(measurements || {}).filter(([, value]) => value);
  return entries.length ? entries.map(([key, value]) => `${key}=${value}`).join(", ") : "None";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "component-scan";
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function confirmDeleteItem(name) {
  return window.confirm(t("confirmDeleteItem", { name: name || t("unknown") }));
}

function saveHistory(result, source, previewUrl, meta = {}) {
  const history = getHistory();
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    scanId: meta.scanId || createScanId(),
    source,
    projectId: meta.projectId || elements.projectSelect.value,
    projectName: meta.projectName || getSelectedProjectName(),
    measurements: meta.measurements || {},
    verificationChecklist: meta.verificationChecklist || {},
    verificationStatus: meta.verificationStatus || "unverified",
    technicianNotes: meta.technicianNotes || "",
    evaluation: meta.evaluation || null,
    previewUrl,
    result: normalizeResult(result)
  };

  localStorage.setItem(historyKey, JSON.stringify([item, ...history].slice(0, maxHistoryItems)));
  renderHistory();
  renderReports();
  renderStorageStatus();
}

function getHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  elements.historyPanel.classList.toggle("is-hidden", !history.length);
  elements.historyList.replaceChildren();

  for (const item of history) {
    const button = document.createElement("button");
    const thumb = document.createElement("img");
    const text = document.createElement("span");
    const confidence = Math.round(Number(item.result?.confidence || 0) * 100);

    button.type = "button";
    button.className = "history-item";
    thumb.src = item.previewUrl || "";
    thumb.alt = "";
    text.innerHTML = `<strong>${escapeHtml(item.result?.componentName || t("unknownComponent"))}</strong><small>${confidence}% ${escapeHtml(t("confidence"))}</small>`;
    button.append(thumb, text);
    button.addEventListener("click", () => renderResult(item.result, item.source, item.previewUrl ? [item.previewUrl] : [], {
      scanId: item.scanId || item.id,
      projectId: item.projectId,
      projectName: item.projectName,
      measurements: item.measurements,
      verificationChecklist: item.verificationChecklist,
      verificationStatus: item.verificationStatus,
      technicianNotes: item.technicianNotes,
      evaluation: item.evaluation
    }));
    elements.historyList.appendChild(button);
  }
}

function renderReports() {
  const history = getHistory();
  elements.reportsList.replaceChildren();
  renderReportsEvaluationSummary();

  if (!history.length) {
    elements.reportsList.innerHTML = `<div class="empty-row">${escapeHtml(t("noReports"))}</div>`;
    return;
  }

  for (const item of history) {
    const row = document.createElement("article");
    row.className = "management-card";
    row.innerHTML = `
      <img src="${item.previewUrl || ""}" alt="">
      <div>
        ${item.evaluation?.verdict ? `<span class="source-pill verdict-pill ${escapeHtml(item.evaluation.verdict)}">${escapeHtml(verdictLabel(item.evaluation.verdict))}</span>` : ""}
        <h2>${escapeHtml(item.result?.componentName || "Scan report")}</h2>
        <p>${escapeHtml(item.projectName || "General")} · ${Math.round(Number(item.result?.confidence || 0) * 100)}% confidence</p>
        <small>${escapeHtml(new Date(item.createdAt).toLocaleString())}${item.evaluation?.correctName ? ` &middot; ${escapeHtml(t("trueName"))}: ${escapeHtml(item.evaluation.correctName)}` : ""}</small>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" type="button" data-action="open">${escapeHtml(t("open"))}</button>
        <button class="secondary-btn danger" type="button" data-action="delete">${escapeHtml(t("delete"))}</button>
      </div>
    `;
    row.querySelector('[data-action="open"]').addEventListener("click", () => {
      renderResult(item.result, item.source, item.previewUrl ? [item.previewUrl] : [], {
        scanId: item.scanId || item.id,
        projectId: item.projectId,
        projectName: item.projectName,
        measurements: item.measurements,
        verificationChecklist: item.verificationChecklist,
        verificationStatus: item.verificationStatus,
        technicianNotes: item.technicianNotes,
        evaluation: item.evaluation
      });
      showPage("scan");
    });
    row.querySelector('[data-action="delete"]').addEventListener("click", () => {
      if (!confirmDeleteItem(item.result?.componentName || t("unknownComponent"))) return;
      localStorage.setItem(historyKey, JSON.stringify(getHistory().filter(scan => scan.id !== item.id)));
      renderHistory();
      renderReports();
      renderStorageStatus();
      showToast(t("itemDeleted"));
    });
    elements.reportsList.appendChild(row);
  }
}

function renderReportsEvaluationSummary() {
  const log = getTestLog();
  const counts = getEvaluationCounts(log);
  elements.reportsEvaluationSummary.classList.toggle("is-hidden", log.length === 0);
  if (!log.length) {
    elements.reportsEvaluationSummary.replaceChildren();
    return;
  }
  elements.reportsEvaluationSummary.innerHTML = `
    <span class="source-pill verdict-pill correct">${escapeHtml(t("testCorrect"))}: ${counts.correct}</span>
    <span class="source-pill verdict-pill partly">${escapeHtml(t("testPartly"))}: ${counts.partly}</span>
    <span class="source-pill verdict-pill wrong">${escapeHtml(t("testWrong"))}: ${counts.wrong}</span>
    <strong>${escapeHtml(t("reportsEvaluationSummary", { total: log.length, correct: counts.correct, partly: counts.partly, wrong: counts.wrong }))}</strong>
  `;
}

function saveEvaluation() {
  syncResultFromUi();
  const evaluation = getEvaluationFromUi();
  if (!evaluation.verdict) {
    showError(t("chooseEvaluation"));
    return;
  }

  const existing = getTestLog().filter(item => item.scanId !== latestResult.scanId);
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    scanId: latestResult.scanId,
    projectId: latestResult.projectId,
    projectName: latestResult.projectName,
    verdict: evaluation.verdict,
    correctName: evaluation.correctName,
    reasons: evaluation.reasons,
    notes: evaluation.notes,
    predictedName: latestResult.result.componentName,
    predictedCategory: latestResult.result.detectedCategory || latestResult.result.category,
    confidence: Number(latestResult.result.confidence || 0),
    source: latestResult.source,
    verificationStatus: elements.verificationStatus.value,
    previewUrl: latestResult.previewUrls?.[0] || "",
    result: normalizeResult(latestResult.result)
  };

  latestResult.evaluation = evaluation;
  localStorage.setItem(testLogKey, JSON.stringify([item, ...existing].slice(0, maxTestLogItems)));
  updateHistoryEvaluation(item);
  renderTestLog();
  renderStorageStatus();
  showToast(t("evaluationSaved"));
}

function getTestLog() {
  try {
    const parsed = JSON.parse(localStorage.getItem(testLogKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderTestLog() {
  const log = getTestLog();
  const counts = getEvaluationCounts(log);
  const accuracy = log.length ? Math.round((counts.correct / log.length) * 100) : 0;

  elements.testTotal.textContent = String(log.length);
  elements.testCorrect.textContent = String(counts.correct);
  elements.testPartly.textContent = String(counts.partly);
  elements.testWrong.textContent = String(counts.wrong);
  elements.testAccuracy.textContent = `${accuracy}%`;
  elements.testLogList.replaceChildren();

  if (!log.length) {
    elements.testLogList.innerHTML = `<div class="empty-row">${escapeHtml(t("noTestLog"))}</div>`;
    return;
  }

  for (const item of log) {
    const row = document.createElement("article");
    row.className = "management-card test-log-card";
    row.innerHTML = `
      <img src="${item.previewUrl || ""}" alt="">
      <div>
        <span class="source-pill verdict-pill ${escapeHtml(item.verdict)}">${escapeHtml(verdictLabel(item.verdict))}</span>
        <h2>${escapeHtml(item.correctName || item.predictedName || t("unknownComponent"))}</h2>
        <p>${escapeHtml(t("predicted"))}: ${escapeHtml(item.predictedName || t("unknownComponent"))} &middot; ${Math.round(Number(item.confidence || 0) * 100)}% ${escapeHtml(t("confidence"))}</p>
        <small>${escapeHtml(t("trueName"))}: ${escapeHtml(item.correctName || t("unknown"))} &middot; ${escapeHtml(new Date(item.createdAt).toLocaleString())}</small>
        ${Array.isArray(item.reasons) && item.reasons.length ? `<div class="reason-tags">${item.reasons.map(reason => `<span>${escapeHtml(reasonLabel(reason))}</span>`).join("")}</div>` : ""}
        ${item.notes ? `<p class="test-notes">${escapeHtml(item.notes)}</p>` : ""}
      </div>
      <div class="card-actions">
        <button class="secondary-btn" type="button" data-action="open">Open</button>
        <button class="secondary-btn danger" type="button" data-action="delete">${escapeHtml(t("delete"))}</button>
      </div>
    `;
    row.querySelector('[data-action="open"]').addEventListener("click", () => {
      renderResult(item.result, item.source, item.previewUrl ? [item.previewUrl] : [], {
        scanId: item.scanId,
        projectId: item.projectId,
        projectName: item.projectName,
        verificationStatus: item.verificationStatus,
        evaluation: {
          verdict: item.verdict,
          correctName: item.correctName,
          reasons: item.reasons || [],
          notes: item.notes
        }
      });
      showPage("scan");
    });
    row.querySelector('[data-action="delete"]').addEventListener("click", () => {
      if (!confirmDeleteItem(item.correctName || item.predictedName || t("unknownComponent"))) return;
      localStorage.setItem(testLogKey, JSON.stringify(getTestLog().filter(entry => entry.id !== item.id)));
      renderTestLog();
      renderStorageStatus();
      showToast(t("itemDeleted"));
    });
    elements.testLogList.appendChild(row);
  }
}

function updateHistoryEvaluation(evaluationItem) {
  const history = getHistory();
  const nextHistory = history.map(item => {
    const matchesScan = item.scanId && item.scanId === evaluationItem.scanId;
    if (!matchesScan) return item;
    return {
      ...item,
      verificationStatus: evaluationItem.verificationStatus,
      evaluation: {
        verdict: evaluationItem.verdict,
        correctName: evaluationItem.correctName,
        reasons: evaluationItem.reasons || [],
        notes: evaluationItem.notes
      }
    };
  });
  localStorage.setItem(historyKey, JSON.stringify(nextHistory));
  renderHistory();
  renderReports();
}

function verdictLabel(verdict) {
  const labels = {
    correct: t("evaluationCorrect"),
    partly: t("evaluationPartly"),
    wrong: t("evaluationWrong")
  };
  return labels[verdict] || t("evaluationNotEvaluated");
}

function getEvaluationCounts(log) {
  return {
    correct: log.filter(item => item.verdict === "correct").length,
    partly: log.filter(item => item.verdict === "partly").length,
    wrong: log.filter(item => item.verdict === "wrong").length
  };
}

function reasonLabel(reason) {
  const labels = {
    "bad-lighting": t("reasonBadLighting"),
    blurry: t("reasonBlurry"),
    markings: t("reasonMarkings"),
    scale: t("reasonScale"),
    angle: t("reasonAngle"),
    "similar-part": t("reasonSimilarPart")
  };
  return labels[reason] || reason;
}

function ensureDefaultProject() {
  if (getProjects().length) return;
  localStorage.setItem(projectKey, JSON.stringify([{ id: "general", name: "General", createdAt: new Date().toISOString() }]));
  localStorage.setItem(selectedProjectKey, "general");
}

function getProjects() {
  try {
    const parsed = JSON.parse(localStorage.getItem(projectKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeProjects(current, incoming) {
  const byName = new Map(current.map(project => [project.name.toLowerCase(), project]));
  for (const project of incoming) {
    if (project?.name && !byName.has(project.name.toLowerCase())) {
      byName.set(project.name.toLowerCase(), {
        id: project.id || createProjectId(project.name),
        name: project.name,
        createdAt: project.createdAt || new Date().toISOString()
      });
    }
  }
  return Array.from(byName.values());
}

function renderProjects() {
  const projects = getProjects();
  const selected = localStorage.getItem(selectedProjectKey) || projects[0]?.id || "general";

  elements.projectSelect.replaceChildren();
  for (const project of projects) {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    option.selected = project.id === selected;
    elements.projectSelect.appendChild(option);
  }

  elements.projectList.replaceChildren();
  for (const project of projects) {
    const scans = getHistory().filter(item => item.projectId === project.id).length;
    const parts = getDatabase().filter(item => item.projectId === project.id).length;
    const row = document.createElement("article");
    row.className = "management-card no-image";
    row.innerHTML = `
      <div>
        <h2>${escapeHtml(project.name)}</h2>
        <p>${scans} scans · ${parts} known parts</p>
        <small>Created ${escapeHtml(new Date(project.createdAt).toLocaleDateString())}</small>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" type="button" data-action="select">${escapeHtml(t("use"))}</button>
        <button class="secondary-btn danger" type="button" data-action="delete">${escapeHtml(t("delete"))}</button>
      </div>
    `;
    row.querySelector('[data-action="select"]').addEventListener("click", () => {
      localStorage.setItem(selectedProjectKey, project.id);
      renderProjects();
      showPage("scan");
    });
    row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProject(project.id));
    elements.projectList.appendChild(row);
  }

  renderStorageStatus();
}

function addProjectFromInput(input) {
  const name = input.value.trim();
  if (!name) return;
  const projects = getProjects();
  const project = { id: createProjectId(name), name, createdAt: new Date().toISOString() };
  localStorage.setItem(projectKey, JSON.stringify([...projects, project]));
  localStorage.setItem(selectedProjectKey, project.id);
  input.value = "";
  renderProjects();
}

function deleteProject(id) {
  if (id === "general") {
    showError(t("cannotDeleteDefaultProject"));
    return;
  }
  const projects = getProjects();
  const project = projects.find(item => item.id === id);
  if (!project || !confirmDeleteItem(project.name)) return;
  const nextProjects = projects.filter(item => item.id !== id);
  localStorage.setItem(projectKey, JSON.stringify(nextProjects));
  if (elements.projectSelect.value === id) {
    localStorage.setItem(selectedProjectKey, "general");
  }
  renderProjects();
  showToast(t("itemDeleted"));
}

function createProjectId(name) {
  return `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
}

function showPage(pageName) {
  if (safetyPrivacyReviewActive && pageName !== "privacy-app" && !hasSafetyAcknowledgement()) {
    safetyPrivacyReviewActive = false;
    pageName = "scan";
    window.setTimeout(() => showSafetyDialog({ force: true }), 0);
  }

  for (const page of elements.pages) {
    page.classList.toggle("is-active", page.id === `page-${pageName}`);
  }
  for (const button of elements.navButtons) {
    button.classList.toggle("is-active", button.dataset.page === pageName);
  }
  document.body.classList.toggle("is-report-preview", pageName === "report-preview");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showReportPreview(scan) {
  reportPrintPending = false;
  elements.reportPreview.innerHTML = buildReportMarkup(scan);
  showPage("report-preview");
}

function returnFromReportPreview({ showMessage = false } = {}) {
  reportPrintPending = false;
  showPage("scan");
  if (showMessage) {
    showToast(t("returnedFromPrint"));
  }
}

function saveKnownPart() {
  const database = getDatabase();
  const knownPart = {
    id: editingKnownPartId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    createdAt: new Date().toISOString(),
    scanId: latestResult.scanId,
    projectId: latestResult.projectId,
    projectName: latestResult.projectName,
    measurements: latestResult.measurements || {},
    verificationChecklist: latestResult.verificationChecklist || {},
    verificationStatus: elements.verificationStatus.value,
    technicianNotes: elements.resultNotes.value.trim(),
    previewUrl: latestResult.previewUrls?.[0] || "",
    result: normalizeResult(latestResult.result)
  };

  const nextDatabase = editingKnownPartId
    ? database.map(part => part.id === editingKnownPartId ? knownPart : part)
    : [knownPart, ...database];
  localStorage.setItem(databaseKey, JSON.stringify(nextDatabase.slice(0, 80)));
  editingKnownPartId = knownPart.id;
  renderDatabase();
  renderMatches();
  renderStorageStatus();
  showToast(t("knownPartSaved"));
}

function getDatabase() {
  try {
    const parsed = JSON.parse(localStorage.getItem(databaseKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderDatabase() {
  const database = getDatabase();
  elements.databasePanel.classList.toggle("is-hidden", !database.length);
  elements.databaseList.replaceChildren();

  for (const part of database.slice(0, 8)) {
    const button = document.createElement("button");
    const thumb = document.createElement("img");
    const text = document.createElement("span");
    button.type = "button";
    button.className = "history-item";
    thumb.src = part.previewUrl || "";
    thumb.alt = "";
    text.innerHTML = `<strong>${escapeHtml(part.result?.componentName || "Known part")}</strong><small>${escapeHtml(part.result?.possibleStandardOrPartNumber || part.verificationStatus || "Saved locally")}</small>`;
    button.append(thumb, text);
    button.addEventListener("click", () => renderResult(part.result, "known-part", part.previewUrl ? [part.previewUrl] : [], {
      scanId: part.scanId,
      projectId: part.projectId,
      projectName: part.projectName,
      measurements: part.measurements,
      knownPartId: part.id,
      verificationStatus: part.verificationStatus,
      technicianNotes: part.technicianNotes
    }));
    elements.databaseList.appendChild(button);
  }
  renderLibrary();
}

function renderLibrary() {
  const database = getDatabase();
  elements.libraryList.replaceChildren();

  if (!database.length) {
    elements.libraryList.innerHTML = `<div class="empty-row">${escapeHtml(t("noKnownParts"))}</div>`;
    return;
  }

  for (const part of database) {
    const row = document.createElement("article");
    row.className = "management-card";
    row.innerHTML = `
      <img src="${part.previewUrl || ""}" alt="">
      <div>
        <h2>${escapeHtml(part.result?.componentName || "Known part")}</h2>
        <p>${escapeHtml(part.result?.possibleStandardOrPartNumber || "No part number")} · ${escapeHtml(part.projectName || "General")}</p>
        <small>${escapeHtml(part.verificationStatus || "unverified")}</small>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" type="button" data-action="load">${escapeHtml(t("load"))}</button>
        <button class="secondary-btn" type="button" data-action="edit">${escapeHtml(t("edit"))}</button>
        <button class="secondary-btn danger" type="button" data-action="delete">${escapeHtml(t("delete"))}</button>
      </div>
    `;
    row.querySelector('[data-action="load"]').addEventListener("click", () => {
      renderResult(part.result, "known-part", part.previewUrl ? [part.previewUrl] : [], {
        scanId: part.scanId,
        projectId: part.projectId,
        projectName: part.projectName,
        measurements: part.measurements,
        knownPartId: part.id,
        verificationStatus: part.verificationStatus,
        technicianNotes: part.technicianNotes
      });
      showPage("scan");
    });
    row.querySelector('[data-action="edit"]').addEventListener("click", () => {
      renderResult(part.result, "known-part", part.previewUrl ? [part.previewUrl] : [], {
        scanId: part.scanId,
        projectId: part.projectId,
        projectName: part.projectName,
        measurements: part.measurements,
        knownPartId: part.id,
        verificationStatus: part.verificationStatus,
        technicianNotes: part.technicianNotes
      });
      showPage("scan");
      setEditMode(true);
    });
    row.querySelector('[data-action="delete"]').addEventListener("click", () => {
      if (!confirmDeleteItem(part.result?.componentName || t("unknownComponent"))) return;
      localStorage.setItem(databaseKey, JSON.stringify(getDatabase().filter(item => item.id !== part.id)));
      renderDatabase();
      renderMatches();
      renderStorageStatus();
      showToast(t("itemDeleted"));
    });
    elements.libraryList.appendChild(row);
  }
}

function renderMatches() {
  if (!latestResult) {
    elements.matchesPanel.classList.add("is-hidden");
    return;
  }

  const matches = findMatches(latestResult.result);
  elements.matchesPanel.classList.toggle("is-hidden", !matches.length);
  elements.matchesList.replaceChildren();

  for (const match of matches) {
    const item = document.createElement("button");
    const confidence = Math.round(match.score * 100);
    item.type = "button";
    item.className = "match-item";
    item.innerHTML = `<strong>${escapeHtml(match.part.result.componentName || "Known part")}</strong><span>${confidence}% match</span><small>${escapeHtml(match.reason)}</small>`;
    item.addEventListener("click", () => renderResult(match.part.result, "known-part", match.part.previewUrl ? [match.part.previewUrl] : [], {
      scanId: match.part.scanId,
      verificationStatus: match.part.verificationStatus,
      technicianNotes: match.part.technicianNotes
    }));
    elements.matchesList.appendChild(item);
  }
}

function findMatches(result) {
  return getDatabase()
    .map(part => scoreKnownPart(result, part))
    .filter(match => match.score >= 0.24)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxDatabaseMatches);
}

function scoreKnownPart(result, part) {
  const known = part.result || {};
  let score = 0;
  const reasons = [];

  const currentPartNumber = normalizeToken(result.possibleStandardOrPartNumber);
  const knownPartNumber = normalizeToken(known.possibleStandardOrPartNumber);
  if (currentPartNumber && knownPartNumber && currentPartNumber === knownPartNumber && !currentPartNumber.includes("not")) {
    score += 0.55;
    reasons.push("same part number");
  }

  if (sameText(result.componentFamily, known.componentFamily)) {
    score += 0.2;
    reasons.push("same family");
  }

  if (sameText(result.detectedCategory, known.detectedCategory)) {
    score += 0.15;
    reasons.push("same category");
  }

  const nameOverlap = tokenOverlap(result.componentName, known.componentName);
  if (nameOverlap > 0) {
    score += Math.min(0.25, nameOverlap * 0.08);
    reasons.push("similar name");
  }

  const featureOverlap = tokenOverlap(
    [result.markingsText, ...(result.visibleFeatures || [])].join(" "),
    [known.markingsText, ...(known.visibleFeatures || [])].join(" ")
  );
  if (featureOverlap > 0) {
    score += Math.min(0.18, featureOverlap * 0.05);
    reasons.push("shared visual clues");
  }

  return {
    part,
    score: Math.min(1, score),
    reason: reasons.length ? reasons.join(", ") : "similar saved record"
  };
}

function sameText(a, b) {
  return Boolean(a && b && normalizeToken(a) === normalizeToken(b));
}

function normalizeToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenOverlap(a, b) {
  const ignored = new Set(["the", "and", "with", "part", "component", "unknown", "visible", "not", "from"]);
  const left = new Set(normalizeToken(a).split(/\s+/).filter(token => token.length > 2 && !ignored.has(token)));
  const right = new Set(normalizeToken(b).split(/\s+/).filter(token => token.length > 2 && !ignored.has(token)));
  let count = 0;
  for (const token of left) {
    if (right.has(token)) count += 1;
  }
  return count;
}

function downloadJson(payload, filename) {
  downloadText(JSON.stringify(payload, null, 2), filename, "application/json");
}

function downloadText(text, filename, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildTestLogCsv(log) {
  const headers = [
    "createdAt",
    "scanId",
    "projectName",
    "verdict",
    "correctName",
    "predictedName",
    "predictedCategory",
    "confidence",
    "reasons",
    "notes",
    "source",
    "verificationStatus"
  ];
  const rows = log.map(item => [
    item.createdAt,
    item.scanId,
    item.projectName,
    item.verdict,
    item.correctName,
    item.predictedName,
    item.predictedCategory,
    Math.round(Number(item.confidence || 0) * 100),
    Array.isArray(item.reasons) ? item.reasons.map(reasonLabel).join("; ") : "",
    item.notes,
    item.source,
    item.verificationStatus
  ]);
  return [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

async function checkBackend() {
  elements.backendStatus.textContent = t("backendChecking");
  try {
    const response = await fetch("/api/health", {
      headers: {
        "X-TechSpec-Install-Id": getInstallId()
      }
    });
    const payload = await response.json();
    latestHealth = payload && typeof payload === "object" ? payload : null;
    latestAppMode = payload.appMode === "production" ? "production" : "development";
    applyAppMode();
    elements.backendStatus.textContent = payload.ok
      ? t("backendOnline", {
        appMode: latestAppMode,
        keyStatus: payload.geminiConfigured ? t("backendConfigured") : t("backendMissing"),
        model: payload.model,
        strongModel: payload.strongModel || payload.model,
        serverVersion: payload.serverVersion || t("unknown")
      })
      : t("backendUnhealthy");
    if (payload.usage) {
      renderUsage(payload.usage);
    }
    renderAppDiagnostics();
    updateReleaseBlockers();
  } catch {
    latestHealth = null;
    latestAppMode = "development";
    applyAppMode();
    elements.backendStatus.textContent = t("backendOffline");
    renderAppDiagnostics();
    updateReleaseBlockers();
  }
}

function renderUsage(usage) {
  if (!usage?.daily || !usage?.monthly) return;
  renderUsageMeter(elements.dailyUsageText, elements.dailyUsageBar, usage.daily);
  renderUsageMeter(elements.monthlyUsageText, elements.monthlyUsageBar, usage.monthly);
  if (usage.installation?.daily && usage.installation?.monthly) {
    renderUsageMeter(elements.deviceDailyUsageText, elements.deviceDailyUsageBar, usage.installation.daily);
    renderUsageMeter(elements.deviceMonthlyUsageText, elements.deviceMonthlyUsageBar, usage.installation.monthly);
    if (elements.installIdText) {
      elements.installIdText.textContent = getScreenshotMode() ? "hidden-for-screenshot" : usage.installation.id || getInstallId();
    }
  }

  const statuses = [
    usage.daily.status,
    usage.monthly.status,
    usage.installation?.daily?.status,
    usage.installation?.monthly?.status
  ];
  const status = statuses.includes("blocked")
    ? "blocked"
    : statuses.includes("warning")
      ? "warning"
      : "ok";
  const lastScan = usage.lastScanAt
    ? ` ${t("usageLastScan", { value: new Date(usage.lastScanAt).toLocaleString() })}`
    : "";
  elements.usageStatus.textContent = `${t(`usage${status[0].toUpperCase()}${status.slice(1)}`)}${lastScan}`;
  elements.usageStatus.dataset.status = status;
  renderFreeScansSummary(usage);
}

function renderFreeScansSummary(usage) {
  if (!elements.freeScansRemainingText || !elements.freeScansRemainingHelp) return;
  const daily = usage.installation?.daily || usage.daily;
  const remaining = Math.max(0, Number(daily?.remaining || 0));
  const limit = Number(daily?.limit || 0);
  const status = daily?.status || "ok";
  elements.freeScansRemainingText.textContent = limit
    ? t("freeScansRemaining", { remaining, limit })
    : t("freeScansUnlimited");
  elements.freeScansRemainingHelp.textContent = t(`usage${status[0].toUpperCase()}${status.slice(1)}`);
  elements.freeScansRemainingHelp.dataset.status = status;
}

function renderUsageMeter(textElement, barElement, usage) {
  const limit = Math.max(1, Number(usage.limit || 1));
  const count = Number(usage.count || 0);
  const percent = Math.min(100, Math.round((count / limit) * 100));
  textElement.textContent = `${count} / ${limit}`;
  barElement.style.width = `${percent}%`;
  barElement.dataset.status = usage.status || "ok";
}

function renderStorageStatus() {
  const projects = getProjects().length;
  const scans = getHistory().length;
  const parts = getDatabase().length;
  const tests = getTestLog().length;
  elements.storageStatus.textContent = t("storageStatus", { projects, scans, parts, tests });
}

function renderReadiness() {
  const saved = getReadiness();
  for (const input of elements.readinessInputs) {
    input.checked = Boolean(saved[input.dataset.readiness]);
  }
  renderReadinessProgress();
}

function saveReadiness() {
  const state = {};
  for (const input of elements.readinessInputs) {
    state[input.dataset.readiness] = input.checked;
  }
  localStorage.setItem(readinessKey, JSON.stringify(state));
  renderReadinessProgress();
  updateReleaseBlockers();
}

function renderReadinessProgress() {
  const total = elements.readinessInputs.length;
  const done = elements.readinessInputs.filter(input => input.checked).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  if (elements.readinessSummary) {
    elements.readinessSummary.textContent = t("readinessProgress", { done, total });
  }
  if (elements.readinessProgressBar) {
    elements.readinessProgressBar.style.width = `${percent}%`;
    elements.readinessProgressBar.dataset.status = percent >= 100 ? "ready" : percent >= 60 ? "warning" : "blocked";
  }
}

function getReadiness() {
  try {
    const parsed = JSON.parse(localStorage.getItem(readinessKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function buildReportMarkup(scan) {
  const { result, source, previewUrls } = scan;
  const title = result.componentName || (getLanguage() === "de" ? "Bauteilscan" : "Component scan");
  const confidence = `${Math.round(Number(result.confidence || 0) * 100)}%`;
  const imageHtml = previewUrls?.length
    ? `<div class="image-grid">${previewUrls.map((url, index) => `<img class="part-image" src="${url}" alt="Scanned component photo ${index + 1}">`).join("")}</div>`
    : `<div class="image-placeholder">${escapeHtml(getLanguage() === "de" ? "Kein Bild fuer diesen Bericht gespeichert" : "No image stored for this report")}</div>`;

  return `
  <main class="report">
    <header>
      <div>
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">
          Scan ID: ${escapeHtml(scan.scanId || "Not assigned")}<br>
          ${escapeHtml(t("project"))}: ${escapeHtml(scan.projectName || "General")}<br>
          Source: ${escapeHtml(source)}<br>
          ${escapeHtml(t("verification"))}: ${escapeHtml(elements.verificationStatus.value)}<br>
          ${escapeHtml(t("detectedFamily"))}: ${escapeHtml(result.detectedCategory || result.category || t("unknown"))}<br>
          ${escapeHtml(t("componentFamily") || "Component family")}: ${escapeHtml(result.componentFamily || t("unknown"))}<br>
          Exported: ${escapeHtml(new Date().toLocaleString())}
        </div>
      </div>
      <div class="badge"><span><strong>${escapeHtml(confidence)}</strong>${escapeHtml(t("confidence"))}</span></div>
    </header>

    <div class="hero">
      ${imageHtml}
      <section>
        <h2>${escapeHtml(t("evidenceSummary"))}</h2>
        <p>${escapeHtml(result.evidenceSummary || t("noEvidenceSummary"))}</p>
      </section>
    </div>

    ${reportConfidenceSection(result, source, scan.measurements)}

    <div class="grid">
      ${reportSection(t("likelyFunction"), result.likelyFunction)}
      ${reportSection(t("material"), result.possibleMaterial)}
      ${reportSection(t("partNumber"), result.possibleStandardOrPartNumber)}
      ${reportSection(t("markings"), result.markingsText)}
      ${reportSection(t("nextPhoto"), result.recommendedNextPhoto)}
      ${reportSection(t("technicianNotes"), elements.resultNotes.value.trim() || (getLanguage() === "de" ? "Keine" : "None"))}
    </div>

    ${reportMeasurements(scan.measurements)}
    ${reportList(t("visibleFeatures"), result.visibleFeatures)}
    ${reportList(t("measurementClues"), result.measurementClues)}
    ${reportList(t("likelyStandards"), result.likelyStandards)}
    ${reportList(t("alternatives"), result.identificationAlternatives)}
    ${reportList(t("recommendedChecks"), result.recommendedChecks)}
    ${reportList(t("uncertainty"), result.uncertaintyWarnings)}
    ${reportList(t("missingEvidence"), result.missingEvidence)}

    <footer>
      ${escapeHtml(t("reportGenerated"))}
    </footer>
  </main>`;
}

function buildReportHtml(scan) {
  const { result, source, previewUrls } = scan;
  const title = result.componentName || (getLanguage() === "de" ? "Bauteilscan" : "Component scan");
  const confidence = `${Math.round(Number(result.confidence || 0) * 100)}%`;
  const imageHtml = previewUrls?.length
    ? `<div class="image-grid">${previewUrls.map((url, index) => `<img class="part-image" src="${url}" alt="Scanned component photo ${index + 1}">`).join("")}</div>`
    : `<div class="image-placeholder">${escapeHtml(getLanguage() === "de" ? "Kein Bild fuer diesen Bericht gespeichert" : "No image stored for this report")}</div>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)} report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      color: #102033;
      font-family: Arial, Helvetica, sans-serif;
      background: #ffffff;
    }
    .report { max-width: 920px; margin: 0 auto; }
    header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 2px solid #d5e0ea;
      padding-bottom: 18px;
      margin-bottom: 22px;
    }
    h1 { margin: 0 0 6px; font-size: 30px; line-height: 1.15; }
    .meta { color: #5a6b7d; line-height: 1.5; }
    .badge {
      min-width: 118px;
      height: 94px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: #102033;
      color: #fff;
      text-align: center;
      font-weight: 700;
    }
    .badge strong { display: block; font-size: 26px; }
    .hero {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 22px;
      align-items: start;
      margin-bottom: 18px;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .part-image,
    .image-placeholder {
      width: 100%;
      border: 1px solid #d5e0ea;
      border-radius: 8px;
      background: #f3f8fc;
    }
    .part-image { display: block; max-height: 220px; object-fit: contain; }
    .image-placeholder {
      min-height: 180px;
      display: grid;
      place-items: center;
      color: #5a6b7d;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin: 16px 0;
    }
    section {
      border: 1px solid #d5e0ea;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      break-inside: avoid;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: .04em;
      color: #1d4ed8;
    }
    p { margin: 0; line-height: 1.45; color: #26384c; }
    ul { margin: 0; padding-left: 20px; color: #26384c; line-height: 1.45; }
    li + li { margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; color: #26384c; }
    th, td { text-align: left; border-bottom: 1px solid #d5e0ea; padding: 7px 4px; }
    th { width: 36%; color: #5a6b7d; font-weight: 700; }
    footer {
      margin-top: 24px;
      color: #5a6b7d;
      font-size: 12px;
      border-top: 1px solid #d5e0ea;
      padding-top: 12px;
    }
    @media print {
      body { padding: 18mm; }
      .report { max-width: none; }
    }
  </style>
</head>
<body>
  <main class="report">
    <header>
      <div>
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">
          Scan ID: ${escapeHtml(scan.scanId || "Not assigned")}<br>
          ${escapeHtml(t("project"))}: ${escapeHtml(scan.projectName || "General")}<br>
          Source: ${escapeHtml(source)}<br>
          ${escapeHtml(t("verification"))}: ${escapeHtml(elements.verificationStatus.value)}<br>
          ${escapeHtml(t("detectedFamily"))}: ${escapeHtml(result.detectedCategory || result.category || t("unknown"))}<br>
          ${escapeHtml(t("componentFamily") || "Component family")}: ${escapeHtml(result.componentFamily || t("unknown"))}<br>
          Exported: ${escapeHtml(new Date().toLocaleString())}
        </div>
      </div>
      <div class="badge"><span><strong>${escapeHtml(confidence)}</strong>${escapeHtml(t("confidence"))}</span></div>
    </header>

    <div class="hero">
      ${imageHtml}
      <section>
        <h2>${escapeHtml(t("evidenceSummary"))}</h2>
        <p>${escapeHtml(result.evidenceSummary || t("noEvidenceSummary"))}</p>
      </section>
    </div>

    ${reportConfidenceSection(result, source, scan.measurements)}

    <div class="grid">
      ${reportSection(t("likelyFunction"), result.likelyFunction)}
      ${reportSection(t("material"), result.possibleMaterial)}
      ${reportSection(t("partNumber"), result.possibleStandardOrPartNumber)}
      ${reportSection(t("markings"), result.markingsText)}
      ${reportSection(t("nextPhoto"), result.recommendedNextPhoto)}
      ${reportSection(t("technicianNotes"), elements.resultNotes.value.trim() || (getLanguage() === "de" ? "Keine" : "None"))}
    </div>

    ${reportMeasurements(scan.measurements)}
    ${reportList(t("visibleFeatures"), result.visibleFeatures)}
    ${reportList(t("measurementClues"), result.measurementClues)}
    ${reportList(t("likelyStandards"), result.likelyStandards)}
    ${reportList(t("alternatives"), result.identificationAlternatives)}
    ${reportList(t("recommendedChecks"), result.recommendedChecks)}
    ${reportList(t("uncertainty"), result.uncertaintyWarnings)}
    ${reportList(t("missingEvidence"), result.missingEvidence)}

    <footer>
      ${escapeHtml(t("reportGenerated"))}
    </footer>
  </main>
</body>
</html>`;
}

function reportSection(label, value) {
  return `<section><h2>${escapeHtml(label)}</h2><p>${escapeHtml(value || "Not provided")}</p></section>`;
}

function reportConfidenceSection(result, source, measurements = {}) {
  const confidence = Number(result.confidence || 0);
  const explanation = confidence >= 0.78
    ? t("confidenceHigh")
    : confidence >= 0.55
      ? t("confidenceMedium")
      : t("confidenceLow");
  const reasons = [
    source === "gemini" ? t("confidenceReasonGemini") : t("confidenceReasonDemo"),
    toArray(result.visibleFeatures).length ? t("confidenceReasonFeatures") : "",
    Object.keys(measurements || {}).length ? t("confidenceReasonMeasurements") : "",
    toArray(result.uncertaintyWarnings).length ? t("confidenceReasonWarnings") : "",
    toArray(result.missingEvidence).length ? t("confidenceReasonMissingEvidence") : ""
  ].filter(Boolean);

  return `<section class="confidence-report"><h2>${escapeHtml(t("confidenceExplanation"))}</h2><p>${escapeHtml(explanation)}</p><ul>${reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></section>`;
}

function reportList(label, items) {
  const values = Array.isArray(items) && items.length ? items : [t("noDetails")];
  return `<section><h2>${escapeHtml(label)}</h2><ul>${values.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function reportMeasurements(measurements = {}) {
  const baseLabels = measurementLabelText[getLanguage()] || measurementLabelText.en;
  const labels = {
    lengthMm: baseLabels.lengthMm,
    widthMm: baseLabels.widthMm,
    diameterMm: baseLabels.diameterMm,
    boreMm: baseLabels.boreMm,
    threadPitchMm: baseLabels.threadPitchMm,
    weightG: baseLabels.weightG,
    materialConfirmed: baseLabels.materialConfirmed,
    measuredBy: baseLabels.measuredBy
  };
  const rows = Object.entries(labels)
    .filter(([key]) => measurements[key])
    .map(([key, label]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(measurements[key])}</td></tr>`)
    .join("");

  if (!rows) return reportSection(t("measurements"), getLanguage() === "de" ? "Keine manuellen Messwerte eingegeben." : "No manual measurements entered.");
  return `<section><h2>${escapeHtml(t("measurements"))}</h2><table>${rows}</table></section>`;
}

function createScanId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TS-${stamp}-${suffix}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function setLoading(isLoading) {
  elements.analyzeBtn.disabled = isLoading || !preparedImages.length;
  elements.loadingState.classList.toggle("is-hidden", !isLoading);
  if (isLoading) {
    elements.emptyState.classList.add("is-hidden");
    elements.resultCard.classList.add("is-hidden");
  } else if (latestResult) {
    elements.resultCard.classList.remove("is-hidden");
  }
}

function showError(message) {
  const errorBoxVisible = elements.errorBox && elements.errorBox.offsetParent !== null;
  const target = errorBoxVisible ? elements.errorBox : elements.toastBox || elements.errorBox;
  target.textContent = message;
  target.classList.remove("is-hidden", "is-info");
  target.classList.add("is-error");
  if (target !== elements.errorBox) {
    window.setTimeout(() => {
      target.classList.remove("is-error");
      target.textContent = "";
      target.classList.add("is-hidden");
    }, 2600);
  }
}

function showToast(message) {
  const target = elements.toastBox || elements.errorBox;
  target.textContent = message;
  target.classList.remove("is-hidden", "is-error");
  target.classList.add("is-info");
  window.setTimeout(() => {
    target.classList.remove("is-info");
    target.textContent = "";
    target.classList.add("is-hidden");
  }, 1800);
}

function clearError() {
  elements.errorBox.textContent = "";
  elements.errorBox.classList.add("is-hidden");
  elements.errorBox.classList.remove("is-info", "is-error");
}
