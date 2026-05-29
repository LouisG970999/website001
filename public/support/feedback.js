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

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "Sending feedback...";

    const payload = {
      category: document.querySelector("#feedbackCategory").value,
      rating: document.querySelector("#feedbackRating").value,
      page: document.querySelector("#feedbackPage").value,
      contact: document.querySelector("#feedbackContact").value,
      message: document.querySelector("#feedbackMessage").value,
      appVersion: "web-feedback-page"
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TechSpec-Install-Id": getInstallId(),
          "X-TechSpec-Beta-Code": getStoredBetaCode()
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Feedback could not be sent.");
      form.reset();
      status.textContent = "Feedback sent. Thank you.";
    } catch (error) {
      status.textContent = `${error.message || "Feedback could not be sent."} You can also email support from the support page.`;
    }
  });
}());
