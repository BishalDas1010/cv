import React, { useEffect, useRef } from 'react';

interface HeroInteractiveHeadlineProps {
  isDark: boolean;
  prefersReduced: boolean;
}

const LINE_ONE = 'SOFTWARE'.split('');
const LINE_TWO = 'ENGINEER'.split('');

export const HeroInteractiveHeadline: React.FC<HeroInteractiveHeadlineProps> = ({
  isDark,
  prefersReduced,
}) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const leftBracketRef = useRef<HTMLSpanElement | null>(null);
  const rightBracketRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReduced) return;

    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!pointerFine) return;

    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let isInside = false;
    let strength = 0;
    let rafId = 0;

    let cachedOffsets: { ox: number; oy: number }[] = [];
    let containerW = 0;
    let containerH = 0;

    const measureOffsets = () => {
      const parentEl = container.parentElement ?? container;
      const prevTransform = container.style.transform;
      container.style.transform = '';
      const pRect = parentEl.getBoundingClientRect();
      containerW = container.offsetWidth || 600;
      containerH = container.offsetHeight || 200;
      cachedOffsets = letterRefs.current.map((el) => {
        if (!el) return { ox: 0, oy: 0 };
        const r = el.getBoundingClientRect();
        return {
          ox: r.left - pRect.left + r.width * 0.5,
          oy: r.top - pRect.top + r.height * 0.5,
        };
      });
      container.style.transform = prevTransform;
    };

    const resetTransforms = () => {
      container.style.transform = '';
      if (leftBracketRef.current) {
        leftBracketRef.current.style.transform = '';
        leftBracketRef.current.style.opacity = '';
      }
      if (rightBracketRef.current) {
        rightBracketRef.current.style.transform = '';
        rightBracketRef.current.style.opacity = '';
      }
      letterRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = '';
          el.style.filter = '';
          el.style.color = '';
        }
      });
    };

    const heroSection = container.closest('section') ?? window;

    const onPointerMove = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.pointerType === 'touch') return;
      mouseX = pe.clientX;
      mouseY = pe.clientY;
      if (!isInside) {
        measureOffsets();
        smoothX = mouseX;
        smoothY = mouseY;
      }
      isInside = true;
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onPointerLeave = () => {
      isInside = false;
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const targetStrength = isInside ? 1 : 0;
      strength += (targetStrength - strength) * (isInside ? 0.15 : 0.1);
      smoothX += (mouseX - smoothX) * 0.2;
      smoothY += (mouseY - smoothY) * 0.2;

      const parentEl = container.parentElement ?? container;
      const parentRect = parentEl.getBoundingClientRect();

      const restLeft = parentEl !== container ? parentRect.left + container.offsetLeft : parentRect.left;
      const restTop = parentEl !== container ? parentRect.top + container.offsetTop : parentRect.top;
      const centerX = restLeft + containerW * 0.5;
      const centerY = restTop + containerH * 0.5;

      const normX = Math.max(-1, Math.min(1, (smoothX - centerX) / Math.max(220, containerW * 0.6)));
      const normY = Math.max(-1, Math.min(1, (smoothY - centerY) / Math.max(150, containerH * 0.85)));

      // Smooth 3D perspective tilt across the whole headline
      const rotY = normX * 5.5 * strength;
      const rotX = -normY * 4.5 * strength;
      const shiftX = normX * 8 * strength;
      const shiftY = normY * 5 * strength;

      container.style.transform = `perspective(1100px) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      // Brackets < and /> breathe outward and brighten cleanly
      if (leftBracketRef.current) {
        const lx = -12 * strength + normX * 6 * strength;
        const ly = normY * 4 * strength;
        const lRot = -6 * strength * (0.5 + normX * 0.5);
        leftBracketRef.current.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0) rotate(${lRot.toFixed(2)}deg)`;
        leftBracketRef.current.style.opacity = (0.65 + 0.35 * strength).toFixed(2);
      }
      if (rightBracketRef.current) {
        const rx = 12 * strength + normX * 6 * strength;
        const ry = normY * 4 * strength;
        const rRot = 6 * strength * (0.5 - normX * 0.5);
        rightBracketRef.current.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) rotate(${rRot.toFixed(2)}deg)`;
        rightBracketRef.current.style.opacity = (0.65 + 0.35 * strength).toFixed(2);
      }

      // Per-letter magnetic proximity lift, scale, tilt & highlight
      const radius = Math.min(230, Math.max(135, containerW * 0.25));
      letterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const o = cachedOffsets[idx];
        if (!o) return;

        const cx = parentRect.left + o.ox;
        const cy = parentRect.top + o.oy;
        const dx = smoothX - cx;
        const dy = smoothY - cy;
        const dist = Math.hypot(dx, dy);
        const rawProximity = Math.max(0, 1 - dist / radius);
        const prox = rawProximity * rawProximity * (3 - 2 * rawProximity) * strength;

        if (prox > 0.004) {
          const liftY = -prox * 11;
          const pushX = (dx / Math.max(40, dist)) * -prox * 4;
          const scale = 1 + prox * 0.11;
          const letterTilt = (dx / radius) * -7 * prox;
          el.style.transform = `translate3d(${pushX.toFixed(2)}px, ${liftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotate(${letterTilt.toFixed(2)}deg)`;
          el.style.color = isDark ? '#ffffff' : '#09090b';
          el.style.filter = isDark
            ? `drop-shadow(0 8px 18px rgba(255,255,255,${(prox * 0.28).toFixed(3)}))`
            : `drop-shadow(0 8px 14px rgba(15,15,18,${(prox * 0.18).toFixed(3)}))`;
        } else {
          el.style.transform = '';
          el.style.color = '';
          el.style.filter = '';
        }
      });

      if (isInside || strength > 0.008) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        strength = 0;
        resetTransforms();
        rafId = 0;
      }
    };

    const handleResize = () => {
      measureOffsets();
    };

    measureOffsets();
    heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
    heroSection.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      heroSection.removeEventListener('pointermove', onPointerMove);
      heroSection.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);
      resetTransforms();
    };
  }, [isDark, prefersReduced]);

  return (
    <h1
      ref={containerRef}
      aria-label="< SOFTWARE ENGINEER />"
      className="relative font-display font-extrabold tracking-[-0.04em] leading-[0.94] text-[clamp(2.35rem,8.5vw,6.75rem)] text-neutral-900 dark:text-neutral-100 select-none text-balance will-change-transform"
    >
      <span aria-hidden="true" className="block">
        <span className="inline-flex items-baseline whitespace-nowrap">
          <span
            ref={leftBracketRef}
            className="inline-block font-normal text-neutral-400 dark:text-neutral-500 mr-1 md:mr-3 will-change-transform"
          >
            &lt;
          </span>
          {LINE_ONE.map((char, idx) => (
            <span
              key={`l1-${idx}`}
              ref={(el) => {
                letterRefs.current[idx] = el;
              }}
              className="inline-block will-change-transform origin-center transition-colors duration-150"
            >
              {char}
            </span>
          ))}
        </span>
        <br />
        <span className="inline-flex items-baseline whitespace-nowrap">
          {LINE_TWO.map((char, idx) => (
            <span
              key={`l2-${idx}`}
              ref={(el) => {
                letterRefs.current[LINE_ONE.length + idx] = el;
              }}
              className="inline-block will-change-transform origin-center transition-colors duration-150"
            >
              {char}
            </span>
          ))}
          <span
            ref={rightBracketRef}
            className="inline-block font-normal text-neutral-400 dark:text-neutral-500 ml-1 md:ml-3 will-change-transform"
          >
            /&gt;
          </span>
        </span>
      </span>
    </h1>
  );
};
