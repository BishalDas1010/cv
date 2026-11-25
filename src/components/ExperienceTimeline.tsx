import React, { useState } from 'react';
import { EXPERIENCES } from '../data/portfolioData';

// Y-offsets (%) matching the undulating bezier curve nodes across the 5 desktop columns
const NODE_Y_POSITIONS = [22, 68, 22, 68, 22];

export const ExperienceTimeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(EXPERIENCES[0].id);

  return (
    <div>
      {/* Desktop: 5-Column Connected Curved Wave Timeline */}
      <div className="hidden lg:block relative pt-4">
        {/* Undulating SVG Curve Layer */}
        <div className="relative h-28 w-full mb-2" aria-hidden="true">
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <path
              d="M 60 22 C 145 22, 185 68, 280 68 C 375 68, 405 22, 500 22 C 595 22, 625 68, 720 68 C 815 68, 845 22, 940 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-neutral-300 dark:text-white/20"
            />
          </svg>

          {/* 5 Node Anchors Positioned Along the Curve */}
          <div className="absolute inset-0 grid grid-cols-5">
            {EXPERIENCES.map((item, index) => {
              const isSelected = activeId === item.id;
              const yPercent = NODE_Y_POSITIONS[index];
              return (
                <div key={item.id} className="relative flex justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    onMouseEnter={() => setActiveId(item.id)}
                    aria-label={`Highlight ${item.role} at ${item.organization}`}
                    style={{ top: `${yPercent}%` }}
                    className={`absolute -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-colors duration-150 ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white ring-4 ring-neutral-900/15 dark:ring-white/20'
                          : 'bg-neutral-50 border-neutral-400 dark:bg-[#0A0A0A] dark:border-white/40'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 Milestone Columns */}
        <div className="grid grid-cols-5 gap-6">
          {EXPERIENCES.map((item) => {
            const isSelected = activeId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                className={`p-4 rounded-xl border transition-colors duration-150 ${
                  isSelected
                    ? 'bg-white dark:bg-[#131316] border-neutral-300 dark:border-white/15'
                    : 'bg-transparent border-transparent hover:border-neutral-200 dark:hover:border-white/[0.06]'
                }`}
              >
                <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {item.period}
                  {item.badge ? ` · ${item.badge}` : ''}
                </div>

                <h3 className="font-display text-base font-bold tracking-tight text-neutral-900 dark:text-white mt-2 leading-snug">
                  {item.role}
                </h3>

                <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1.5">
                  {item.organization}
                  {item.location ? ` · ${item.location}` : ''}
                </div>

                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 mt-3">
                  {item.description}
                  {item.highlight ? (
                    <span className="font-mono text-neutral-900 dark:text-neutral-200 tabular-nums">
                      {' '}
                      · {item.highlight}
                    </span>
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet: Clean Vertical Connected Timeline */}
      <div className="lg:hidden relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-300 dark:before:bg-white/15">
        {EXPERIENCES.map((item) => {
          const isSelected = activeId === item.id;
          return (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <span
                className={`absolute -left-6 top-1.5 w-[19px] h-[19px] rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white'
                    : 'bg-neutral-50 border-neutral-400 dark:bg-[#0A0A0A] dark:border-white/40'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-950" />
                )}
              </span>

              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#131316] border-neutral-300 dark:border-white/15'
                    : 'bg-white/60 dark:bg-[#111113] border-neutral-200 dark:border-white/[0.06]'
                }`}
              >
                <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {item.period}
                  {item.badge ? ` · ${item.badge}` : ''}
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-neutral-900 dark:text-white mt-1.5">
                  {item.role}
                </h3>
                <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                  {item.organization}
                  {item.location ? ` · ${item.location}` : ''}
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mt-2.5">
                  {item.description}
                  {item.highlight ? (
                    <span className="font-mono text-neutral-900 dark:text-neutral-200 tabular-nums">
                      {' '}
                      · {item.highlight}
                    </span>
                  ) : null}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
