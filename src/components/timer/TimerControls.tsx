import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface Props {
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  accentColor: string;
}

export function TimerControls({ isRunning, onPlayPause, onReset, onSkip, accentColor }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onReset}
        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200"
        title="Reset (R)"
      >
        <RotateCcw size={18} />
      </button>

      <button
        onClick={onPlayPause}
        className="w-20 h-20 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: accentColor }}
        title="Play/Pause (Space)"
      >
        {isRunning ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
      </button>

      <button
        onClick={onSkip}
        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200"
        title="Skip to next phase"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
}
