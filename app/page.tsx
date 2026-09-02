import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { IntakeExperience } from '@/components/intake-experience';
import { contactEmail, studioName } from '@/lib/intake-config';

export default function HomePage() {
  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label={`${studioName} website intake home`}>
        <span className="brand-mark">W</span>
        <span>{studioName}<small>WEBSITE PROJECT INTAKE</small></span>
      </a>
      <div className="topbar-note"><i/>Now accepting project inquiries</div>
    </header>

    <main id="top">
      <section className="hero">
        <div>
          <p className="eyebrow">WEBSITE PROJECT DISCOVERY</p>
          <h1>Tell me what you&apos;re building. <em>I&apos;ll figure out what it needs.</em></h1>
          <p className="hero-copy">A guided project brief that gets beyond “I need a website.” We&apos;ll clarify the business goal, audience, content, functionality, budget, launch constraints, and what success actually needs to look like before scope and pricing are finalized.</p>
          <div className="hero-actions">
            <a className="primary" href="#intake">Start the project brief <ArrowRight size={17}/></a>
            <span style={{fontSize:'.72rem',color:'#6f7882'}}>About 8–12 thoughtful minutes</span>
          </div>
          <div className="hero-proof">
            <div><ShieldCheck size={16}/> Draft saves automatically</div>
            <div><LockKeyhole size={16}/> No payment until review</div>
            <div><FileCheck2 size={16}/> Download your answers</div>
          </div>
        </div>

        <aside className="hero-card">
          <div className="hero-card-top">
            <span>THE BRIEF COVERS</span>
            <h2>Everything that changes the build.</h2>
            <div className="hero-card-list">
              {['Business + audience','Goals + conversion path','Pages + functionality','Brand + content readiness','Domain + integrations','Budget + launch timing'].map((item,index)=><div key={item}><i>{index+1}</i>{item}</div>)}
            </div>
          </div>
          <div className="hero-card-bottom">The goal is fewer assumptions, better scope, and a website built around the real problem.</div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="How the inquiry works">
        <div className="trust-strip-inner">
          <div className="trust-item"><Sparkles size={20}/><div><strong>Smart, not exhausting</strong><span>You&apos;ll only see deeper questions when your project actually needs them.</span></div></div>
          <div className="trust-item"><CheckCircle2 size={20}/><div><strong>Scope before price</strong><span>Your budget matters, but it is considered alongside goals, pages, content, and functionality.</span></div></div>
          <div className="trust-item"><LockKeyhole size={20}/><div><strong>Secure payment path</strong><span>Once the brief is submitted, you can reserve the project through Stripe Checkout.</span></div></div>
        </div>
      </section>

      <section className="intake-wrap">
        <div className="intake-heading">
          <div><p className="eyebrow">THE PROJECT BRIEF</p><h2>Enough detail to build from.</h2></div>
          <p>No design degree required. Answer plainly. “I don&apos;t know yet” is useful information too.</p>
        </div>
        <IntakeExperience />
      </section>

      <section className="process-section">
        <div className="process-heading">
          <div><p className="eyebrow">WHAT HAPPENS AFTER</p><h2>A clear path from inquiry to launch.</h2></div>
          <p>The intake is not a contract or instant quote. It gives me the information needed to review fit, confirm scope, and turn the right projects into a clean proposal and build plan.</p>
        </div>
        <div className="process-grid">
          <article><span>01 · REVIEW</span><h3>I read the brief.</h3><p>I look for the real goal, complexity, risks, missing assets, and anything that needs clarification.</p></article>
          <article><span>02 · SCOPE</span><h3>We confirm the build.</h3><p>Pages, functionality, responsibilities, timeline, and deliverables become a concrete project scope.</p></article>
          <article><span>03 · RESERVE</span><h3>You secure the project.</h3><p>Once the scope is agreed, a Stripe deposit can reserve the work and create a clean payment record.</p></article>
          <article><span>04 · BUILD</span><h3>Then we make it real.</h3><p>Design, development, review, launch, and post-launch support follow the agreed project plan.</p></article>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-inner">
        <div><h2>Good websites start with better questions.</h2><p>This intake helps turn an idea into a buildable scope before design and development begin.</p></div>
        <div className="footer-meta"><strong>{studioName}</strong><span>{contactEmail}</span></div>
      </div>
    </footer>
  </div>;
}
