import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, User } from 'lucide-react';
import { CROWD_WALKERS, PROFILE } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const FOOTER_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
];

interface WalkerRuntime {
  x: number;
  dir: 1 | -1;
  speed: number;
  walkPhase: number;
  strideBlend: number;
  pauseRemaining: number;
  startDelayRemaining: number;
  hovered: boolean;
  initialized: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const walkerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runtimeRef = useRef<WalkerRuntime[]>(
    CROWD_WALKERS.map((w) => ({
      x: 0,
      dir: w.direction,
      speed: w.baseSpeed,
      walkPhase: w.bouncePhase,
      strideBlend: 0,
      pauseRemaining: 0,
      startDelayRemaining: w.startDelayMs / 1000,
      hovered: false,
      initialized: false,
    }))
  );
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});
  const [meFailed, setMeFailed] = useState(false);

  const markFailed = (id: string) => {
    setFailedIds((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = motionQuery.matches;
    const runtime = runtimeRef.current;

    const layoutStaticCrowd = () => {
      const stageWidth = stageEl.clientWidth || 1000;
      CROWD_WALKERS.forEach((walker, idx) => {
        const el = walkerRefs.current[idx];
        if (!el) return;
        const w = el.offsetWidth || 120;
        const x = walker.initialProgress * Math.max(180, stageWidth - w * 0.6) - w * 0.2;
        runtime[idx].x = x;
        runtime[idx].strideBlend = 0;
        runtime[idx].initialized = true;
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, 0)`;
      });
    };

    layoutStaticCrowd();

    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      if (prefersReduced) {
        layoutStaticCrowd();
      }
    };
    motionQuery.addEventListener('change', onMotionChange);

    let rafId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      if (!prefersReduced) {
        const elapsed = (now - startTime) / 1000;
        const stageWidth = stageEl.clientWidth || 1000;
        const speedScale = stageWidth < 640 ? 0.72 : 1;

        CROWD_WALKERS.forEach((walker, idx) => {
          const el = walkerRefs.current[idx];
          if (!el || el.offsetParent === null) return;

          const state = runtime[idx];
          const charWidth = el.offsetWidth || 120;

          if (!state.initialized) {
            state.x = walker.initialProgress * Math.max(180, stageWidth - charWidth * 0.6) - charWidth * 0.2;
            state.initialized = true;
          }

          if (state.startDelayRemaining > 0) {
            state.startDelayRemaining = Math.max(0, state.startDelayRemaining - dt);
          }

          if (state.pauseRemaining > 0) {
            state.pauseRemaining = Math.max(0, state.pauseRemaining - dt);
          }

          const isWaiting = state.hovered || state.startDelayRemaining > 0 || state.pauseRemaining > 0;
          const targetBlend = isWaiting ? 0 : 1;

          // Smooth deceleration when pausing/hovering and smooth acceleration into stride
          const blendRate = targetBlend === 0 ? 9.5 : 5.2;
          state.strideBlend += (targetBlend - state.strideBlend) * Math.min(1, dt * blendRate);
          if (Math.abs(targetBlend - state.strideBlend) < 0.002) {
            state.strideBlend = targetBlend;
          }

          // Subtle natural stroll pace drift so walkers never move like rigid robots
          const paceDrift = 1 + 0.07 * Math.sin(elapsed * 0.55 + walker.bouncePhase * 1.7);

          // Advance continuous stride phase locked to actual walking speed
          const effectiveSpeedRatio = (state.speed / walker.baseSpeed) * paceDrift;
          const angularFreq = walker.bounceFreq * 0.52 * effectiveSpeedRatio;
          state.walkPhase += dt * angularFreq * state.strideBlend;

          // Stride-coupled horizontal surge (slight push-off surge, gentler at foot plant)
          const stepPulse = Math.cos(state.walkPhase * 2);
          const strideCadence = 1 + 0.12 * stepPulse;

          if (state.strideBlend > 0.002 && state.pauseRemaining <= 0 && state.startDelayRemaining <= 0) {
            state.x +=
              state.dir *
              state.speed *
              speedScale *
              paceDrift *
              strideCadence *
              state.strideBlend *
              dt;

            // Exited stage -> short random pause, then re-enter from opposite side
            if (state.dir === 1 && state.x > stageWidth + 18) {
              state.pauseRemaining = 0.25 + Math.random() * 1.1;
              state.x = -charWidth - 18;
              state.speed = walker.baseSpeed * (0.84 + Math.random() * 0.32);
            } else if (state.dir === -1 && state.x < -charWidth - 18) {
              state.pauseRemaining = 0.25 + Math.random() * 1.1;
              state.x = stageWidth + 18;
              state.speed = walker.baseSpeed * (0.84 + Math.random() * 0.32);
            }
          }

          // Rounded cosine gait arc (two steps per full cycle) instead of sharp |sin| bounce
          const stepArc = 0.5 - 0.5 * Math.cos(state.walkPhase * 2);
          const bounceAmp = walker.layer === 'front' ? 4.2 : 3.5;
          const bounceY = -stepArc * bounceAmp * state.strideBlend;

          // Natural forward lean toward direction of travel + left/right shoulder sway
          const forwardLean = state.dir * 1.4 * state.strideBlend;
          const shoulderSway = Math.sin(state.walkPhase) * 1.35 * state.strideBlend;
          const tiltDeg = forwardLean + shoulderSway;

          // Subtle 3/4 facing angle toward travel + tiny compression at foot plant
          const turnYDeg = state.dir * -7.5 * state.strideBlend;
          const footPlant = 1 - stepArc;
          const scaleY = 1 - footPlant * 0.009 * state.strideBlend;
          const scaleX = 1 + footPlant * 0.007 * state.strideBlend;

          el.style.transform = `perspective(900px) translate3d(${state.x.toFixed(1)}px, ${bounceY.toFixed(2)}px, 0) rotateY(${turnYDeg.toFixed(2)}deg) rotateZ(${tiltDeg.toFixed(2)}deg) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
        });
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <footer className="border-t border-neutral-200 dark:border-white/[0.08] pt-14 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10">
          {/* Left: Wordmark & Role */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-display text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white">
              BISHAL.
            </div>
            <p className="font-display text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 max-w-[230px] leading-snug">
              {PROFILE.role}
            </p>
          </div>

          {/* Center: Footer Links Above the Crowd */}
          <nav
            aria-label="Footer navigation"
            className="md:col-span-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={`#${link.target}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.target);
                }}
                className="min-h-[40px] inline-flex items-center text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Direct Email & Copyright */}
          <div className="md:col-span-3 md:text-right space-y-2">
            <div>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-white hover:underline underline-offset-4 break-all"
              >
                <span>{PROFILE.email}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500 tabular-nums">
              © {PROFILE.copyrightYear} {PROFILE.fullName}
            </div>
          </div>
        </div>

        {/* Sign-Off Bar Above Crowd */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            See you around.
          </p>

          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="min-h-[44px] px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Living Crowd Footer Stage: overflow-hidden clips only bottom edges */}
        <div
          ref={stageRef}
          className="relative w-full h-[215px] sm:h-[280px] md:h-[335px] rounded-t-2xl overflow-hidden bg-white border-t border-x border-neutral-200 dark:border-white/10 select-none"
        >
          {/* Large Faded BISHAL Watermark Behind Everyone (~20vw) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
          >
            <span className="font-display font-extrabold text-[20vw] leading-none tracking-[-0.04em] text-neutral-200/80 whitespace-nowrap">
              BISHAL
            </span>
          </div>

          {/* 11 Walking Transparent PNG Figures (p1 to p11) Behind Me */}
          {CROWD_WALKERS.map((walker, index) => {
            const isFailed = Boolean(failedIds[walker.id]);
            const depthZ =
              walker.layer === 'front'
                ? 'z-20 hover:z-30'
                : 'z-10 hover:z-30 opacity-95';
            return (
              <div
                key={walker.id}
                ref={(el) => {
                  walkerRefs.current[index] = el;
                }}
                onMouseEnter={() => {
                  runtimeRef.current[index].hovered = true;
                }}
                onMouseLeave={() => {
                  runtimeRef.current[index].hovered = false;
                }}
                style={{ '--person-scale': walker.heightScale } as React.CSSProperties}
                className={`${
                  walker.hideOnMobile ? 'hidden sm:flex' : 'flex'
                } absolute bottom-0 left-0 -mb-3.5 sm:-mb-4 ${depthZ} items-end h-[calc(152px*var(--person-scale))] sm:h-[calc(218px*var(--person-scale))] md:h-[calc(264px*var(--person-scale))] will-change-transform origin-bottom`}
              >
                <div className="h-full flex items-end transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-3 cursor-pointer">
                  {!isFailed ? (
                    <img
                      src={walker.src}
                      alt={walker.alt}
                      referrerPolicy="no-referrer"
                      onError={() => markFailed(walker.id)}
                      className="h-full w-auto object-contain object-bottom block pointer-events-none drop-shadow-[0_0_2px_rgba(255,255,255,0.96)]"
                    />
                  ) : (
                    <div className="h-32 w-20 rounded-t-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-500">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* My Figure (me.png): Exact Center, Always In Front (z-40), Stationary Except Hover Lift */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-3.5 sm:-mb-4 z-40 flex items-end justify-center h-[148px] sm:h-[218px] md:h-[268px]">
            <div className="h-full flex items-end transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-3 cursor-pointer">
              {!meFailed ? (
                <img
                  src={PROFILE.meFigureImage}
                  alt="Illustrated standing portrait of Bishal in the center of the crowd"
                  referrerPolicy="no-referrer"
                  onError={() => setMeFailed(true)}
                  className="h-full w-auto object-contain object-bottom block pointer-events-none drop-shadow-[0_0_5px_rgba(255,255,255,0.98)]"
                />
              ) : (
                <div className="h-36 w-24 rounded-t-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700">
                  <User className="w-7 h-7" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
