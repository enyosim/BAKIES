import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { FlatSticker } from '../data/bakies';
import { BakieImage } from './BakieImage';

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
  if (!sticker) return null;

  return (
    <div
      className="fixed inset-0 z-[750] bg-[#4a2812]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-[#fffdf9] border-t-4 sm:border-4 border-[#8c5228] rounded-t-[32px] sm:rounded-[34px] p-5 sm:p-7 shadow-[0_24px_60px_rgba(74,40,18,0.32)] relative text-center animate-pop-sticker">
        <div className="w-10 h-1.5 bg-[#e6ccb6] rounded-full mx-auto mb-3 sm:hidden" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#fdf2e6] border border-[#e7cbb2] text-[#7c4118] hover:bg-[#fbe4cc] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className={`w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-[28px] border-2 ${sticker.pastelBg} ${sticker.pastelAccent} flex items-center justify-center p-4`}
        >
          <BakieImage
            src={sticker.imagePath}
            alt={`${sticker.speciesName} ${sticker.variantNum}`}
            fallbackIcon={sticker.speciesIcon}
            imgClassName="w-full h-full object-contain drop-shadow-[0_12px_18px_rgba(92,52,25,0.18)]"
          />
        </div>

        <h2
          id="detail-modal-title"
          className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#632d0c] flex items-center justify-center gap-2"
        >
          <span aria-hidden="true">{sticker.speciesIcon}</span>
          <span>{sticker.speciesName}</span>
        </h2>

        <p className="mt-1 text-sm font-bold text-[#8c6245] tabular-nums">
          Variante {sticker.variantNum} · Serie 1
        </p>

        <p className="mt-3 text-sm sm:text-base font-semibold text-[#5c3419] leading-relaxed bg-[#fff8f0] border border-[#f1dccb] rounded-2xl px-4 py-3">
          {sticker.flavor}
        </p>

        <p className="mt-3 text-sm font-bold text-emerald-700 tabular-nums">
          Tienes {quantity} {quantity === 1 ? 'copia' : 'copias'} en tu inventario
        </p>

        {hasMultipleUnlocked && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="min-h-[44px] flex-1 px-4 py-2 rounded-full font-display text-sm font-bold text-[#632d0c] bg-[#fff4e6] border-2 border-[#e6cbb3] hover:bg-[#fde8d2] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="min-h-[44px] flex-1 px-4 py-2 rounded-full font-display text-sm font-bold text-[#632d0c] bg-[#fff4e6] border-2 border-[#e6cbb3] hover:bg-[#fde8d2] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
