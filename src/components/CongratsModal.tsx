import React, { useEffect, useRef } from 'react';
import { Star, Trophy, RotateCcw, ArrowRight, Volume2 } from 'lucide-react';
import { LetterStage } from '../types';
import { MASCOT_IMAGE } from '../data/stages';
import { playClickSound, playVictorySound, speakTurkish } from '../utils/audio';

interface CongratsModalProps {
  stage: LetterStage;
  stars: number;
  onNextStage: () => void;
  onReplay: () => void;
  onBackToMenu: () => void;
  onOpenCertificate: () => void;
}

export const CongratsModal: React.FC<CongratsModalProps> = ({
  stage,
  stars,
  onNextStage,
  onReplay,
  onBackToMenu,
  onOpenCertificate,
}) => {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    playVictorySound();
    speakTurkish(`Tebrikler! ${stage.letter} harfinin tüm gizli eşyalarını buldun! Harika bir dedektifsin!`);

    // Confetti animation on HTML5 Canvas
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = canvas.parentElement?.clientHeight || 550;

    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#F97316'];
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
    }));

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      });
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [stage]);

  const handlePronounce = (word: string) => {
    playClickSound();
    speakTurkish(word);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center relative overflow-hidden transform transition-all duration-300">
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />

        {/* Mascot Avatar & Crown */}
        <div className="relative w-24 h-24 mx-auto mb-3 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center shadow-lg">
          <img
            src={MASCOT_IMAGE}
            alt="Kutlama Baykuşu"
            className="w-20 h-20 object-contain"
          />
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow text-xl animate-bounce">
            ⭐
          </div>
        </div>

        {/* Header Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
          Tebrikler Dedektif! 🎉
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mb-3 font-medium">
          <span
            className="font-black text-base px-2 py-0.5 rounded-lg mr-1 text-white shadow-sm inline-block"
            style={{ backgroundColor: stage.color }}
          >
            {stage.letter}
          </span>
          harfine ait 5 gizli nesneyi başarıyla tespit ettin!
        </p>

        {/* Star Rating Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {[1, 2, 3].map((starNum) => (
            <Star
              key={starNum}
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ${
                starNum <= stars
                  ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Found Words Summary Chip List */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-5 relative z-20">
          <span className="text-xs font-black text-amber-900 block mb-2">
            Bulduğun Harfli Kelimeler (Dinlemek için tıkla):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {stage.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePronounce(item.name)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-300 font-extrabold text-xs sm:text-sm text-emerald-900 shadow-sm flex items-center gap-1.5 transition active:scale-95"
              >
                <span>✓</span>
                <span dangerouslySetInnerHTML={{ __html: item.highlightHtml }} />
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-20">
          <button
            onClick={() => {
              playClickSound();
              onNextStage();
            }}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm sm:text-base shadow-lg hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>Sıradaki Harfe Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playClickSound();
              onBackToMenu();
            }}
            className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm sm:text-base shadow-sm active:scale-95 transition"
          >
            <span>Harf Menüsüne Dön</span>
          </button>
        </div>

        {/* Secondary Action Row */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 relative z-20 text-xs font-bold text-slate-500">
          <button
            onClick={() => {
              playClickSound();
              onReplay();
            }}
            className="hover:text-amber-700 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bu Sahneyi Tekrar Oyna</span>
          </button>
          <span>•</span>
          <button
            onClick={() => {
              playClickSound();
              onOpenCertificate();
            }}
            className="hover:text-amber-700 flex items-center gap-1 transition"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Dedektif Belgem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
