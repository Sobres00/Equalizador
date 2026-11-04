import React, { useState } from 'react';
import { Volume2, Play, Check, Sparkles, MessageSquareHeart, Mic } from 'lucide-react';
import { VoiceEmotion, VoiceProfile } from '../types/assistant';

const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'aoede',
    name: 'Aoede',
    gender: 'Femenino',
    timbre: 'Cálido, Melódico y Cristalino',
    description: 'Voz femenina natural, excelente para tareas del día a día y respuestas empáticas.',
    defaultPitch: 1.15,
    defaultRate: 1.0,
    samplePhrase: '¡Hola! Soy Anne con la voz Aoede. Estoy lista para ayudarte con tus documentos, correos y música.'
  },
  {
    id: 'kore',
    name: 'Kore',
    gender: 'Femenino',
    timbre: 'Serena, Pausada y Elegante',
    description: 'Voz femenina suave, ideal para lectura de resúmenes largos y momentos de calma.',
    defaultPitch: 1.0,
    defaultRate: 0.95,
    samplePhrase: 'He preparado el informe de migración de pingüinos con todos los detalles organizados.'
  },
  {
    id: 'puck',
    name: 'Puck',
    gender: 'Masculino',
    timbre: 'Enérgico, Dinámico y Jovial',
    description: 'Voz masculina juvenil y rápida, perfecta para multitarea y respuestas ágiles.',
    defaultPitch: 1.05,
    defaultRate: 1.1,
    samplePhrase: '¡Listo! Abriendo Spotify y reproduciendo la canción de inmediato.'
  },
  {
    id: 'charon',
    name: 'Charon',
    gender: 'Masculino',
    timbre: 'Profundo, Autorizado y Resonante',
    description: 'Voz masculina de tono grave y gran presencia ejecutiva.',
    defaultPitch: 0.85,
    defaultRate: 0.95,
    samplePhrase: 'Confirmación de seguridad requerida antes de enviar el mensaje por WhatsApp.'
  },
  {
    id: 'fenrir',
    name: 'Fenrir',
    gender: 'Masculino',
    timbre: 'Claro, Neutro y Tecnológico',
    description: 'Voz masculina equilibrada, estilo asistente de última generación.',
    defaultPitch: 0.95,
    defaultRate: 1.02,
    samplePhrase: 'He descargado el archivo adjunto desde tu bandeja de Gmail y lo guardé en Descargas.'
  }
];

const EMOTION_STYLES: {
  id: VoiceEmotion;
  label: string;
  badge: string;
  color: string;
  pitchOffset: number;
  rateOffset: number;
  promptDescription: string;
}[] = [
  {
    id: 'amigable',
    label: 'Cálida y Amigable',
    badge: 'Predeterminada',
    color: 'from-indigo-500 to-cyan-500',
    pitchOffset: 0.05,
    rateOffset: 0.0,
    promptDescription: 'Habla con cercanía, empatía natural y calidez en cada respuesta.'
  },
  {
    id: 'entusiasta',
    label: 'Entusiasta y Resolutiva',
    badge: 'Para Éxitos',
    color: 'from-amber-500 to-rose-500',
    pitchOffset: 0.15,
    rateOffset: 0.08,
    promptDescription: 'Tono alegre, dinámico y con energía positiva al completar tus órdenes.'
  },
  {
    id: 'calmada',
    label: 'Serena y Reconfortante',
    badge: 'Para Lecturas',
    color: 'from-emerald-500 to-teal-500',
    pitchOffset: -0.1,
    rateOffset: -0.06,
    promptDescription: 'Pausada, tranquila y sosegada, ideal para no saturar al usuario.'
  },
  {
    id: 'profesional',
    label: 'Profesional y Ejecutiva',
    badge: 'Precisión',
    color: 'from-blue-600 to-indigo-600',
    pitchOffset: 0.0,
    rateOffset: 0.02,
    promptDescription: 'Respuestas directas al grano, formales y estructuradas sin rodeos.'
  },
  {
    id: 'empatica',
    label: 'Empática y Cuidadosa',
    badge: 'Seguridad',
    color: 'from-purple-500 to-pink-500',
    pitchOffset: 0.02,
    rateOffset: -0.03,
    promptDescription: 'Atenta al estado del usuario, brindando tranquilidad en tareas críticas.'
  }
];

interface VoiceEmotionSelectorProps {
  selectedVoiceId: string;
  setSelectedVoiceId: (id: string) => void;
  selectedEmotion: VoiceEmotion;
  setSelectedEmotion: (e: VoiceEmotion) => void;
  onPreviewSpeak: (text: string, pitch: number, rate: number) => void;
}

export const VoiceEmotionSelector: React.FC<VoiceEmotionSelectorProps> = ({
  selectedVoiceId,
  setSelectedVoiceId,
  selectedEmotion,
  setSelectedEmotion,
  onPreviewSpeak,
}) => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const currentVoice = VOICE_PROFILES.find((v) => v.id === selectedVoiceId) || VOICE_PROFILES[0];
  const currentEmotionConfig = EMOTION_STYLES.find((e) => e.id === selectedEmotion) || EMOTION_STYLES[0];

  const handleTestVoice = (voice: VoiceProfile, emotion: typeof currentEmotionConfig) => {
    setIsPlayingSample(true);
    const finalPitch = Math.max(0.5, Math.min(2.0, voice.defaultPitch + emotion.pitchOffset));
    const finalRate = Math.max(0.7, Math.min(1.5, voice.defaultRate + emotion.rateOffset));

    onPreviewSpeak(voice.samplePhrase, finalPitch, finalRate);
    setTimeout(() => setIsPlayingSample(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Motor de Síntesis Expresiva & Modulación Humana</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Elige la Voz y la Expresión Emocional de Anne
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Anne no utiliza un lector robótico. Integra los perfiles de voz de última generación de Gemini y modula la entonación, velocidad y pausas según la emoción del momento.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voice Selection (Left column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-400" />
              <span>1. Perfil y Timbre de Voz</span>
            </h3>
            <span className="text-xs text-slate-400">{VOICE_PROFILES.length} voces disponibles</span>
          </div>

          <div className="space-y-3">
            {VOICE_PROFILES.map((voice) => {
              const isSelected = voice.id === selectedVoiceId;
              return (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-base">{voice.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                          {voice.gender}
                        </span>
                        <span className="text-xs text-indigo-300 font-medium">
                          • {voice.timbre}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{voice.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVoiceId(voice.id);
                          handleTestVoice(voice, currentEmotionConfig);
                        }}
                        className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 transition-all text-xs flex items-center gap-1.5"
                        title="Escuchar muestra"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs">Probar</span>
                      </button>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emotion Styles (Right column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-pink-400" />
              <span>2. Modulación Emocional</span>
            </h3>
            <span className="text-xs text-slate-400">Inflexión de tono</span>
          </div>

          <div className="space-y-2.5">
            {EMOTION_STYLES.map((emotion) => {
              const isSelected = emotion.id === selectedEmotion;
              return (
                <div
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500/60 shadow-md shadow-pink-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-white">{emotion.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {emotion.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{emotion.promptDescription}</p>
                </div>
              );
            })}
          </div>

          {/* Current Voice & Emotion Live Preview Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Configuración Activa</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sincronizada con Kotlin
              </span>
            </div>
            <div className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <span>{currentVoice.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-pink-400">{currentEmotionConfig.label}</span>
            </div>
            <button
              onClick={() => handleTestVoice(currentVoice, currentEmotionConfig)}
              disabled={isPlayingSample}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingSample ? 'Reproduciendo audio...' : 'Escuchar Voz con Emoción en Vivo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
