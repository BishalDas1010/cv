import React from 'react';
import { Briefcase, FolderKanban, Home, Layers, Mail, Moon, Sun } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export type NavSection = 'hero' | 'skills' | 'projects' | 'experience' | 'contact';

interface NavbarProps {
  activeSection: NavSection;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (sectionId: string) => void;
}

const DESKTOP_LINKS: { label: string; target: string; id: NavSection }[] = [
  { label: 'About', target: 'about', id: 'hero' },
  { label: 'Skills', target: 'skills', id: 'skills' },
  { label: 'Projects', target: 'projects', id: 'projects' },
  { label: 'Experience', target: 'experience', id: 'experience' },
];

const MOBILE_TABS: { label: string; target: string; id: NavSection; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Home', target: 'hero', id: 'hero', icon: Home },
  { label: 'Skills', target: 'skills', id: 'skills', icon: Layers },
  { label: 'Projects', target: 'projects', id: 'projects', icon: FolderKanban },
  { label: 'History', target: 'experience', id: 'experience', icon: Briefcase },
  { label: 'Talk', target: 'contact', id: 'contact', icon: Mail },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  isDark,
  onToggleTheme,
  onNavigate,
}) => {
  return (
    <>
      {/* Desktop Top Bar: Strictly 3 zones separated by gap-8 */}
      <header className="hidden md:block sticky top-0 z-40 border-b border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/85 dark:bg-[#0A0A0A]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="font-display text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-sm"
          >
            {PROFILE.brand}
          </a>

          {/* Zone 2: 4 concise single-line text links */}
          <nav aria-label="Primary navigation" className="flex items-center gap-8 text-sm font-medium">
            {DESKTOP_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.target}
                  href={`#${link.target}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.target);
                  }}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-sm ${
                    isActive
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-px bg-neutral-900 dark:bg-white transition-transform duration-150 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 text-xs font-semibold tracking-tight rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#0A0A0A]"
            >
              Let’s talk
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Non-Sticky Compact Header (keeps sticky chrome <= 10% viewport height) */}
      <header className="md:hidden border-b border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#0A0A0A]">
        <div className="px-4 h-14 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="font-display text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap shrink-0"
          >
            {PROFILE.brand}
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141416] text-neutral-800 dark:text-neutral-200 active:scale-95 transition-transform"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Zone Tab Bar (60px height, well under 15% cap) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200/90 dark:border-white/[0.08] bg-neutral-50/92 dark:bg-[#0C0C0E]/92 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-[60px] items-center px-1">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.target)}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  isActive
                    ? 'text-neutral-950 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                <span className="text-[11px] font-medium tracking-tight leading-none whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
