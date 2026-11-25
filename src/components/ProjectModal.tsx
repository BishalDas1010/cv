import React, { useEffect, useState } from 'react';
import { ArrowUpRight, FolderOpen, X } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      {/* Mobile Bottom Sheet -> Desktop Centered Editorial Modal */}
      <div
        className="w-full md:max-w-3xl max-h-[90dvh] md:max-h-[86vh] rounded-t-3xl md:rounded-2xl bg-white dark:bg-[#121214] border-t md:border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle Affordance */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" aria-hidden="true" />
        </div>

        {/* Sticky Modal Header */}
        <div className="px-5 md:px-7 py-4 border-b border-neutral-200 dark:border-white/[0.08] flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.organization}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
            </div>
            <h2
              id="project-modal-title"
              className="font-display text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1"
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 md:px-7 py-5 space-y-6">
          {/* Preview Frame */}
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-white/[0.08]">
            {!imgError ? (
              <img
                src={project.image}
                alt={`${project.title} interface preview`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center gap-2 text-neutral-400">
                <FolderOpen className="w-8 h-8" />
                <span className="text-sm font-medium">{project.title}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <p className="text-[15px] md:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            {project.summary}
          </p>

          {/* Quantitative Impact Row */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-neutral-200 dark:border-white/[0.08]">
            {project.impact.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <div className="font-display text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums truncate">
                  {metric.value}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Challenge & Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-semibold text-neutral-900 dark:text-white mb-1.5">
                Problem &amp; Context
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.challenge}
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-neutral-900 dark:text-white mb-1.5">
                System Architecture
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.architecture}
              </p>
            </div>
          </div>

          {/* Stack List (Clean unboxed metadata separated by middot) */}
          <div>
            <h3 className="font-display text-sm font-semibold text-neutral-900 dark:text-white mb-1.5">
              Technologies Used
            </h3>
            <p className="text-xs font-mono leading-relaxed text-neutral-600 dark:text-neutral-400">
              {project.skills.join(' · ')}
            </p>
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="px-5 md:px-7 py-4 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#0E0E10] flex items-center justify-between gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-sm font-medium rounded-xl border border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Back to projects
          </button>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-5 py-2 text-sm font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span>View on GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
