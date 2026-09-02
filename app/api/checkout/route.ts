import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_DEPOSIT_PRICE_ID;

    if (!secretKey || !priceId) {
      return NextResponse.json({
        error: 'Project deposit checkout has not been configured yet. Add STRIPE_SECRET_KEY and STRIPE_DEPOSIT_PRICE_ID in the deployment environment.',
      }, { status: 503 });
    }

    const body = await request.json();
    if (!body?.submissionId || !body?.email) {
      return NextResponse.json({ error: 'A submitted project brief is required before payment.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
    const origin = configuredUrl || new URL(request.url).origin;
    const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === 'true';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: body.email,
      customer_creation: 'always',
      client_reference_id: String(body.submissionId).slice(0, 200),
      metadata: {
        submissionId: String(body.submissionId).slice(0, 500),
        clientName: String(body.name || '').slice(0, 500),
        businessName: String(body.businessName || '').slice(0, 500),
        statedBudget: String(body.budget || '').slice(0, 500),
      },
      billing_address_collection: 'auto',
      automatic_tax: automaticTax ? { enabled: true } : undefined,
      invoice_creation: { enabled: true },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled#intake`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a Checkout URL.' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error', error);
    return NextResponse.json({ error: 'Could not start Stripe Checkout. Please try again.' }, { status: 500 });
  }
}
