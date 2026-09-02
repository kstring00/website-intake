import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { IntakeExperience } from '@/components/intake-experience';
import { contactEmail, studioName } from '@/lib/intake-config';

const phases = [
  ['01', 'BRIEF', 'You tell me what you need, why it matters, and what the site has to do.'],
  ['02', 'BUILD', 'I turn the brief into a real website you can open, use, and react to.'],
  ['03', 'REFINE', 'We work through it together for a defined refinement window.'],
  ['04', 'LAUNCH', 'We approve it, connect what matters, test it, and put it live.'],
] as const;

export default function HomePage() {
  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label={`${studioName} home`}>
        <span className="brand-mark">W/</span>
        <span>{studioName}<small>WEB DESIGN + DEVELOPMENT</small></span>
      </a>
      <a className="topbar-link" href="#intake">Begin <ArrowDownRight size={14}/></a>
    </header>

    <main id="top">
      <section className="hero-minimal">
        <div className="hero-minimal-copy">
          <p className="micro-label">WEBSITES, BUILT WITH YOU.</p>
          <h1>Tell me what you’re building.</h1>
          <p>A thoughtful brief gives me what I need to turn the idea into a real website—then we shape it together.</p>
          <a className="hero-cta" href="#intake">Begin your project <ArrowRight size={16}/></a>
        </div>

        <div className="kintsugi-object" aria-label="A fractured form repaired with a gold seam">
          <div className="kintsugi-disc">
            <span className="crack crack-a"/>
            <span className="crack crack-b"/>
            <span className="crack crack-c"/>
            <span className="crack crack-d"/>
            <i className="gold-seam seam-a"/>
            <i className="gold-seam seam-b"/>
            <i className="gold-seam seam-c"/>
            <i className="gold-seam seam-d"/>
          </div>
          <div className="object-caption"><span>DISCONNECTED INPUTS</span><strong>ONE CLEAR DIRECTION</strong></div>
        </div>
      </section>

      <section className="phase-strip" aria-label="Project process">
        {phases.map(([number,title,copy]) => <article key={title}>
          <span>{number}</span>
          <h2>{title}</h2>
          <p>{copy}</p>
        </article>)}
      </section>

      <section className="brief-intro">
        <div><p className="micro-label">THE BRIEF</p><h2>What I need.<br/>Nothing I don’t.</h2></div>
        <p>Need. Purpose. Audience. Function. Content. Identity. Proof. Constraints. How you want to work together.</p>
      </section>

      <div className="intake-container">
        <IntakeExperience />
      </div>

      <section className="after-section">
        <div className="after-number">AFTER</div>
        <div className="after-copy">
          <p className="micro-label">REFINEMENT + LAUNCH</p>
          <h2>You won’t disappear into a design process.</h2>
          <p>You’ll have the live build to look at as it develops. When the first full interpretation is ready, we meet virtually or in person, refine it together for the agreed window, then launch.</p>
        </div>
        <div className="maintenance-note">
          <span>AFTER LAUNCH</span>
          <strong>Maintenance is separate.</strong>
          <p>Ongoing changes, additions, monitoring, and support continue under a monthly maintenance agreement if you want me to stay involved.</p>
        </div>
      </section>
    </main>

    <footer className="footer-minimal">
      <div><span className="footer-mark">W/</span><strong>{studioName}</strong></div>
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      <a href="#intake">Start a project <ArrowRight size={14}/></a>
    </footer>
  </div>;
}
