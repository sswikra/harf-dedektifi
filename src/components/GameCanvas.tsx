import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lightbulb, ArrowLeft, Volume2, Search, CheckCircle2 } from 'lucide-react';
import { LetterStage, StageItem } from '../types';
import {
  playFoundSound,
  playWrongSound,
  playHintSound,
  playClickSound,
  speakTurkish,
} from '../utils/audio';

interface GameCanvasProps {
  stage: LetterStage;
  foundItemIds: string[];
  onItemFound: (item: StageItem) => void;
  onBackToMenu: () => void;
  onCompleteStage: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stage,
  foundItemIds,
  onItemFound,
  onBackToMenu,
  onCompleteStage,
}) => {
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [activeHintItemId, setActiveHintItemId] = useState<string | null>(null);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isSuccess: boolean } | null>(
    null
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, isSuccess: boolean) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({ text, isSuccess });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Announce stage upon entering
  useEffect(() => {
    speakTurkish(`${stage.letter} harfi dedektifliği başlıyor! 5 gizli nesneyi bul!`);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [stage]);

  // Check if all items found
  useEffect(() => {
    if (foundItemIds.length === stage.items.length && stage.items.length > 0) {
      const timer = setTimeout(() => {
        onCompleteStage();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [foundItemIds, stage.items.length, onCompleteStage]);

  // Handle successful item discovery (direct function)
  const handleItemFoundDirect = useCallback(
    (item: StageItem) => {
      if (foundItemIds.includes(item.id)) return;

      playFoundSound();
      speakTurkish(`Tebrikler! ${item.name} bulundu!`);
      showToast(`✨ Harika! "${item.name}" bulundu!`, true);
      onItemFound(item);

      if (activeHintItemId === item.id) {
        setActiveHintItemId(null);
      }
    },
    [foundItemIds, activeHintItemId, onItemFound, showToast]
  );

  // Handle stage miss or close-range hit detection
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked on an actual hotspot button, it already handled it
    if ((e.target as HTMLElement).closest('button')) return;

    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if the click falls on or slightly near any unfound item with 3% tolerance
    const unfound = stage.items.filter((item) => !foundItemIds.includes(item.id));
    const matchedItem = unfound.find((item) => {
      const padX = 2.5;
      const padY = 3.0;
      return (
        clickX >= item.x - padX &&
        clickX <= item.x + item.w + padX &&
        clickY >= item.y - padY &&
        clickY <= item.y + item.h + padY
      );
    });

    if (matchedItem) {
      handleItemFoundDirect(matchedItem);
      return;
    }

    // Genuinely empty area clicked
    playWrongSound();
    setIsShaking(true);
    showToast('🔍 Orada aradığımız harf sesi yok gibi, başka bir köşeye bak!', false);
    setTimeout(() => setIsShaking(false), 450);
  };

  // Handle clicking button hotspot
  const handleHotspotClick = (item: StageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleItemFoundDirect(item);
  };

  // Use hint
  const handleUseHint = () => {
    playClickSound();
    if (hintsRemaining <= 0) {
      showToast('İpucu hakkın kalmadı, biraz daha dikkatle incele! 🧐', false);
      return;
    }

    const unfound = stage.items.filter((item) => !foundItemIds.includes(item.id));
    if (unfound.length === 0) return;

    setHintsRemaining((prev) => prev - 1);
    playHintSound();

    // Pick random unfound item
    const luckyItem = unfound[Math.floor(Math.random() * unfound.length)];
    setActiveHintItemId(luckyItem.id);
    speakTurkish(`İpucu: ${luckyItem.clue}`);
    showToast(`Dedektif Bubo fısıldadı: ${luckyItem.name} parlıyor! 💡`, true);

    setTimeout(() => {
      setActiveHintItemId((current) => (current === luckyItem.id ? null : current));
    }, 4500);
  };

  // Magnifier pointer movement
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMagnifierActive || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnifierPos({ x, y });
  };

  const handlePointerLeave = () => {
    setMagnifierPos(null);
  };

  // Speak word & syllables
  const handlePronounceItem = (item: StageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    const syllableText = item.syllables.join(' - ');
    speakTurkish(`${item.name}. ${syllableText}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Stage Header Info Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              playClickSound();
              onBackToMenu();
            }}
            className="px-3.5 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm shadow-sm hover:bg-slate-50 transition active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Harfler</span>
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-800 leading-tight">
              {stage.letter} Harfi — {stage.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Bu odadaki{' '}
              <strong className="font-black text-amber-600">"{stage.letter}"</strong> sesini
              barındıran 5 gizli eşyayı bul!
            </p>
          </div>
        </div>

        {/* Action Controls: Magnifier & Hint */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Magnifier Lens Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setIsMagnifierActive(!isMagnifierActive);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 font-bold text-xs sm:text-sm transition active:scale-95 shadow-sm ${
              isMagnifierActive
                ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
            }`}
            title="Büyüteç Modu (Yakından İncele)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xs:inline">Büyüteç</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={handleUseHint}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-md transition active:scale-95 ${
              hintsRemaining > 0
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:brightness-105'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-4 h-4 fill-amber-300" />
            <span>İpucu ({hintsRemaining})</span>
          </button>
        </div>
      </div>

      {/* Stage Playground Container */}
      <div className="relative w-full bg-white rounded-3xl p-2 sm:p-3 border-4 border-amber-200 shadow-xl overflow-hidden">
        {/* Interactive Viewport Canvas - naturally fits image without letterboxing or cropping */}
        <div
          ref={viewportRef}
          onClick={handleViewportClick}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 select-none shadow-inner ${
            isShaking ? 'shake-animation' : ''
          } ${isMagnifierActive ? 'cursor-none' : 'cursor-crosshair'}`}
        >
          {/* Main Stage Image - Full sharpness, no aspect crop */}
          <img
            src={stage.image}
            alt={stage.title}
            className="w-full h-auto block select-none pointer-events-none"
            draggable={false}
            style={{
              imageRendering: '-webkit-optimize-contrast',
            }}
          />

          {/* Hotspots Layer - 100% pixel aligned with the image */}
          <div className="absolute inset-0 pointer-events-auto">
            {stage.items.map((item) => {
              const isFound = foundItemIds.includes(item.id);
              const isHinted = activeHintItemId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={(e) => handleHotspotClick(item, e)}
                  disabled={isFound}
                  aria-label={item.name}
                  className={`absolute rounded-2xl transition-all focus:outline-none ${
                    isFound
                      ? 'border-3 border-emerald-500 bg-emerald-500/25 cursor-default'
                      : isHinted
                      ? 'hint-glow border-3 border-amber-400 bg-amber-300/40 z-30'
                      : 'border-2 border-transparent hover:border-amber-400/40'
                  }`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.w}%`,
                    height: `${item.h}%`,
                  }}
                >
                  {isFound && (
                    <div className="pop-in absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-lg border-2 border-white">
                      ✓
                    </div>
                  )}
                  {isHinted && !isFound && (
                    <div className="absolute -top-3.5 -right-3.5 bg-amber-400 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black shadow-md animate-bounce flex items-center gap-1 border border-white">
                      <span>💡</span>
                      <span>Burada!</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Magnifier Glass Overlay when active */}
          {isMagnifierActive && magnifierPos && (
            <div
              className="absolute pointer-events-none rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden z-30"
              style={{
                width: '150px',
                height: '150px',
                left: `${magnifierPos.x}%`,
                top: `${magnifierPos.y}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 6px rgba(255, 255, 255, 0.85), 0 10px 25px rgba(0,0,0,0.45)',
                backgroundImage: `url(${stage.image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '250%',
                backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
              }}
            >
              {/* Magnifier Crosshair & optical shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-full h-[1px] bg-amber-500"></div>
                <div className="h-full w-[1px] bg-amber-500 absolute"></div>
              </div>
            </div>
          )}

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div
              className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 pointer-events-none transition-all duration-300 z-40 ${
                toastMessage.isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/85 backdrop-blur text-white'
              }`}
            >
              <span>{toastMessage.isSuccess ? '🎉' : '🔎'}</span>
              <span>{toastMessage.text}</span>
            </div>
          )}
        </div>

        {/* Bottom Targets Tray matching the user design */}
        <div className="mt-3 bg-amber-50/90 rounded-2xl p-2.5 sm:p-3 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-sm shadow-sm">
              🎯
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-950">
              Aranan Gizli Eşyalar:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {stage.items.map((item) => {
              const isFound = foundItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={(e) => handlePronounceItem(item, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${
                    isFound
                      ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950 scale-102'
                      : 'bg-white border border-amber-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                  title="Tıkla ve sesli dinle"
                >
                  {isFound ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="text-slate-400 text-xs">○</span>
                  )}
                  <span
                    dangerouslySetInnerHTML={{ __html: item.highlightHtml }}
                    className="font-medium"
                  />
                  <button
                    onClick={(e) => handlePronounceItem(item, e)}
                    className="text-slate-400 hover:text-amber-700 p-0.5"
                    title="Telaffuzu Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
