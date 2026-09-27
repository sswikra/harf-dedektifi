import React, { useState } from 'react';
import { Award, Printer, X, Star, Check } from 'lucide-react';
import { MASCOT_IMAGE, STAGES } from '../data/stages';
import { AllProgress } from '../types';
import { playClickSound } from '../utils/audio';

interface CertificateModalProps {
  progress: AllProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ progress, onClose }) => {
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('harf_dedektifi_student_name') || 'Küçük Dedektif';
  });

  const handleNameChange = (name: string) => {
    setStudentName(name);
    localStorage.setItem('harf_dedektifi_student_name', name);
  };

  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-2xl w-full p-4 sm:p-8 relative my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Sheet */}
        <div className="bg-[#FFFDF7] border-8 border-double border-amber-300 rounded-2xl p-5 sm:p-8 text-center relative overflow-hidden shadow-inner">
          {/* Watermark Owl */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img src={MASCOT_IMAGE} alt="Watermark" className="w-96 h-96 object-contain" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-sm">
              <img src={MASCOT_IMAGE} alt="Mascot" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-amber-800 block">
                Türkiye Yüzyılı Maarif Modeli
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif">
                BAŞARI BELGESİ
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-emerald-700 mb-4">
            1. Sınıf Türkçe Harf ve Ses Dedektifliği Programı
          </p>

          <p className="text-xs sm:text-sm text-slate-600 mb-2">
            Bu belge, gizli nesneleri ve sesleri üstün gayretle bulan:
          </p>

          {/* Student Name Input */}
          <div className="max-w-xs mx-auto mb-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Dedektifin İsmi"
              className="w-full text-center font-black text-xl sm:text-2xl text-amber-950 border-b-2 border-amber-400 bg-transparent py-1 focus:outline-none focus:border-amber-600 placeholder:text-slate-300"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              (İsmini değiştirmek için tıkla)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto mb-5 font-medium">
            adlı öğrencimize, Türkçemizin 4. ve 5. ses grubunda yer alan harfleri sahnelerde başarıyla
            keşfederek <strong className="text-amber-900 font-black">"Usta Harf Dedektifi"</strong>{' '}
            unvanını kazandığı için takdim edilmiştir.
          </p>

          {/* Progress Counters & Badges */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-5">
            <div className="bg-amber-100/60 rounded-xl p-2.5 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold block">Tamamlanan Harf</span>
              <span className="text-xl sm:text-2xl font-black text-amber-950">
                {completedCount} / 11
              </span>
            </div>
            <div className="bg-amber-100/60 rounded-xl p-2.5 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold block">Kazanılan Yıldız</span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>{totalStars} / 33</span>
              </span>
            </div>
          </div>

          {/* 11 Letters Stamp Ribbon */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              Keşfedilen Harf Rozetleri:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {STAGES.map((s) => {
                const isDone = progress[s.id]?.completed;
                return (
                  <div
                    key={s.id}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isDone
                        ? 'text-white shadow-sm ring-2 ring-emerald-400'
                        : 'bg-slate-100 text-slate-300 border border-slate-200'
                    }`}
                    style={{ backgroundColor: isDone ? s.color : undefined }}
                    title={`${s.letter} Harfi (${isDone ? 'Tamamlandı' : 'Bekliyor'})`}
                  >
                    {isDone ? (
                      <span className="relative">
                        {s.letter}
                        <Check className="w-2.5 h-2.5 absolute -bottom-1 -right-2 text-white stroke-[3]" />
                      </span>
                    ) : (
                      s.letter
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signatures */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-200/80 text-xs text-amber-900 font-bold px-4">
            <div className="text-left">
              <span className="block text-slate-400 text-[10px]">Eğitim Danışmanı</span>
              <span>Dedektif Bubo 🦉</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-400 text-[10px]">Tarih</span>
              <span>{new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition"
          >
            Kapat
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
