/**
 * State-aware conformance test for the Node SDK against the real dev API.
 *
 * Unlike runner.ts (which just verifies every method is callable against a
 * Prism mock), this file exercises 17 scenarios that cover:
 *
 *   - Read-only state checks for granted / denied / unknown consent records
 *   - Domain verification state surfaced on listDomains
 *   - sendEmail behaviour against granted / denied / mixed recipients
 *   - sendTemplateEmail against granted / denied recipients
 *   - requestEmailConsent for fresh unknown addresses
 *   - Negative tests: unverified sender domain, bad template id, etc.
 *
 * Fixtures (loaded from tests/.env.dev — see tests/.env.example for the full
 * list and how to set them up in the dev dashboard).
 *
 * Destructive scenarios run only when ALLOW_DESTRUCTIVE=1.
 */

import {
  Configuration,
  DomainsApi,
  EmailsApi,
} from "@goodsender/sdk";

// ─── Fixtures from environment ───────────────────────────────────────

const required = (key: string): string => {
  const v = process.env[key];
  if (!v) {
    console.error(`FATAL: ${key} is not set in .env.dev`);
    process.exit(2);
  }
  return v;
};

const BASE_URL = required("BASE_URL");
const API_KEY = required("GOODSENDER_API_KEY");
const ALLOW_DESTRUCTIVE = process.env.ALLOW_DESTRUCTIVE === "1";

const VERIFIED_DOMAIN = required("VERIFIED_SENDER_DOMAIN");
const VERIFIED_EMAIL = required("VERIFIED_SENDER_EMAIL");
const VERIFIED_NAME = process.env.VERIFIED_SENDER_NAME ?? "GoodSender SDK Tests";
const UNVERIFIED_DOMAIN = required("UNVERIFIED_SENDER_DOMAIN");
const UNVERIFIED_EMAIL = required("UNVERIFIED_SENDER_EMAIL");
const GRANTED_1 = required("RECIPIENT_GRANTED_1");
const GRANTED_2 = required("RECIPIENT_GRANTED_2");
const DENIED_1 = required("RECIPIENT_DENIED_1");
const DENIED_2 = required("RECIPIENT_DENIED_2");
const TEMPLATE_ID = required("TEMPLATE_ID");

// Random suffix used for the "unknown / fresh" addresses generated per run.
// Keeps the run idempotent against the workspace: each run uses brand-new
// addresses for requestEmailConsent + bad-template-id probes.
const RUN_TAG = `sdk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const freshAddr = (slot: number) => `${RUN_TAG}-${slot}@${VERIFIED_DOMAIN}`;
const FRESH_1 = freshAddr(1);
const FRESH_2 = freshAddr(2);

const cfg = new Configuration({ basePath: BASE_URL, accessToken: API_KEY });
const emails = new EmailsApi(cfg);
const domains = new DomainsApi(cfg);

// ─── Result tracking ─────────────────────────────────────────────────

type Status = "PASS" | "FAIL" | "SKIP";
type Result = { id: string; name: string; status: Status; detail: string };
const results: Result[] = [];

function record(id: string, name: string, status: Status, detail: string) {
  results.push({ id, name, status, detail });
}

async function scenario(
  id: string,
  name: string,
  fn: () => Promise<{ ok: boolean; detail: string }>,
) {
  try {
    const { ok, detail } = await fn();
    record(id, name, ok ? "PASS" : "FAIL", detail);
  } catch (err: unknown) {
    record(id, name, "FAIL", `unexpected: ${describeError(err)}`);
  }
}

function describeError(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { message?: unknown; response?: { status?: number; data?: unknown } };
    if (e.response) {
      const body = JSON.stringify(e.response.data).slice(0, 160);
      return `HTTP ${e.response.status} ${body}`;
    }
    if (e.message) return String(e.message);
  }
  return String(err);
}

function httpStatus(err: unknown): number | undefined {
  if (err && typeof err === "object" && "response" in err) {
    return (err as { response?: { status?: number } }).response?.status;
  }
  return undefined;
}

function httpBody(err: unknown): unknown {
  if (err && typeof err === "object" && "response" in err) {
    return (err as { response?: { data?: unknown } }).response?.data;
  }
  return undefined;
}

// ─── Read-only scenarios (always run) ────────────────────────────────

await scenario("R1", "listDomains returns both fixtures with correct verification flags", async () => {
  const res = await domains.listDomains({ limit: 100 });
  const byName = new Map(res.data.domains.map((d) => [d.domain, d]));
  const v = byName.get(VERIFIED_DOMAIN);
  const u = byName.get(UNVERIFIED_DOMAIN);
  if (!v) return { ok: false, detail: `${VERIFIED_DOMAIN} not in listDomains response` };
  if (!u) return { ok: false, detail: `${UNVERIFIED_DOMAIN} not in listDomains response` };
  if (!v.verification?.verified) return { ok: false, detail: `${VERIFIED_DOMAIN} has verification.verified=false; should be true` };
  if (u.verification?.verified) return { ok: false, detail: `${UNVERIFIED_DOMAIN} has verification.verified=true; should be false` };
  return { ok: true, detail: `domains=${res.data.domains.length}, verified=${v.verification.verified}, unverified=${u.verification.verified}` };
});

await scenario("R2", "getEmailConsentStatus returns granted for approved recipient", async () => {
  const res = await emails.getEmailConsentStatus({ email: GRANTED_1, domain: VERIFIED_DOMAIN });
  const entry = res.data.find((e) => e.domain === VERIFIED_DOMAIN);
  if (!entry) return { ok: false, detail: `no entry for domain=${VERIFIED_DOMAIN}` };
  if (entry.consentStatus !== "granted") return { ok: false, detail: `consentStatus=${entry.consentStatus}, expected granted` };
  return { ok: true, detail: `consentStatus=${entry.consentStatus}` };
});

await scenario("R3", "getEmailConsentStatus returns denied for rejected recipient", async () => {
  const res = await emails.getEmailConsentStatus({ email: DENIED_1, domain: VERIFIED_DOMAIN });
  const entry = res.data.find((e) => e.domain === VERIFIED_DOMAIN);
  if (!entry) return { ok: false, detail: `no entry for domain=${VERIFIED_DOMAIN}` };
  if (entry.consentStatus !== "denied") return { ok: false, detail: `consentStatus=${entry.consentStatus}, expected denied` };
  return { ok: true, detail: `consentStatus=${entry.consentStatus}` };
});

await scenario("R4", "getEmailConsentStatus returns 404 for unknown recipient", async () => {
  const probe = `${RUN_TAG}-r4-probe@${VERIFIED_DOMAIN}`;
  try {
    const res = await emails.getEmailConsentStatus({ email: probe, domain: VERIFIED_DOMAIN });
    return { ok: false, detail: `expected 404, got ${res.status} with ${res.data.length} entries` };
  } catch (err) {
    const status = httpStatus(err);
    if (status === 404) return { ok: true, detail: `404 (probe=${probe})` };
    return { ok: false, detail: `expected 404, got ${describeError(err)}` };
  }
});

await scenario("R5", "listEmailConsents for verified domain includes all 4 fixtures", async () => {
  const collected: string[] = [];
  let cursor: string | undefined;
  // Page through; fixtures should appear within the first few pages even if
  // the workspace has accumulated leftover state from prior runs.
  for (let page = 0; page < 20; page++) {
    const res = await emails.listEmailConsents({ domain: VERIFIED_DOMAIN, limit: 100, cursor });
    for (const e of res.data.emails ?? []) collected.push(e.email);
    cursor = res.data.nextCursor;
    if (!cursor) break;
  }
  const expected = [GRANTED_1, GRANTED_2, DENIED_1, DENIED_2];
  const missing = expected.filter((e) => !collected.includes(e));
  if (missing.length > 0) return { ok: false, detail: `missing from listEmailConsents: ${missing.join(", ")}` };
  return { ok: true, detail: `${collected.length} entries scanned; all 4 fixtures present` };
});

await scenario("R6", "listEmailConsents with consentStatus=granted filter excludes denied", async () => {
  const collected = new Set<string>();
  const statuses = new Set<string>();
  let cursor: string | undefined;
  let pages = 0;
  for (let page = 0; page < 20; page++) {
    const res = await emails.listEmailConsents({ domain: VERIFIED_DOMAIN, consentStatus: "granted", limit: 100, cursor });
    pages++;
    for (const e of res.data.emails ?? []) {
      collected.add(e.email);
      statuses.add(e.consentStatus);
    }
    cursor = res.data.nextCursor;
    if (!cursor) break;
  }
  if (statuses.size > 1 || (statuses.size === 1 && !statuses.has("granted"))) {
    return { ok: false, detail: `filter leaked non-granted statuses: ${[...statuses].join(",")}` };
  }
  const missing = [GRANTED_1, GRANTED_2].filter((e) => !collected.has(e));
  if (missing.length > 0) {
    const sample = [...collected].slice(0, 5).join(", ") || "(none)";
    return {
      ok: false,
      detail: `filter returned ${collected.size} entries across ${pages} page(s); missing=${missing.join(",")}; sample=[${sample}]`,
    };
  }
  if (collected.has(DENIED_1) || collected.has(DENIED_2)) {
    return { ok: false, detail: `denied fixtures leaked into granted filter` };
  }
  return { ok: true, detail: `${collected.size} granted entries; denied fixtures absent` };
});

// ─── Destructive scenarios (gated by ALLOW_DESTRUCTIVE) ──────────────

if (ALLOW_DESTRUCTIVE) {
  await scenario("D1", "sendEmail to 2 granted recipients delivers both", async () => {
    const res = await emails.sendEmail({
      sendEmailRequest: {
        emails: [{
          from: { email: VERIFIED_EMAIL, name: VERIFIED_NAME },
          to: [{ email: GRANTED_1 }, { email: GRANTED_2 }],
          subject: `SDK conformance D1 ${RUN_TAG}`,
          text_content: "Conformance test D1 — to granted recipients.",
        }],
      },
    });
    if (res.data.sent !== 2 || res.data.declined !== 0) {
      return { ok: false, detail: `sent=${res.data.sent} declined=${res.data.declined}, expected 2/0` };
    }
    return { ok: true, detail: `sent=${res.data.sent} declined=${res.data.declined}` };
  });

  await scenario("D2", "sendEmail to 2 denied recipients declines both", async () => {
    const res = await emails.sendEmail({
      sendEmailRequest: {
        emails: [{
          from: { email: VERIFIED_EMAIL, name: VERIFIED_NAME },
          to: [{ email: DENIED_1 }, { email: DENIED_2 }],
          subject: `SDK conformance D2 ${RUN_TAG}`,
          text_content: "Conformance test D2 — to denied recipients.",
        }],
      },
    });
    if (res.data.sent !== 0 || res.data.declined !== 2) {
      return { ok: false, detail: `sent=${res.data.sent} declined=${res.data.declined}, expected 0/2` };
    }
    return { ok: true, detail: `sent=${res.data.sent} declined=${res.data.declined}` };
  });

  await scenario("D3", "sendEmail to granted+denied mix splits correctly", async () => {
    const res = await emails.sendEmail({
      sendEmailRequest: {
        emails: [{
          from: { email: VERIFIED_EMAIL, name: VERIFIED_NAME },
          to: [{ email: GRANTED_1 }, { email: DENIED_1 }],
          subject: `SDK conformance D3 ${RUN_TAG}`,
          text_content: "Conformance test D3 — mixed recipients.",
        }],
      },
    });
    if (res.data.sent !== 1 || res.data.declined !== 1) {
      return { ok: false, detail: `sent=${res.data.sent} declined=${res.data.declined}, expected 1/1` };
    }
    return { ok: true, detail: `sent=${res.data.sent} declined=${res.data.declined}` };
  });

  await scenario("D4", "sendTemplateEmail to granted recipient returns status=sent", async () => {
    const res = await emails.sendTemplateEmail({
      templateEmailRequest: {
        from: { email: VERIFIED_EMAIL, name: VERIFIED_NAME },
        to: { email: GRANTED_1 },
        subject: `SDK conformance D4 ${RUN_TAG}`,
        template: { template_id: TEMPLATE_ID, variables: {} },
      },
    });
    if (res.data.status !== "sent") {
      return { ok: false, detail: `status=${res.data.status}, expected sent` };
    }
    return { ok: true, detail: `status=${res.data.status}` };
  });

  await scenario("D5", "sendTemplateEmail to denied recipient returns status=declined", async () => {
    const res = await emails.sendTemplateEmail({
      templateEmailRequest: {
        from: { email: VERIFIED_EMAIL, name: VERIFIED_NAME },
        to: { email: DENIED_1 },
        subject: `SDK conformance D5 ${RUN_TAG}`,
        template: { template_id: TEMPLATE_ID, variables: {} },
      },
    });
    if (res.data.status !== "declined") {
      return { ok: false, detail: `status=${res.data.status}, expected declined` };
    }
    return { ok: true, detail: `status=${res.data.status}` };
  });

  await scenario("D6", "requestEmailConsent registers 2 fresh addresses", async () => {
    const res = await emails.requestEmailConsent({
      consentEmailRequest: {
        domain: VERIFIED_DOMAIN,
        emails: [
          { email: FRESH_1, name: "SDK Conformance Fresh 1" },
          { email: FRESH_2, name: "SDK Conformance Fresh 2" },
        ],
      },
    });
    const entries = res.data.emails ?? [];
    if (entries.length !== 2) {
      return { ok: false, detail: `expected 2 entries in ConsentEmailResult.emails, got ${entries.length}` };
    }
    const statuses = entries.map((e) => e.consentStatus).sort();
    return { ok: true, detail: `2 fresh addresses; statuses=[${statuses.join(",")}] ${FRESH_1} ${FRESH_2}` };
  });

  // ─── Negative tests — discovery mode ────────────────────────────────
  // For now we only assert that a 4xx/5xx came back, and surface the actual
  // status + body. Once we know the canonical error shapes we tighten these.

  await scenario("E1", "sendEmail from unverified domain is rejected", async () => {
    try {
      const res = await emails.sendEmail({
        sendEmailRequest: {
          emails: [{
            from: { email: UNVERIFIED_EMAIL },
            to: [{ email: GRANTED_1 }],
            subject: `SDK conformance E1 ${RUN_TAG}`,
            text_content: "Should be rejected — unverified domain.",
          }],
        },
      });
      return { ok: false, detail: `expected 4xx, got ${res.status} sent=${res.data.sent}` };
    } catch (err) {
      const status = httpStatus(err);
      if (status && status >= 400 && status < 500) {
        return { ok: true, detail: `${status} ${JSON.stringify(httpBody(err)).slice(0, 120)}` };
      }
      return { ok: false, detail: `expected 4xx, got ${describeError(err)}` };
    }
  });

  await scenario("E2", "sendTemplateEmail from unverified domain is rejected", async () => {
    try {
      const res = await emails.sendTemplateEmail({
        templateEmailRequest: {
          from: { email: UNVERIFIED_EMAIL },
          to: { email: GRANTED_1 },
          subject: `SDK conformance E2 ${RUN_TAG}`,
          template: { template_id: TEMPLATE_ID, variables: {} },
        },
      });
      return { ok: false, detail: `expected 4xx, got ${res.status} status=${res.data.status}` };
    } catch (err) {
      const status = httpStatus(err);
      if (status && status >= 400 && status < 500) {
        return { ok: true, detail: `${status} ${JSON.stringify(httpBody(err)).slice(0, 120)}` };
      }
      return { ok: false, detail: `expected 4xx, got ${describeError(err)}` };
    }
  });

  await scenario("E3", "sendTemplateEmail with bogus template_id returns 404", async () => {
    const badTemplate = `${RUN_TAG}-does-not-exist`;
    try {
      const res = await emails.sendTemplateEmail({
        templateEmailRequest: {
          from: { email: VERIFIED_EMAIL },
          to: { email: GRANTED_1 },
          subject: `SDK conformance E3 ${RUN_TAG}`,
          template: { template_id: badTemplate, variables: {} },
        },
      });
      return { ok: false, detail: `expected 404, got ${res.status} status=${res.data.status}` };
    } catch (err) {
      const status = httpStatus(err);
      if (status === 404) {
        return { ok: true, detail: `404 ${JSON.stringify(httpBody(err)).slice(0, 120)}` };
      }
      return { ok: false, detail: `expected 404, got ${describeError(err)}` };
    }
  });

  await scenario("E4", "requestEmailConsent for unverified domain is rejected", async () => {
    const fresh = `${RUN_TAG}-e4-target@example.com`;
    try {
      const res = await emails.requestEmailConsent({
        consentEmailRequest: {
          domain: UNVERIFIED_DOMAIN,
          emails: [{ email: fresh }],
        },
      });
      return { ok: false, detail: `expected 4xx, got ${res.status}` };
    } catch (err) {
      const status = httpStatus(err);
      if (status && status >= 400 && status < 500) {
        return { ok: true, detail: `${status} ${JSON.stringify(httpBody(err)).slice(0, 120)}` };
      }
      return { ok: false, detail: `expected 4xx, got ${describeError(err)}` };
    }
  });

  await scenario("E5", "listEmailConsents for non-existent domain", async () => {
    const bogus = `not-a-real-domain-${RUN_TAG}.invalid`;
    try {
      const res = await emails.listEmailConsents({ domain: bogus, limit: 1 });
      // Per spec this may also return 200 with an empty result. Both are
      // acceptable; record which one the API actually does.
      return { ok: true, detail: `200 emails=${res.data.emails?.length ?? 0} (no error path for unknown domain)` };
    } catch (err) {
      const status = httpStatus(err);
      if (status && status >= 400 && status < 500) {
        return { ok: true, detail: `${status} ${JSON.stringify(httpBody(err)).slice(0, 120)}` };
      }
      return { ok: false, detail: `unexpected: ${describeError(err)}` };
    }
  });
} else {
  for (const [id, name] of [
    ["D1", "sendEmail to 2 granted recipients"],
    ["D2", "sendEmail to 2 denied recipients"],
    ["D3", "sendEmail granted+denied mix"],
    ["D4", "sendTemplateEmail to granted"],
    ["D5", "sendTemplateEmail to denied"],
    ["D6", "requestEmailConsent for 2 fresh addresses"],
    ["E1", "sendEmail from unverified domain rejected"],
    ["E2", "sendTemplateEmail from unverified domain rejected"],
    ["E3", "sendTemplateEmail with bogus template_id"],
    ["E4", "requestEmailConsent for unverified domain rejected"],
    ["E5", "listEmailConsents for non-existent domain"],
  ] as const) {
    record(id, name, "SKIP", "destructive — set ALLOW_DESTRUCTIVE=1");
  }
}

// ─── Report ──────────────────────────────────────────────────────────

for (const r of results) {
  console.log(`${r.status.padEnd(4)}  node  ${r.id}  ${r.name.padEnd(58).slice(0, 58)}  ${r.detail}`);
}

const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.filter((r) => r.status === "FAIL").length;
const skipped = results.filter((r) => r.status === "SKIP").length;
console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
if (ALLOW_DESTRUCTIVE) {
  console.log(`\nDestructive run created consent records for cleanup:\n  ${FRESH_1}\n  ${FRESH_2}`);
}

if (failed > 0) process.exit(1);
