import React from 'react';
import { Volume2, VolumeX, Sparkles, Award, HelpCircle } from 'lucide-react';
import { MASCOT_IMAGE } from '../data/stages';
import { LetterStage } from '../types';

interface HeaderProps {
  currentStage: LetterStage | null;
  foundCount: number;
  totalCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onNavigateHome: () => void;
  onOpenCertificate: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  foundCount,
  totalCount,
  isMuted,
  onToggleMute,
  isVoiceEnabled,
  onToggleVoice,
  onNavigateHome,
  onOpenCertificate,
  onOpenGuide,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b-2 border-amber-200/70 px-3 sm:px-6 py-2.5 sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* App Logo & Home Button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl p-1 transition"
          title="Ana Sayfaya Dön"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={MASCOT_IMAGE}
              alt="Dedektif Baykuş"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-amber-950 group-hover:text-amber-800 transition">
                Harf Dedektifi
              </span>
              <span className="text-base sm:text-xl">🔍</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-emerald-600">
              Maarif Modeli 1. Sınıf
            </p>
          </div>
        </button>

        {/* Center Target Badge in Gameplay */}
        {currentStage && (
          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 rounded-full px-3 sm:px-4 py-1 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-amber-800 hidden xs:inline">
              Hedef:
            </span>
            <span
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white font-black text-lg sm:text-xl flex items-center justify-center shadow"
              style={{ backgroundColor: currentStage.color }}
            >
              {currentStage.letter}
            </span>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-900 bg-white/95 px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-200">
              <span className="hidden sm:inline">Kalan:</span>
              <span className="text-emerald-600 font-extrabold text-sm sm:text-base">
                {foundCount} / {totalCount}
              </span>
            </div>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice Narration Toggle */}
          <button
            onClick={onToggleVoice}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 flex items-center justify-center text-xs font-bold transition shadow-sm active:scale-95 ${
              isVoiceEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={isVoiceEnabled ? 'Sesli Okuma Açık' : 'Sesli Okuma Kapalı'}
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-amber-900 transition shadow-sm active:scale-95"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-slate-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-800" />
            )}
          </button>

          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className="hidden md:flex items-center gap-1.5 px-3 h-10 sm:h-11 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 font-bold text-amber-900 text-xs sm:text-sm transition shadow-sm active:scale-95"
            title="Dedektif Başarı Belgesi"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>Belgem</span>
          </button>

          {/* Guide / Info Button */}
          <button
            onClick={onOpenGuide}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shadow-sm active:scale-95"
            title="Öğretmen ve Veli Kılavuzu"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Quick Home if playing */}
          {currentStage && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-3 sm:px-4 h-10 sm:h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 font-bold text-slate-700 text-xs sm:text-sm transition shadow-sm active:scale-95"
            >
              <span>🏠 Menü</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
