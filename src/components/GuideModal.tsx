import React from 'react';
import { X, BookOpen, Tablet, Sparkles, RefreshCw } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface GuideModalProps {
  onClose: () => void;
  onResetProgress: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose, onResetProgress }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-xl w-full p-5 sm:p-7 relative my-auto">
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 text-xl font-bold flex-shrink-0">
            <BookOpen className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Öğretmen & Veli Kılavuzu</h3>
            <p className="text-xs text-emerald-600 font-bold">
              Türkiye Yüzyılı Maarif Modeli 1. Sınıf Türkçe Uyumu
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
            <h4 className="font-black text-amber-950 flex items-center gap-1.5 mb-1 text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Oyunun Pedagojik Amacı</span>
            </h4>
            <p>
              Öğrencilerin ses-harf eşleşmesini ve kelime başı/içi ses farkındalığını (fonolojik
              farkındalık) görsel zenginlik ve keşif hissiyle pekiştirmesi amaçlanmıştır. Her
              sahnede hedeflenen ses grubuna ait eşyalar saklanmıştır.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5 mb-1 text-sm">
              <Tablet className="w-4 h-4 text-indigo-600" />
              <span>Tablette ve Akıllı Tahtada Kullanım</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>Dokunmatik Keşif:</strong> Öğrenciler parmaklarıyla doğrudan resimdeki eşyaya
                dokunarak bulabilir.
              </li>
              <li>
                <strong>Büyüteç Modu:</strong> Resmin detaylarını yakından incelemek için Büyüteç
                butonuna basılabilir.
              </li>
              <li>
                <strong>Sesli Telaffuz:</strong> Alt kısımda bulunan eşya kartlarına tıklandığında
                heceler ve kelime Türkçe olarak seslendirilir.
              </li>
              <li>
                <strong>İpucu Butonu:</strong> Zorlanan minik dedektifler için Baykuş Bubo eşyanın
                parlamasını sağlar.
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
            <h4 className="font-black text-emerald-950 mb-1 text-sm">
              4. ve 5. Ses Grubu Harfleri:
            </h4>
            <p className="text-emerald-900 font-semibold">
              • 4. Ses Grubu: <strong>Z, Ç, G, Ş, C, P</strong>
              <br />• 5. Ses Grubu: <strong>H, V, Ğ, F, J</strong>
            </p>
          </div>

          {/* Reset progress */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Yeni bir öğrenci için ilerlemeyi sıfırla:</span>
            <button
              onClick={() => {
                if (window.confirm('Tüm yıldızlar ve ilerleme sıfırlansın mı?')) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>İlerlemeyi Sıfırla</span>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition active:scale-95"
          >
            Anladım, Oyuna Devam Et! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
