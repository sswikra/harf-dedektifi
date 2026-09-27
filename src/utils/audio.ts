/**
 * Sound synthesis and Turkish Text-to-Speech narration
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;
let isVoiceEnabled = true;

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

export const getMuted = () => isMuted;

export const setVoiceEnabled = (enabled: boolean) => {
  isVoiceEnabled = enabled;
};

export const getVoiceEnabled = () => isVoiceEnabled;

const playTone = (
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainVal = 0.15,
  delay = 0
) => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const startTime = audioCtx.currentTime + delay;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch {
    // Ignore audio context errors
  }
};

export const playClickSound = () => {
  playTone(550, 0.05, 'sine', 0.1);
};

export const playFoundSound = () => {
  // Joyful three-note rising chord (C5 -> E5 -> G5)
  playTone(523.25, 0.12, 'triangle', 0.2, 0);
  playTone(659.25, 0.12, 'triangle', 0.2, 0.09);
  playTone(783.99, 0.28, 'triangle', 0.25, 0.18);
};

export const playWrongSound = () => {
  // Low gentle wobble tone
  playTone(280, 0.12, 'sawtooth', 0.08, 0);
  playTone(220, 0.2, 'sawtooth', 0.08, 0.1);
};

export const playHintSound = () => {
  // Sparkle chime
  playTone(880, 0.15, 'sine', 0.18, 0);
  playTone(1174.66, 0.2, 'sine', 0.2, 0.1);
  playTone(1396.91, 0.35, 'sine', 0.22, 0.2);
};

export const playVictorySound = () => {
  // Big fanfare
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((freq, idx) => {
    playTone(freq, 0.3, 'triangle', 0.2, idx * 0.12);
  });
};

/**
 * Speaks Turkish text using browser Web Speech API
 */
export const speakTurkish = (text: string) => {
  if (isMuted || !isVoiceEnabled || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95; // Slightly slower for primary school children
    utterance.pitch = 1.15; // Friendly, warm pitch

    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.startsWith('tr'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis fallback
  }
};
