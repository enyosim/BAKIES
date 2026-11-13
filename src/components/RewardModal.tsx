import { Sparkles, Star } from 'lucide-react';
import type { FlatSticker } from '../data/bakies';
import { BakieImage } from './BakieImage';

export interface PulledCard {
  item: FlatSticker;
  isNew: boolean;
  totalOwned: number;
}

interface RewardModalProps {
  isOpen: boolean;
  cards: PulledCard[];
  onClose: () => void;
  onOpenAnother: () => void;
}

export function RewardModal({ isOpen, cards, onClose, onOpenAnother }: RewardModalProps) {
  if (!isOpen) return null;

  const newCount = cards.filter((c) => c.isNew).length;

  return (
    <div
      className="fixed inset-0 z-[700] bg-[#4a2812]/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-xl bg-[#fffdf9] border-t-4 sm:border-4 border-[#8c5228] rounded-t-[32px] sm:rounded-[34px] px-4 pt-5 pb-6 sm:p-7 shadow-[0_24px_60px_rgba(74,40,18,0.35)] text-center animate-pop-sticker max-h-[92dvh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-[#e6ccb6] rounded-full mx-auto mb-4 sm:hidden" aria-hidden="true" />

        <h2
          id="reward-modal-title"
          className="font-display text-2xl sm:text-3xl font-bold text-[#632d0c] leading-tight"
        >
          ¡Has conseguido Bakies!
        </h2>
        <p className="mt-1 text-sm sm:text-base font-semibold text-[#8c6245]">
          {newCount > 0
            ? `Descubriste ${newCount} ${newCount === 1 ? 'sticker nuevo' : 'stickers nuevos'} para tu álbum.`
            : 'Stickers añadidos a tu inventario de pastelería.'}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-4">
          {cards.map((card, idx) => (
            <div
              key={`${card.item.uid}-${idx}`}
              style={{ animationDelay: `${idx * 110}ms` }}
              className={`animate-pop-sticker rounded-[22px] sm:rounded-[26px] border-2 p-2.5 sm:p-3.5 flex flex-col items-center justify-between transition-transform ${
                card.isNew
                  ? 'bg-gradient-to-b from-amber-50 to-rose-50 border-amber-300 shadow-[0_10px_22px_rgba(245,158,11,0.18)]'
                  : 'bg-white border-[#efdccc] shadow-[0_8px_18px_rgba(120,53,15,0.08)]'
              }`}
            >
              <div className="w-full aspect-square max-w-[96px] sm:max-w-[116px] flex items-center justify-center rounded-2xl bg-white/80 p-1.5">
                <BakieImage
                  src={card.item.imagePath}
                  alt={`${card.item.speciesName} ${card.item.variantNum}`}
                  fallbackIcon={card.item.speciesIcon}
                  imgClassName="w-full h-full object-contain drop-shadow-[0_6px_10px_rgba(92,52,25,0.15)]"
                />
              </div>

              <div className="mt-2 w-full">
                <div className="font-display text-xs sm:text-sm font-bold text-[#5c3419] truncate">
                  {card.item.speciesName}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-[#8c6245] tabular-nums">
                  {card.item.variantNum}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-center gap-1 min-h-[20px]">
                {card.isNew ? (
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold text-rose-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
                    Nuevo
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs font-bold text-[#8c6245] tabular-nums">
                    Tienes x{card.totalOwned}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-full font-display text-base sm:text-lg font-bold text-white bg-gradient-to-b from-emerald-400 to-emerald-500 border-2 border-emerald-700 shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.28)] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Guardar en el Álbum
          </button>

          <button
            type="button"
            onClick={onOpenAnother}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full font-display text-base font-bold text-[#7c4118] bg-[#fff3e6] border-2 border-[#e5c9b0] hover:bg-[#fde8d2] active:translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            <Sparkles className="w-4 h-4 text-rose-500" aria-hidden="true" />
            Abrir otro sobre
          </button>
        </div>
      </div>
    </div>
  );
}
