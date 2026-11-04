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

  // Modo permanente 24/7 (Sin límite de tiempo)
  const isAlwaysActive = true;

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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Continuous Active 24/7 Bar */}
        <WatchdogTimer isActive={isAlwaysActive} />

        {/* Tab 1: Interactive Command Simulator */}
        {activeTab === 'simulator' && (
          <CommandSimulator
            currentEmotion={selectedEmotion}
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
