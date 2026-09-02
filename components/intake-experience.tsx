'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  Globe2,
  Layers3,
  LockKeyhole,
  Palette,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  brandVibes,
  budgetRanges,
  featureOptions,
  goalOptions,
  pageOptions,
  steps,
  studioName,
} from '@/lib/intake-config';

type Intake = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  currentWebsite: string;
  businessDescription: string;
  offers: string;
  difference: string;
  audience: string;
  audienceProblem: string;
  primaryAction: string;
  goals: string[];
  successMetric: string;
  whyNow: string;
  pages: string[];
  customPages: string;
  features: string[];
  customFeatures: string;
  ecommerceDetails: string;
  bookingDetails: string;
  memberDetails: string;
  integrations: string;
  existingPlatform: string;
  domainStatus: string;
  hostingStatus: string;
  brandVibes: string[];
  colors: string;
  avoid: string;
  inspiration: string;
  logoStatus: string;
  contentStatus: string;
  photographyStatus: string;
  testimonialsStatus: string;
  assetLink: string;
  seoKeywords: string;
  legalStatus: string;
  deadline: string;
  deadlineReason: string;
  budget: string;
  paymentPreference: string;
  decisionMakers: string;
  feedbackSpeed: string;
  postLaunch: string;
  communication: string;
  biggestConcern: string;
  notes: string;
  consent: boolean;
};

const blank: Intake = {
  name: '', email: '', phone: '', businessName: '', currentWebsite: '', businessDescription: '', offers: '', difference: '',
  audience: '', audienceProblem: '', primaryAction: '', goals: [], successMetric: '', whyNow: '', pages: [], customPages: '', features: [],
  customFeatures: '', ecommerceDetails: '', bookingDetails: '', memberDetails: '', integrations: '', existingPlatform: '', domainStatus: '', hostingStatus: '',
  brandVibes: [], colors: '', avoid: '', inspiration: '', logoStatus: '', contentStatus: '', photographyStatus: '', testimonialsStatus: '', assetLink: '',
  seoKeywords: '', legalStatus: '', deadline: '', deadlineReason: '', budget: '', paymentPreference: '', decisionMakers: '', feedbackSpeed: '', postLaunch: '',
  communication: '', biggestConcern: '', notes: '', consent: false,
};

const requiredByStep: Record<number, (keyof Intake)[]> = {
  0: ['name', 'email', 'businessName', 'businessDescription'],
  1: ['audience', 'primaryAction'],
  2: ['domainStatus'],
  3: ['logoStatus'],
  4: ['contentStatus'],
  5: ['budget', 'communication'],
  6: ['consent'],
};

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <div className="field"><label className="field-label">{label}</label>{help && <p className="field-help">{help}</p>}{children}</div>;
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`choice ${active ? 'active' : ''}`} onClick={onClick}><span className="choice-check">{active && <Check size={13}/>}</span><span>{children}</span></button>;
}

function RadioCard({ active, onClick, title, copy }: { active: boolean; onClick: () => void; title: string; copy?: string }) {
  return <button type="button" className={`radio-card ${active ? 'active' : ''}`} onClick={onClick}><span className="radio-dot">{active && <span/>}</span><span><strong>{title}</strong>{copy && <small>{copy}</small>}</span></button>;
}

export function IntakeExperience() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Intake>(blank);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('website-intake-draft-v1');
    if (saved) {
      try { setData({ ...blank, ...JSON.parse(saved) }); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('website-intake-draft-v1', JSON.stringify(data));
  }, [data]);

  const complexity = useMemo(() => {
    let score = data.pages.length + data.features.length * 2;
    if (data.features.includes('E-commerce / cart')) score += 4;
    if (data.features.includes('Client accounts / login')) score += 4;
    if (data.features.includes('AI feature')) score += 4;
    if (data.features.includes('Third-party API integration')) score += 3;
    if (score <= 8) return { label: 'Focused marketing site', copy: 'A streamlined site with a clear conversion path and modest functionality.' };
    if (score <= 18) return { label: 'Growth website', copy: 'A more substantial build with multiple journeys, content types, or integrations.' };
    return { label: 'Advanced digital product', copy: 'Your scope is moving beyond a standard brochure site into platform-level functionality.' };
  }, [data]);

  function update<K extends keyof Intake>(key: K, value: Intake[K]) {
    setData(current => ({ ...current, [key]: value }));
  }

  function toggle(key: 'goals' | 'pages' | 'features' | 'brandVibes', value: string) {
    setData(current => {
      const list = current[key];
      return { ...current, [key]: list.includes(value) ? list.filter(item => item !== value) : [...list, value] };
    });
  }

  function validate() {
    const required = requiredByStep[step] || [];
    for (const key of required) {
      const value = data[key];
      if (typeof value === 'boolean' && !value) return 'Please confirm the project-inquiry acknowledgement before submitting.';
      if (Array.isArray(value) && !value.length) return 'Please choose at least one option before continuing.';
      if (typeof value === 'string' && !value.trim()) return 'Please complete the required fields before continuing.';
    }
    if (step === 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return 'Please enter a valid email address.';
    return '';
  }

  function next() {
    const message = validate();
    if (message) { setError(message); return; }
    setError('');
    setStep(current => Math.min(steps.length - 1, current + 1));
    window.scrollTo({ top: document.getElementById('intake')?.offsetTop || 0, behavior: 'smooth' });
  }

  function back() {
    setError('');
    setStep(current => Math.max(0, current - 1));
  }

  function reset() {
    if (!window.confirm('Clear this intake and start over?')) return;
    setData(blank); setStep(0); setSubmitted(false); setSubmissionId(''); localStorage.removeItem('website-intake-draft-v1');
  }

  function downloadBrief() {
    const blob = new Blob([JSON.stringify({ submittedAt: new Date().toISOString(), ...data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${data.businessName || 'website'}-project-brief.json`; a.click(); URL.revokeObjectURL(url);
  }

  async function submit() {
    const message = validate();
    if (message) { setError(message); return; }
    setSubmitting(true); setError('');
    try {
      const response = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, complexity: complexity.label }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not submit your brief.');
      setSubmissionId(result.submissionId);
      setSubmitted(true);
      localStorage.removeItem('website-intake-draft-v1');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  }

  async function checkout() {
    setCheckoutLoading(true); setError('');
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submissionId, email: data.email, name: data.name, businessName: data.businessName, budget: data.budget }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Checkout is not available yet.');
      window.location.href = result.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout could not be started.');
    } finally { setCheckoutLoading(false); }
  }

  if (submitted) {
    return <section className="submitted-card" id="intake">
      <div className="submitted-icon"><CheckCircle2 size={28}/></div>
      <p className="kicker">PROJECT BRIEF RECEIVED</p>
      <h2>That gives me enough to start thinking like your designer.</h2>
      <p className="submitted-copy">Your brief has been captured. The next step is review, scope confirmation, and—if you are ready—reserving the project with a secure Stripe deposit.</p>
      <div className="submitted-grid">
        <div><span>Project</span><strong>{data.businessName}</strong></div>
        <div><span>Likely shape</span><strong>{complexity.label}</strong></div>
        <div><span>Budget</span><strong>{data.budget}</strong></div>
      </div>
      <div className="deposit-card">
        <div><p className="kicker">OPTIONAL NEXT STEP</p><h3>Reserve your project.</h3><p>Pay the configured project deposit through Stripe Checkout. You will see the exact amount before payment.</p></div>
        <button className="primary" onClick={checkout} disabled={checkoutLoading}>{checkoutLoading ? 'Opening checkout…' : 'Pay project deposit'} <ArrowRight size={17}/></button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="submitted-actions"><button className="secondary" onClick={downloadBrief}><Download size={16}/> Download my brief</button><button className="text-button" onClick={reset}><RefreshCw size={15}/> Start another project</button></div>
    </section>;
  }

  return <section className="intake-shell" id="intake">
    <aside className="intake-sidebar">
      <div className="sidebar-top">
        <p className="kicker">PROJECT INTAKE</p>
        <h2>Build the brief before the build.</h2>
        <p>Thoughtful questions now save rounds of confusion later.</p>
      </div>
      <nav className="steps" aria-label="Intake progress">
        {steps.map((item, index) => <button type="button" key={item.id} className={`${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`} onClick={() => index < step && setStep(index)} disabled={index > step}>
          <span className="step-number">{index < step ? <Check size={12}/> : item.eyebrow}</span><span>{item.label}</span>
        </button>)}
      </nav>
      <div className="save-note"><ShieldCheck size={16}/><span>Your draft saves automatically on this device.</span></div>
    </aside>

    <div className="intake-main">
      <div className="mobile-progress"><span>Step {step + 1} of {steps.length}</span><div><i style={{ width: `${((step + 1) / steps.length) * 100}%` }}/></div></div>

      {step === 0 && <div className="step-panel">
        <header><p className="kicker">01 · BASICS</p><h2>Start with the business, not the website.</h2><p>Tell me what exists today and what you actually do. Plain English is better than polished marketing copy.</p></header>
        <div className="two-col">
          <Field label="Your name"><input value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Jane Smith"/></Field>
          <Field label="Email"><input type="email" value={data.email} onChange={e=>update('email',e.target.value)} placeholder="jane@company.com"/></Field>
          <Field label="Phone" help="Optional"><input value={data.phone} onChange={e=>update('phone',e.target.value)} placeholder="(555) 555-5555"/></Field>
          <Field label="Business / brand name"><input value={data.businessName} onChange={e=>update('businessName',e.target.value)} placeholder="Acme Studio"/></Field>
        </div>
        <Field label="Current website" help="Leave blank if this is a new business."><input value={data.currentWebsite} onChange={e=>update('currentWebsite',e.target.value)} placeholder="https://..."/></Field>
        <Field label="What does the business do?" help="One or two sentences, the way you'd explain it to a real person."><textarea value={data.businessDescription} onChange={e=>update('businessDescription',e.target.value)} placeholder="We help..."/></Field>
        <Field label="What do you sell or offer?" help="List the main services, products, packages, memberships, or offers."><textarea value={data.offers} onChange={e=>update('offers',e.target.value)} /></Field>
        <Field label="What makes you meaningfully different?" help="Price, expertise, process, speed, niche, story, experience—anything customers genuinely choose you for."><textarea value={data.difference} onChange={e=>update('difference',e.target.value)} /></Field>
      </div>}

      {step === 1 && <div className="step-panel">
        <header><p className="kicker">02 · STRATEGY</p><h2>What job does this website need to do?</h2><p>The strongest websites are built around an audience, a decision, and a measurable outcome.</p></header>
        <Field label="Who is the ideal customer / audience?" help="Be as specific as you can: role, age, location, stage of life, type of company, or situation."><textarea value={data.audience} onChange={e=>update('audience',e.target.value)} /></Field>
        <Field label="What problem, frustration, or desire brings them here?"><textarea value={data.audienceProblem} onChange={e=>update('audienceProblem',e.target.value)} /></Field>
        <Field label="What is the #1 action you want a visitor to take?" help="Examples: book a call, buy, request a quote, join a list, apply, visit a location."><input value={data.primaryAction} onChange={e=>update('primaryAction',e.target.value)} /></Field>
        <Field label="What else should the site accomplish?" help="Choose everything that matters."><div className="choice-grid">{goalOptions.map(item=><Choice key={item} active={data.goals.includes(item)} onClick={()=>toggle('goals',item)}>{item}</Choice>)}</div></Field>
        <Field label="How will we know the website is working?" help="What result would make you say this project was worth it?"><textarea value={data.successMetric} onChange={e=>update('successMetric',e.target.value)} placeholder="More qualified inquiries, 20 bookings/month, clearer positioning..."/></Field>
        <Field label="Why are you doing this now?" help="What changed, launched, broke, grew, or became urgent?"><textarea value={data.whyNow} onChange={e=>update('whyNow',e.target.value)} /></Field>
      </div>}

      {step === 2 && <div className="step-panel">
        <header><p className="kicker">03 · SCOPE</p><h2>Now define what the website actually needs.</h2><p>This is where we separate a focused marketing site from a more advanced product build.</p></header>
        <Field label="Which pages do you expect?" help="This is a starting point, not a final sitemap."><div className="choice-grid compact">{pageOptions.map(item=><Choice key={item} active={data.pages.includes(item)} onClick={()=>toggle('pages',item)}>{item}</Choice>)}</div></Field>
        <Field label="Any custom or unusual pages?"><textarea value={data.customPages} onChange={e=>update('customPages',e.target.value)} /></Field>
        <Field label="What functionality does it need?" help="Choose what should work on launch—not every feature you might want someday."><div className="choice-grid compact">{featureOptions.map(item=><Choice key={item} active={data.features.includes(item)} onClick={()=>toggle('features',item)}>{item}</Choice>)}</div></Field>
        <Field label="Anything not listed?"><textarea value={data.customFeatures} onChange={e=>update('customFeatures',e.target.value)} /></Field>
        {data.features.includes('E-commerce / cart') && <Field label="Tell me about what you will sell online." help="How many products, physical vs digital, shipping, variants, inventory, taxes, discounts, etc."><textarea value={data.ecommerceDetails} onChange={e=>update('ecommerceDetails',e.target.value)} /></Field>}
        {data.features.includes('Booking / calendar') && <Field label="How should booking work?" help="Services, appointment lengths, team members, deposits, preferred calendar platform."><textarea value={data.bookingDetails} onChange={e=>update('bookingDetails',e.target.value)} /></Field>}
        {(data.features.includes('Client accounts / login') || data.features.includes('Subscriptions / memberships')) && <Field label="What should members be able to do after login?"><textarea value={data.memberDetails} onChange={e=>update('memberDetails',e.target.value)} /></Field>}
        <Field label="Apps or systems this site must connect to" help="Examples: Stripe, HubSpot, Google Calendar, Calendly, Mailchimp, Shopify, Supabase, Salesforce."><textarea value={data.integrations} onChange={e=>update('integrations',e.target.value)} /></Field>
        {data.currentWebsite && <Field label="What platform is the current site on?"><input value={data.existingPlatform} onChange={e=>update('existingPlatform',e.target.value)} placeholder="Squarespace, WordPress, Wix, custom..."/></Field>}
        <Field label="Domain status"><div className="radio-grid">{['I own it and have access','I own it but someone else manages it','I need a domain','Not sure'].map(item=><RadioCard key={item} active={data.domainStatus===item} onClick={()=>update('domainStatus',item)} title={item}/>)}</div></Field>
        <Field label="Hosting status" help="Optional"><input value={data.hostingStatus} onChange={e=>update('hostingStatus',e.target.value)} placeholder="Vercel, GoDaddy, SiteGround, not sure..."/></Field>
      </div>}

      {step === 3 && <div className="step-panel">
        <header><p className="kicker">04 · BRAND</p><h2>Give the website a visual point of view.</h2><p>You do not need to know design terminology. References and reactions are more useful than jargon.</p></header>
        <Field label="Which words should the brand feel like?"><div className="choice-grid">{brandVibes.map(item=><Choice key={item} active={data.brandVibes.includes(item)} onClick={()=>toggle('brandVibes',item)}>{item}</Choice>)}</div></Field>
        <Field label="Colors you want to use" help="Include brand colors, hex codes, or just describe the palette."><input value={data.colors} onChange={e=>update('colors',e.target.value)} /></Field>
        <Field label="What should I avoid?" help="Colors, visual clichés, animations, layouts, photography styles, competitor looks—anything you strongly dislike."><textarea value={data.avoid} onChange={e=>update('avoid',e.target.value)} /></Field>
        <Field label="Websites or brands you love" help="Paste URLs and tell me what you like about each one."><textarea value={data.inspiration} onChange={e=>update('inspiration',e.target.value)} placeholder="https://... — I like the typography and simplicity"/></Field>
        <Field label="Do you have a logo / brand identity?"><div className="radio-grid">{['Yes — final files are ready','Yes — but it needs refinement','No — I need help with this','Not sure'].map(item=><RadioCard key={item} active={data.logoStatus===item} onClick={()=>update('logoStatus',item)} title={item}/>)}</div></Field>
      </div>}

      {step === 4 && <div className="step-panel">
        <header><p className="kicker">05 · CONTENT</p><h2>What are we building with?</h2><p>Design goes faster when we know whether the words, photography, proof, and brand assets already exist.</p></header>
        <Field label="Website copy"><div className="radio-grid">{['Final copy is ready','I have rough copy / notes','I need help shaping the copy','I need copywriting from scratch'].map(item=><RadioCard key={item} active={data.contentStatus===item} onClick={()=>update('contentStatus',item)} title={item}/>)}</div></Field>
        <Field label="Photography / imagery"><div className="radio-grid">{['Professional photos are ready','I have usable photos','I need stock / generated imagery','I need a photography plan'].map(item=><RadioCard key={item} active={data.photographyStatus===item} onClick={()=>update('photographyStatus',item)} title={item}/>)}</div></Field>
        <Field label="Testimonials / case studies"><div className="radio-grid">{['Ready to use','I can collect them','Not yet','Not relevant'].map(item=><RadioCard key={item} active={data.testimonialsStatus===item} onClick={()=>update('testimonialsStatus',item)} title={item}/>)}</div></Field>
        <Field label="Asset folder link" help="Google Drive, Dropbox, OneDrive, Canva, etc. You can add this later."><input value={data.assetLink} onChange={e=>update('assetLink',e.target.value)} placeholder="https://..."/></Field>
        <Field label="SEO topics or search phrases" help="What might your ideal customer type into Google? Optional."><textarea value={data.seoKeywords} onChange={e=>update('seoKeywords',e.target.value)} /></Field>
        <Field label="Privacy policy / terms / required legal language" help="Tell me what exists and what still needs to be supplied."><textarea value={data.legalStatus} onChange={e=>update('legalStatus',e.target.value)} /></Field>
      </div>}

      {step === 5 && <div className="step-panel">
        <header><p className="kicker">06 · LOGISTICS</p><h2>Make the project realistic.</h2><p>Budget, timing, feedback, and decision-making affect the build just as much as design.</p></header>
        <Field label="Target launch date" help="Leave blank if flexible."><input type="date" value={data.deadline} onChange={e=>update('deadline',e.target.value)} /></Field>
        {data.deadline && <Field label="Why does this date matter?" help="Launch, event, campaign, opening, contract, seasonality, etc."><input value={data.deadlineReason} onChange={e=>update('deadlineReason',e.target.value)} /></Field>}
        <Field label="Realistic investment range" help="This does not lock you into a price. It tells me what kind of solution we should design."><div className="radio-grid">{budgetRanges.map(item=><RadioCard key={item} active={data.budget===item} onClick={()=>update('budget',item)} title={item}/>)}</div></Field>
        <Field label="Payment preference" help="Optional"><div className="radio-grid">{['Deposit + final payment','Milestone payments','Pay in full if the scope is right','I need to discuss options'].map(item=><RadioCard key={item} active={data.paymentPreference===item} onClick={()=>update('paymentPreference',item)} title={item}/>)}</div></Field>
        <Field label="Who approves the website?" help="List everyone who needs to sign off or give feedback."><input value={data.decisionMakers} onChange={e=>update('decisionMakers',e.target.value)} /></Field>
        <Field label="How quickly can feedback usually be returned?" help="Optional"><input value={data.feedbackSpeed} onChange={e=>update('feedbackSpeed',e.target.value)} placeholder="24–48 hours, weekly leadership meeting, etc."/></Field>
        <Field label="What support might you want after launch?" help="Updates, content, SEO, analytics review, new pages, maintenance, training."><textarea value={data.postLaunch} onChange={e=>update('postLaunch',e.target.value)} /></Field>
        <Field label="Preferred communication"><div className="radio-grid">{['Email','Text','Phone / video calls','Slack / Teams','No preference'].map(item=><RadioCard key={item} active={data.communication===item} onClick={()=>update('communication',item)} title={item}/>)}</div></Field>
        <Field label="Biggest concern about this project"><textarea value={data.biggestConcern} onChange={e=>update('biggestConcern',e.target.value)} /></Field>
        <Field label="Anything else I should know?"><textarea value={data.notes} onChange={e=>update('notes',e.target.value)} /></Field>
      </div>}

      {step === 6 && <div className="step-panel review-panel">
        <header><p className="kicker">07 · REVIEW</p><h2>Your project, in one page.</h2><p>Make sure the direction feels right. This is a discovery brief—not a binding scope or final estimate.</p></header>
        <div className="project-shape"><div className="shape-icon"><Layers3 size={23}/></div><div><span>LIKELY PROJECT SHAPE</span><h3>{complexity.label}</h3><p>{complexity.copy}</p></div></div>
        <div className="review-grid">
          <article><Target size={18}/><span>Primary action</span><strong>{data.primaryAction || 'Not specified'}</strong></article>
          <article><CircleDollarSign size={18}/><span>Budget</span><strong>{data.budget || 'Not specified'}</strong></article>
          <article><Clock3 size={18}/><span>Launch</span><strong>{data.deadline || 'Flexible'}</strong></article>
          <article><Globe2 size={18}/><span>Pages</span><strong>{data.pages.length || 0} selected</strong></article>
          <article><Sparkles size={18}/><span>Features</span><strong>{data.features.length || 0} selected</strong></article>
          <article><Palette size={18}/><span>Brand direction</span><strong>{data.brandVibes.slice(0,2).join(', ') || 'Open'}</strong></article>
        </div>
        <div className="summary-block"><h3>Business</h3><p><strong>{data.businessName}</strong> — {data.businessDescription}</p>{data.offers && <p><b>Offers:</b> {data.offers}</p>}</div>
        <div className="summary-block"><h3>Audience & goal</h3><p>{data.audience}</p><p><b>Desired action:</b> {data.primaryAction}</p>{data.goals.length>0 && <p><b>Additional goals:</b> {data.goals.join(', ')}</p>}</div>
        <div className="summary-block"><h3>Scope</h3><p><b>Pages:</b> {data.pages.join(', ') || 'To be determined'}</p><p><b>Features:</b> {data.features.join(', ') || 'No advanced functionality selected'}</p></div>
        <label className="consent"><input type="checkbox" checked={data.consent} onChange={e=>update('consent',e.target.checked)}/><span>I understand this is a project inquiry and discovery brief, not a final quote, contract, or guaranteed launch date. Final scope and pricing will be confirmed separately.</span></label>
        <button type="button" className="secondary download-review" onClick={downloadBrief}><Download size={16}/> Download a copy of my answers</button>
      </div>}

      {error && <p className="error">{error}</p>}
      <div className="form-nav">
        <button type="button" className="text-button" onClick={step===0?reset:back}>{step===0 ? <><RefreshCw size={15}/> Clear form</> : <><ArrowLeft size={16}/> Back</>}</button>
        {step < steps.length - 1 ? <button type="button" className="primary" onClick={next}>Continue <ArrowRight size={17}/></button> : <button type="button" className="primary" onClick={submit} disabled={submitting}>{submitting ? 'Sending project brief…' : 'Submit project brief'} <Rocket size={17}/></button>}
      </div>
    </div>
  </section>;
}
