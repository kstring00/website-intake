# Website Client Intake

A premium website-project discovery, scoping, and payment experience built with Next.js, TypeScript, and Stripe Checkout.

## What it does

- Premium landing page designed to be shareable directly with prospective clients
- Seven-step guided website intake instead of one overwhelming long form
- Browser autosave so prospects can leave and return without losing the draft
- Business, audience, goals, conversion, pages, functionality, brand, content, technical, SEO, budget, deadline, approval, and support questions
- Conditional questions for e-commerce, booking, client accounts, and memberships
- Automatic high-level project complexity classification
- Review screen before submission
- Downloadable JSON copy of the completed project brief
- Server-side submission endpoint
- Optional Resend email delivery of the full intake to the studio owner
- Server-side Stripe Checkout project-deposit flow
- Stripe `client_reference_id` and metadata connect the payment to the intake submission
- Stripe webhook endpoint for server-side payment completion handling
- Stripe payment confirmation page
- Responsive/mobile UI and reduced-motion support

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_DEPOSIT_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_AUTOMATIC_TAX=false

RESEND_API_KEY=re_...
INTAKE_NOTIFICATION_EMAIL=you@example.com
INTAKE_FROM_EMAIL=Website Intake <intake@yourdomain.com>

NEXT_PUBLIC_STUDIO_NAME=Your Web Studio
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
```

### Stripe setup

1. In Stripe Dashboard, create a Product such as **Website Project Deposit**.
2. Add a one-time Price at the deposit amount you want to collect.
3. Copy that `price_...` ID to `STRIPE_DEPOSIT_PRICE_ID`.
4. Add your Stripe secret key as `STRIPE_SECRET_KEY` in Vercel/project environment variables.
5. Add a Stripe webhook endpoint at `https://YOUR-DOMAIN/api/stripe/webhook` and subscribe it to `checkout.session.completed`.
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.
7. Keep test-mode keys, Price, and webhook while validating the flow.
8. Switch the secret key, Price ID, and webhook to live-mode values when you are ready to accept real payments.
9. Only set `STRIPE_AUTOMATIC_TAX=true` after Stripe Tax is configured for the account.

The Checkout route lives at `app/api/checkout/route.ts`. The browser never receives the secret key. The webhook route lives at `app/api/stripe/webhook/route.ts` and provides a server-side payment-completion path even if the customer closes the browser before the success page loads.

### Intake email delivery

The intake endpoint lives at `app/api/intake/route.ts`.

If `RESEND_API_KEY` and `INTAKE_NOTIFICATION_EMAIL` are configured, the full brief is emailed to you and the prospect's email is used as the reply-to address. The same email configuration is also used by the Stripe webhook to notify you when a project deposit completes.

If Resend is not configured, the route still works in development and logs the payload server-side. For production, configure delivery before sharing the site publicly.

## Customizing pricing and questions

Reusable option sets are in `lib/intake-config.ts`:

- budget ranges
- page types
- features
- website goals
- visual directions
- step labels

The full guided experience is in `components/intake-experience.tsx`.

## Recommended Vercel deployment

1. Import `kstring00/website-intake` into Vercel.
2. Add the environment variables above in Project Settings → Environment Variables.
3. Deploy with test Stripe keys first.
4. Submit a full test intake.
5. Complete a Stripe test Checkout.
6. Confirm the intake email, Stripe payment, webhook notification, success page, and project reference all match.
7. Switch to live Stripe values only after the end-to-end test works.

## Important business note

The form explicitly tells clients the intake is a discovery brief, not a binding quote, contract, guaranteed delivery date, or final scope. Your formal proposal/contract should still define scope, payment terms, revision limits, ownership, cancellation/refund terms, responsibilities, and launch conditions.
