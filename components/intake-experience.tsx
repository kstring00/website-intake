'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  actionOptions,
  assetOptions,
  budgetRanges,
  collaborationOptions,
  feelingOptions,
  outcomeOptions,
  pageOptions,
  projectTypes,
  steps,
  styleOptions,
} from '@/lib/intake-config';

type Intake = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  projectType: string;
  currentWebsite: string;
  businessDescription: string;
  offers: string;
  whyWebsite: string;
  primaryOutcome: string;
  oneThing: string;
  audience: string;
  audienceIntent: string;
  audienceDoubt: string;
  actions: string[];
  bookingDetails: string;
  commerceDetails: string;
  accountDetails: string;
  customFunction: string;
  integrations: string;
  pages: string[];
  contentMustHave: string;
  feelings: string[];
  styleWords: string[];
  inspiration: string;
  avoid: string;
  assets: string[];
  assetLink: string;
  proof: string;
  claimsAvoid: string;
  deadline: string;
  deadlineReason: string;
  budget: string;
  paymentPreference: string;
  collaboration: string;
  communication: string;
  meetingPreference: string;
  notes: string;
  consent: boolean;
};

type ArrayKey = 'actions' | 'pages' | 'feelings' | 'styleWords' | 'assets';

const blank: Intake = {
  name: '', email: '', phone: '', businessName: '', projectType: '', currentWebsite: '', businessDescription: '', offers: '',
  whyWebsite: '', primaryOutcome: '', oneThing: '', audience: '', audienceIntent: '', audienceDoubt: '', actions: [], bookingDetails: '',
  commerceDetails: '', accountDetails: '', customFunction: '', integrations: '', pages: [], contentMustHave: '', feelings: [], styleWords: [],
  inspiration: '', avoid: '', assets: [], assetLink: '', proof: '', claimsAvoid: '', deadline: '', deadlineReason: '', budget: '',
  paymentPreference: '', collaboration: '', communication: '', meetingPreference: '', notes: '', consent: false,
};

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <div className="brief-field">
    <label>{label}</label>
    {help && <p>{help}</p>}
    {children}
  </div>;
}

function SelectCard({ active, onClick, children, copy }: { active: boolean; onClick: () => void; children: React.ReactNode; copy?: string }) {
  return <button type="button" className={`select-card ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="select-mark">{active ? <Check size={12}/> : null}</span>
    <span><strong>{children}</strong>{copy && <small>{copy}</small>}</span>
  </button>;
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
    const saved = localStorage.getItem('website-intake-compass-v2');
    if (!saved) return;
    try { setData({ ...blank, ...JSON.parse(saved) }); } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('website-intake-compass-v2', JSON.stringify(data));
  }, [data]);

  const progress = ((step + 1) / steps.length) * 100;

  const buildProfile = useMemo(() => {
    let score = data.actions.length + data.pages.length;
    if (data.actions.includes('Buy something')) score += 4;
    if (data.actions.includes('Create an account')) score += 5;
    if (data.actions.includes('Pay invoices')) score += 3;
    if (data.actions.includes('Take an assessment')) score += 3;
    if (data.integrations.trim()) score += 3;
    if (score < 10) return 'Focused website';
    if (score < 20) return 'Growth website';
    return 'Advanced build';
  }, [data]);

  const compass = useMemo(() => [
    ['Need', data.projectType || 'Website project'],
    ['Purpose', data.primaryOutcome || data.whyWebsite || 'To be defined'],
    ['Audience', data.audience || 'To be defined'],
    ['Must do', data.actions.length ? data.actions.slice(0, 4).join(' · ') : 'To be defined'],
    ['Feel', data.styleWords.length ? data.styleWords.join(' · ') : data.feelings.join(' · ') || 'To be defined'],
    ['Launch', data.deadline || 'Flexible'],
    ['Investment', data.budget || 'To be defined'],
  ], [data]);

  function update<K extends keyof Intake>(key: K, value: Intake[K]) {
    setData(current => ({ ...current, [key]: value }));
  }

  function toggle(key: ArrayKey, value: string, max?: number) {
    setData(current => {
      const currentList = current[key];
      if (currentList.includes(value)) return { ...current, [key]: currentList.filter(item => item !== value) };
      if (max && currentList.length >= max) return current;
      return { ...current, [key]: [...currentList, value] };
    });
  }

  function validate() {
    const checks: Record<number, boolean> = {
      0: Boolean(data.name.trim() && data.email.trim() && data.businessName.trim() && data.projectType && data.businessDescription.trim()),
      1: Boolean(data.whyWebsite.trim() && data.primaryOutcome),
      2: Boolean(data.audience.trim()),
      3: data.actions.length > 0,
      4: data.pages.length > 0,
      5: data.feelings.length > 0 && data.styleWords.length > 0,
      6: true,
      7: Boolean(data.budget),
      8: Boolean(data.collaboration && data.communication.trim()),
      9: data.consent,
    };
    if (!checks[step]) return step === 9 ? 'Please confirm the acknowledgement before sending your brief.' : 'Finish the highlighted idea before continuing.';
    if (step === 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return 'Enter a valid email address.';
    return '';
  }

  function goNext() {
    const message = validate();
    if (message) { setError(message); return; }
    setError('');
    setStep(current => Math.min(steps.length - 1, current + 1));
    requestAnimationFrame(() => document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function goBack() {
    setError('');
    setStep(current => Math.max(0, current - 1));
  }

  function jumpTo(index: number) {
    if (index > step) return;
    setError('');
    setStep(index);
  }

  function reset() {
    if (!window.confirm('Clear this project brief and start again?')) return;
    setData(blank);
    setStep(0);
    setSubmitted(false);
    setSubmissionId('');
    localStorage.removeItem('website-intake-compass-v2');
  }

  function downloadBrief() {
    const payload = { projectCompass: Object.fromEntries(compass), buildProfile, ...data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.businessName || 'website'}-project-brief.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submit() {
    const message = validate();
    if (message) { setError(message); return; }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectCompass: Object.fromEntries(compass), buildProfile }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your brief.');
      setSubmissionId(result.submissionId);
      setSubmitted(true);
      localStorage.removeItem('website-intake-compass-v2');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function checkout() {
    setCheckoutLoading(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, email: data.email, name: data.name, businessName: data.businessName, budget: data.budget }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Checkout is not available yet.');
      window.location.href = result.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout could not be started.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (submitted) {
    return <section className="brief-complete" id="intake">
      <div className="complete-seam" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="complete-icon"><CheckCircle2 size={22}/></div>
      <p className="micro-label">BRIEF RECEIVED</p>
      <h2>Your project has a direction.</h2>
      <p>Your answers give me the starting point for the first build. From here, I build, we refine it together, and we launch when it feels right.</p>
      <div className="complete-compass">
        {compass.slice(0, 5).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="complete-actions">
        <button className="gold-button" type="button" onClick={checkout} disabled={checkoutLoading}>{checkoutLoading ? 'Opening Stripe…' : 'Reserve project'} <ArrowRight size={15}/></button>
        <button className="quiet-button" type="button" onClick={downloadBrief}><Download size={14}/> Download brief</button>
        <button className="quiet-button" type="button" onClick={reset}><RefreshCw size={14}/> New project</button>
      </div>
      {error && <p className="brief-error">{error}</p>}
    </section>;
  }

  return <section className="brief-shell" id="intake" style={{ '--brief-progress': `${progress}%` } as React.CSSProperties}>
    <header className="brief-progress-head">
      <div>
        <span className="micro-label">PROJECT BRIEF</span>
        <strong>{String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</strong>
      </div>
      <div className="brief-progress-line" aria-hidden="true"><i/></div>
      <span>{steps[step].label}</span>
    </header>

    <div className="kintsugi-rail" aria-hidden="true">
      {steps.map((item, index) => <i key={item.id} className={index <= step ? 'lit' : ''}/>) }
    </div>

    <div className="brief-body">
      <nav className="brief-step-nav" aria-label="Project brief progress">
        {steps.map((item, index) => <button key={item.id} type="button" onClick={() => jumpTo(index)} disabled={index > step} className={index === step ? 'active' : index < step ? 'done' : ''}>
          <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
        </button>)}
        <div className="autosave"><ShieldCheck size={13}/> Saved on this device</div>
      </nav>

      <div className="brief-stage" key={step}>
        {step === 0 && <>
          <div className="question-head"><p className="micro-label">THE NEED</p><h2>What are we making?</h2><p>Start simple. I need the business before I need the design.</p></div>
          <div className="select-grid two">{projectTypes.map(item => <SelectCard key={item} active={data.projectType === item} onClick={() => update('projectType', item)}>{item}</SelectCard>)}</div>
          <div className="field-grid two">
            <Field label="Your name"><input value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Your name"/></Field>
            <Field label="Email"><input type="email" value={data.email} onChange={e=>update('email',e.target.value)} placeholder="you@company.com"/></Field>
            <Field label="Business / project name"><input value={data.businessName} onChange={e=>update('businessName',e.target.value)} placeholder="What should I call it?"/></Field>
            <Field label="Current website" help="If one exists."><input value={data.currentWebsite} onChange={e=>update('currentWebsite',e.target.value)} placeholder="https://"/></Field>
          </div>
          <Field label="What do you do?" help="Explain it the way you would to someone you just met."><textarea value={data.businessDescription} onChange={e=>update('businessDescription',e.target.value)} placeholder="We help…"/></Field>
          <Field label="What are you selling or offering?" help="Services, products, appointments, memberships, content—whatever is real."><textarea value={data.offers} onChange={e=>update('offers',e.target.value)} placeholder="The main thing people can get from us is…"/></Field>
        </>}

        {step === 1 && <>
          <div className="question-head"><p className="micro-label">THE PURPOSE</p><h2>Why does this website need to exist?</h2><p>The answer should tell me what the site has to accomplish—not what it should look like.</p></div>
          <Field label="Why do you need this website right now?"><textarea value={data.whyWebsite} onChange={e=>update('whyWebsite',e.target.value)} placeholder="Right now, the problem is…"/></Field>
          <Field label="What should happen because it exists?"><div className="select-grid two">{outcomeOptions.map(item => <SelectCard key={item} active={data.primaryOutcome === item} onClick={()=>update('primaryOutcome',item)}>{item}</SelectCard>)}</div></Field>
          <Field label="If someone remembers only one thing after visiting, what should it be?" help="One sentence is enough."><input value={data.oneThing} onChange={e=>update('oneThing',e.target.value)} placeholder="I want them to remember that…"/></Field>
        </>}

        {step === 2 && <>
          <div className="question-head"><p className="micro-label">THE AUDIENCE</p><h2>Who are we talking to?</h2><p>Good pages become easier to write when the person on the other side is clear.</p></div>
          <Field label="Who is this for?"><textarea value={data.audience} onChange={e=>update('audience',e.target.value)} placeholder="The person I most want to reach is…"/></Field>
          <Field label="What are they looking for when they find you?"><textarea value={data.audienceIntent} onChange={e=>update('audienceIntent',e.target.value)} placeholder="They are usually trying to…"/></Field>
          <Field label="What are they unsure about before choosing you?" help="Trust, price, experience, results, risk, confusion—anything that gets in the way."><textarea value={data.audienceDoubt} onChange={e=>update('audienceDoubt',e.target.value)} placeholder="Before they say yes, they worry about…"/></Field>
        </>}

        {step === 3 && <>
          <div className="question-head"><p className="micro-label">THE FUNCTION</p><h2>What should someone be able to do here?</h2><p>Choose what matters. I’ll only ask deeper questions where the build actually needs them.</p></div>
          <div className="select-grid two">{actionOptions.map(item => <SelectCard key={item} active={data.actions.includes(item)} onClick={()=>toggle('actions',item)}>{item}</SelectCard>)}</div>
          {data.actions.includes('Book an appointment') && <Field label="How should booking work?" help="Name the tool if you already use one."><input value={data.bookingDetails} onChange={e=>update('bookingDetails',e.target.value)} placeholder="Calendly, Acuity, built-in calendar…"/></Field>}
          {data.actions.includes('Buy something') && <Field label="What will people buy?" help="Products, services, number of items, shipping, subscriptions—whatever changes the checkout."><textarea value={data.commerceDetails} onChange={e=>update('commerceDetails',e.target.value)} placeholder="We sell…"/></Field>}
          {data.actions.includes('Create an account') && <Field label="What should a logged-in client be able to access?"><textarea value={data.accountDetails} onChange={e=>update('accountDetails',e.target.value)} placeholder="After login, clients should be able to…"/></Field>}
          {data.actions.includes('Something custom') && <Field label="What custom interaction do you have in mind?"><textarea value={data.customFunction} onChange={e=>update('customFunction',e.target.value)} placeholder="The custom piece is…"/></Field>}
          <Field label="Anything this site needs to connect to?" help="CRM, email platform, Stripe, calendar, analytics, another app or API."><input value={data.integrations} onChange={e=>update('integrations',e.target.value)} placeholder="Optional"/></Field>
        </>}

        {step === 4 && <>
          <div className="question-head"><p className="micro-label">THE CONTENT</p><h2>What needs to exist on it?</h2><p>Think information first. We can decide the final navigation and structure from this.</p></div>
          <div className="select-grid three">{pageOptions.map(item => <SelectCard key={item} active={data.pages.includes(item)} onClick={()=>toggle('pages',item)}>{item}</SelectCard>)}</div>
          <Field label="What information absolutely has to appear somewhere?" help="Anything the page list does not capture."><textarea value={data.contentMustHave} onChange={e=>update('contentMustHave',e.target.value)} placeholder="People need to know…"/></Field>
        </>}

        {step === 5 && <>
          <div className="question-head"><p className="micro-label">THE IDENTITY</p><h2>What should it feel like?</h2><p>Not colors yet. Start with the reaction you want from a person.</p></div>
          <Field label="How should someone feel when they land on it?"><div className="select-grid three">{feelingOptions.map(item => <SelectCard key={item} active={data.feelings.includes(item)} onClick={()=>toggle('feelings',item,4)}>{item}</SelectCard>)}</div></Field>
          <Field label="Pick up to four words that should describe the site."><div className="select-grid three">{styleOptions.map(item => <SelectCard key={item} active={data.styleWords.includes(item)} onClick={()=>toggle('styleWords',item,4)}>{item}</SelectCard>)}</div></Field>
          <Field label="Show me websites you love." help="Links plus a few words about what you like is ideal."><textarea value={data.inspiration} onChange={e=>update('inspiration',e.target.value)} placeholder="https://… — I like…"/></Field>
          <Field label="What do you absolutely not want?" help="A useful negative is often more revealing than another inspiration link."><textarea value={data.avoid} onChange={e=>update('avoid',e.target.value)} placeholder="Please avoid…"/></Field>
        </>}

        {step === 6 && <>
          <div className="question-head"><p className="micro-label">THE PROOF</p><h2>What do we have to work with?</h2><p>This tells me what can be used immediately and what may need to be created.</p></div>
          <div className="select-grid three">{assetOptions.map(item => <SelectCard key={item} active={data.assets.includes(item)} onClick={()=>toggle('assets',item)}>{item}</SelectCard>)}</div>
          <Field label="Where can I find the existing assets?" help="Google Drive, Dropbox, Canva, a current site, or any shared folder."><input value={data.assetLink} onChange={e=>update('assetLink',e.target.value)} placeholder="https://"/></Field>
          <Field label="What can we confidently say about you or the business?" help="Credentials, experience, results, numbers, awards, testimonials, certifications."><textarea value={data.proof} onChange={e=>update('proof',e.target.value)} placeholder="We can confidently say…"/></Field>
          <Field label="Anything I should not imply or claim?"><textarea value={data.claimsAvoid} onChange={e=>update('claimsAvoid',e.target.value)} placeholder="Do not suggest that…"/></Field>
        </>}

        {step === 7 && <>
          <div className="question-head"><p className="micro-label">THE CONSTRAINTS</p><h2>What does the real world allow?</h2><p>Time and investment shape the build. Neither answer is a judgment.</p></div>
          <div className="field-grid two">
            <Field label="When would you love this live?"><input type="date" value={data.deadline} onChange={e=>update('deadline',e.target.value)}/></Field>
            <Field label="Anything driving that date?"><input value={data.deadlineReason} onChange={e=>update('deadlineReason',e.target.value)} placeholder="Launch, event, opening, no rush…"/></Field>
          </div>
          <Field label="What are you comfortable investing?"><div className="select-grid two">{budgetRanges.map(item => <SelectCard key={item} active={data.budget === item} onClick={()=>update('budget',item)}>{item}</SelectCard>)}</div></Field>
          <Field label="Any payment preference?" help="Optional. Full payment, deposit + balance, installments, or something else."><input value={data.paymentPreference} onChange={e=>update('paymentPreference',e.target.value)} placeholder="Optional"/></Field>
        </>}

        {step === 8 && <>
          <div className="question-head"><p className="micro-label">WORKING TOGETHER</p><h2>How involved do you want to be?</h2><p>You’ll be able to see the real site as it develops. Tell me how you prefer to use that access.</p></div>
          <div className="select-grid one">{collaborationOptions.map(item => <SelectCard key={item.title} active={data.collaboration === item.title} onClick={()=>update('collaboration',item.title)} copy={item.copy}>{item.title}</SelectCard>)}</div>
          <Field label="What is the easiest way to communicate with you?"><input value={data.communication} onChange={e=>update('communication',e.target.value)} placeholder="Email, text, phone, Slack…"/></Field>
          <Field label="For our refinement session, what works best?" help="In person, video call, either, or something else."><input value={data.meetingPreference} onChange={e=>update('meetingPreference',e.target.value)} placeholder="Optional"/></Field>
          <Field label="Anything else I should know before I build?" help="This is the place for the thing the form did not ask."><textarea value={data.notes} onChange={e=>update('notes',e.target.value)} placeholder="One last thing…"/></Field>
        </>}

        {step === 9 && <div className="review-stage">
          <div className="question-head"><p className="micro-label">PROJECT COMPASS</p><h2>Here’s what I heard.</h2><p>This is the direction I’ll use when I interpret your brief and begin the first build.</p></div>
          <div className="compass-grid">
            {compass.map(([label,value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </div>
          <div className="compass-note">
            <span>BUILD PROFILE</span>
            <strong>{buildProfile}</strong>
            <p>This is a high-level signal based on the pages and functionality you selected—not a quote or final scope.</p>
          </div>
          <label className="consent-row"><input type="checkbox" checked={data.consent} onChange={e=>update('consent',e.target.checked)}/><span><strong>Yes — this sounds right.</strong> I understand this brief is the starting direction, not a final contract, price, or fixed scope.</span></label>
          <button type="button" className="download-inline" onClick={downloadBrief}><Download size={14}/> Download my answers</button>
        </div>}

        {error && <p className="brief-error">{error}</p>}

        <div className="brief-nav">
          <button type="button" className="quiet-button" onClick={goBack} disabled={step === 0}><ArrowLeft size={14}/> Back</button>
          {step < steps.length - 1
            ? <button type="button" className="gold-button" onClick={goNext}>Continue <ArrowRight size={15}/></button>
            : <button type="button" className="gold-button" onClick={submit} disabled={submitting}>{submitting ? 'Sending…' : 'Send my brief'} <ArrowRight size={15}/></button>}
        </div>
      </div>
    </div>
  </section>;
}
