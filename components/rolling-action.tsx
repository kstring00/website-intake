'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const outgoing = {
  rest: { transform: 'translateY(0%)' },
  active: { transform: 'translateY(100%)' },
};

const incoming = {
  rest: { transform: 'translateY(-100%)' },
  active: { transform: 'translateY(0%)' },
};

const still = {
  rest: { transform: 'translateY(0%)' },
  active: { transform: 'translateY(0%)' },
};

export const rollingTransition = {
  duration: 0.3,
  ease: [0.338, 0.015, 0.395, 0.959] as const,
};

function ChevronRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6"/></svg>;
}

export function RollingLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const outgoingVariants = reduceMotion ? still : outgoing;
  const incomingVariants = reduceMotion ? still : incoming;

  return <span className={`rolling-label-window ${className}`} aria-hidden="true">
    <motion.span className="rolling-label-copy" variants={outgoingVariants} transition={rollingTransition}>{children}</motion.span>
    <motion.span className="rolling-label-copy rolling-label-copy--incoming" variants={incomingVariants} transition={rollingTransition}>{children}</motion.span>
  </span>;
}

type RollingButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string;
  icon?: ReactNode;
};

export function RollingButton({ label, icon, className = '', type = 'button', ...props }: RollingButtonProps) {
  const reduceMotion = useReducedMotion();
  return <motion.button
    type={type}
    className={`rolling-action ${className}`}
    initial="rest"
    animate="rest"
    whileHover={reduceMotion ? 'rest' : 'active'}
    whileFocus={reduceMotion ? 'rest' : 'active'}
    transition={rollingTransition}
    {...props}
  >
    <span className="rolling-action-content">
      <RollingLabel>{label}</RollingLabel>
      <span className="rolling-action-icon" aria-hidden="true">{icon ?? <ChevronRightIcon/>}</span>
    </span>
    <span className="sr-only">{label}</span>
  </motion.button>;
}

export function RollingLink({ href, label, className = '' }: { href: string; label: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.a
    href={href}
    className={`rolling-action ${className}`}
    initial="rest"
    animate="rest"
    whileHover={reduceMotion ? 'rest' : 'active'}
    whileFocus={reduceMotion ? 'rest' : 'active'}
    transition={rollingTransition}
    aria-label={label}
  >
    <span className="rolling-action-content" aria-hidden="true">
      <RollingLabel>{label}</RollingLabel>
      <span className="rolling-action-icon"><ChevronRightIcon/></span>
    </span>
  </motion.a>;
}
