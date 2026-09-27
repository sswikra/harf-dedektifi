import React, { useState } from 'react';
import { Sparkles, Trophy, Star, Volume2 } from 'lucide-react';
import { MASCOT_IMAGE, STAGES } from '../data/stages';
import { AllProgress, LetterStage } from '../types';
import { playClickSound, speakTurkish } from '../utils/audio';

interface MainMenuProps {
  onSelectStage: (stage: LetterStage) => void;
  progress: AllProgress;
  onOpenCertificate: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectStage,
  progress,
  onOpenCertificate,
}) => {
  const [filterGroup, setFilterGroup] = useState<'all' | 4 | 5>('all');

  const filteredStages = STAGES.filter((s) => {
    if (filterGroup === 'all') return true;
    return s.group === filterGroup;
  });

  const totalCompleted = Object.values(progress).filter((p) => p.completed).length;

  const handleCardClick = (stage: LetterStage) => {
    playClickSound();
    speakTurkish(`${stage.letter} harfi. ${stage.title}`);
    onSelectStage(stage);
  };

  const handleLetterSoundClick = (e: React.MouseEvent, stage: LetterStage) => {
    e.stopPropagation();
    playClickSound();
    speakTurkish(`${stage.letter} sesi`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Welcome Hero Banner Matching Image 8 */}
      <div className="w-full bg-white/95 border-2 border-amber-200/90 rounded-3xl p-5 sm:p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-amber-100 border-4 border-amber-300 p-1 flex-shrink-0 shadow-md flex items-center justify-center">
            <img
              src={MASCOT_IMAGE}
              alt="Dedektif Baykuş Bubo"
              className="w-full h-full object-contain"
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow border border-white">
              Minik Şef
            </span>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Hoş Geldin Küçük Dedektif! 👋
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-1 max-w-xl font-medium leading-relaxed">
              Sahnelerde saklanan eşyaları bulabilir misin? İstediğin bir harfi seç, büyüteçle keşfe başla!
            </p>
          </div>
        </div>

        {/* Right Info Trophy Card */}
        <div
          onClick={onOpenCertificate}
          className="w-full md:w-auto bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300/80 rounded-2xl p-3 sm:px-5 sm:py-3 flex items-center justify-between md:justify-start gap-3 cursor-pointer transition shadow-sm"
          title="Başarı Belgesi ve İlerleme"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-800 text-2xl flex-shrink-0">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-950 text-xs sm:text-sm block">
                4. ve 5. Ses Grubu
              </span>
              <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {totalCompleted}/11 Tamamlandı
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-amber-700 font-medium">
              11 Harfli Zengin Macera
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Subtitle Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>Harf Sahnesi Seç</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
              11 Görev
            </span>
          </h3>
        </div>

        {/* Ses Grubu Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-amber-200 text-xs font-bold">
          <button
            onClick={() => setFilterGroup('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterGroup === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({STAGES.length})
          </button>
          <button
            onClick={() => setFilterGroup(4)}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterGroup === 4
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Ses Grubu
          </button>
          <button
            onClick={() => setFilterGroup(5)}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterGroup === 5
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Ses Grubu
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden lg:inline">
          Tablete özel dokunmatik mod ✨
        </span>
      </div>

      {/* 11 Letters Grid Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {filteredStages.map((stage) => {
          const stageProg = progress[stage.id];
          const isDone = stageProg?.completed;
          const stars = stageProg?.stars || 0;

          return (
            <div
              key={stage.id}
              onClick={() => handleCardClick(stage)}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 hover:border-amber-400 border-amber-200/80 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between active:scale-[0.98] group relative overflow-hidden"
            >
              {/* Top Row: Letter Badge & Object Count */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm text-white group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.letter}
                  </div>
                  {/* Clickable speaker for phonetic sound */}
                  <button
                    onClick={(e) => handleLetterSoundClick(e, stage)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-100 flex items-center justify-center text-slate-600 hover:text-amber-800 transition"
                    title={`"${stage.letter}" Sesini Dinle`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full text-slate-700 bg-slate-100 border border-slate-200">
                    5 Nesne
                  </span>
                  {isDone && (
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Target Letter */}
              <div className="mb-4">
                <h4 className="font-extrabold text-slate-800 text-base sm:text-lg leading-snug group-hover:text-amber-900 transition">
                  {stage.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500 font-medium">
                    Hedef Ses:{' '}
                    <span
                      className="font-black text-sm px-1.5 py-0.5 rounded-md"
                      style={{ color: stage.color, backgroundColor: stage.bgSoft }}
                    >
                      {stage.letter}
                    </span>
                  </p>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    ({stage.group}. Ses Grubu)
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {isDone ? (
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Tamamlandı!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Hazır
                  </span>
                )}
                <span className="text-sm font-black text-amber-600 group-hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Oyna ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classroom / Tablet Mode Helpful Footer Hint */}
      <div className="mt-8 bg-white/70 border border-amber-200 rounded-2xl p-3.5 max-w-xl text-center text-xs text-slate-600 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>
          İpucu: Resimlerdeki nesneleri parmağınla veya fareyle bulabilir, büyüteçle yakından inceleyebilirsin!
        </span>
      </div>
    </div>
  );
};
