(function () {
  const form = document.querySelector("#adminFeedbackForm");
  const codeInput = document.querySelector("#adminFeedbackCode");
  const status = document.querySelector("#adminFeedbackStatus");
  const resultsPanel = document.querySelector("#adminFeedbackResults");
  const summary = document.querySelector("#adminFeedbackSummary");
  const stats = document.querySelector("#adminFeedbackStats");
  const list = document.querySelector("#adminFeedbackList");
  const searchInput = document.querySelector("#feedbackSearchInput");
  const categoryFilter = document.querySelector("#feedbackCategoryFilter");
  const ratingFilter = document.querySelector("#feedbackRatingFilter");
  const clearFiltersBtn = document.querySelector("#clearFeedbackFiltersBtn");
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

  for (const control of [searchInput, categoryFilter, ratingFilter]) {
    control?.addEventListener("input", () => renderFeedback(latestExport));
  }

  clearFiltersBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (ratingFilter) ratingFilter.value = "";
    renderFeedback(latestExport);
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
    if (!exportPayload) return;
    const entries = Array.isArray(exportPayload.feedback) ? exportPayload.feedback : [];
    populateCategoryFilter(entries);
    renderStats(entries);
    const filteredEntries = filterEntries(entries);
    summary.textContent = `${filteredEntries.length} of ${entries.length} entries shown. Export generated ${formatDate(exportPayload.generatedAt)}.`;
    list.replaceChildren();

    if (!filteredEntries.length) {
      const empty = document.createElement("p");
      empty.className = "small-note";
      empty.textContent = entries.length ? "No feedback entries match the current filters." : "No feedback entries have been stored yet.";
      list.appendChild(empty);
      resultsPanel.classList.remove("is-hidden");
      return;
    }

    for (const entry of filteredEntries.slice().reverse()) {
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

  function populateCategoryFilter(entries) {
    if (!categoryFilter) return;
    const selected = categoryFilter.value;
    const categories = [...new Set(entries.map(entry => entry.category || "general"))].sort((a, b) => a.localeCompare(b));
    categoryFilter.replaceChildren(new Option("All categories", ""));
    for (const category of categories) {
      categoryFilter.appendChild(new Option(category, category));
    }
    if (categories.includes(selected)) categoryFilter.value = selected;
  }

  function renderStats(entries) {
    if (!stats) return;
    const ratings = entries.map(entry => Number(entry.rating)).filter(Number.isFinite);
    const averageRating = ratings.length
      ? `${(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)} / 5`
      : "No ratings yet";
    const categories = new Map();
    for (const entry of entries) {
      const category = entry.category || "general";
      categories.set(category, (categories.get(category) || 0) + 1);
    }
    const topCategory = [...categories.entries()].sort((a, b) => b[1] - a[1])[0];
    const contactCount = entries.filter(entry => entry.contact).length;

    stats.replaceChildren(
      statCard("Total", String(entries.length)),
      statCard("Average rating", averageRating),
      statCard("Top category", topCategory ? `${topCategory[0]} (${topCategory[1]})` : "None"),
      statCard("With contact", String(contactCount))
    );
  }

  function statCard(label, value) {
    const card = document.createElement("div");
    card.className = "feedback-stat-card";
    card.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    return card;
  }

  function filterEntries(entries) {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const category = categoryFilter?.value || "";
    const rating = ratingFilter?.value || "";

    return entries.filter(entry => {
      if (category && (entry.category || "general") !== category) return false;
      const entryRating = entry.rating ? String(entry.rating) : "none";
      if (rating && entryRating !== rating) return false;
      if (!query) return true;
      const haystack = [
        entry.id,
        entry.category,
        entry.page,
        entry.message,
        entry.contact,
        entry.installId,
        entry.appVersion,
        entry.screen,
        entry.userAgent
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
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
