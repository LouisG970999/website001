(function () {
  const form = document.querySelector("#adminFeedbackForm");
  const codeInput = document.querySelector("#adminFeedbackCode");
  const status = document.querySelector("#adminFeedbackStatus");
  const resultsPanel = document.querySelector("#adminFeedbackResults");
  const summary = document.querySelector("#adminFeedbackSummary");
  const stats = document.querySelector("#adminFeedbackStats");
  const list = document.querySelector("#adminFeedbackList");
  const triagePanel = document.querySelector("#feedbackTriagePanel");
  const healthSummary = document.querySelector("#adminHealthSummary");
  const healthStats = document.querySelector("#adminHealthStats");
  const preflightList = document.querySelector("#adminPreflightList");
  const refreshHealthBtn = document.querySelector("#refreshAdminHealthBtn");
  const searchInput = document.querySelector("#feedbackSearchInput");
  const categoryFilter = document.querySelector("#feedbackCategoryFilter");
  const ratingFilter = document.querySelector("#feedbackRatingFilter");
  const clearFiltersBtn = document.querySelector("#clearFeedbackFiltersBtn");
  const copyTriageBtn = document.querySelector("#copyFeedbackTriageBtn");
  const downloadTriageBtn = document.querySelector("#downloadFeedbackTriageBtn");
  const downloadJsonBtn = document.querySelector("#downloadFeedbackJsonBtn");
  const downloadCsvBtn = document.querySelector("#downloadFeedbackCsvBtn");
  let latestExport = null;

  if (!form || !codeInput || !status || !resultsPanel || !summary || !list) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    await loadFeedback();
  });

  refreshHealthBtn?.addEventListener("click", loadHealth);

  list.addEventListener("click", async event => {
    const button = event.target.closest("[data-delete-feedback-id]");
    if (!button) return;
    const id = button.dataset.deleteFeedbackId;
    if (!id || !window.confirm("Delete this feedback entry? This cannot be undone.")) return;
    await deleteFeedback(id);
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

  copyTriageBtn?.addEventListener("click", async () => {
    if (!latestExport) return;
    const text = buildTriageText(latestExport.feedback || []);
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Triage summary copied.";
    } catch {
      downloadText(text, `techspec-feedback-triage-${dateStamp()}.txt`, "text/plain;charset=utf-8");
      status.textContent = "Clipboard unavailable. Triage summary downloaded instead.";
    }
  });

  downloadTriageBtn?.addEventListener("click", () => {
    if (!latestExport) return;
    downloadText(
      buildTriageText(latestExport.feedback || []),
      `techspec-feedback-triage-${dateStamp()}.txt`,
      "text/plain;charset=utf-8"
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

  loadHealth();

  async function loadHealth() {
    if (!healthSummary || !healthStats || !preflightList) return;
    healthSummary.textContent = "Checking hosted app status...";
    healthStats.replaceChildren();
    preflightList.replaceChildren();

    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error("Health check failed.");
      renderHealth(result);
    } catch (error) {
      healthSummary.textContent = error.message || "Health check failed.";
      healthStats.replaceChildren(
        statCard("Backend", "Unavailable"),
        statCard("Action", "Refresh later")
      );
    }
  }

  function renderHealth(health) {
    const checks = Array.isArray(health.preflight?.checks) ? health.preflight.checks : [];
    const criticalCount = checks.filter(check => !check.ok && check.severity === "critical").length;
    const warningCount = checks.filter(check => !check.ok && check.severity === "warning").length;
    const usage = health.usage || {};
    const daily = usage.daily ? `${usage.daily.count || 0} / ${usage.daily.limit || 0}` : String(usage.dailyCount || 0);
    const monthly = usage.monthly ? `${usage.monthly.count || 0} / ${usage.monthly.limit || 0}` : String(usage.monthlyCount || 0);
    const automation = automationStatus(health.automation);

    healthSummary.textContent = `${health.appMode || "unknown"} mode. Server ${health.serverVersion || "unknown"}. Started ${formatDate(health.startedAt)}.`;
    healthStats.replaceChildren(
      statCard("Backend", health.ok ? "Online" : "Issue"),
      statCard("Gemini", health.geminiConfigured ? "Configured" : "Missing"),
      statCard("Beta access", health.betaAccessRequired ? "Enabled" : "Disabled"),
      statCard("Automation", automation),
      statCard("Daily scans", daily),
      statCard("Monthly scans", monthly),
      statCard("Preflight", `${criticalCount} critical / ${warningCount} warning`)
    );

    preflightList.replaceChildren();
    for (const check of checks) {
      const row = document.createElement("div");
      row.className = "admin-preflight-row";
      row.dataset.status = check.ok ? "ok" : check.severity || "warning";
      row.innerHTML = `
        <strong>${escapeHtml(check.id || "check")}</strong>
        <span>${escapeHtml(check.ok ? "OK" : check.severity || "warning")}</span>
        <p>${escapeHtml(check.message || "")}</p>
      `;
      preflightList.appendChild(row);
    }
  }

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

  async function deleteFeedback(id) {
    const code = codeInput.value.trim();
    if (!code) {
      status.textContent = "Enter your feedback admin code first.";
      codeInput.focus();
      return;
    }

    status.textContent = "Deleting feedback entry...";
    try {
      const response = await fetch("/api/feedback/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TechSpec-Admin-Code": code
        },
        body: JSON.stringify({ id })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || result.message || "Feedback could not be deleted.");
      status.textContent = "Feedback entry deleted.";
      await loadFeedback();
    } catch (error) {
      status.textContent = error.message || "Feedback could not be deleted.";
    }
  }

  function renderFeedback(exportPayload) {
    if (!exportPayload) return;
    const entries = Array.isArray(exportPayload.feedback) ? exportPayload.feedback : [];
    populateCategoryFilter(entries);
    renderStats(entries);
    renderTriage(entries);
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
          <dt>ID</dt><dd>${escapeHtml(entry.id || "unknown")}</dd>
          <dt>Rating</dt><dd>${escapeHtml(entry.rating || "none")}</dd>
          <dt>Page</dt><dd>${escapeHtml(entry.page || "not provided")}</dd>
          <dt>Contact</dt><dd>${escapeHtml(entry.contact || "not provided")}</dd>
          <dt>Install ID</dt><dd>${escapeHtml(entry.installId || "unknown")}</dd>
          <dt>App version</dt><dd>${escapeHtml(entry.appVersion || "unknown")}</dd>
          <dt>Screen</dt><dd>${escapeHtml(entry.screen || "unknown")}</dd>
        </dl>
        <div class="feedback-entry-actions">
          <button class="button-link danger-action" type="button" data-delete-feedback-id="${escapeHtml(entry.id || "")}">Delete entry</button>
        </div>
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

  function renderTriage(entries) {
    if (!triagePanel) return;
    const triage = buildTriage(entries);
    triagePanel.replaceChildren(
      triageColumn("Needs attention", triage.needsAttention),
      triageColumn("Repeated categories", triage.categoryLines),
      triageColumn("Pages mentioned", triage.pageLines)
    );
  }

  function triageColumn(title, lines) {
    const section = document.createElement("section");
    section.className = "feedback-triage-card";
    const h3 = document.createElement("h3");
    h3.textContent = title;
    const listElement = document.createElement("ul");
    const values = lines.length ? lines : ["No signal yet"];
    for (const line of values.slice(0, 6)) {
      const item = document.createElement("li");
      item.textContent = line;
      listElement.appendChild(item);
    }
    section.append(h3, listElement);
    return section;
  }

  function buildTriage(entries) {
    const normalized = Array.isArray(entries) ? entries : [];
    const categoryCounts = countBy(normalized, entry => entry.category || "general");
    const pageCounts = countBy(normalized, entry => entry.page || "not provided");
    const lowRatings = normalized.filter(entry => Number(entry.rating) > 0 && Number(entry.rating) <= 2);
    const bugs = normalized.filter(entry => /bug|crash|error|broken|does not|did not|wrong|uncertain/i.test(`${entry.category || ""} ${entry.message || ""}`));
    const contactCount = normalized.filter(entry => entry.contact).length;
    const ratingValues = normalized.map(entry => Number(entry.rating)).filter(Number.isFinite);
    const averageRating = ratingValues.length
      ? (ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length).toFixed(1)
      : "none";

    return {
      total: normalized.length,
      generatedAt: new Date().toISOString(),
      averageRating,
      contactCount,
      lowRatingCount: lowRatings.length,
      bugSignalCount: bugs.length,
      needsAttention: [
        `${lowRatings.length} low-rating entries`,
        `${bugs.length} bug/wrong-result signals`,
        `${contactCount} entries with contact email`,
        averageRating === "none" ? "No ratings collected yet" : `Average rating ${averageRating} / 5`
      ],
      categoryLines: topCountLines(categoryCounts),
      pageLines: topCountLines(pageCounts),
      lowRatings: lowRatings.slice().reverse().slice(0, 8),
      bugSignals: bugs.slice().reverse().slice(0, 8)
    };
  }

  function buildTriageText(entries) {
    const triage = buildTriage(entries);
    const lines = [
      "TechSpec Scanner Beta Feedback Triage",
      `Generated: ${formatDate(triage.generatedAt)}`,
      `Entries: ${triage.total}`,
      `Average rating: ${triage.averageRating}`,
      `Low-rating entries: ${triage.lowRatingCount}`,
      `Bug/wrong-result signals: ${triage.bugSignalCount}`,
      `Entries with contact email: ${triage.contactCount}`,
      "",
      "Repeated categories:",
      ...prefixLines(triage.categoryLines),
      "",
      "Pages mentioned:",
      ...prefixLines(triage.pageLines),
      "",
      "Low-rating entries to review:",
      ...feedbackLines(triage.lowRatings),
      "",
      "Bug/wrong-result signals to review:",
      ...feedbackLines(triage.bugSignals)
    ];
    return lines.join("\n");
  }

  function countBy(entries, getKey) {
    const counts = new Map();
    for (const entry of entries) {
      const key = String(getKey(entry) || "not provided").trim() || "not provided";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }

  function topCountLines(counts) {
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([label, count]) => `${label}: ${count}`);
  }

  function prefixLines(lines) {
    return lines.length ? lines.map(line => `- ${line}`) : ["- No signal yet"];
  }

  function feedbackLines(entries) {
    if (!entries.length) return ["- None"];
    return entries.map(entry => [
      `- ${entry.createdAt || "unknown date"} | ${entry.category || "general"} | rating ${entry.rating || "none"} | ${entry.page || "not provided"}`,
      `  ${String(entry.message || "").replace(/\s+/g, " ").trim().slice(0, 220)}`
    ].join("\n"));
  }

  function statCard(label, value) {
    const card = document.createElement("div");
    card.className = "feedback-stat-card";
    card.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    return card;
  }

  function automationStatus(automation) {
    if (!automation) return "Unknown";
    if (automation.feedbackWebhookInvalid) return "Invalid URL";
    if (automation.feedbackWebhookConfigured) {
      return automation.feedbackWebhookHost
        ? `Enabled: ${automation.feedbackWebhookHost}`
        : "Enabled";
    }
    return "Off";
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
