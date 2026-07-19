(function () {
  const config = window.AGNE_SITE_CONFIG || {};

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const initAnalytics = () => {
    if (!config.ga4MeasurementId || window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", config.ga4MeasurementId, {
      anonymize_ip: true,
      send_page_view: true
    });

    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`)
      .catch(() => {});
  };

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#main-menu");

  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Atidaryti meniu");
      navLinks.classList.remove("is-open");
    };

    navToggle.setAttribute("aria-label", "Atidaryti meniu");

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Atidaryti meniu" : "Uždaryti meniu");
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (navLinks.classList.contains("is-open") && event.target instanceof Element && !event.target.closest(".nav")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) closeMenu();
    });
  }

  const track = (eventName, params) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  };

  document.querySelectorAll("[data-event]").forEach((element) => {
    element.addEventListener("click", () => {
      track(element.getAttribute("data-event"), {
        source_page: window.location.pathname
      });
    });
  });

  document.querySelectorAll("[data-track-select]").forEach((element) => {
    element.addEventListener("change", () => {
      if (!element.value) return;
      track(element.getAttribute("data-track-select"), {
        source_page: window.location.pathname
      });
    });
  });

  const cookieBanner = document.querySelector("[data-cookie-banner]");
  const acceptCookies = document.querySelector("[data-cookie-accept]");
  const declineCookies = document.querySelector("[data-cookie-decline]");
  const resetCookies = document.querySelector("[data-cookie-reset]");
  const cookieChoice = localStorage.getItem("agne_cookie_choice");

  if (cookieBanner && !cookieChoice) {
    cookieBanner.hidden = false;
  }

  const setCookieChoice = (choice) => {
    localStorage.setItem("agne_cookie_choice", choice);
    if (cookieBanner) cookieBanner.hidden = true;
    if (choice === "accepted") initAnalytics();
    window.dispatchEvent(new CustomEvent("analytics-consent", { detail: choice }));

    const choiceStatus = document.querySelector("[data-cookie-choice-status]");
    if (choiceStatus) {
      choiceStatus.textContent = choice === "accepted"
        ? "Pasirinkimas išsaugotas: lankomumo matavimas leidžiamas."
        : "Pasirinkimas išsaugotas: lankomumo matavimas neleidžiamas.";
    }
  };

  if (cookieChoice === "accepted") {
    initAnalytics();
  }

  if (acceptCookies) {
    acceptCookies.addEventListener("click", () => setCookieChoice("accepted"));
  }

  if (declineCookies) {
    declineCookies.addEventListener("click", () => setCookieChoice("declined"));
  }

  if (resetCookies) {
    resetCookies.addEventListener("click", () => {
      localStorage.removeItem("agne_cookie_choice");
      if (cookieBanner) cookieBanner.hidden = false;
      const choiceStatus = document.querySelector("[data-cookie-choice-status]");
      if (choiceStatus) choiceStatus.textContent = "Pasirinkite iš naujo žemiau pateiktame pranešime.";
      window.dispatchEvent(new CustomEvent("analytics-consent", { detail: "reset" }));
    });
  }

  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form-status");
  const turnstileContainer = document.querySelector("[data-turnstile]");
  const turnstileToken = document.querySelector("#turnstile-token");
  let formStarted = false;
  let turnstileWidgetId = null;

  if (form && status) {
    if (config.turnstileSiteKey && turnstileContainer && turnstileToken) {
      window.onloadTurnstileCallback = function () {
        turnstileWidgetId = window.turnstile.render(turnstileContainer, {
          sitekey: config.turnstileSiteKey,
          callback: (token) => {
            turnstileToken.value = token;
          },
          "expired-callback": () => {
            turnstileToken.value = "";
          }
        });
      };

      loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback")
        .catch(() => {
          status.classList.add("is-error");
          status.textContent = "Nepavyko įkelti formos apsaugos. Pabandykite vėliau arba parašykite el. paštu.";
        });
    }

    const resetTurnstile = () => {
      if (turnstileToken) turnstileToken.value = "";
      if (window.turnstile && turnstileWidgetId !== null) {
        window.turnstile.reset(turnstileWidgetId);
      }
    };

    const readResponseMessage = async (response) => {
      try {
        const body = await response.json();
        return body && typeof body.message === "string" ? body.message : "";
      } catch (error) {
        return "";
      }
    };

    const validationFields = form.querySelectorAll("input:not([type='hidden']), select, textarea");
    const markFieldInvalid = (field) => {
      if (field) field.setAttribute("aria-invalid", "true");
    };
    const clearInvalidFields = () => {
      validationFields.forEach((field) => field.removeAttribute("aria-invalid"));
    };

    validationFields.forEach((field) => {
      const clearFieldError = () => field.removeAttribute("aria-invalid");
      field.addEventListener("input", clearFieldError);
      field.addEventListener("change", clearFieldError);
    });

    form.addEventListener("input", () => {
      if (!formStarted) {
        formStarted = true;
        track("form_start", { form_id: "contact", source_page: window.location.pathname });
      }
    }, { once: true });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.className = "form-status";
      status.textContent = "";
      clearInvalidFields();

      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const replyBy = String(data.get("replyBy") || "");
      const emailInput = form.querySelector("#email");
      const phoneInput = form.querySelector("#phone");

      if (!email && !phone) {
        status.classList.add("is-error");
        status.textContent = "Įrašykite el. paštą arba telefono numerį, kad būtų galima jums atsakyti.";
        track("form_error", { form_id: "contact", error_type: "missing_contact" });
        markFieldInvalid(emailInput);
        markFieldInvalid(phoneInput);
        if (emailInput) emailInput.focus();
        return;
      }

      if (replyBy === "email" && !email) {
        status.classList.add("is-error");
        status.textContent = "Pasirinkote atsakymą el. paštu, todėl įrašykite el. pašto adresą.";
        track("form_error", { form_id: "contact", error_type: "missing_email" });
        markFieldInvalid(emailInput);
        if (emailInput) emailInput.focus();
        return;
      }

      if (replyBy === "phone" && !phone) {
        status.classList.add("is-error");
        status.textContent = "Pasirinkote atsakymą telefonu, todėl įrašykite telefono numerį.";
        track("form_error", { form_id: "contact", error_type: "missing_phone" });
        markFieldInvalid(phoneInput);
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!form.checkValidity()) {
        const firstInvalidField = form.querySelector(":invalid");
        status.classList.add("is-error");
        status.textContent = "Patikrinkite privalomus laukus ir pabandykite dar kartą.";
        track("form_error", { form_id: "contact", error_type: "invalid_fields" });
        markFieldInvalid(firstInvalidField);
        form.reportValidity();
        return;
      }

      const payload = Object.fromEntries(data.entries());
      const submit = form.querySelector("button[type='submit']");
      const submitLabel = submit ? submit.getAttribute("data-submit-label") || submit.textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.setAttribute("aria-busy", "true");
        submit.textContent = "Siunčiama...";
      }
      form.setAttribute("aria-busy", "true");
      status.textContent = "Siunčiama...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const message = await readResponseMessage(response);
          throw new Error(message || "Šiuo metu formos išsiųsti nepavyko.");
        }

        form.reset();
        clearInvalidFields();
        resetTurnstile();
        status.classList.add("is-success");
        status.textContent = "Užklausa išsiųsta. Ačiū, kad parašėte.";
        track("generate_lead", { form_id: "contact", source_page: window.location.pathname });
      } catch (error) {
        resetTurnstile();
        status.classList.add("is-error");
        status.textContent = `${error.message} Jei reikia, parašykite tiesiogiai el. paštu: zukiene.agne@gmail.com.`;
        track("form_error", { form_id: "contact", error_type: "submit_failed" });
      } finally {
        form.removeAttribute("aria-busy");
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute("aria-busy");
          submit.textContent = submitLabel;
        }
      }
    });
  }
})();
