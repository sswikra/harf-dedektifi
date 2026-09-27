import { useState, useEffect } from 'react';
import { STAGES } from './data/stages';
import { LetterStage, StageItem, AllProgress } from './types';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { CongratsModal } from './components/CongratsModal';
import { CertificateModal } from './components/CertificateModal';
import { GuideModal } from './components/GuideModal';
import {
  initAudio,
  setMuted,
  getMuted,
  setVoiceEnabled,
  getVoiceEnabled,
} from './utils/audio';

const STORAGE_KEY = 'harf_dedektifi_progress_v1';

export default function App() {
  const [activeStage, setActiveStage] = useState<LetterStage | null>(null);
  const [progress, setProgress] = useState<AllProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentFoundItemIds, setCurrentFoundItemIds] = useState<string[]>([]);
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMutedState, setIsMutedState] = useState(getMuted());
  const [isVoiceState, setIsVoiceState] = useState(getVoiceEnabled());

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore local storage error
    }
  }, [progress]);

  // Audio unlock listener
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleSelectStage = (stage: LetterStage) => {
    setActiveStage(stage);
    setCurrentFoundItemIds([]);
    setIsCongratsOpen(false);
  };

  const handleItemFound = (item: StageItem) => {
    if (!activeStage) return;

    setCurrentFoundItemIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [...prev, item.id];
    });
  };

  const handleCompleteStage = () => {
    if (!activeStage) return;

    // Calculate stars: 3 stars for finding all
    const earnedStars = 3;

    setProgress((prev) => ({
      ...prev,
      [activeStage.id]: {
        foundItemIds: activeStage.items.map((i) => i.id),
        stars: Math.max(prev[activeStage.id]?.stars || 0, earnedStars),
        completed: true,
        hintsUsed: 0,
      },
    }));

    setIsCongratsOpen(true);
  };

  const handleNextStage = () => {
    if (!activeStage) return;
    const currentIndex = STAGES.findIndex((s) => s.id === activeStage.id);
    const nextIndex = (currentIndex + 1) % STAGES.length;
    const nextStage = STAGES[nextIndex];
    handleSelectStage(nextStage);
  };

  const handleReplayStage = () => {
    if (!activeStage) return;
    setCurrentFoundItemIds([]);
    setIsCongratsOpen(false);
  };

  const handleNavigateHome = () => {
    setActiveStage(null);
    setIsCongratsOpen(false);
  };

  const handleToggleMute = () => {
    const newMuted = !isMutedState;
    setIsMutedState(newMuted);
    setMuted(newMuted);
  };

  const handleToggleVoice = () => {
    const newVoice = !isVoiceState;
    setIsVoiceState(newVoice);
    setVoiceEnabled(newVoice);
  };

  const handleResetProgress = () => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
    setIsGuideOpen(false);
  };

  return (
    <div className="bg-[#FFF9EE] bg-pattern min-h-screen flex flex-col justify-between text-slate-800">
      {/* App Header */}
      <Header
        currentStage={activeStage}
        foundCount={currentFoundItemIds.length}
        totalCount={activeStage ? activeStage.items.length : 0}
        isMuted={isMutedState}
        onToggleMute={handleToggleMute}
        isVoiceEnabled={isVoiceState}
        onToggleVoice={handleToggleVoice}
        onNavigateHome={handleNavigateHome}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {!activeStage ? (
          <MainMenu
            onSelectStage={handleSelectStage}
            progress={progress}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        ) : (
          <GameCanvas
            stage={activeStage}
            foundItemIds={currentFoundItemIds}
            onItemFound={handleItemFound}
            onBackToMenu={handleNavigateHome}
            onCompleteStage={handleCompleteStage}
          />
        )}
      </main>

      {/* Footer info matching design */}
      <footer className="w-full bg-white/70 border-t border-amber-200/60 py-2.5 px-4 text-center mt-6">
        <p className="text-xs text-slate-500 font-bold">
          🌱 Maarif Modeli 1. Sınıf Türkçe Öğretim Desteği • Dokunmatik Tablet & Kiosk Uyumlu
        </p>
      </footer>

      {/* Congrats Celebration Modal */}
      {isCongratsOpen && activeStage && (
        <CongratsModal
          stage={activeStage}
          stars={progress[activeStage.id]?.stars || 3}
          onNextStage={handleNextStage}
          onReplay={handleReplayStage}
          onBackToMenu={handleNavigateHome}
          onOpenCertificate={() => {
            setIsCongratsOpen(false);
            setIsCertificateOpen(true);
          }}
        />
      )}

      {/* Detective Achievement Certificate Modal */}
      {isCertificateOpen && (
        <CertificateModal
          progress={progress}
          onClose={() => setIsCertificateOpen(false)}
        />
      )}

      {/* Teacher & Parent Guide Modal */}
      {isGuideOpen && (
        <GuideModal
          onClose={() => setIsGuideOpen(false)}
          onResetProgress={handleResetProgress}
        />
      )}
    </div>
  );
}
