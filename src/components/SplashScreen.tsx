import { useEffect, useState } from 'react';
import { LOADING_MESSAGES, PRELOAD_ASSETS } from '../data/bakies';
import { BakieImage } from './BakieImage';

interface SplashScreenProps {
  onEnter: () => void;
}

const SPLASH_DURATION_MS = 15000;

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [timeProgress, setTimeProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const totalAssets = PRELOAD_ASSETS.length;

  useEffect(() => {
    let isCancelled = false;
    const cachedImages: HTMLImageElement[] = [];

    const markLoaded = () => {
      if (!isCancelled) {
        setLoadedCount((prev) => Math.min(prev + 1, totalAssets));
      }
    };

    PRELOAD_ASSETS.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      cachedImages.push(img);

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {}).finally(markLoaded);
        } else {
          markLoaded();
        }
      };

      img.onload = finish;
      img.onerror = () => {
        if (!settled) {
          settled = true;
          markLoaded();
        }
      };
      img.src = src;

      if (img.complete) {
        finish();
      }
    });

    let start: number | null = null;
    let rafId: number;

    const tick = (timestamp: number) => {
      if (isCancelled) return;
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const ratio = Math.min(elapsed / SPLASH_DURATION_MS, 1);
      setTimeProgress(ratio);

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [totalAssets]);

  const assetProgress = totalAssets > 0 ? loadedCount / totalAssets : 1;
  const combinedProgress = Math.min(timeProgress, assetProgress);
  const isReady = timeProgress >= 1 && loadedCount >= totalAssets;

  const progressStepsCount = LOADING_MESSAGES.length - 1;
  const msgIdx = Math.min(
    Math.floor(combinedProgress * progressStepsCount),
    progressStepsCount - 1
  );
  const activeMsg = isReady
    ? LOADING_MESSAGES[LOADING_MESSAGES.length - 1]
    : LOADING_MESSAGES[msgIdx];

  const pct = Math.round(combinedProgress * 100);

  return (
    <div
      className="fixed inset-0 z-[900] flex flex-col items-center justify-center px-5 py-8 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50"
      style={{
        backgroundImage:
          'radial-gradient(#f0d7c4 2px, transparent 2px), linear-gradient(135deg, #fff1f4 0%, #fffbeb 50%, #eef9ff 100%)',
        backgroundSize: '28px 28px, 100% 100%',
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="w-[min(78vw,340px)] mb-6 animate-float-gentle drop-shadow-[0_14px_24px_rgba(92,52,25,0.18)]">
          <BakieImage
            src="/assets/logo/bakies_logo.png"
            alt="Logo oficial de BAKIES"
            fallbackIcon="🧁"
            imgClassName="w-full h-auto mx-auto"
          />
        </div>

        <div className="w-full max-w-xs sm:max-w-sm bg-white/88 backdrop-blur-md rounded-[28px] border-2 border-[#f1dccb] p-5 sm:p-6 shadow-[0_14px_32px_rgba(120,53,15,0.09)]">
          <div
            className="w-full h-5 bg-[#faead9] border-2 border-[#7c4118] rounded-full p-0.5 overflow-hidden shadow-inner"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Cargando pastelería BAKIES"
          >
            <div
              className="h-full rounded-full relative overflow-hidden bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 candy-stripes transition-[width] duration-100 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-3.5 min-h-[24px] text-sm sm:text-base font-semibold text-[#7c4118] flex items-center justify-center gap-2">
            <span aria-hidden="true">{activeMsg.icon}</span>
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
              className={`w-full min-h-[48px] px-6 py-3 rounded-full font-display text-base sm:text-lg font-bold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 whitespace-nowrap ${
                isReady
                  ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-2 border-emerald-700 shadow-[0_6px_0_#047857,0_12px_20px_rgba(16,185,129,0.28)] hover:brightness-105 active:translate-y-0.5 cursor-pointer'
                  : 'bg-[#f6e8d9] text-[#a07654] border-2 border-[#e4cbb4] cursor-not-allowed opacity-80'
              }`}
            >
              {isReady ? '¡Entrar a la Pastelería!' : 'Preparando la pastelería...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
