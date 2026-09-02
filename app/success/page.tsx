import Link from 'next/link';
import Stripe from 'stripe';
import { ArrowLeft, CheckCircle2, ReceiptText } from 'lucide-react';

export const runtime = 'nodejs';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;
  const sessionId = params.session_id;
  let paid = false;
  let amount = '';
  let email = '';
  let reference = '';

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === 'paid';
      email = session.customer_details?.email || session.customer_email || '';
      reference = session.client_reference_id || '';
      if (typeof session.amount_total === 'number' && session.currency) {
        amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: session.currency.toUpperCase() }).format(session.amount_total / 100);
      }
    } catch (error) {
      console.error('Could not retrieve Checkout Session', error);
    }
  }

  return <main className="payment-success-page">
    <section className="payment-success-card">
      <div className="payment-orbit" aria-hidden="true"><i/><i/><i/></div>
      <div className="payment-icon"><CheckCircle2 size={26}/></div>
      <p className="kicker">PROJECT RESERVED</p>
      <h1>{paid ? 'Payment received.' : 'Checkout complete.'}</h1>
      <p className="payment-lede">Your project brief and payment now share one reference, connecting the right payment to the right build from day one.</p>
      <div className="payment-details">
        {amount && <div><span>AMOUNT</span><strong>{amount}</strong></div>}
        {email && <div><span>EMAIL</span><strong>{email}</strong></div>}
        {reference && <div><span>PROJECT REFERENCE</span><strong>{reference}</strong></div>}
      </div>
      <div className="payment-receipt"><ReceiptText size={15}/> Stripe will provide the receipt associated with this Checkout session.</div>
      <Link href="/" className="secondary"><ArrowLeft size={15}/> Back to project intake</Link>
    </section>
  </main>;
}
