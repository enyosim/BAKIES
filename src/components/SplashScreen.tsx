import { useEffect, useRef, useState } from 'react';
import { LOADING_MESSAGES, PRELOAD_ASSETS } from '../data/bakies';
import { BakieImage } from './BakieImage';

interface SplashScreenProps {
  onEnter: () => void;
}

const SPLASH_DURATION_MS = 15000;
const LOGO_SRC = '/assets/logo/bakies_logo.png';
const OTHER_ASSETS = PRELOAD_ASSETS.filter((src) => src !== LOGO_SRC);

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const totalAssets = PRELOAD_ASSETS.length;
  const [loadedCount, setLoadedCount] = useState(0);
  const [pct, setPct] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const barRef = useRef<HTMLDivElement | null>(null);
  const loadedCountRef = useRef(0);
  const lastPctRef = useRef(-1);
  const lastReadyRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;
    let rafId: number | null = null;
    let startTime: number | null = null;
    let timeRatio = 0;

    const updateProgressVisuals = () => {
      if (isCancelled) return;
      const assetRatio = totalAssets > 0 ? loadedCountRef.current / totalAssets : 1;
      const combined = Math.min(timeRatio, assetRatio);
      const nextPct = Math.round(combined * 100);
      const nextReady = timeRatio >= 1 && loadedCountRef.current >= totalAssets;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0.02, combined)})`;
      }

      if (nextPct !== lastPctRef.current) {
        lastPctRef.current = nextPct;
        setPct(nextPct);
      }
      if (nextReady !== lastReadyRef.current) {
        lastReadyRef.current = nextReady;
        setIsReady(nextReady);
      }
    };

    const incrementLoaded = () => {
      if (isCancelled) return;
      loadedCountRef.current = Math.min(loadedCountRef.current + 1, totalAssets);
      setLoadedCount(loadedCountRef.current);
      updateProgressVisuals();
    };

    const preloadImage = (src: string, syncDecode = false): Promise<void> =>
      new Promise((resolve) => {
        if (isCancelled) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = syncDecode ? 'sync' : 'async';
        let settled = false;

        const finish = () => {
          if (settled) return;
          settled = true;
          if (!syncDecode && typeof img.decode === 'function') {
            img.decode().catch(() => {}).finally(() => {
              incrementLoaded();
              resolve();
            });
          } else {
            incrementLoaded();
            resolve();
          }
        };

        img.onload = finish;
        img.onerror = finish;
        img.src = src;

        if (img.complete) {
          finish();
        }
      });

    // Prioritize the logo first so it renders immediately without bandwidth contention,
    // then decode remaining assets in small batches to maintain steady 60fps.
    const loadAssetsSequentially = async () => {
      await preloadImage(LOGO_SRC, true);

      const BATCH_SIZE = 4;
      for (let i = 0; i < OTHER_ASSETS.length; i += BATCH_SIZE) {
        if (isCancelled) break;
        const batch = OTHER_ASSETS.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((src) => preloadImage(src, false)));
      }
    };

    void loadAssetsSequentially();

    const tick = (timestamp: number) => {
      if (isCancelled) return;
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      timeRatio = Math.min(elapsed / SPLASH_DURATION_MS, 1);

      updateProgressVisuals();

      if (timeRatio < 1 || loadedCountRef.current < totalAssets) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      isCancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [totalAssets]);

  const progressStepsCount = LOADING_MESSAGES.length - 1;
  const msgIdx = Math.min(
    Math.floor((pct / 100) * progressStepsCount),
    progressStepsCount - 1
  );
  const activeMsg = isReady
    ? LOADING_MESSAGES[LOADING_MESSAGES.length - 1]
    : LOADING_MESSAGES[msgIdx];

  return (
    <div
      className="fixed inset-0 z-[900] overflow-y-auto scroll-smooth-touch"
      style={{
        backgroundColor: '#fffbf5',
        backgroundImage:
          'radial-gradient(#f0d7c4 2px, transparent 2px), linear-gradient(135deg, #fff1f4 0%, #fffbeb 50%, #eef9ff 100%)',
        backgroundSize: '28px 28px, 100% 100%',
      }}
    >
      <div className="min-h-full w-full flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          {/* Preloaded logo with fixed 16:9 box to eliminate layout shift */}
          <div className="w-[min(74vw,300px)] sm:w-[340px] max-h-[28dvh] aspect-[16/9] mb-4 sm:mb-6 flex items-center justify-center animate-float-gentle drop-shadow-[0_14px_24px_rgba(92,52,25,0.18)]">
            <BakieImage
              src={LOGO_SRC}
              alt="Logo oficial de BAKIES"
              fallbackIcon="🧁"
              width={1280}
              height={720}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              imgClassName="w-full h-full object-contain"
            />
          </div>

          <div className="w-full max-w-[340px] sm:max-w-sm bg-white/92 backdrop-blur-md rounded-[28px] border-2 border-[#f1dccb] p-5 sm:p-6 shadow-[0_14px_32px_rgba(120,53,15,0.09)]">
            <div
              className="w-full h-5 bg-[#faead9] border-2 border-[#7c4118] rounded-full p-0.5 overflow-hidden shadow-inner"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Cargando pastelería BAKIES"
            >
              <div
                ref={barRef}
                className="w-full h-full rounded-full relative overflow-hidden bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 candy-stripes origin-left will-change-transform"
                style={{ transform: 'scaleX(0.02)' }}
              />
            </div>

            <p className="mt-3.5 min-h-[42px] sm:min-h-[28px] text-sm sm:text-base font-semibold text-[#7c4118] flex items-center justify-center gap-2 leading-snug text-balance">
              <span aria-hidden="true" className="shrink-0">
                {activeMsg.icon}
              </span>
              <span>{activeMsg.text}</span>
            </p>

            <p className="mt-1.5 text-xs font-bold text-[#9c7149] tabular-nums">
              Precargando recursos: {loadedCount} / {totalAssets} · {pct}%
            </p>

            <div className="mt-5 flex flex-col items-center">
              <button
                type="button"
                disabled={!isReady}
                onClick={onEnter}
                className={`w-full min-h-[48px] px-5 py-3 rounded-full font-display text-sm sm:text-base font-bold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 whitespace-nowrap ${
                  isReady
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-2 border-emerald-700 shadow-[0_6px_0_#047857,0_12px_20px_rgba(16,185,129,0.28)] hover:brightness-105 active:translate-y-0.5 cursor-pointer'
                    : 'bg-[#f6e8d9] text-[#a07654] border-2 border-[#e4cbb4] cursor-not-allowed opacity-85'
                }`}
              >
                {isReady ? '¡Entrar a la Pastelería!' : 'Preparando la pastelería...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
