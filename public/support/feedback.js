(function () {
  const form = document.querySelector("#feedbackForm");
  const status = document.querySelector("#feedbackStatus");
  if (!form || !status) return;

  function getStoredBetaCode() {
    try {
      return localStorage.getItem("techspec-beta-access-code-v1") || "";
    } catch {
      return "";
    }
  }

  function storeBetaCode(code) {
    try {
      if (code) localStorage.setItem("techspec-beta-access-code-v1", code);
    } catch {
      // Best-effort convenience only; the request still uses the typed code.
    }
  }

  function getInstallId() {
    try {
      let value = localStorage.getItem("component-scanner-install-id-v1");
      if (!value) {
        const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        value = `ts-${random}`.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
        localStorage.setItem("component-scanner-install-id-v1", value);
      }
      return value;
    } catch {
      return "unknown";
    }
  }

  function fillFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const mapping = {
      category: "#feedbackCategory",
      rating: "#feedbackRating",
      page: "#feedbackPage",
      contact: "#feedbackContact",
      message: "#feedbackMessage"
    };

    for (const [key, selector] of Object.entries(mapping)) {
      const element = document.querySelector(selector);
      const value = params.get(key);
      if (element && value) element.value = value.slice(0, element.tagName === "TEXTAREA" ? 2400 : 160);
    }
  }

  fillFromQueryParams();

  const betaCodeInput = document.querySelector("#feedbackBetaCode");
  if (betaCodeInput) {
    betaCodeInput.value = getStoredBetaCode();
    if (!betaCodeInput.value) {
      status.textContent = "Enter the beta access code before sending feedback.";
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "Sending feedback...";
    const betaCode = (betaCodeInput?.value || getStoredBetaCode()).trim();
    if (!betaCode) {
      status.textContent = "Please enter the beta access code first.";
      betaCodeInput?.focus();
      return;
    }
    storeBetaCode(betaCode);

    const payload = {
      category: document.querySelector("#feedbackCategory").value,
      rating: document.querySelector("#feedbackRating").value,
      page: document.querySelector("#feedbackPage").value,
      contact: document.querySelector("#feedbackContact").value,
      message: document.querySelector("#feedbackMessage").value,
      appVersion: "web-feedback-page",
      browserOnline: navigator.onLine,
      screen: `${window.innerWidth}x${window.innerHeight}`
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TechSpec-Install-Id": getInstallId(),
          "X-TechSpec-Beta-Code": betaCode
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Feedback could not be sent.");
      form.reset();
      if (betaCodeInput) betaCodeInput.value = betaCode;
      status.textContent = "Feedback sent. Thank you.";
    } catch (error) {
      const message = error.message || "Feedback could not be sent.";
      status.textContent = message.includes("BETA_ACCESS") || message.includes("INVALID")
        ? "The beta access code was not accepted. Check the code and try again."
        : `${message} You can also email support from the support page.`;
    }
  });
}());
