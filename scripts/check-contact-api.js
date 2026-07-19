const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = process.cwd();
const workerSource = fs.readFileSync(path.join(root, "src", "index.js"), "utf8");
const runnableSource = workerSource
  .replace("export default", "const worker =")
  .concat("\nglobalThis.__worker = worker;\n");

function createWorker(fetchMock = fetch) {
  const context = {
    console,
    URL,
    Request,
    Response,
    FormData,
    fetch: fetchMock,
    globalThis: {}
  };

  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(runnableSource, context, { filename: "src/index.js" });
  return context.__worker;
}

function jsonRequest(body, init = {}) {
  return new Request("https://agnezukiene.lt/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...init.headers
    },
    body: JSON.stringify(body)
  });
}

async function readJson(response) {
  return response.json();
}

function validPayload(overrides = {}) {
  return {
    name: "Testas",
    email: "test@example.com",
    phone: "",
    replyBy: "email",
    format: "unknown",
    topic: "other",
    message: "Trumpa testine zinute.",
    privacy: true,
    turnstileToken: "token",
    ...overrides
  };
}

async function main() {
  const worker = createWorker();

  {
    const response = await worker.fetch(new Request("https://www.agnezukiene.lt/kontaktai?is=www"), {});
    assert.strictEqual(response.status, 301, "www requests should redirect permanently to the main domain");
    assert.strictEqual(
      response.headers.get("location"),
      "https://agnezukiene.lt/kontaktai?is=www",
      "www redirect should preserve the path and query"
    );
    assert.strictEqual(
      response.headers.get("strict-transport-security"),
      "max-age=31536000",
      "www redirect should require secure connections"
    );
  }

  {
    const assetCalls = [];
    const response = await worker.fetch(new Request("https://agnezukiene.lt/neegzistuojantis-puslapis"), {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          assetCalls.push(url.pathname);
          if (url.pathname === "/404") {
            return new Response("<!doctype html><html lang=\"lt\"><body><h1>Puslapis nerastas</h1></body></html>", {
              status: 200,
              headers: { "content-type": "text/html; charset=utf-8" }
            });
          }
          return new Response("", { status: 404 });
        }
      }
    });
    const text = await response.text();
    assert.strictEqual(response.status, 404, "Unknown static GET paths should return a 404 status");
    assert.deepStrictEqual(assetCalls, ["/neegzistuojantis-puslapis", "/404"], "Worker should fetch the extensionless custom 404 page after an asset miss");
    assert(text.includes("<html lang=\"lt\">"), "Custom 404 fallback should return Lithuanian HTML");
    assert(text.includes("Puslapis nerastas"), "Custom 404 fallback should return the 404 content");
    assert(response.headers.get("x-content-type-options"), "Custom 404 fallback should include security headers");
    assert.strictEqual(response.headers.get("strict-transport-security"), "max-age=31536000", "Custom 404 should require secure connections");
  }

  {
    const response = await worker.fetch(new Request("https://agnezukiene.lt/api/contact"), {});
    assert.strictEqual(response.status, 405, "GET /api/contact should be rejected");
    assert(response.headers.get("x-content-type-options"), "API responses should include security headers");
    assert.strictEqual(response.headers.get("strict-transport-security"), "max-age=31536000", "API responses should require secure connections");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload(), {
      headers: { origin: "https://example.com" }
    }), { ALLOWED_ORIGIN: "https://agnezukiene.lt" });
    assert.strictEqual(response.status, 403, "Unexpected origin should be rejected");
  }

  {
    const response = await worker.fetch(new Request("https://agnezukiene.lt/api/contact", {
      method: "POST",
      body: JSON.stringify(validPayload())
    }), {});
    const body = await readJson(response);
    assert.strictEqual(response.status, 415, "Non-JSON contact requests should be rejected");
    assert(body.message.includes("JSON"), "Unsupported content type response should explain JSON requirement");
  }

  {
    const response = await worker.fetch(new Request("https://agnezukiene.lt/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "10001"
      },
      body: JSON.stringify(validPayload())
    }), {});
    const body = await readJson(response);
    assert.strictEqual(response.status, 413, "Oversized contact requests should be rejected");
    assert(body.message.includes("per didelis"), "Oversized response should explain the size problem");
  }

  {
    const response = await worker.fetch(new Request("https://agnezukiene.lt/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{"
    }), {});
    assert.strictEqual(response.status, 400, "Invalid JSON should be rejected");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload({ website: "bot.example" })), {});
    assert.strictEqual(response.status, 200, "Honeypot submissions should get a neutral success response");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload({ email: "", phone: "" })), {});
    const body = await readJson(response);
    assert.strictEqual(response.status, 400, "Missing contact method should be rejected");
    assert(body.message.includes("el. paštą arba telefoną"), "Missing contact response should explain the error");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload({ email: "", phone: "+37060000000", replyBy: "email" })), {});
    const body = await readJson(response);
    assert.strictEqual(response.status, 400, "Email reply choice should require an email address");
    assert(body.message.includes("įrašykite el. pašto adresą"), "Email reply mismatch should explain what is missing");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload({ email: "test@example.com", phone: "", replyBy: "phone" })), {});
    const body = await readJson(response);
    assert.strictEqual(response.status, 400, "Phone reply choice should require a phone number");
    assert(body.message.includes("įrašykite telefono numerį"), "Phone reply mismatch should explain what is missing");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload({ turnstileToken: "" })), {
      TURNSTILE_SECRET_KEY: "secret"
    });
    const body = await readJson(response);
    assert.strictEqual(response.status, 400, "Missing Turnstile token should be rejected when Turnstile secret is set");
    assert(body.message.includes("patvirtinti"), "Turnstile response should explain the verification failure");
  }

  {
    const response = await worker.fetch(jsonRequest(validPayload()), {});
    assert.strictEqual(response.status, 503, "Valid request should stay setup-pending until Resend variables are present");
  }

  {
    const calls = [];
    const workerWithFetch = createWorker(async (url, init = {}) => {
      calls.push({ url: String(url), init });
      if (String(url).includes("siteverify")) {
        return Response.json({ success: true });
      }
      if (String(url).includes("api.resend.com")) {
        return Response.json({ id: "email_test" });
      }
      return new Response("not found", { status: 404 });
    });

    const response = await workerWithFetch.fetch(jsonRequest(validPayload()), {
      TURNSTILE_SECRET_KEY: "secret",
      RESEND_API_KEY: "resend_test",
      CONTACT_TO_EMAIL: "zukiene.agne@gmail.com",
      CONTACT_FROM_EMAIL: "Agnė Žukienė <noreply@agnezukiene.lt>"
    });
    assert.strictEqual(response.status, 200, "Valid request should succeed when Turnstile and Resend are configured");

    const resendCall = calls.find((call) => call.url.includes("api.resend.com"));
    assert(resendCall, "Resend API should be called for configured valid requests");
    const resendPayload = JSON.parse(resendCall.init.body);
    assert.deepStrictEqual(resendPayload.to, ["zukiene.agne@gmail.com"], "Resend recipient should be the configured inbox");
    assert.strictEqual(resendPayload.reply_to, "test@example.com", "Resend reply_to should use the submitted email");
    assert(!("html" in resendPayload), "Resend payload should use plain text for the MVP");
  }

  console.log("Contact API check passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
