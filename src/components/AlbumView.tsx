import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lock, RotateCcw, Search, X } from 'lucide-react';
import {
  BAKIES_DATABASE,
  TOTAL_STICKERS,
  type BakieSpecies,
  type BakieVariant,
} from '../data/bakies';
import { BakieImage } from './BakieImage';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

type StatusFilter = 'all' | 'unlocked' | 'locked';

interface AlbumViewProps {
  inventory: Record<string, number>;
  packsOpened: number;
  uniqueCollected: number;
  onSelectSticker: (species: BakieSpecies, variant: BakieVariant, qty: number) => void;
  onResetProgress: () => void;
}

export function AlbumView({
  inventory,
  packsOpened,
  uniqueCollected,
  onSelectSticker,
  onResetProgress,
}: AlbumViewProps) {
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useBodyScrollLock(showResetConfirm);

  useEffect(() => {
    if (!showResetConfirm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowResetConfirm(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showResetConfirm]);

  const completedSpeciesCount = useMemo(() => {
    return BAKIES_DATABASE.filter((sp) =>
      sp.variants.every((v) => (inventory[`${sp.id}_${v.num.replace('#', '')}`] || 0) > 0)
    ).length;
  }, [inventory]);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return BAKIES_DATABASE.filter((sp) => speciesFilter === 'all' || sp.id === speciesFilter)
      .map((sp) => {
        const variants = sp.variants.filter((v) => {
          const uid = `${sp.id}_${v.num.replace('#', '')}`;
          const qty = inventory[uid] || 0;
          const isUnlocked = qty > 0;

          if (statusFilter === 'unlocked' && !isUnlocked) return false;
          if (statusFilter === 'locked' && isUnlocked) return false;

          if (q) {
            const matchName = sp.name.toLowerCase().includes(q);
            const matchNum = v.num.toLowerCase().includes(q);
            const matchFlavor = isUnlocked && v.flavor.toLowerCase().includes(q);
            return matchName || matchNum || matchFlavor;
          }
          return true;
        });

        return { species: sp, variants };
      })
      .filter((group) => group.variants.length > 0);
  }, [inventory, searchQuery, speciesFilter, statusFilter]);

  const completionPct = Math.round((uniqueCollected / TOTAL_STICKERS) * 100);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + Summary + Filters */}
      <div className="bg-white/95 border-2 border-[#f1dccb] rounded-[28px] sm:rounded-[30px] p-4 sm:p-6 shadow-[0_12px_30px_rgba(120,53,15,0.07)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#632d0c] truncate">
                Tu Álbum de Bakies
              </h1>
              {packsOpened > 0 && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="lg:hidden min-h-[40px] px-3 py-1.5 rounded-full text-xs font-bold text-[#8c6245] hover:text-rose-600 bg-[#fff7ef] border border-[#ebd5c1] hover:border-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500"
                  title="Reiniciar colección"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reiniciar</span>
                </button>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-[#8c6245] tabular-nums">
              <span className="whitespace-nowrap">
                {uniqueCollected} / {TOTAL_STICKERS} stickers ({completionPct}%)
              </span>
              <span className="text-[#c8a88b]" aria-hidden="true">
                ·
              </span>
              <span className="whitespace-nowrap">
                {completedSpeciesCount} / {BAKIES_DATABASE.length} especies completas
              </span>
              <span className="text-[#c8a88b]" aria-hidden="true">
                ·
              </span>
              <span className="whitespace-nowrap">
                {packsOpened} {packsOpened === 1 ? 'sobre' : 'sobres'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Status filter segmented control */}
            <div
              className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex items-center p-1 bg-[#f7eadc] border border-[#e7cbb2] rounded-full"
              role="group"
              aria-label="Filtrar por estado de colección"
            >
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'unlocked', label: 'Conseguidos' },
                  { id: 'locked', label: 'Faltantes' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`min-h-[38px] px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap text-center focus-visible:outline-2 focus-visible:outline-rose-500 ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#5c3419] shadow-sm'
                      : 'text-[#8c6245] hover:text-[#5c3419]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {packsOpened > 0 && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="hidden lg:inline-flex min-h-[44px] px-4 py-2 rounded-full text-sm font-bold text-[#8c6245] hover:text-rose-600 bg-[#fff7ef] border border-[#ebd5c1] hover:border-rose-200 transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500"
                title="Reiniciar colección"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Search + Species filter bar */}
        <div className="mt-4 pt-4 border-t border-[#f3e3d4] flex flex-col gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="w-4 h-4 text-[#9c7149] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar especie o sabor..."
              aria-label="Buscar especie o sabor"
              className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-full bg-[#fffaf4] border-2 border-[#ebd5c1] text-sm font-semibold text-[#5c3419] placeholder:text-[#a88263] focus:outline-none focus:border-rose-300 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#8c6245] hover:bg-[#f3e3d3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto md:flex-wrap no-scrollbar scroll-smooth-touch py-0.5 -mx-1 px-1"
            role="group"
            aria-label="Filtrar por especie"
          >
            <button
              type="button"
              onClick={() => setSpeciesFilter('all')}
              className={`min-h-[42px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                speciesFilter === 'all'
                  ? 'bg-[#7c4118] text-white border-[#7c4118] shadow-sm'
                  : 'bg-white text-[#7c4118] border-[#e7cbb2] hover:bg-[#fff4e6]'
              }`}
            >
              Todas las especies
            </button>

            {BAKIES_DATABASE.map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSpeciesFilter(sp.id)}
                className={`min-h-[42px] px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-150 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                  speciesFilter === sp.id
                    ? 'bg-[#7c4118] text-white border-[#7c4118] shadow-sm'
                    : 'bg-white text-[#7c4118] border-[#e7cbb2] hover:bg-[#fff4e6]'
                }`}
              >
                <span aria-hidden="true">{sp.icon}</span>
                <span>{sp.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Species Groups */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white/95 border-2 border-[#f1dccb] rounded-[28px] p-8 sm:p-12 text-center shadow-[0_10px_26px_rgba(120,53,15,0.05)]">
          <p className="font-display text-xl font-bold text-[#632d0c]">
            No hay stickers con ese filtro
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[#8c6245] text-balance">
            Prueba limpiando la búsqueda o seleccionando otra categoría.
          </p>
          <button
            type="button"
            onClick={() => {
              setSpeciesFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 min-h-[44px] px-6 py-2.5 rounded-full font-display text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            Mostrar todos
          </button>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {filteredGroups.map(({ species, variants }) => {
            const unlockedInSpecies = species.variants.filter(
              (v) => (inventory[`${species.id}_${v.num.replace('#', '')}`] || 0) > 0
            ).length;
            const isComplete = unlockedInSpecies === species.variants.length;

            return (
              <section
                key={species.id}
                className="album-section-perf bg-white/95 border-2 border-[#f1dccb] rounded-[26px] sm:rounded-[28px] p-4 sm:p-6 shadow-[0_10px_26px_rgba(120,53,15,0.06)]"
              >
                <div className="flex items-center justify-between gap-3 pb-3.5 mb-4 border-b border-dashed border-[#edd6c2]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${species.pastelBg} ${species.pastelAccent}`}
                      aria-hidden="true"
                    >
                      {species.icon}
                    </span>
                    <h2 className="font-display text-lg sm:text-2xl font-bold text-[#632d0c] truncate">
                      {species.name}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${
                      isComplete ? 'text-emerald-700' : 'text-[#8c6245]'
                    }`}
                  >
                    {isComplete && <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />}
                    <span>
                      {unlockedInSpecies} / {species.variants.length}
                      {isComplete ? ' · Completo' : ' coleccionados'}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {variants.map((variant) => {
                    const uid = `${species.id}_${variant.num.replace('#', '')}`;
                    const qty = inventory[uid] || 0;
                    const isUnlocked = qty > 0;

                    return (
                      <button
                        key={uid}
                        type="button"
                        onClick={() => onSelectSticker(species, variant, qty)}
                        disabled={!isUnlocked}
                        className={`min-w-0 w-full group relative rounded-[20px] sm:rounded-[22px] border-2 p-3 sm:p-4 flex flex-col items-center text-center transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                          isUnlocked
                            ? `bg-white ${species.pastelAccent} hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(120,53,15,0.12)] active:scale-[0.98] cursor-pointer`
                            : 'bg-[#fbf4ec] border-dashed border-[#e5ccb4] opacity-80 cursor-default'
                        }`}
                      >
                        {qty > 1 && (
                          <span className="absolute top-2 right-2.5 z-10 text-xs font-extrabold text-rose-600 tabular-nums pointer-events-none">
                            x{qty}
                          </span>
                        )}

                        <div
                          className={`w-full aspect-square max-w-[112px] rounded-2xl flex items-center justify-center p-2 relative ${
                            isUnlocked ? species.pastelBg : 'bg-[#f4e8db]/75'
                          }`}
                        >
                          <BakieImage
                            src={variant.path}
                            alt={isUnlocked ? `${species.name} ${variant.num}` : 'Sticker bloqueado'}
                            fallbackIcon={species.icon}
                            width={1080}
                            height={1080}
                            loading="lazy"
                            decoding="async"
                            imgClassName={`w-full h-full object-contain transition-transform duration-150 ${
                              isUnlocked
                                ? 'drop-shadow-[0_6px_10px_rgba(92,52,25,0.14)] group-hover:scale-105'
                                : 'brightness-0 opacity-[0.14] pointer-events-none select-none'
                            }`}
                          />
                          {!isUnlocked && (
                            <span
                              className="absolute inset-0 flex items-center justify-center text-[#9c7149]"
                              aria-hidden="true"
                            >
                              <Lock className="w-6 h-6" />
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 w-full min-w-0">
                          <div className="font-display text-sm sm:text-base font-bold text-[#5c3419] truncate">
                            {isUnlocked ? species.name : 'Por descubrir'}
                          </div>
                          <div className="text-xs font-bold text-[#8c6245] tabular-nums">
                            {variant.num}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* In-app Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[800] bg-[#4a2812]/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-5 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResetConfirm(false);
          }}
        >
          <div className="w-full max-w-sm bg-[#fffdf9] border-3 border-[#8c5228] rounded-[28px] p-6 text-center shadow-2xl animate-pop-sticker max-h-[90dvh] overflow-y-auto scroll-smooth-touch">
            <h3 id="reset-dialog-title" className="font-display text-xl font-bold text-[#632d0c]">
              ¿Reiniciar tu álbum?
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#8c6245] text-balance">
              Se borrarán todos los stickers conseguidos y el contador de sobres abiertos.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="min-h-[44px] flex-1 px-4 py-2.5 rounded-full font-display text-sm font-bold text-[#632d0c] bg-[#fdf2e6] border-2 border-[#e5c9b0] hover:bg-[#fbe8d3] cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-rose-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="min-h-[44px] flex-1 px-4 py-2.5 rounded-full font-display text-sm font-bold text-white bg-rose-500 border-2 border-rose-700 hover:bg-rose-600 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-rose-700"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
