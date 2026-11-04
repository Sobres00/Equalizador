import React from 'react';
import { Mic, ShieldCheck, Infinity, Radio, Sparkles } from 'lucide-react';

interface WatchdogTimerProps {
  secondsRemaining?: number;
  isActive: boolean;
  onReset?: () => void;
  onToggleActive?: () => void;
}

export const WatchdogTimer: React.FC<WatchdogTimerProps> = ({
  isActive = true,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Infinity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Modo Escucha Permanente 24/7
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Sin Restricción de Tiempo
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Temporizador de 6 minutos eliminado. Anne permanece despierta e interactiva de forma continua sin apagarse nunca.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Escucha Continua Siempre Activa</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
          <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Palabra "Anne" Siempre Lista:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Puedes llamarla desde otra habitación a cualquier hora. El servicio nunca se cierra ni entra en reposo.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Servicio en Primer Plano:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Utiliza <code className="text-indigo-300">FOREGROUND_SERVICE_MICROPHONE</code> para que Android 16 no mate la app.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-slate-200">Sin Límite de Inactividad:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Se han quitado todos los bloqueos de cuenta atrás para una experiencia multitarea continua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
