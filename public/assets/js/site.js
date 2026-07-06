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
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
      }
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
  const cookieChoice = localStorage.getItem("agne_cookie_choice");

  if (cookieBanner && !cookieChoice) {
    cookieBanner.hidden = false;
  }

  const setCookieChoice = (choice) => {
    localStorage.setItem("agne_cookie_choice", choice);
    if (cookieBanner) cookieBanner.hidden = true;
    if (choice === "accepted") initAnalytics();
    window.dispatchEvent(new CustomEvent("analytics-consent", { detail: choice }));
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

  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form-status");
  const turnstileContainer = document.querySelector("[data-turnstile]");
  const turnstileToken = document.querySelector("#turnstile-token");
  let formStarted = false;

  if (form && status) {
    if (config.turnstileSiteKey && turnstileContainer && turnstileToken) {
      window.onloadTurnstileCallback = function () {
        window.turnstile.render(turnstileContainer, {
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

      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();

      if (!email && !phone) {
        status.classList.add("is-error");
        status.textContent = "Įrašykite el. paštą arba telefono numerį, kad būtų galima jums atsakyti.";
        track("form_error", { form_id: "contact", error_type: "missing_contact" });
        return;
      }

      if (!form.checkValidity()) {
        status.classList.add("is-error");
        status.textContent = "Patikrinkite privalomus laukus ir pabandykite dar kartą.";
        track("form_error", { form_id: "contact", error_type: "invalid_fields" });
        form.reportValidity();
        return;
      }

      const payload = Object.fromEntries(data.entries());
      const submit = form.querySelector("button[type='submit']");
      if (submit) submit.disabled = true;
      status.textContent = "Siunčiama...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        form.reset();
        status.classList.add("is-success");
        status.textContent = "Užklausa išsiųsta. Ačiū, kad parašėte.";
        track("generate_lead", { form_id: "contact", source_page: window.location.pathname });
      } catch (error) {
        status.classList.add("is-error");
        status.textContent = "Šiuo metu formos išsiųsti nepavyko. Parašykite tiesiogiai el. paštu: zukiene.agne@gmail.com.";
        track("form_error", { form_id: "contact", error_type: "submit_failed" });
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
})();
