import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Gift, Package, Star, Volume2, VolumeX } from 'lucide-react';
import {
  ALL_STICKERS_FLAT,
  TOTAL_STICKERS,
  type BakieSpecies,
  type BakieVariant,
  type FlatSticker,
} from './data/bakies';
import { ConfettiCanvas, type ConfettiHandle } from './components/ConfettiCanvas';
import { SplashScreen } from './components/SplashScreen';
import { PackOpener } from './components/PackOpener';
import { AlbumView } from './components/AlbumView';
import { RewardModal, type PulledCard } from './components/RewardModal';
import { StickerDetailModal } from './components/StickerDetailModal';
import { BakieImage } from './components/BakieImage';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { playRevealChime, playSoftPop, playTearStep } from './utils/sound';

type ActiveTab = 'store' | 'album';

interface UserState {
  inventory: Record<string, number>;
  packsOpened: number;
}

const STORAGE_KEY = 'bakies_save_v2';

function loadInitialState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserState>;
      return {
        inventory: parsed.inventory && typeof parsed.inventory === 'object' ? parsed.inventory : {},
        packsOpened: typeof parsed.packsOpened === 'number' ? parsed.packsOpened : 0,
      };
    }
  } catch {
    // Fallback to clean state if localStorage is unavailable or malformed
  }
  return { inventory: {}, packsOpened: 0 };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('store');
  const [userState, setUserState] = useState<UserState>(loadInitialState);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Pack opening state
  const [frameIndex, setFrameIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [rewardCards, setRewardCards] = useState<PulledCard[]>([]);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [recentPulls, setRecentPulls] = useState<FlatSticker[]>([]);

  // Detail modal state
  const [selectedSticker, setSelectedSticker] = useState<FlatSticker | null>(null);

  const confettiRef = useRef<ConfettiHandle | null>(null);
  const packWrapperRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const inventoryRef = useRef(userState.inventory);
  inventoryRef.current = userState.inventory;

  useBodyScrollLock(showSplash);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch {
      // Ignore storage quota errors
    }
  }, [userState]);

  const uniqueCollected = useMemo(() => {
    return ALL_STICKERS_FLAT.filter((item) => (userState.inventory[item.uid] || 0) > 0).length;
  }, [userState.inventory]);

  const unlockedStickersList = useMemo(() => {
    return ALL_STICKERS_FLAT.filter((item) => (userState.inventory[item.uid] || 0) > 0);
  }, [userState.inventory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedSticker) setSelectedSticker(null);
        else if (isRewardOpen) setIsRewardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRewardOpen, selectedSticker]);

  const handleEnterApp = useCallback(() => {
    playSoftPop(soundEnabled);
    setShowSplash(false);
    confettiRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
  }, [soundEnabled]);

  const handleSwitchTab = useCallback(
    (tab: ActiveTab) => {
      if (tab !== activeTab) {
        playSoftPop(soundEnabled);
        setActiveTab(tab);
        window.scrollTo({
          top: 0,
          behavior: window.scrollY < 450 ? 'smooth' : 'instant',
        });
      }
    },
    [activeTab, soundEnabled]
  );

  const revealPackRewards = useCallback(() => {
    const pulledItems: FlatSticker[] = [];
    for (let i = 0; i < 3; i++) {
      const randIdx = Math.floor(Math.random() * ALL_STICKERS_FLAT.length);
      pulledItems.push(ALL_STICKERS_FLAT[randIdx]);
    }

    const nextInventory = { ...inventoryRef.current };
    const nextCards: PulledCard[] = pulledItems.map((item) => {
      const prevQty = nextInventory[item.uid] || 0;
      const nextQty = prevQty + 1;
      nextInventory[item.uid] = nextQty;
      return {
        item,
        isNew: prevQty === 0,
        totalOwned: nextQty,
      };
    });

    const hasNew = nextCards.some((c) => c.isNew);
    playRevealChime(soundEnabled, hasNew);

    setUserState((prev) => ({
      inventory: nextInventory,
      packsOpened: prev.packsOpened + 1,
    }));
    setRewardCards(nextCards);
    setRecentPulls(pulledItems);
    setIsRewardOpen(true);

    confettiRef.current?.burst(window.innerWidth / 2, window.innerHeight / 2, 55);
  }, [soundEnabled]);

  const startPackOpening = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    setFrameIndex(0);
    playTearStep(soundEnabled, 0);

    const frameDuration = 220;
    const totalFrames = 6;

    for (let step = 1; step < totalFrames; step++) {
      const t = window.setTimeout(() => {
        setFrameIndex(step);
        playTearStep(soundEnabled, step);

        const rect = packWrapperRef.current?.getBoundingClientRect();
        if (rect) {
          const tearRatio = step / (totalFrames - 1);
          const tearX = rect.right - rect.width * tearRatio * 0.85;
          const tearY = rect.top + 42;
          confettiRef.current?.burst(tearX, tearY, 12 + step * 3);
        }
      }, step * frameDuration);
      timersRef.current.push(t);
    }

    const revealTimer = window.setTimeout(() => {
      revealPackRewards();
      const resetTimer = window.setTimeout(() => {
        setFrameIndex(0);
        setIsOpening(false);
      }, 420);
      timersRef.current.push(resetTimer);
    }, totalFrames * frameDuration + 160);

    timersRef.current.push(revealTimer);
  }, [isOpening, revealPackRewards, soundEnabled]);

  const handleOpenAnother = useCallback(() => {
    setIsRewardOpen(false);
    const t = window.setTimeout(() => {
      startPackOpening();
    }, 120);
    timersRef.current.push(t);
  }, [startPackOpening]);

  const handleSelectAlbumSticker = useCallback(
    (species: BakieSpecies, variant: BakieVariant, qty: number) => {
      if (qty <= 0) return;
      const uid = `${species.id}_${variant.num.replace('#', '')}`;
      const found = ALL_STICKERS_FLAT.find((s) => s.uid === uid);
      if (found) {
        playSoftPop(soundEnabled);
        setSelectedSticker(found);
      }
    },
    [soundEnabled]
  );

  const handleCycleDetail = useCallback(
    (direction: -1 | 1) => {
      if (!selectedSticker || unlockedStickersList.length <= 1) return;
      const idx = unlockedStickersList.findIndex((s) => s.uid === selectedSticker.uid);
      if (idx === -1) return;
      const nextIdx =
        (idx + direction + unlockedStickersList.length) % unlockedStickersList.length;
      playSoftPop(soundEnabled);
      setSelectedSticker(unlockedStickersList[nextIdx]);
    },
    [selectedSticker, soundEnabled, unlockedStickersList]
  );

  const handleResetProgress = useCallback(() => {
    setUserState({ inventory: {}, packsOpened: 0 });
    setRecentPulls([]);
    setSelectedSticker(null);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      <ConfettiCanvas ref={confettiRef} />

      {showSplash && <SplashScreen onEnter={handleEnterApp} />}

      {/* Compact Sticky Header (<= 48px on mobile) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#efdccc] shadow-[0_4px_16px_rgba(120,53,15,0.05)]">
        <div className="max-w-6xl mx-auto h-12 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-8">
          {/* Zone 1: Brand Logo */}
          <button
            type="button"
            onClick={() => handleSwitchTab('store')}
            aria-label="Ir al inicio de BAKIES"
            className="min-h-[44px] px-1 shrink-0 flex items-center cursor-pointer transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-rose-500 rounded-xl"
          >
            <BakieImage
              src="/assets/logo/bakies_logo.png"
              alt="BAKIES"
              fallbackIcon="🧁"
              width={1280}
              height={720}
              loading="eager"
              fetchPriority="high"
              imgClassName="h-7 sm:h-11 w-auto aspect-[16/9] object-contain"
            />
          </button>

          {/* Zone 2: Desktop Navigation Tabs */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-1.5 p-1 bg-[#f7eadc] border-2 border-[#e7cbb2] rounded-full"
          >
            <button
              type="button"
              onClick={() => handleSwitchTab('store')}
              className={`min-h-[38px] px-5 py-1.5 rounded-full font-display text-sm font-bold inline-flex items-center gap-2 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                activeTab === 'store'
                  ? 'bg-white text-[#5c3419] shadow-sm'
                  : 'text-[#8c6245] hover:text-[#5c3419]'
              }`}
            >
              <Gift className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
              <span>Abrir Sobres</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('album')}
              className={`min-h-[38px] px-5 py-1.5 rounded-full font-display text-sm font-bold inline-flex items-center gap-2 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500 ${
                activeTab === 'album'
                  ? 'bg-white text-[#5c3419] shadow-sm'
                  : 'text-[#8c6245] hover:text-[#5c3419]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span>Álbum de Stickers</span>
            </button>
          </nav>

          {/* Zone 3: Collection Counters & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-[#632d0c] tabular-nums"
              aria-label="Estadísticas de colección"
            >
              <span
                className="inline-flex items-center gap-1 whitespace-nowrap"
                title="Stickers únicos conseguidos"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
                <span>
                  {uniqueCollected}/{TOTAL_STICKERS}
                </span>
              </span>
              <span className="text-[#d6b79c]" aria-hidden="true">
                ·
              </span>
              <span
                className="inline-flex items-center gap-1 whitespace-nowrap"
                title="Sobres abiertos"
              >
                <Package className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
                <span>{userState.packsOpened}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fff6eb] border border-[#ebd5c1] text-[#7c4118] hover:bg-[#fde9d4] flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-rose-500"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#a88263]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-8 pb-20 md:pb-10">
        {activeTab === 'store' ? (
          <PackOpener
            frameIndex={frameIndex}
            isOpening={isOpening}
            packWrapperRef={packWrapperRef}
            onOpenPack={startPackOpening}
            uniqueCollected={uniqueCollected}
            packsOpened={userState.packsOpened}
            recentPulls={recentPulls}
            onGoToAlbum={() => handleSwitchTab('album')}
            onSelectSticker={(sticker) => {
              playSoftPop(soundEnabled);
              setSelectedSticker(sticker);
            }}
          />
        ) : (
          <AlbumView
            inventory={userState.inventory}
            packsOpened={userState.packsOpened}
            uniqueCollected={uniqueCollected}
            onSelectSticker={handleSelectAlbumSticker}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (Thumb Zone, compact <= 52px) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/94 backdrop-blur-md border-t-2 border-[#efdccc] shadow-[0_-6px_20px_rgba(120,53,15,0.07)] pb-safe"
      >
        <div className="grid grid-cols-2 h-[52px] max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleSwitchTab('store')}
            aria-current={activeTab === 'store' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500 ${
              activeTab === 'store' ? 'text-rose-600' : 'text-[#8c6245]'
            }`}
          >
            {activeTab === 'store' && (
              <span
                aria-hidden="true"
                className="absolute top-0 w-10 h-0.5 rounded-full bg-rose-500"
              />
            )}
            <Gift className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-display text-[11px] font-bold whitespace-nowrap leading-none">
              Abrir Sobres
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('album')}
            aria-current={activeTab === 'album' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500 ${
              activeTab === 'album' ? 'text-[#632d0c]' : 'text-[#8c6245]'
            }`}
          >
            {activeTab === 'album' && (
              <span
                aria-hidden="true"
                className="absolute top-0 w-10 h-0.5 rounded-full bg-[#7c4118]"
              />
            )}
            <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-display text-[11px] font-bold whitespace-nowrap tabular-nums leading-none">
              Álbum · {uniqueCollected}/{TOTAL_STICKERS}
            </span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <RewardModal
        isOpen={isRewardOpen}
        cards={rewardCards}
        onClose={() => setIsRewardOpen(false)}
        onOpenAnother={handleOpenAnother}
      />

      <StickerDetailModal
        sticker={selectedSticker}
        quantity={selectedSticker ? userState.inventory[selectedSticker.uid] || 1 : 0}
        onClose={() => setSelectedSticker(null)}
        onPrev={() => handleCycleDetail(-1)}
        onNext={() => handleCycleDetail(1)}
        hasMultipleUnlocked={unlockedStickersList.length > 1}
      />
    </div>
  );
}
