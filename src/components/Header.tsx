import React from 'react';
import { Shield, Radio, Volume2, Timer, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'code' | 'voices' | 'permissions';
  setActiveTab: (tab: 'simulator' | 'code' | 'voices' | 'permissions') => void;
  watchdogSeconds: number;
  isWatchdogActive: boolean;
  onResetWatchdog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  watchdogSeconds,
  isWatchdogActive,
  onResetWatchdog,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Assistant Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isWatchdogActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isWatchdogActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Anne</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-medium">
                  Android 16 Native
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Asistente por Voz, Watchdog de 6 min & Suite Kotlin
              </p>
            </div>
          </div>

          {/* Watchdog Timer Status Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetWatchdog}
              title="Haz clic para reiniciar el temporizador a 6:00"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                isWatchdogActive
                  ? 'bg-slate-900 border-indigo-500/30 text-indigo-300 hover:border-indigo-400'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}
            >
              <Timer className={`w-3.5 h-3.5 ${isWatchdogActive ? 'animate-pulse text-indigo-400' : 'text-amber-400'}`} />
              <span className="font-semibold">{formatTime(watchdogSeconds)}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {isWatchdogActive ? 'Activo' : 'En Reposo'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-2 pt-1 border-t border-slate-900 scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Simulador de Comandos</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'voices'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Voces & Emociones</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'permissions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Permisos Android 16</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Código Kotlin & Android Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
