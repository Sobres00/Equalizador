import React from 'react';
import { Timer, ShieldAlert, RefreshCw, Power, BatteryCharging } from 'lucide-react';

interface WatchdogTimerProps {
  secondsRemaining: number;
  isActive: boolean;
  onReset: () => void;
  onToggleActive: () => void;
}

export const WatchdogTimer: React.FC<WatchdogTimerProps> = ({
  secondsRemaining,
  isActive,
  onReset,
  onToggleActive,
}) => {
  const maxSeconds = 360; // 6 minutos
  const percentage = Math.max(0, (secondsRemaining / maxSeconds) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Temporizador de Seguridad (Watchdog 6:00 min)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Auto-protección
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Libera el hardware del micrófono y evita drenaje de batería si no hay órdenes en 6 minutos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset a 6:00</span>
          </button>
          <button
            onClick={onToggleActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isActive
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Simular Fin de 6 min' : 'Reactivar Anne'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Countdown Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            Estado del Micrófono: {isActive ? 'Escucha Activa de "Anne"' : 'En Reposo (Micrófono cerrado)'}
          </span>
          <span className="font-mono text-sm font-bold text-white">
            {formatTime(secondsRemaining)} / 06:00
          </span>
        </div>

        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              percentage > 40
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                : percentage > 15
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-500 to-red-400 animate-pulse'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Security info card */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Reinicio por Actividad:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Cada vez que dices "Anne" o ejecutas un comando (WhatsApp, PDF, Spotify), el temporizador vuelve automáticamente a los 6:00 min.
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
          <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Ahorro y Privacidad:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Al llegar a 00:00, Anne detiene el procesador de audio. Tu micrófono queda 100% inactivo hasta que toques la pantalla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
