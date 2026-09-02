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
    <style>{`
      .payment-success-page{min-height:100vh;display:grid;place-items:center;padding:28px;background:radial-gradient(circle at 70% 20%,rgba(201,168,92,.11),transparent 25%),#10100e;color:#f0ede6;position:relative;overflow:hidden}.payment-success-page:before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(circle at center,#000,transparent 70%)}.payment-success-card{width:min(760px,100%);border:1px solid #37352e;background:#171714;padding:clamp(38px,7vw,76px);position:relative;overflow:hidden;z-index:2}.payment-orbit{position:absolute;right:-100px;top:-100px;width:360px;height:360px}.payment-orbit i{position:absolute;inset:0;border:1px solid rgba(201,168,92,.12);border-radius:50%;animation:successOrbit 10s linear infinite}.payment-orbit i:nth-child(2){inset:50px;animation-direction:reverse;animation-duration:14s}.payment-orbit i:nth-child(3){inset:100px;animation-duration:8s}.payment-icon{width:56px;height:56px;border:1px solid #806a38;color:#e2c77e;display:grid;place-items:center;margin-bottom:24px}.payment-success-card h1{font-family:var(--serif);font-size:clamp(3rem,7vw,5.4rem);line-height:.92;letter-spacing:-.045em;font-weight:440;margin:14px 0 22px;max-width:650px}.payment-lede{color:#8f8b82;line-height:1.75;font-size:.82rem;max-width:620px}.payment-details{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#36342e;border:1px solid #36342e;margin:30px 0}.payment-details div{background:#10100e;padding:17px;min-width:0}.payment-details span{display:block;font-size:.5rem;letter-spacing:.14em;color:#806f48;margin-bottom:6px}.payment-details strong{display:block;font-size:.72rem;color:#bbb4a7;overflow-wrap:anywhere}.payment-receipt{display:flex;align-items:center;gap:9px;color:#706c65;font-size:.65rem;margin-bottom:26px}.payment-success-card .secondary{position:relative;z-index:3}@keyframes successOrbit{to{transform:rotate(360deg)}}@media(max-width:620px){.payment-details{grid-template-columns:1fr}.payment-success-card{padding:34px 24px}.payment-orbit{opacity:.55}}@media(prefers-reduced-motion:reduce){.payment-orbit i{animation:none}}
    `}</style>
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
