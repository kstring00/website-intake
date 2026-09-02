'use client';

import { useEffect, useRef } from 'react';

export function ElectricBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let decayTimer = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();

    const write = (x: number, y: number, charge: number, shift?: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.setProperty('--electric-x', `${x}px`);
        node.style.setProperty('--electric-y', `${y}px`);
        node.style.setProperty('--electric-charge', String(Math.max(0, Math.min(1, charge))));
        if (typeof shift === 'number') node.style.setProperty('--electric-shift', `${shift}px`);
      });
    };

    const settle = () => {
      window.clearTimeout(decayTimer);
      decayTimer = window.setTimeout(() => {
        node.style.setProperty('--electric-charge', reduced.matches ? '0' : '.08');
      }, 140);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduced.matches) return;
      write(event.clientX, event.clientY, .88);
      settle();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduced.matches) return;
      write(event.clientX, event.clientY, 1);
      settle();
    };

    const onScroll = () => {
      if (reduced.matches) return;
      const now = performance.now();
      const distance = Math.abs(window.scrollY - lastScroll);
      const elapsed = Math.max(16, now - lastTime);
      const velocity = Math.min(1, (distance / elapsed) * 2.4);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const phase = window.scrollY * .013;
      const x = width * (.5 + Math.sin(phase) * .24);
      const y = height * (.54 + Math.cos(phase * .72) * .18);
      const shift = -((window.scrollY * .075) % 160);
      write(x, y, .22 + velocity * .62, shift);
      lastScroll = window.scrollY;
      lastTime = now;
      settle();
    };

    const onLeave = () => settle();

    node.style.setProperty('--electric-x', `${window.innerWidth * .72}px`);
    node.style.setProperty('--electric-y', `${window.innerHeight * .28}px`);
    node.style.setProperty('--electric-charge', reduced.matches ? '0' : '.08');

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(decayTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="electric-backdrop" aria-hidden="true">
    <div className="electric-contours" />
    <div className="electric-charge" />
    <div className="electric-core" />
  </div>;
}
