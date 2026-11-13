import { Sparkles, Star } from 'lucide-react';
import type { FlatSticker } from '../data/bakies';
import { BakieImage } from './BakieImage';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

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
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const newCount = cards.filter((c) => c.isNew).length;

  return (
    <div
      className="fixed inset-0 z-[700] bg-[#4a2812]/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-xl bg-[#fffdf9] border-t-4 sm:border-4 border-[#8c5228] rounded-t-[30px] sm:rounded-[34px] shadow-[0_24px_60px_rgba(74,40,18,0.35)] text-center animate-pop-sticker max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-4 pt-4 sm:px-7 sm:pt-7 pb-2 shrink-0">
          <div className="w-10 h-1.5 bg-[#e6ccb6] rounded-full mx-auto mb-3.5 sm:hidden" aria-hidden="true" />
          <h2
            id="reward-modal-title"
            className="font-display text-2xl sm:text-3xl font-bold text-[#632d0c] leading-tight text-balance"
          >
            ¡Has conseguido Bakies!
          </h2>
          <p className="mt-1 text-sm sm:text-base font-semibold text-[#8c6245] text-balance">
            {newCount > 0
              ? `Descubriste ${newCount} ${newCount === 1 ? 'sticker nuevo' : 'stickers nuevos'} para tu álbum.`
              : 'Stickers añadidos a tu inventario de pastelería.'}
          </p>
        </div>

        {/* Scrollable Cards Body (isolated scroll) */}
        <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth-touch px-4 sm:px-7 py-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {cards.map((card, idx) => (
              <div
                key={`${card.item.uid}-${idx}`}
                style={{ animationDelay: `${idx * 90}ms` }}
                className={`min-w-0 animate-pop-sticker rounded-[20px] sm:rounded-[24px] border-2 p-2 sm:p-3.5 flex flex-col items-center justify-between ${
                  card.isNew
                    ? 'bg-gradient-to-b from-amber-50 to-rose-50 border-amber-300 shadow-[0_10px_22px_rgba(245,158,11,0.18)]'
                    : 'bg-white border-[#efdccc] shadow-[0_8px_18px_rgba(120,53,15,0.08)]'
                }`}
              >
                <div className="w-full aspect-square max-w-[96px] sm:max-w-[116px] flex items-center justify-center rounded-2xl bg-white/85 p-1.5">
                  <BakieImage
                    src={card.item.imagePath}
                    alt={`${card.item.speciesName} ${card.item.variantNum}`}
                    fallbackIcon={card.item.speciesIcon}
                    width={1080}
                    height={1080}
                    imgClassName="w-full h-full object-contain drop-shadow-[0_6px_10px_rgba(92,52,25,0.15)]"
                  />
                </div>

                <div className="mt-2 w-full min-w-0">
                  <div className="font-display text-xs sm:text-sm font-bold text-[#5c3419] truncate">
                    {card.item.speciesName}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-[#8c6245] tabular-nums">
                    {card.item.variantNum}
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-center gap-1 min-h-[20px]">
                  {card.isNew ? (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold text-rose-600 whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
                      <span>Nuevo</span>
                    </span>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-bold text-[#8c6245] tabular-nums whitespace-nowrap">
                      Tienes x{card.totalOwned}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="px-4 pt-3 pb-5 sm:px-7 sm:pb-7 sm:pt-4 shrink-0 border-t border-[#f3e4d5]/70 bg-[#fffdf9] pb-safe">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 min-h-[48px] px-6 py-3 rounded-full font-display text-base font-bold text-white bg-gradient-to-b from-emerald-400 to-emerald-500 border-2 border-emerald-700 shadow-[0_5px_0_#047857,0_10px_20px_rgba(16,185,129,0.28)] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Guardar en el Álbum
            </button>

            <button
              type="button"
              onClick={onOpenAnother}
              className="w-full sm:flex-1 min-h-[48px] px-6 py-3 rounded-full font-display text-base font-bold text-[#7c4118] bg-[#fff3e6] border-2 border-[#e5c9b0] hover:bg-[#fde8d2] active:translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <Sparkles className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
              <span>Abrir otro sobre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
