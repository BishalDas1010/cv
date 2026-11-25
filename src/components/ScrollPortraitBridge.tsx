import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface ScrollPortraitBridgeProps {
  rootRef: React.RefObject<HTMLDivElement | null>;
  heroSlotRef: React.RefObject<HTMLDivElement | null>;
  aboutSlotRef: React.RefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  fallbackName: string;
  hasError: boolean;
  onError: () => void;
  prefersReduced: boolean;
}

interface BoxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const ScrollPortraitBridge: React.FC<ScrollPortraitBridgeProps> = ({
  rootRef,
  heroSlotRef,
  aboutSlotRef,
  src,
  alt,
  fallbackName,
  hasError,
  onError,
  prefersReduced,
}) => {
  const bridgeRef = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const bracketsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;

    const rootEl = rootRef.current;
    const heroEl = heroSlotRef.current;
    const aboutEl = aboutSlotRef.current;
    const bridgeEl = bridgeRef.current;
    const ghostEl = ghostRef.current;
    const imgEl = imgRef.current;
    const sheenEl = sheenRef.current;
    const bracketsEl = bracketsRef.current;

    if (!rootEl || !heroEl || !aboutEl || !bridgeEl) return;

    let heroRect: BoxRect | null = null;
    let aboutRect: BoxRect | null = null;
    let rafId = 0;
    let targetRawT = 0;
    let currentRawT = 0;
    let trailRawT = 0;
    let initialized = false;

    const measureSlots = () => {
      const rBox = rootEl.getBoundingClientRect();
      const hBox = heroEl.getBoundingClientRect();
      const aBox = aboutEl.getBoundingClientRect();

      heroRect = {
        left: hBox.left - rBox.left,
        top: hBox.top - rBox.top,
        width: hBox.width,
        height: hBox.height,
      };
      aboutRect = {
        left: aBox.left - rBox.left,
        top: aBox.top - rBox.top,
        width: aBox.width,
        height: aBox.height,
      };
    };

    const computeTargetT = () => {
      if (!heroRect || !aboutRect) return 0;
      const vh = window.innerHeight || 800;
      const scrollStart = Math.max(12, heroRect.top - vh * 0.42);
      const scrollEnd = Math.max(scrollStart + 200, aboutRect.top - vh * 0.32);
      return clamp((window.scrollY - scrollStart) / (scrollEnd - scrollStart), 0, 1);
    };

    const computePose = (rawT: number, isDesktop: boolean) => {
      if (!heroRect || !aboutRect) {
        return { x: 0, y: 0, w: 0, h: 0, scale: 1, tiltX: 0, tiltY: 0, tiltZ: 0, arc: 0, t: 0 };
      }

      const t = easeInOutCubic(rawT);
      const arc = Math.sin(t * Math.PI);
      const wave = Math.sin(t * Math.PI * 2);

      // Subtle lateral glide arc so even vertically aligned mobile portraits sweep gracefully
      const lateralOffset = isDesktop ? arc * 26 : arc * 16;
      const verticalLift = -arc * (isDesktop ? 22 : 12);

      const x = lerp(heroRect.left, aboutRect.left, t) + lateralOffset;
      const y = lerp(heroRect.top, aboutRect.top, t) + verticalLift;
      const w = lerp(heroRect.width, aboutRect.width, t);
      const h = lerp(heroRect.height, aboutRect.height, t);

      const scale = 1 + arc * (isDesktop ? 0.095 : 0.065);
      const tiltX = arc * 8.5;
      const tiltY = wave * (isDesktop ? -10.5 : -6.5);
      const tiltZ = arc * (isDesktop ? -3.2 : -2.0);

      return { x, y, w, h, scale, tiltX, tiltY, tiltZ, arc, t };
    };

    const renderFrame = () => {
      if (!heroRect || !aboutRect) measureSlots();
      if (!heroRect || !aboutRect) return;

      const isDesktop = window.innerWidth >= 1024;
      const pose = computePose(currentRawT, isDesktop);
      const trailPose = computePose(trailRawT, isDesktop);
      const velocity = Math.abs(currentRawT - trailRawT);

      // Main 3D perspective card transform
      bridgeEl.style.width = `${pose.w.toFixed(1)}px`;
      bridgeEl.style.height = `${pose.h.toFixed(1)}px`;
      bridgeEl.style.transform = `perspective(1200px) translate3d(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px, 0) scale(${pose.scale.toFixed(4)}) rotateX(${pose.tiltX.toFixed(2)}deg) rotateY(${pose.tiltY.toFixed(2)}deg) rotateZ(${pose.tiltZ.toFixed(2)}deg)`;
      bridgeEl.style.boxShadow =
        pose.arc > 0.015
          ? `0 ${Math.round(16 + pose.arc * 28)}px ${Math.round(30 + pose.arc * 40)}px rgba(0, 0, 0, ${(0.26 + pose.arc * 0.34).toFixed(2)})`
          : '';

      // Inner image subtle zoom-in during flight
      if (imgEl) {
        const innerScale = 1 + pose.arc * 0.075;
        const innerBrightness = 1 + pose.arc * 0.06;
        imgEl.style.transform = `scale(${innerScale.toFixed(4)})`;
        imgEl.style.filter = pose.arc > 0.01 ? `brightness(${innerBrightness.toFixed(3)})` : '';
      }

      // Specular light glint sweeping diagonally across portrait glass
      if (sheenEl) {
        const sheenX = lerp(-140, 210, pose.t);
        sheenEl.style.transform = `translate3d(${sheenX.toFixed(1)}%, 0, 0) skewX(-18deg)`;
        sheenEl.style.opacity = (pose.arc * 0.85).toFixed(3);
      }

      // Architectural corner brackets that expand outward mid-flight and lock flush at rest
      if (bracketsEl) {
        const bracketScale = 1 + pose.arc * 0.045;
        bracketsEl.style.opacity = clamp(pose.arc * 1.45, 0, 0.9).toFixed(3);
        bracketsEl.style.transform = `scale(${bracketScale.toFixed(4)})`;
      }

      // Trailing motion-echo silhouette behind main card during active scroll
      if (ghostEl) {
        const ghostOpacity = clamp(velocity * 4.2, 0, 0.42) * (0.25 + pose.arc * 0.75);
        ghostEl.style.width = `${trailPose.w.toFixed(1)}px`;
        ghostEl.style.height = `${trailPose.h.toFixed(1)}px`;
        ghostEl.style.transform = `perspective(1200px) translate3d(${trailPose.x.toFixed(1)}px, ${trailPose.y.toFixed(1)}px, 0) scale(${(trailPose.scale * 0.985).toFixed(4)}) rotateX(${(trailPose.tiltX * 1.15).toFixed(2)}deg) rotateY(${(trailPose.tiltY * 1.2).toFixed(2)}deg) rotateZ(${(trailPose.tiltZ * 1.25).toFixed(2)}deg)`;
        ghostEl.style.opacity = ghostOpacity.toFixed(3);
        ghostEl.style.visibility = ghostOpacity > 0.005 ? 'visible' : 'hidden';
      }
    };

    const tick = () => {
      targetRawT = computeTargetT();

      if (!initialized) {
        currentRawT = targetRawT;
        trailRawT = targetRawT;
        initialized = true;
      } else {
        currentRawT += (targetRawT - currentRawT) * 0.16;
        trailRawT += (currentRawT - trailRawT) * 0.14;
      }

      renderFrame();

      const stillMoving =
        Math.abs(targetRawT - currentRawT) > 0.0004 ||
        Math.abs(currentRawT - trailRawT) > 0.0004;

      if (stillMoving) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentRawT = targetRawT;
        trailRawT = targetRawT;
        renderFrame();
        rafId = 0;
      }
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      measureSlots();
      targetRawT = computeTargetT();
      currentRawT = targetRawT;
      trailRawT = targetRawT;
      renderFrame();
    };

    measureSlots();
    targetRawT = computeTargetT();
    currentRawT = targetRawT;
    trailRawT = targetRawT;
    initialized = true;
    renderFrame();

    const resizeObserver = new ResizeObserver(() => {
      measureSlots();
      scheduleUpdate();
    });
    resizeObserver.observe(rootEl);
    resizeObserver.observe(heroEl);
    resizeObserver.observe(aboutEl);

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, [rootRef, heroSlotRef, aboutSlotRef, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Trailing Motion-Echo Ghost Layer */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-[19] rounded-2xl overflow-hidden border border-neutral-400/50 dark:border-white/20 bg-neutral-200 dark:bg-neutral-900 opacity-0 will-change-transform origin-center"
      >
        {!hasError && (
          <img
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top grayscale contrast-125 opacity-60"
          />
        )}
      </div>

      {/* Main 3D Animated Portrait Card */}
      <div
        ref={bridgeRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-20 rounded-2xl border border-neutral-300 dark:border-white/15 bg-[#27292E] shadow-xl will-change-transform origin-center"
      >
        {/* Architectural Reticle Corner Brackets (Fade in mid-flight) */}
        <div
          ref={bracketsRef}
          className="pointer-events-none absolute -inset-2.5 opacity-0 will-change-transform"
        >
          <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 rounded-tl-md border-neutral-900/70 dark:border-white/75" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 rounded-tr-md border-neutral-900/70 dark:border-white/75" />
          <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 rounded-bl-md border-neutral-900/70 dark:border-white/75" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 rounded-br-md border-neutral-900/70 dark:border-white/75" />
        </div>

        {/* Clipped Portrait & Specular Glint Surface */}
        <div className="relative w-full h-full rounded-[15px] overflow-hidden">
          {!hasError ? (
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={onError}
              className="w-full h-full object-cover object-top will-change-transform grayscale contrast-110 hover:grayscale-0 transition-all duration-500 cursor-pointer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-950 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <User className="w-10 h-10" />
              <span className="text-xs font-medium">{fallbackName}</span>
            </div>
          )}

          {/* Diagonal Specular Light Glint */}
          <div
            ref={sheenRef}
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-2/3 opacity-0 will-change-transform"
            style={{
              background:
                'linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.26) 48%, rgba(255,255,255,0.06) 62%, transparent 82%)',
            }}
          />
        </div>
      </div>
    </>
  );
};

