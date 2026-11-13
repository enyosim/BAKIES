import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { FlatSticker } from '../data/bakies';
import { BakieImage } from './BakieImage';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface StickerDetailModalProps {
  sticker: FlatSticker | null;
  quantity: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasMultipleUnlocked: boolean;
}

export function StickerDetailModal({
  sticker,
  quantity,
  onClose,
  onPrev,
  onNext,
  hasMultipleUnlocked,
}: StickerDetailModalProps) {
  useBodyScrollLock(Boolean(sticker));

  useEffect(() => {
    if (!sticker || !hasMultipleUnlocked) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sticker, hasMultipleUnlocked, onPrev, onNext]);

  if (!sticker) return null;

  return (
    <div
      className="fixed inset-0 z-[750] bg-[#4a2812]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5 overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-[#fffdf9] border-t-4 sm:border-4 border-[#8c5228] rounded-t-[30px] sm:rounded-[34px] shadow-[0_24px_60px_rgba(74,40,18,0.32)] text-center animate-pop-sticker max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Sheet Handle & Close Bar */}
        <div className="relative px-5 pt-4 sm:px-6 sm:pt-5 pb-1 shrink-0 flex items-center justify-end">
          <div
            className="w-10 h-1.5 bg-[#e6ccb6] rounded-full absolute left-1/2 -translate-x-1/2 top-3.5 sm:hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="w-11 h-11 rounded-full bg-[#fdf2e6] border border-[#e7cbb2] text-[#7c4118] hover:bg-[#fbe4cc] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth-touch px-5 sm:px-7 pb-4">
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-[28px] border-2 ${sticker.pastelBg} ${sticker.pastelAccent} flex items-center justify-center p-4`}
          >
            <BakieImage
              src={sticker.imagePath}
              alt={`${sticker.speciesName} ${sticker.variantNum}`}
              fallbackIcon={sticker.speciesIcon}
              width={1080}
              height={1080}
              imgClassName="w-full h-full object-contain drop-shadow-[0_12px_18px_rgba(92,52,25,0.18)]"
            />
          </div>

          <h2
            id="detail-modal-title"
            className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#632d0c] flex items-center justify-center gap-2 text-balance"
          >
            <span aria-hidden="true" className="shrink-0">
              {sticker.speciesIcon}
            </span>
            <span className="truncate">{sticker.speciesName}</span>
          </h2>

          <p className="mt-1 text-sm font-bold text-[#8c6245] tabular-nums">
            Variante {sticker.variantNum} · Serie 1
          </p>

          <p className="mt-3 text-sm sm:text-base font-semibold text-[#5c3419] leading-relaxed bg-[#fff8f0] border border-[#f1dccb] rounded-2xl px-4 py-3 text-balance">
            {sticker.flavor}
          </p>

          <p className="mt-3 text-sm font-bold text-emerald-700 tabular-nums">
            Tienes {quantity} {quantity === 1 ? 'copia' : 'copias'} en tu inventario
          </p>
        </div>

        {/* Bottom Prev/Next Navigation */}
        {hasMultipleUnlocked ? (
          <div className="px-5 pt-3 pb-5 sm:px-7 sm:pb-6 shrink-0 border-t border-[#f3e4d5]/70 bg-[#fffdf9] pb-safe">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onPrev}
                className="min-h-[44px] flex-1 px-4 py-2 rounded-full font-display text-sm font-bold text-[#632d0c] bg-[#fff4e6] border-2 border-[#e6cbb3] hover:bg-[#fde8d2] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-rose-500"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="min-h-[44px] flex-1 px-4 py-2 rounded-full font-display text-sm font-bold text-[#632d0c] bg-[#fff4e6] border-2 border-[#e6cbb3] hover:bg-[#fde8d2] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-rose-500"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-3 sm:h-4 shrink-0 pb-safe" />
        )}
      </div>
    </div>
  );
}
