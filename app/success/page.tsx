import Link from 'next/link';
import Stripe from 'stripe';
import { CheckCircle2, ReceiptText } from 'lucide-react';

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

  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'28px',background:'#f4f1eb',fontFamily:'Arial,sans-serif',color:'#111820'}}>
    <section style={{width:'min(680px,100%)',background:'#fbfaf7',border:'1px solid #d5dbe0',borderRadius:'28px',padding:'clamp(32px,7vw,70px)',boxShadow:'0 28px 90px rgba(19,31,43,.07)'}}>
      <div style={{width:58,height:58,borderRadius:18,display:'grid',placeItems:'center',background:'#dfeae5',color:'#315c4f',marginBottom:24}}><CheckCircle2 size={28}/></div>
      <p style={{letterSpacing:'.16em',fontSize:11,fontWeight:800,color:'#365b79'}}>PROJECT RESERVED</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(42px,7vw,70px)',fontWeight:500,lineHeight:.95,letterSpacing:'-.04em',margin:'12px 0 20px'}}>{paid ? 'Payment received.' : 'Checkout complete.'}</h1>
      <p style={{color:'#68737d',lineHeight:1.7,fontSize:15}}>Your project brief and payment now have a shared reference, which makes it easy to connect the right payment to the right build.</p>
      <div style={{margin:'28px 0',padding:'18px',borderRadius:14,background:'#eef3f6',border:'1px solid #d4dde4',display:'grid',gap:8}}>
        {amount && <div style={{display:'flex',justifyContent:'space-between',gap:20,fontSize:13}}><span style={{color:'#6c7780'}}>Amount</span><strong>{amount}</strong></div>}
        {email && <div style={{display:'flex',justifyContent:'space-between',gap:20,fontSize:13}}><span style={{color:'#6c7780'}}>Email</span><strong>{email}</strong></div>}
        {reference && <div style={{display:'flex',justifyContent:'space-between',gap:20,fontSize:13}}><span style={{color:'#6c7780'}}>Project reference</span><strong>{reference}</strong></div>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,color:'#66727c',fontSize:12,marginBottom:24}}><ReceiptText size={16}/>Stripe will provide the payment receipt associated with the Checkout session.</div>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',minHeight:46,padding:'0 18px',borderRadius:12,background:'#10273f',color:'white',fontWeight:700,fontSize:13}}>Back to project intake</Link>
    </section>
  </main>;
}
