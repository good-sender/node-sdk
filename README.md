# GoodSender SDK for Node.js / TypeScript

Official client library for the GoodSender email API. Package: `@goodsender/sdk`

## Quick start

```typescript
import { Configuration, EmailsApi, DomainsApi } from "@goodsender/sdk";

const config = new Configuration({
  basePath: "https://api.goodsender.com",
  accessToken: "YOUR_API_KEY",
});
const emails = new EmailsApi(config);
const domains = new DomainsApi(config);

const res = await emails.sendEmail({
  sendEmailRequest: {
    emails: [
      {
        from: { email: "sender@example.com", name: "Sender" },
        to: [{ email: "recipient@example.com", name: "Recipient" }],
        subject: "Hello",
        text_content: "Body",
      },
    ],
  },
});
console.log(`sent=${res.data.sent} declined=${res.data.declined}`);
```

## Examples

### Send via a template

```typescript
const res = await emails.sendTemplateEmail({
  templateEmailRequest: {
    from: { email: "sender@example.com", name: "Sender" },
    to: { email: "recipient@example.com", name: "Recipient" },
    subject: "Your OTP",
    template: { template_id: "otp_code", variables: { code: "123456" } },
  },
});
console.log(`status=${res.data.status}`);
```

### List domains

```typescript
const res = await domains.listDomains({ limit: 50 });
console.log(`domains=${res.data.domains.length}`);
```

### Check consent status

```typescript
const res = await emails.getEmailConsentStatus({ email: "user@example.com" });
console.log(`entries=${res.data.length}`);

// List all consents for a domain
const list = await emails.listEmailConsents({ domain: "example.com", limit: 50 });
console.log(`emails=${list.data.emails?.length ?? 0}`);
```

## Documentation

- API reference: <https://goodsender.com/docs>
- OpenAPI spec: `openapi/goodsender.yaml` in this repo
- Conformance tests: `tests/`

## Development

- Regenerate from spec: `scripts/regen.sh` (preserves `tests/`, `.github/`, and hand-curated files per `.regen-ignore`)
- Run conformance tests against local mock: `tests/run.sh mock`
- Run conformance against real dev API: `tests/run.sh dev` (requires `tests/.env.dev`)

## License

MIT — see [LICENSE](LICENSE).
