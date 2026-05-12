/**
 * Smoke-tests every GoodSender SDK method.
 *
 * Modes:
 *   mock  — pointed at a local Prism mock; safe for every method.
 *   dev   — pointed at https://api.dev.goodsender.com; sendEmail,
 *           sendTemplateEmail, and requestEmailConsent are SKIPPED unless
 *           ALLOW_DESTRUCTIVE=1 is set in the environment.
 *
 * Env vars (loaded by tests/run.sh from tests/.env.dev when running dev mode):
 *   BASE_URL              — required. Where to send requests.
 *   GOODSENDER_API_KEY    — required.
 *   ALLOW_DESTRUCTIVE     — "1" to opt into the 3 destructive methods.
 *   SENDER_EMAIL          — sender address whose domain is registered.
 *   SENDER_NAME           — display name on the from address.
 *   TEST_RECIPIENT_EMAIL  — recipient to send test mail to.
 *   TEST_RECIPIENT_NAME   — display name on the recipient.
 *   TEMPLATE_ID           — template id for sendTemplateEmail.
 *
 * Exits 0 only if every method that ran returned a 2xx and the response
 * parsed cleanly into the SDK's typed model. Skipped methods don't fail
 * the run.
 */

import {
  Configuration,
  DomainsApi,
  EmailsApi,
} from "@goodsender/sdk";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.GOODSENDER_API_KEY;
const ALLOW_DESTRUCTIVE = process.env.ALLOW_DESTRUCTIVE === "1";

if (!BASE_URL) {
  console.error("FATAL: BASE_URL is not set");
  process.exit(2);
}
if (!API_KEY) {
  console.error("FATAL: GOODSENDER_API_KEY is not set");
  process.exit(2);
}

const SENDER_EMAIL = process.env.SENDER_EMAIL ?? "sender@example.com";
const SENDER_NAME = process.env.SENDER_NAME ?? "GoodSender SDK Tests";
const RECIPIENT_EMAIL = process.env.TEST_RECIPIENT_EMAIL ?? "recipient@example.com";
const RECIPIENT_NAME = process.env.TEST_RECIPIENT_NAME ?? "SDK Test Recipient";
const TEMPLATE_ID = process.env.TEMPLATE_ID ?? "otp_code";

const config = new Configuration({
  basePath: BASE_URL,
  accessToken: API_KEY,
});
const emails = new EmailsApi(config);
const domains = new DomainsApi(config);

type Status = "PASS" | "FAIL" | "SKIP";
type Result = { method: string; status: Status; detail: string };
const results: Result[] = [];

async function run(method: string, fn: () => Promise<string>) {
  try {
    const detail = await fn();
    results.push({ method, status: "PASS", detail });
  } catch (err: unknown) {
    const detail =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : String(err);
    results.push({ method, status: "FAIL", detail });
  }
}

function skip(method: string, reason: string) {
  results.push({ method, status: "SKIP", detail: reason });
}

// --- read-only methods (safe everywhere) -------------------------------

await run("listDomains", async () => {
  const res = await domains.listDomains({ limit: 50 });
  return `status=${res.status} domains=${res.data.domains.length}`;
});

await run("listEmailConsents", async () => {
  // listEmailConsents requires a domain query param. Use the first domain
  // returned by listDomains; fall back to "example.com" for mock mode where
  // the domain doesn't have to exist.
  let domain = "example.com";
  try {
    const list = await domains.listDomains({ limit: 1 });
    if (list.data.domains[0]?.domain) {
      domain = list.data.domains[0].domain;
    }
  } catch {
    // ignore — keep the fallback
  }
  const res = await emails.listEmailConsents({ domain, limit: 50 });
  return `status=${res.status} domain=${domain} emails=${res.data.emails?.length ?? 0}`;
});

await run("getEmailConsentStatus", async () => {
  // Use an address that is guaranteed not to exist. Against the real API
  // this returns 404 — which is the documented behaviour and *not* a bug.
  const probe = `sdk-smoke-test-${Date.now()}@example.com`;
  try {
    const res = await emails.getEmailConsentStatus({ email: probe });
    return `status=${res.status} entries=${res.data.length}`;
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "response" in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined;
    if (status === 404) {
      // Expected — the probe address doesn't exist.
      return `status=404 (unknown recipient — expected)`;
    }
    throw err;
  }
});

// --- destructive methods (gated by ALLOW_DESTRUCTIVE) ------------------

if (ALLOW_DESTRUCTIVE) {
  await run("sendEmail", async () => {
    const res = await emails.sendEmail({
      sendEmailRequest: {
        emails: [
          {
            from: { email: SENDER_EMAIL, name: SENDER_NAME },
            to: [{ email: RECIPIENT_EMAIL, name: RECIPIENT_NAME }],
            subject: "GoodSender SDK smoke test",
            text_content: "This is a test email from the SDK smoke tests.",
          },
        ],
      },
    });
    return `status=${res.status} sent=${res.data.sent} declined=${res.data.declined}`;
  });

  await run("sendTemplateEmail", async () => {
    const res = await emails.sendTemplateEmail({
      templateEmailRequest: {
        from: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: { email: RECIPIENT_EMAIL, name: RECIPIENT_NAME },
        subject: "GoodSender SDK template smoke test",
        template: { template_id: TEMPLATE_ID, variables: {} },
      },
    });
    return `status=${res.status} body.status=${res.data.status}`;
  });

  await run("requestEmailConsent", async () => {
    const res = await emails.requestEmailConsent({
      consentEmailRequest: {
        domain: SENDER_EMAIL.split("@")[1] ?? "example.com",
        emails: [{ email: RECIPIENT_EMAIL, name: RECIPIENT_NAME }],
      },
    });
    return `status=${res.status} accounts=${res.data.accounts?.length ?? 0}`;
  });
} else {
  skip("sendEmail", "destructive — set ALLOW_DESTRUCTIVE=1");
  skip("sendTemplateEmail", "destructive — set ALLOW_DESTRUCTIVE=1");
  skip("requestEmailConsent", "destructive — set ALLOW_DESTRUCTIVE=1");
}

// --- report -----------------------------------------------------------

for (const r of results) {
  console.log(`${r.status.padEnd(4)}  node  ${r.method.padEnd(22)}  ${r.detail}`);
}

const failed = results.filter((r) => r.status === "FAIL").length;
const passed = results.filter((r) => r.status === "PASS").length;
const skipped = results.filter((r) => r.status === "SKIP").length;
console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);

if (failed > 0) process.exit(1);
