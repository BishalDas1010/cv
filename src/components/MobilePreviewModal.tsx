import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, X } from 'lucide-react';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_WIDTHS = [
  { label: '375px · Compact', width: 375 },
  { label: '390px · Standard', width: 390 },
  { label: '430px · Large', width: 430 },
];

export const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({ isOpen, onClose }) => {
  const [viewportWidth, setViewportWidth] = useState(390);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const previewUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?preview=mobile`
      : '/?preview=mobile';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-preview-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white">
            <Smartphone className="w-4 h-4 text-neutral-400" />
            <h2 id="mobile-preview-title" className="font-display text-sm font-semibold">
              Interactive Mobile Viewport
            </h2>
          </div>

          {/* Width Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.06]">
            {PRESET_WIDTHS.map((preset) => (
              <button
                key={preset.width}
                type="button"
                onClick={() => setViewportWidth(preset.width)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewportWidth === preset.width
                    ? 'bg-white text-neutral-950'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Return to desktop view"
            className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-medium text-neutral-200 hover:bg-white/10 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
            <X className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Interactive Phone Frame */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[#060607]">
          <div
            style={{ width: `${viewportWidth}px` }}
            className="h-[740px] max-h-[75vh] rounded-[2.25rem] border-[6px] border-neutral-800 bg-[#0A0A0A] shadow-2xl overflow-hidden transition-[width] duration-200 shrink-0"
          >
            <iframe
              title="Mobile Portfolio Preview"
              src={previewUrl}
              className="w-full h-full border-0 bg-[#0A0A0A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
