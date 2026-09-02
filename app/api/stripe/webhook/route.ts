import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info('Website project deposit completed', {
        sessionId: session.id,
        submissionId: session.client_reference_id,
        email: session.customer_details?.email || session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      });

      const resendKey = process.env.RESEND_API_KEY;
      const notificationEmail = process.env.INTAKE_NOTIFICATION_EMAIL;
      const from = process.env.INTAKE_FROM_EMAIL || 'Website Intake <onboarding@resend.dev>';

      if (resendKey && notificationEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [notificationEmail],
            subject: `Website deposit paid — ${session.metadata?.businessName || session.client_reference_id || session.id}`,
            html: `
              <div style="font-family:Arial,sans-serif;color:#111820">
                <p style="font-size:11px;font-weight:800;letter-spacing:.14em;color:#365b79">STRIPE PAYMENT RECEIVED</p>
                <h1 style="font-family:Georgia,serif;font-weight:500">Project deposit completed</h1>
                <p><strong>Business:</strong> ${session.metadata?.businessName || '—'}</p>
                <p><strong>Client:</strong> ${session.metadata?.clientName || '—'}</p>
                <p><strong>Email:</strong> ${session.customer_details?.email || session.customer_email || '—'}</p>
                <p><strong>Submission:</strong> ${session.client_reference_id || '—'}</p>
                <p><strong>Stripe session:</strong> ${session.id}</p>
              </div>`,
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error', error);
    return NextResponse.json({ error: 'Invalid webhook payload or signature.' }, { status: 400 });
  }
}
