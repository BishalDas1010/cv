import React, { useState } from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectFolderCardProps {
  project: ProjectItem;
  isMatchedBySkill: boolean;
  hasActiveSkillFilter: boolean;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({
  project,
  isMatchedBySkill,
  hasActiveSkillFilter,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  const dimmed = hasActiveSkillFilter && !isMatchedBySkill;

  return (
    <article
      className={`group flex flex-col transition-opacity duration-200 ${
        dimmed ? 'opacity-40 hover:opacity-85' : 'opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(project)}
        aria-label={`Open ${project.title} ${project.ctaLabel.toLowerCase()}`}
        className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-2xl cursor-pointer"
      >
        {/* Tactile Folder Silhouette */}
        <div className="relative pt-4">
          {/* Folder Top Tab */}
          <div
            className="w-[44%] h-4 rounded-t-xl bg-neutral-200 dark:bg-[#1C1C1F] border-t border-x border-neutral-300/80 dark:border-white/[0.08] ml-0.5 transition-colors duration-200"
            aria-hidden="true"
          />

          {/* Folder Back Container + Layered Peeking Sheets */}
          <div className="relative rounded-b-2xl rounded-tr-2xl bg-neutral-200/90 dark:bg-[#19191C] border border-neutral-300/80 dark:border-white/[0.08] pt-3 px-3 pb-0 overflow-hidden shadow-sm">
            {/* Back Sheet */}
            <div
              className="mx-2 h-8 rounded-t-lg bg-neutral-100 dark:bg-[#232327] border border-neutral-300/60 dark:border-white/[0.07] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] px-3 pt-1.5"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{project.organization}</span>
                <span className="tabular-nums">{project.year}</span>
              </div>
            </div>

            {/* Middle Preview Sheet with Project Visual */}
            <div
              className="-mt-3 mx-0.5 h-24 rounded-t-xl overflow-hidden bg-neutral-900 border border-neutral-300/60 dark:border-white/10 transform translate-y-2 group-hover:-translate-y-0.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
              aria-hidden="true"
            >
              {!imgError ? (
                <img
                  src={project.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-neutral-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Front Folder Sleeve */}
            <div
              className={`relative -mt-8 z-10 rounded-xl bg-white dark:bg-[#131316] border px-5 pt-6 pb-5 flex items-end justify-between gap-3 transition-colors duration-200 ${
                isMatchedBySkill && hasActiveSkillFilter
                  ? 'border-neutral-900 dark:border-white/40'
                  : 'border-neutral-200 dark:border-white/[0.08] group-hover:border-neutral-400 dark:group-hover:border-white/20'
              }`}
            >
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-snug">
                  {project.title}
                </h3>
              </div>

              <span className="w-9 h-9 min-w-[36px] rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Clean Unboxed Metadata Row Below Folder */}
        <div className="mt-3.5 px-1 space-y-1">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="truncate">{project.subtitle}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 dark:text-neutral-200 group-hover:underline underline-offset-4">
            <span>{project.ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </button>
    </article>
  );
};
