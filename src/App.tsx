import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Moon,
  Smartphone,
  Sun,
  User,
} from 'lucide-react';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { Footer } from './components/Footer';
import { HeroInteractiveHeadline } from './components/HeroInteractiveHeadline';

import { MobilePreviewModal } from './components/MobilePreviewModal';
import { Navbar, NavSection } from './components/Navbar';
import { ProjectFolderCard } from './components/ProjectFolderCard';
import { ProjectModal } from './components/ProjectModal';
import { ScrollPortraitBridge } from './components/ScrollPortraitBridge';
import {
  CERTIFICATIONS,
  HERO_METRICS,
  PROFILE,
  ProjectCategory,
  ProjectItem,
  PROJECTS,
  SKILL_GROUPS,
  SkillItem,
} from './data/portfolioData';

const CATEGORIES: ProjectCategory[] = ['All', 'AI & RAG', 'IoT & TinyML', 'Analytics'];

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<NavSection>('hero');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [portraitError, setPortraitError] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroSlotRef = useRef<HTMLDivElement | null>(null);
  const aboutSlotRef = useRef<HTMLDivElement | null>(null);

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = senderName.trim();
    const trimmedEmail = senderEmail.trim();
    const trimmedMsg = senderMessage.trim();

    if (!trimmedName || !trimmedEmail || !trimmedEmail.includes('@') || !trimmedMsg) {
      setFormError('Please enter your name, a valid email address, and a short message.');
      return;
    }

    setFormError('');

    try {
      const formData = new URLSearchParams();
      formData.append('entry.1128053529', trimmedName);
      formData.append('entry.1222869304', trimmedEmail);
      formData.append('entry.499354010', trimmedMsg);

      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLScV6BUsGWplsWs99ZbPDWcWJztMSHtnldpiwId3jTeZufJKOQ/formResponse',
        {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        }
      );
    } catch {
      // Suppress network errors for seamless UX
    }

    setFormSubmitted(true);
  };



  const isPreviewFrame = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'mobile';
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Track visible section for Desktop Top Bar & Mobile Bottom Tab Bar
  useEffect(() => {
    const sectionMap: { id: string; nav: NavSection }[] = [
      { id: 'hero', nav: 'hero' },
      { id: 'about', nav: 'hero' },
      { id: 'skills', nav: 'skills' },
      { id: 'projects', nav: 'projects' },
      { id: 'experience', nav: 'experience' },
      { id: 'contact', nav: 'contact' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const match = sectionMap.find((s) => s.id === visible[0].target.id);
          if (match) setActiveSection(match.nav);
        }
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    sectionMap.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleSkill = (skill: SkillItem) => {
    setSelectedSkill((prev) => (prev?.name === skill.name ? null : skill));
  };

  const visibleProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const matchingProjectCount = useMemo(() => {
    if (!selectedSkill) return PROJECTS.length;
    return PROJECTS.filter((p) => p.skills.includes(selectedSkill.name)).length;
  }, [selectedSkill]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };



  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-neutral-50 text-neutral-900 dark:bg-[#0A0A0A] dark:text-neutral-100 pb-20 md:pb-0 transition-colors duration-200"
    >


      <ScrollPortraitBridge
        rootRef={rootRef}
        heroSlotRef={heroSlotRef}
        aboutSlotRef={aboutSlotRef}
        src={PROFILE.portraitImage}
        alt="Art-style portrait of Bishal Das, Software Engineer"
        fallbackName={PROFILE.fullName}
        hasError={portraitError}
        onError={() => setPortraitError(true)}
        prefersReduced={prefersReduced}
      />

      <Navbar
        activeSection={activeSection}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* SECTION 1: Monumental Editorial Hero */}
        <section
          id="hero"
          className="pt-8 pb-12 md:pt-14 md:pb-16 border-b border-neutral-200 dark:border-white/[0.08]"
        >
          <div className="relative flex flex-col items-center text-center">
            {/* Oversized Architectural Display Typography */}
            <HeroInteractiveHeadline isDark={isDark} prefersReduced={prefersReduced} />

            {/* Centered Bright Art-Style Portrait Slot (Seamless target for ScrollPortraitBridge) */}
            <div
              id="hero-portrait"
              ref={heroSlotRef}
              className={`mt-6 md:-mt-4 relative z-10 w-36 sm:w-48 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/15 bg-[#27292E] shadow-xl group cursor-pointer ${
                prefersReduced ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {!portraitError ? (
                <img
                  src={PROFILE.portraitImage}
                  alt="Art-style portrait of Bishal Das, Software Engineer"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitError(true)}
                  className="w-full h-full object-cover object-top grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-950 flex flex-col items-center justify-center gap-2 text-neutral-400">
                  <User className="w-10 h-10" />
                  <span className="text-xs font-medium">{PROFILE.fullName}</span>
                </div>
              )}
            </div>

            {/* Bottom Baseline Row */}
            <div className="w-full mt-8 md:mt-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-mono text-neutral-500 dark:text-neutral-400">
              <span className="tabular-nums">©{PROFILE.copyrightYear}</span>

              <div className="hidden md:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs font-sans font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                </button>

                {!isPreviewFrame && (
                  <button
                    type="button"
                    onClick={() => setIsMobilePreviewOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs font-sans font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile preview</span>
                  </button>
                )}
              </div>

              <span>{PROFILE.disciplineTag}</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Intro / About Split + Full-Width Metric Strip */}
        <section
          id="about"
          className="py-14 md:py-20 border-b border-neutral-200 dark:border-white/[0.08]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Intro & Current Role */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-8">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.04] text-neutral-950 dark:text-white text-balance">
                  {PROFILE.greeting}
                </h2>
                <p className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-300 mt-4 leading-snug text-balance">
                  {PROFILE.role}
                </p>
              </div>

              <div className="space-y-1 text-sm border-t border-neutral-200 dark:border-white/[0.08] pt-5">
                <div className="text-xs text-neutral-500 dark:text-neutral-500">
                  {PROFILE.currentLabel}
                </div>
                <div className="font-semibold text-neutral-900 dark:text-white">
                  {PROFILE.currentOrg}
                </div>
                <div className="text-neutral-600 dark:text-neutral-400">
                  {PROFILE.currentRole} · {PROFILE.location}
                </div>
              </div>
            </div>

            {/* Center Column: Full-Height Editorial Portrait Slot (Target for ScrollPortraitBridge) */}
            <div className="lg:col-span-4 flex justify-center lg:block">
              <div
                ref={aboutSlotRef}
                className={`w-48 sm:w-60 lg:w-full aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[280px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-[#27292E] group ${
                  prefersReduced ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {!portraitError ? (
                  <img
                    src={PROFILE.portraitImage}
                    alt={`${PROFILE.fullName}, ${PROFILE.role}`}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center gap-2 text-neutral-400">
                    <User className="w-10 h-10" />
                    <span className="text-sm font-medium">{PROFILE.fullName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Lead Copy & Primary CTA */}
            <div className="lg:col-span-4 flex flex-col justify-center gap-6">
              <p className="text-lg sm:text-xl leading-relaxed font-medium text-neutral-800 dark:text-neutral-200">
                {PROFILE.leadCopy}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleNavigate('projects')}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Explore projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('contact')}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Get in touch
                </button>

                <a
                  href={PROFILE.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>View CV</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Metric Strip */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-6">
            {HERO_METRICS.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white tabular-nums">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Interactive Tech Stack & Skill Matrix */}
        <section
          id="skills"
          className="py-14 md:py-20 border-b border-neutral-200 dark:border-white/[0.08]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
                Core Stack
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
                Select any technology below to inspect how I use it and highlight matching projects.
              </p>
            </div>

            {selectedSkill && (
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="self-start sm:self-auto min-h-[40px] px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-white/15 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear filter · {selectedSkill.name} ({matchingProjectCount})
              </button>
            )}
          </div>

          {/* Active Skill Note Callout (when selected) */}
          {selectedSkill && (
            <div className="mb-8 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-neutral-800 dark:text-neutral-200">
                <span className="font-semibold text-neutral-950 dark:text-white">
                  {selectedSkill.name}:
                </span>{' '}
                {selectedSkill.note}
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('projects')}
                className="text-xs font-semibold text-neutral-900 dark:text-white underline underline-offset-4 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                See {matchingProjectCount} matching project{matchingProjectCount === 1 ? '' : 's'}
              </button>
            </div>
          )}

          {/* 3-Column Skill Groups */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.id}
                className="flex flex-col pb-6 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-white/[0.06] last:border-b-0"
              >
                <h3 className="font-display text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
                  {group.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed min-h-[2.25rem]">
                  {group.subtitle}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => {
                    const isSelected = selectedSkill?.name === skill.name;
                    const isInverted = isSelected || (!selectedSkill && skill.featured);
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        aria-pressed={isSelected}
                        className={`min-h-[40px] md:min-h-[34px] px-3 py-1.5 rounded-md text-xs font-medium tracking-tight border transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          isInverted
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 dark:bg-[#151518] dark:text-neutral-300 dark:border-white/10 dark:hover:border-white/25'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Featured Projects (Tactile Folder Cards) */}
        <section
          id="projects"
          className="py-14 md:py-20 border-b border-neutral-200 dark:border-white/[0.08]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white text-balance">
                Featured Projects
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-lg">
                Independent projects and professional work. Open a folder to explore a project or case study.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
              {/* Interactive Category Filter Segmented Control */}
              <div
                role="tablist"
                aria-label="Filter projects by category"
                className="flex items-center gap-1 p-1 rounded-xl bg-neutral-200/70 dark:bg-[#141416] border border-neutral-200 dark:border-white/[0.06] overflow-x-auto no-scrollbar max-w-full"
              >
                {CATEGORIES.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(category)}
                      className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-neutral-950 shadow-sm dark:bg-white dark:text-neutral-950'
                          : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white whitespace-nowrap"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {visibleProjects.map((project) => {
              const isMatchedBySkill = selectedSkill
                ? project.skills.includes(selectedSkill.name)
                : true;
              return (
                <ProjectFolderCard
                  key={project.id}
                  project={project}
                  isMatchedBySkill={isMatchedBySkill}
                  hasActiveSkillFilter={Boolean(selectedSkill)}
                  onSelect={setActiveProject}
                />
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Experience & Education Timeline */}
        <section
          id="experience"
          className="py-14 md:py-20 border-b border-neutral-200 dark:border-white/[0.08]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Experience.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Current work · Back to the foundations
            </p>
          </div>

          <ExperienceTimeline />

          {/* Certifications Row */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-display text-base font-bold tracking-tight text-neutral-950 dark:text-white">
              Certifications
            </h3>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900 dark:text-neutral-200">
                    {cert.title}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Contact & Footer */}
        <section id="contact" className="py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Headline & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white text-balance">
                  Let’s talk.
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 max-w-md leading-relaxed">
                  Open to Machine Learning, RAG systems, Data Engineering, and TinyML/IoT internships or engineering roles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#131316] text-xs font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied {PROFILE.email}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>{PROFILE.email}</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${PROFILE.phone}`}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-white/15 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center transition-colors tabular-nums"
                >
                  {PROFILE.phone}
                </a>

                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-white/15 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-white/15 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              {formSubmitted ? (
                <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#131316] space-y-4">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Message received</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Thanks for reaching out. Your note has been submitted to the Google Form successfully!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setSenderName('');
                      setSenderEmail('');
                      setSenderMessage('');
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-neutral-300 dark:border-white/15 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2"
                      >
                        Your name
                      </label>
                      <input
                        id="contact-name"
                        name="entry.1128053529"
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="What should I call you?"
                        className="w-full min-h-[44px] bg-transparent border-b border-neutral-300 dark:border-white/20 focus:border-neutral-950 dark:focus:border-white py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2"
                      >
                        Email address
                      </label>
                      <input
                        id="contact-email"
                        name="entry.1222869304"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full min-h-[44px] bg-transparent border-b border-neutral-300 dark:border-white/20 focus:border-neutral-950 dark:focus:border-white py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2"
                    >
                      Project or message
                    </label>
                    <textarea
                      id="contact-message"
                      name="entry.499354010"
                      rows={3}
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="Tell me about what you are building or hiring for..."
                      className="w-full bg-transparent border-b border-neutral-300 dark:border-white/20 focus:border-neutral-950 dark:focus:border-white py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Send message</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <div className="relative z-10">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Project Case Study Modal / Mobile Bottom Sheet */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />

      {/* Interactive Mobile Frame Preview (Desktop only) */}
      <MobilePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
      />
    </div>
  );
}
