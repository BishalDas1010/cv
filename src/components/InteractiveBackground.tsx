import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  isDark: boolean;
}

const CODE_SNIPPETS: {
  text: string;
  top: string;
  left: string;
  hideOnMobile?: boolean;
}[] = [
  { text: 'def rag_pipeline(query: str) -> Response:', top: '8%', left: '4%' },
  { text: 'await vectorstore.asimilarity_search(k=5)', top: '14%', left: '62%', hideOnMobile: true },
  { text: '@app.post("/v1/ats-score")', top: '23%', left: '72%' },
  { text: 'const embeddings = Chroma.from_documents(docs)', top: '29%', left: '6%', hideOnMobile: true },
  { text: 'mqtt_client.subscribe("esp32/wearable/imu")', top: '38%', left: '68%' },
  { text: 'tf.lite.Interpreter(model_path="tinyml.tflite")', top: '45%', left: '5%' },
  { text: 'SELECT sensor_id, AVG(bpm) FROM stream GROUP BY 1;', top: '53%', left: '58%', hideOnMobile: true },
  { text: 'graph = StateGraph(AgentState)', top: '61%', left: '8%' },
  { text: 'spark.readStream.format("kafka").load()', top: '69%', left: '66%' },
  { text: 'chain = prompt | mistral_llm | StrOutputParser()', top: '77%', left: '6%', hideOnMobile: true },
  { text: 'docker compose up --build fastapi-worker', top: '85%', left: '64%' },
  { text: 'return {"accuracy": 0.88, "water_saved": "30%"}', top: '91%', left: '10%' },
];

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ isDark }) => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layerRef.current;
    const ringEl = ringRef.current;
    if (!el) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = motionQuery.matches;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.3;
    let currentX = targetX;
    let currentY = targetY;
    let isActive = false;
    let rafId = 0;

    const applyPosition = (x: number, y: number, active: boolean) => {
      el.style.setProperty('--mx', `${x.toFixed(1)}px`);
      el.style.setProperty('--my', `${y.toFixed(1)}px`);
      el.style.setProperty('--m-opacity', active ? '1' : '0.45');
      if (ringEl) {
        ringEl.style.transform = `translate3d(${(x - 110).toFixed(1)}px, ${(y - 110).toFixed(1)}px, 0) scale(${active ? 1 : 0.88})`;
        ringEl.style.opacity = active && !prefersReduced ? '1' : '0';
      }
    };

    applyPosition(currentX, currentY, false);

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReduced || e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
      isActive = true;
    };

    const onPointerLeave = () => {
      isActive = false;
    };

    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      if (prefersReduced) {
        applyPosition(window.innerWidth * 0.5, window.innerHeight * 0.25, false);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    motionQuery.addEventListener('change', onMotionChange);

    const tick = () => {
      if (!prefersReduced) {
        currentX += (targetX - currentX) * 0.13;
        currentY += (targetY - currentY) * 0.13;
        applyPosition(currentX, currentY, isActive);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  const baseLine = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 15, 18, 0.04)';
  const activeLine = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 15, 18, 0.13)';
  const hatchColor = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(15, 15, 18, 0.035)';
  const ambientBloom = isDark
    ? 'radial-gradient(460px circle at var(--mx, 50%) var(--my, 30%), rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015) 45%, transparent 74%)'
    : 'radial-gradient(460px circle at var(--mx, 50%) var(--my, 30%), rgba(15, 15, 18, 0.045), rgba(15, 15, 18, 0.012) 45%, transparent 74%)';

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Layer 1: Base Architectural Hairline Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${baseLine} 1px, transparent 1px), linear-gradient(to bottom, ${baseLine} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Layer 2: Quiet Base Coding Fragments */}
      <div className="absolute inset-0 font-mono text-[11px] sm:text-xs tracking-tight text-neutral-900/[0.045] dark:text-white/[0.04]">
        {CODE_SNIPPETS.map((snippet) => (
          <span
            key={snippet.text}
            style={{ top: snippet.top, left: snippet.left }}
            className={`${snippet.hideOnMobile ? 'hidden md:inline' : 'inline'} absolute whitespace-nowrap`}
          >
            {snippet.text}
          </span>
        ))}
      </div>

      {/* Layer 3: Cursor-Revealed Coding Layer + High-Contrast Grid */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--m-opacity, 0.45)',
          backgroundImage: `linear-gradient(to right, ${activeLine} 1px, transparent 1px), linear-gradient(to bottom, ${activeLine} 1px, transparent 1px), repeating-linear-gradient(-45deg, ${hatchColor} 0px, ${hatchColor} 1px, transparent 1px, transparent 12px)`,
          backgroundSize: '48px 48px, 48px 48px, 100% 100%',
          WebkitMaskImage:
            'radial-gradient(310px circle at var(--mx, 50%) var(--my, 30%), black 0%, rgba(0,0,0,0.5) 48%, transparent 100%)',
          maskImage:
            'radial-gradient(310px circle at var(--mx, 50%) var(--my, 30%), black 0%, rgba(0,0,0,0.5) 48%, transparent 100%)',
        }}
      >
        <div className="relative w-full h-full font-mono text-[11px] sm:text-xs tracking-tight text-neutral-900/35 dark:text-white/30">
          {CODE_SNIPPETS.map((snippet) => (
            <span
              key={`active-${snippet.text}`}
              style={{ top: snippet.top, left: snippet.left }}
              className={`${snippet.hideOnMobile ? 'hidden md:inline' : 'inline'} absolute whitespace-nowrap`}
            >
              {snippet.text}
            </span>
          ))}
        </div>
      </div>

      {/* Layer 4: Soft Cursor Ambient Radial Bloom */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--m-opacity, 0.45)',
          background: ambientBloom,
        }}
      />

      {/* Layer 5: Cursor-Tracked Code Inspector Lens Ring (Desktop Pointer Only) */}
      <div
        ref={ringRef}
        className="hidden md:flex items-center justify-between px-2.5 absolute top-0 left-0 w-[220px] h-[220px] rounded-full border border-neutral-900/12 dark:border-white/[0.12] transition-opacity duration-300 will-change-transform"
      >
        <span className="font-mono text-[10px] text-neutral-900/25 dark:text-white/25">&lt;</span>
        <div className="absolute inset-4 rounded-full border border-dashed border-neutral-900/[0.07] dark:border-white/[0.07]" />
        <span className="font-mono text-[10px] text-neutral-900/25 dark:text-white/25">/&gt;</span>
      </div>
    </div>
  );
};
