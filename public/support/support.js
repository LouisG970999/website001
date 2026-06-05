(function () {
  const config = window.TechSpecSupport || {};

  for (const element of document.querySelectorAll("[data-support-field]")) {
    const key = element.dataset.supportField;
    const value = config[key] || "";
    if (element.tagName === "A") {
      element.textContent = value;
      if (key === "supportEmail") {
        element.href = `mailto:${value}`;
      } else if (/Url$/.test(key) || key === "supportWebsite") {
        element.href = value;
      }
    } else {
      element.textContent = value;
    }
  }

  for (const link of document.querySelectorAll("[data-support-href]")) {
    const key = link.dataset.supportHref;
    if (config[key]) {
      link.href = config[key];
    }
  }
}());
