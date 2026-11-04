/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { WatchdogTimer } from './components/WatchdogTimer';
import { CommandSimulator } from './components/CommandSimulator';
import { VoiceEmotionSelector } from './components/VoiceEmotionSelector';
import { PermissionsGuide } from './components/PermissionsGuide';
import { CodeInspector } from './components/CodeInspector';
import { VoiceEmotion } from './types/assistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'voices' | 'permissions'>('simulator');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('aoede');
  const [selectedEmotion, setSelectedEmotion] = useState<VoiceEmotion>('amigable');

  // Watchdog timer state (6 minutos = 360 segundos)
  const [watchdogSeconds, setWatchdogSeconds] = useState<number>(360);
  const [isWatchdogActive, setIsWatchdogActive] = useState<boolean>(true);

  // Interval reference for watchdog
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWatchdogActive && watchdogSeconds > 0) {
      interval = setInterval(() => {
        setWatchdogSeconds((prev) => {
          if (prev <= 1) {
            setIsWatchdogActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWatchdogActive, watchdogSeconds]);

  const handleResetWatchdog = () => {
    setWatchdogSeconds(360);
    setIsWatchdogActive(true);
  };

  const handleToggleWatchdogActive = () => {
    if (isWatchdogActive) {
      setIsWatchdogActive(false);
      setWatchdogSeconds(0);
    } else {
      setIsWatchdogActive(true);
      setWatchdogSeconds(360);
    }
  };

  // Browser speech synthesis playback with emotional modulation
  const handleSpeak = (text: string, emotion?: VoiceEmotion, customPitch?: number, customRate?: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';

    // Pitch and rate based on chosen emotion and voice
    const activeEmotion = emotion || selectedEmotion;

    let basePitch = 1.0;
    let baseRate = 1.0;

    switch (activeEmotion) {
      case 'entusiasta':
        basePitch = 1.2;
        baseRate = 1.1;
        break;
      case 'calmada':
        basePitch = 0.9;
        baseRate = 0.9;
        break;
      case 'profesional':
        basePitch = 1.0;
        baseRate = 1.0;
        break;
      case 'empatica':
        basePitch = 0.98;
        baseRate = 0.95;
        break;
      default:
        basePitch = 1.05;
        baseRate = 1.0;
        break;
    }

    // Voice gender tuning
    if (selectedVoiceId === 'charon') basePitch -= 0.2;
    if (selectedVoiceId === 'fenrir') basePitch -= 0.1;
    if (selectedVoiceId === 'aoede') basePitch += 0.1;

    utterance.pitch = customPitch !== undefined ? customPitch : Math.max(0.5, Math.min(2.0, basePitch));
    utterance.rate = customRate !== undefined ? customRate : Math.max(0.7, Math.min(1.5, baseRate));

    window.speechSynthesis.speak(utterance);
    handleResetWatchdog();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchdogSeconds={watchdogSeconds}
        isWatchdogActive={isWatchdogActive}
        onResetWatchdog={handleResetWatchdog}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Watchdog Bar (visible across tabs) */}
        <WatchdogTimer
          secondsRemaining={watchdogSeconds}
          isActive={isWatchdogActive}
          onReset={handleResetWatchdog}
          onToggleActive={handleToggleWatchdogActive}
        />

        {/* Tab 1: Interactive Command Simulator */}
        {activeTab === 'simulator' && (
          <CommandSimulator
            currentEmotion={selectedEmotion}
            onResetWatchdog={handleResetWatchdog}
            onSpeak={handleSpeak}
          />
        )}

        {/* Tab 2: Voices and Emotion Settings */}
        {activeTab === 'voices' && (
          <VoiceEmotionSelector
            selectedVoiceId={selectedVoiceId}
            setSelectedVoiceId={setSelectedVoiceId}
            selectedEmotion={selectedEmotion}
            setSelectedEmotion={setSelectedEmotion}
            onPreviewSpeak={(text, p, r) => handleSpeak(text, selectedEmotion, p, r)}
          />
        )}

        {/* Tab 3: Android 16 Permissions Guide */}
        {activeTab === 'permissions' && <PermissionsGuide />}

        {/* Tab 4: Kotlin Source Code & Android Studio Package */}
        {activeTab === 'code' && <CodeInspector />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500">
        <p>Anne • Asistente Personal Inteligente para Android 16 • Arquitectura Nativa Kotlin + Gemini API</p>
      </footer>
    </div>
  );
}
