(function () {
  const form = document.querySelector("#adminFeedbackForm");
  const codeInput = document.querySelector("#adminFeedbackCode");
  const status = document.querySelector("#adminFeedbackStatus");
  const resultsPanel = document.querySelector("#adminFeedbackResults");
  const summary = document.querySelector("#adminFeedbackSummary");
  const list = document.querySelector("#adminFeedbackList");
  const downloadJsonBtn = document.querySelector("#downloadFeedbackJsonBtn");
  const downloadCsvBtn = document.querySelector("#downloadFeedbackCsvBtn");
  let latestExport = null;

  if (!form || !codeInput || !status || !resultsPanel || !summary || !list) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    await loadFeedback();
  });

  downloadJsonBtn?.addEventListener("click", () => {
    if (!latestExport) return;
    downloadText(
      JSON.stringify(latestExport, null, 2),
      `techspec-feedback-${dateStamp()}.json`,
      "application/json;charset=utf-8"
    );
  });

  downloadCsvBtn?.addEventListener("click", () => {
    if (!latestExport) return;
    downloadText(
      buildCsv(latestExport.feedback || []),
      `techspec-feedback-${dateStamp()}.csv`,
      "text/csv;charset=utf-8"
    );
  });

  async function loadFeedback() {
    const code = codeInput.value.trim();
    if (!code) {
      status.textContent = "Enter your feedback admin code first.";
      codeInput.focus();
      return;
    }

    status.textContent = "Loading feedback...";
    resultsPanel.classList.add("is-hidden");

    try {
      const response = await fetch("/api/feedback/export", {
        headers: {
          "X-TechSpec-Admin-Code": code
        }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || result.message || "Feedback could not be loaded.");
      latestExport = result;
      renderFeedback(result);
      status.textContent = "Feedback loaded.";
    } catch (error) {
      latestExport = null;
      status.textContent = error.message?.includes("ADMIN_ACCESS")
        ? "The admin code was not accepted."
        : error.message || "Feedback could not be loaded.";
    }
  }

  function renderFeedback(exportPayload) {
    const entries = Array.isArray(exportPayload.feedback) ? exportPayload.feedback : [];
    summary.textContent = `${entries.length} entries. Export generated ${formatDate(exportPayload.generatedAt)}.`;
    list.replaceChildren();

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "small-note";
      empty.textContent = "No feedback entries have been stored yet.";
      list.appendChild(empty);
      resultsPanel.classList.remove("is-hidden");
      return;
    }

    for (const entry of entries.slice().reverse()) {
      const article = document.createElement("article");
      article.className = "feedback-entry";
      article.innerHTML = `
        <div>
          <strong>${escapeHtml(entry.category || "general")}</strong>
          <span>${escapeHtml(formatDate(entry.createdAt))}</span>
        </div>
        <p>${escapeHtml(entry.message || "")}</p>
        <dl>
          <dt>Rating</dt><dd>${escapeHtml(entry.rating || "none")}</dd>
          <dt>Page</dt><dd>${escapeHtml(entry.page || "not provided")}</dd>
          <dt>Contact</dt><dd>${escapeHtml(entry.contact || "not provided")}</dd>
          <dt>Install ID</dt><dd>${escapeHtml(entry.installId || "unknown")}</dd>
          <dt>App version</dt><dd>${escapeHtml(entry.appVersion || "unknown")}</dd>
          <dt>Screen</dt><dd>${escapeHtml(entry.screen || "unknown")}</dd>
        </dl>
      `;
      list.appendChild(article);
    }

    resultsPanel.classList.remove("is-hidden");
  }

  function buildCsv(entries) {
    const columns = ["id", "createdAt", "category", "rating", "page", "message", "contact", "installId", "appVersion", "screen", "browserOnline", "userAgent"];
    const rows = [columns.join(",")];
    for (const entry of entries) {
      rows.push(columns.map(column => csvCell(entry[column])).join(","));
    }
    return rows.join("\r\n");
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
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

  function dateStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "unknown date";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}());
