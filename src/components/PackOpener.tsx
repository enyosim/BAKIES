import type { RefObject } from 'react';
import { BookOpen, PackageOpen, Sparkles } from 'lucide-react';
import { PACK_FRAMES, TOTAL_STICKERS, type FlatSticker } from '../data/bakies';
import { BakieImage } from './BakieImage';

interface PackOpenerProps {
  frameIndex: number;
  isOpening: boolean;
  packWrapperRef: RefObject<HTMLDivElement | null>;
  onOpenPack: () => void;
  uniqueCollected: number;
  packsOpened: number;
  recentPulls: FlatSticker[];
  onGoToAlbum: () => void;
  onSelectSticker: (sticker: FlatSticker) => void;
}

export function PackOpener({
  frameIndex,
  isOpening,
  packWrapperRef,
  onOpenPack,
  uniqueCollected,
  packsOpened,
  recentPulls,
  onGoToAlbum,
  onSelectSticker,
}: PackOpenerProps) {
  const completionPct = Math.round((uniqueCollected / TOTAL_STICKERS) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.65rem)] font-bold text-[#632d0c] leading-tight text-balance">
          ¡Abre tus Sobres de Bakies!
        </h1>
        <p className="mt-1.5 text-sm sm:text-base font-semibold text-[#8c6245] text-balance">
          Rasga el sobre oficial Serie 1 para descubrir qué criaturas dulces salen del horno.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Main Pack Stage */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-md border-2 border-[#f1dccb] rounded-[32px] p-5 sm:p-8 shadow-[0_14px_34px_rgba(120,53,15,0.08)] flex flex-col items-center justify-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-10 bottom-16 rounded-full bg-gradient-to-br from-rose-100/70 via-amber-100/60 to-sky-100/70 blur-2xl pointer-events-none"
          />

          <div
            ref={packWrapperRef}
            role="button"
            tabIndex={0}
            aria-label={isOpening ? 'Abriendo sobre de Bakies' : 'Toca para abrir un sobre de Bakies'}
            onClick={onOpenPack}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenPack();
              }
            }}
            className={`relative z-10 w-[min(60vw,245px)] sm:w-[275px] aspect-[29/40] flex items-center justify-center cursor-pointer select-none transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500 rounded-3xl ${
              isOpening
                ? 'animate-pack-wobble pointer-events-none'
                : 'hover:-translate-y-2 hover:scale-[1.02] active:scale-95'
            }`}
          >
            <BakieImage
              src={PACK_FRAMES[frameIndex] ?? PACK_FRAMES[0]}
              alt="Sobre oficial BAKIES Serie 1"
              fallbackIcon="🎁"
              imgClassName="w-full h-full object-contain drop-shadow-[0_18px_28px_rgba(120,53,15,0.22)]"
            />
          </div>

          <div className="relative z-10 mt-5 w-full max-w-xs flex flex-col items-center gap-2.5">
            <button
              type="button"
              disabled={isOpening}
              onClick={onOpenPack}
              className="w-full min-h-[52px] px-7 py-3 rounded-full font-display text-lg sm:text-xl font-bold text-white bg-gradient-to-b from-rose-400 to-rose-500 border-2 border-rose-700 shadow-[0_6px_0_#be123c,0_12px_24px_rgba(244,63,94,0.3)] hover:brightness-105 active:translate-y-0.5 disabled:opacity-65 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-150 inline-flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            >
              <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{isOpening ? 'Abriendo sobre...' : 'Abrir Sobre'}</span>
            </button>
            <p className="text-xs sm:text-sm font-semibold text-[#8c6245]">
              Toca el sobre o el botón · 3 stickers por sobre
            </p>
          </div>
        </div>

        {/* Companion Bakery Showcase */}
        <aside className="lg:col-span-5 bg-white/85 backdrop-blur-md border-2 border-[#f1dccb] rounded-[32px] p-5 sm:p-7 shadow-[0_14px_34px_rgba(120,53,15,0.08)] flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold text-[#632d0c]">
                Tu Pastelería
              </h2>
              <span className="text-sm font-bold text-[#8c6245] tabular-nums">
                {uniqueCollected} / {TOTAL_STICKERS} stickers
              </span>
            </div>

            <div className="mt-3 w-full h-4 bg-[#faead9] rounded-full p-0.5 border border-[#e7cbb2] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 transition-[width] duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#8c6245] tabular-nums">
              <span>{completionPct}% del álbum completo</span>
              <span>
                {packsOpened} {packsOpened === 1 ? 'sobre abierto' : 'sobres abiertos'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#f3e3d4] pt-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#632d0c]">
                  Recién Horneados
                </h3>
                <span className="text-xs font-semibold text-[#8c6245]">Último sobre</span>
              </div>

              {recentPulls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {recentPulls.map((sticker, idx) => (
                    <button
                      key={`${sticker.uid}-${idx}`}
                      type="button"
                      onClick={() => onSelectSticker(sticker)}
                      className={`group rounded-2xl border-2 p-2.5 flex flex-col items-center text-center transition-transform duration-150 hover:-translate-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500 ${sticker.pastelBg} ${sticker.pastelAccent}`}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                        <BakieImage
                          src={sticker.imagePath}
                          alt={`${sticker.speciesName} ${sticker.variantNum}`}
                          fallbackIcon={sticker.speciesIcon}
                          imgClassName="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="mt-1.5 font-display text-xs font-bold text-[#5c3419] truncate w-full">
                        {sticker.speciesName}
                      </span>
                      <span className="text-[11px] font-bold text-[#8c6245] tabular-nums">
                        {sticker.variantNum}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[#ebd5c1] bg-[#fffaf3] p-5 text-center">
                  <PackageOpen
                    className="w-8 h-8 text-[#c39a76] mx-auto mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#8c6245]">
                    Abre tu primer sobre para exhibir aquí tus Bakies recién salidos del horno.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onGoToAlbum}
              className="w-full min-h-[46px] px-5 py-2.5 rounded-full font-display text-base font-bold text-[#632d0c] bg-[#fff4e6] border-2 border-[#e6cbb3] hover:bg-[#fde8d2] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c4118]"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Ir al Álbum de Stickers</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
