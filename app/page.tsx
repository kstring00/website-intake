import { ArrowDownRight, ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { IntakeExperience } from '@/components/intake-experience';
import { contactEmail, studioName } from '@/lib/intake-config';

const orbitLabels = ['STRATEGY', 'IDENTITY', 'CONVERSION', 'BUILD'];

export default function HomePage() {
  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label={`${studioName} website intake home`}>
        <span className="brand-mark">W/</span>
        <span>{studioName}<small>DIGITAL PROJECT STUDIO</small></span>
      </a>
      <div className="topbar-center">PROJECT INTAKE · 01/03</div>
      <a className="topbar-link" href="#intake">Begin brief <ArrowDownRight size={15}/></a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy-wrap">
          <div className="hero-index"><span>01</span><i/><span>DISCOVERY</span></div>
          <p className="eyebrow">WEBSITES BUILT FROM THE BUSINESS OUT</p>
          <h1>Your website should feel <em>inevitable.</em></h1>
          <p className="hero-copy">Not a template with your logo dropped in. This brief uncovers what the business needs to communicate, prove, automate, sell, and make effortless—before a single screen is designed.</p>
          <div className="hero-actions">
            <a className="primary" href="#intake">Build my project brief <ArrowRight size={17}/></a>
            <span className="hero-time">08–12 MIN · AUTOSAVES</span>
          </div>
          <div className="hero-proof">
            <div><ShieldCheck size={15}/> Private project discovery</div>
            <div><FileCheck2 size={15}/> Complete scope snapshot</div>
            <div><LockKeyhole size={15}/> Stripe-ready reservation</div>
          </div>
        </div>

        <aside className="instrument" aria-label="Website project architecture visual">
          <div className="instrument-grid"/>
          <div className="instrument-label"><span>PROJECT ARCHITECTURE</span><strong>01 / 04</strong></div>
          <div className="orbit orbit-a"/>
          <div className="orbit orbit-b"/>
          <div className="orbit orbit-c"/>
          <div className="core"><span>YOUR</span><strong>SITE</strong></div>
          {orbitLabels.map((label,index)=><div className={`orbit-node node-${index+1}`} key={label}><i>{index+1}</i><span>{label}</span></div>)}
          <div className="instrument-caption"><span>THE SYSTEM</span><p>Every choice should connect back to the outcome your business actually needs.</p></div>
        </aside>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0,1].map(group=><div className="marquee-group" key={group}>
            <span>DISCOVERY</span><i/> <span>POSITIONING</span><i/> <span>UX</span><i/> <span>DESIGN</span><i/> <span>DEVELOPMENT</span><i/> <span>CONVERSION</span><i/> <span>LAUNCH</span><i/>
          </div>)}
        </div>
      </div>

      <section className="thesis-section">
        <div className="thesis-number">02</div>
        <div className="thesis-copy">
          <p className="eyebrow">WHY THE BRIEF EXISTS</p>
          <h2>Most website problems start <em>before</em> design.</h2>
        </div>
        <div className="thesis-grid">
          <article><span>01</span><h3>We find the real job.</h3><p>What the site must make clearer, faster, easier, more credible, or more profitable.</p></article>
          <article><span>02</span><h3>We expose complexity early.</h3><p>Accounts, payments, booking, integrations, content, SEO, and operational constraints belong in scope—not surprises.</p></article>
          <article><span>03</span><h3>We design from evidence.</h3><p>Your audience, offer, proof, goals, and existing assets become inputs to the visual system.</p></article>
        </div>
      </section>

      <section className="intake-wrap">
        <div className="intake-heading">
          <div className="section-index"><span>03</span><i/></div>
          <div><p className="eyebrow">THE PROJECT BRIEF</p><h2>Tell me enough to think like your <em>partner.</em></h2></div>
          <p>No polished marketing language required. Direct answers are better. “I don&apos;t know yet” is useful information too.</p>
        </div>
        <IntakeExperience />
      </section>

      <section className="process-section">
        <div className="process-heading">
          <div><p className="eyebrow">AFTER YOU SUBMIT</p><h2>From idea to a buildable system.</h2></div>
          <p>The intake is discovery—not a binding quote. I use it to confirm fit, identify risks, define responsibilities, and turn the right project into a precise proposal.</p>
        </div>
        <div className="process-grid">
          <article><span>01 / REVIEW</span><h3>Read the signal.</h3><p>I isolate the real objective, gaps, dependencies, and what needs clarification.</p><i/></article>
          <article><span>02 / ARCHITECT</span><h3>Shape the system.</h3><p>Pages, flows, features, content, and technical requirements become a concrete scope.</p><i/></article>
          <article><span>03 / RESERVE</span><h3>Secure the build.</h3><p>Once scope is agreed, Stripe creates a clean deposit and payment record tied to your project.</p><i/></article>
          <article><span>04 / CREATE</span><h3>Make it unmistakable.</h3><p>Design, development, refinement, launch, and support move against the agreed plan.</p><i/></article>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-mark">◆</div>
        <p>GOOD WEBSITES ARE NOT DECORATED.</p>
        <h2>They are <em>resolved.</em></h2>
        <a href="#intake">Start the brief <ArrowRight size={16}/></a>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-wordmark"><span>W/</span><strong>{studioName}</strong></div>
        <div><p>PROJECT DISCOVERY · DESIGN · DEVELOPMENT</p><span>{contactEmail}</span></div>
        <div className="footer-status"><i/> ACCEPTING SELECT PROJECTS</div>
      </div>
    </footer>
  </div>;
}
