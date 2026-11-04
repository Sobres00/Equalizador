import React, { useState } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  FileText,
  MessageCircle,
  Music,
  Mail,
  Volume2,
  CheckCircle,
  ExternalLink,
  Bot
} from 'lucide-react';
import { VoiceEmotion, LogMessage } from '../types/assistant';
import { WhatsAppConfirmModal } from './WhatsAppConfirmModal';
import { PdfPenguinDemo } from './PdfPenguinDemo';

interface CommandSimulatorProps {
  currentEmotion: VoiceEmotion;
  onResetWatchdog?: () => void;
  onSpeak: (text: string, emotion?: VoiceEmotion) => void;
}

export const CommandSimulator: React.FC<CommandSimulatorProps> = ({
  currentEmotion,
  onResetWatchdog,
  onSpeak,
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningWakeWord, setIsListeningWakeWord] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [lastPdfGeneratedTime, setLastPdfGeneratedTime] = useState<string | undefined>();
  const [showPdfCard, setShowPdfCard] = useState(false);

  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'init-1',
      timestamp: '00:01',
      sender: 'anne',
      text: '¡Hola! Soy Anne en Modo Permanente 24/7. Sin límite de tiempo ni apagado automático. El micrófono local está siempre listo. Puedes decir "Anne" o probar los escenarios abajo.',
      emotion: 'amigable',
      actionTag: 'SYSTEM_BOOT_24_7'
    }
  ]);

  const addLog = (log: Omit<LogMessage, 'id' | 'timestamp'>) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogMessage = {
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: time,
    };
    setLogs((prev) => [...prev, newLog]);
    if (onResetWatchdog) onResetWatchdog();
  };

  const handleExecuteCommand = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setInputText('');
    setIsProcessing(true);

    // Add user message to log
    addLog({
      sender: 'user',
      text: text,
    });

    const lower = text.toLowerCase();

    setTimeout(() => {
      // 1. Escenario PDF Pingüino
      if (lower.includes('pdf') || lower.includes('pingüino')) {
        const reply = 'Localicé el documento de los pingüinos en tu almacenamiento. He enriquecido las rutas de migración antárticas con Gemini y lo guardé respetando su estructura original.';
        addLog({
          sender: 'anne',
          text: reply,
          emotion: 'entusiasta',
          actionTag: 'PDFBOX_UPDATE',
          details: 'Archivo generado: /storage/emulated/0/Download/migracion_pinguino_actualizado.pdf (Estructura de 4 páginas preservada).'
        });
        setShowPdfCard(true);
        setLastPdfGeneratedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        onSpeak(reply, 'entusiasta');
      }
      // 2. Escenario WhatsApp con confirmación
      else if (lower.includes('whatsapp') || lower.includes('mensaje')) {
        const reply = 'He preparado el mensaje para Carlos. Por seguridad, por favor autoriza el envío en la ventana emergente.';
        addLog({
          sender: 'anne',
          text: reply,
          emotion: 'profesional',
          actionTag: 'WHATSAPP_SECURITY_CHECK',
          details: 'Intent pendiente de confirmación biométrica o de pantalla.'
        });
        onSpeak(reply, 'profesional');
        setShowWhatsAppModal(true);
      }
      // 3. Escenario Spotify / Chrome
      else if (lower.includes('spotify') || lower.includes('canción') || lower.includes('musica') || lower.includes('chrome')) {
        const songName = text.replace(/anne/gi, '').replace(/abre/gi, '').replace(/spotify/gi, '').replace(/reproduce/gi, '').trim() || 'Coldplay - Viva La Vida';
        const reply = `Lanzando Spotify en segundo plano para reproducir "${songName}" y abriendo una pestaña en Google Chrome.`;
        addLog({
          sender: 'anne',
          text: reply,
          emotion: 'amigable',
          actionTag: 'ANDROID_INTENT_DISPATCH',
          details: `Intent: spotify:search:${encodeURIComponent(songName)} + Chrome Tab: https://google.com`
        });
        onSpeak(reply, 'amigable');
      }
      // 4. Escenario Gmail descarga API
      else if (lower.includes('gmail') || lower.includes('correo') || lower.includes('descarga')) {
        const reply = 'Conecté con tu cuenta de Google mediante Credential Manager. Encontré el correo con adjunto de pingüinos, decodifiqué el archivo en Base64 y ya está en tu carpeta de Descargas.';
        addLog({
          sender: 'anne',
          text: reply,
          emotion: 'entusiasta',
          actionTag: 'GMAIL_API_OAUTH2',
          details: 'Query API: "has:attachment filename:pdf pinguino" -> 1 adjunto extraído (1.8 MB).'
        });
        onSpeak(reply, 'entusiasta');
      }
      // General Gemini reasoning
      else {
        const reply = `He recibido tu instrucción: "${text}". Procesando con el motor Gemini 2.0 en español respetando el entorno de Android 16.`;
        addLog({
          sender: 'anne',
          text: reply,
          emotion: currentEmotion,
          actionTag: 'GEMINI_INFERENCE'
        });
        onSpeak(reply, currentEmotion);
      }

      setIsProcessing(false);
    }, 600);
  };

  const handleDownloadVerificationPdf = () => {
    const reportText = `========================================================
INFORME CIENTÍFICO: RUTAS DE MIGRACIÓN DE PINGÜINOS
Generado por el Asistente Anne (Motor Android 16 + Gemini)
========================================================

FECHA DE PROCESAMIENTO: ${new Date().toLocaleString()}
ESTADO DE ESTRUCTURA: Original intacta, tablas y estilos validados.

1. RESUMEN EJECUTIVO
Durante la estación invernal antártica, las colonias de Pingüino Adelia (Pygoscelis adeliae)
y Pingüino Emperador (Aptenodytes forsteri) inician su migración hacia el borde septentrional
del hielo marino para alimentarse en aguas ricas en krill (Euphausia superba).

2. TELEMETRÍA Y DATOS GPS AGREGADOS
- Desplazamiento promedio: 1.250 km de navegación continua.
- Profundidad media de inmersión: 65 a 140 metros.
- Nuevos corredores biológicos detectados en el Mar de Ross.

3. CONCLUSIÓN Y GUARDADO
Documento actualizado con éxito en el almacenamiento local del dispositivo.
Ruta: /storage/emulated/0/Download/migracion_pinguino_actualizado.pdf
========================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'migracion_pinguino_actualizado.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmWhatsApp = () => {
    setShowWhatsAppModal(false);
    const successMsg = '¡Mensaje de WhatsApp autorizado! Se ha despachado a la aplicación.';
    addLog({
      sender: 'anne',
      text: successMsg,
      emotion: 'entusiasta',
      actionTag: 'WHATSAPP_DISPATCHED',
      details: 'Intent enviado: https://api.whatsapp.com/send?text=Hola,%20te%20escribo%20mediante%20Anne'
    });
    onSpeak(successMsg, 'entusiasta');
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenario Buttons based on user requirements */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Escenarios Reales del Usuario (Probar con 1 Clic)</span>
          </div>
          <span className="text-xs text-slate-400">Prueba los comandos exactos solicitados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Scenario 1: PDF Pingüino */}
          <button
            onClick={() =>
              handleExecuteCommand(
                'Anne busca el archivo de PDF y edítalo con la nueva información de migración de pingüinos respetando la estructura y guárdalo'
              )
            }
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-indigo-300">
                PDF Pingüinos con Estructura
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              "Anne busca el archivo de PDF y edítalo con nueva información de migración de pingüino respetando la estructura..."
            </p>
          </button>

          {/* Scenario 2: WhatsApp con confirmación previa */}
          <button
            onClick={() =>
              handleExecuteCommand(
                'Anne envía mensaje de WhatsApp a Carlos diciendo que llego en 15 minutos con confirmación previa'
              )
            }
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-emerald-300">
                WhatsApp con Confirmación
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              "Anne envía mensaje de WhatsApp a Carlos con confirmación previa del usuario..."
            </p>
          </button>

          {/* Scenario 3: Spotify & Chrome multitarea */}
          <button
            onClick={() =>
              handleExecuteCommand(
                'Anne abre Chrome y Spotify y reproduce la canción Bohemian Rhapsody en segundo plano'
              )
            }
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                <Music className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-amber-300">
                Multitarea: Spotify & Chrome
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              "Anne abre Chrome y reproduce esta canción en Spotify en segundo plano..."
            </p>
          </button>

          {/* Scenario 4: Gmail descarga segura */}
          <button
            onClick={() =>
              handleExecuteCommand(
                'Anne abre mi Gmail y descarga este archivo adjunto de mi correo de pingüinos'
              )
            }
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                Gmail API (Descarga Silenciosa)
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              "Anne abre mi Gmail y descarga este archivo de mi correo sin abrir ventanas..."
            </p>
          </button>
        </div>
      </div>

      {/* PDF Inspection Card when generated */}
      {showPdfCard && (
        <PdfPenguinDemo
          onDownloadMockPdf={handleDownloadVerificationPdf}
          lastGeneratedTime={lastPdfGeneratedTime}
        />
      )}

      {/* Interactive Command Log / Conversation Feed */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-[420px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Registro de Actividad en Vivo</h3>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Servicio Foreground Activo
          </span>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {logs.map((log) => {
            const isAnne = log.sender === 'anne';
            return (
              <div
                key={log.id}
                className={`flex flex-col ${isAnne ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                  <span>{isAnne ? 'Anne' : 'Tú (Voz / Comandos)'}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                  {log.emotion && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      Tono {log.emotion}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                    isAnne
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="leading-relaxed">{log.text}</p>
                    {isAnne && (
                      <button
                        onClick={() => onSpeak(log.text, log.emotion)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                        title="Escuchar respuesta"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {log.actionTag && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {log.actionTag}
                      </span>
                      {log.details && (
                        <span className="text-slate-400">{log.details}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800 mt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteCommand(inputText);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => {
                setIsListeningWakeWord(!isListeningWakeWord);
                if (!isListeningWakeWord) {
                  onSpeak('Dime, te escucho.', 'amigable');
                  if (onResetWatchdog) onResetWatchdog();
                }
              }}
              className={`p-3 rounded-xl border transition-all ${
                isListeningWakeWord
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isListeningWakeWord ? 'Micrófono activo' : 'Pulsar para hablar (Wake word)'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe o simula una orden (ej: Anne busca el PDF de pingüinos...)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ejecutar</span>
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Modal Triggered during simulation */}
      <WhatsAppConfirmModal
        isOpen={showWhatsAppModal}
        contactName="Carlos Mendoza (+34 612 345 678)"
        messageText="Hola Carlos, te aviso que llego en 15 minutos. Te escribe Anne con confirmación."
        onConfirm={handleConfirmWhatsApp}
        onCancel={() => {
          setShowWhatsAppModal(false);
          addLog({
            sender: 'anne',
            text: 'Envío de WhatsApp cancelado por el usuario. No se ha transmitido ningún mensaje.',
            emotion: 'calmada',
            actionTag: 'WHATSAPP_ABORTED'
          });
        }}
      />
    </div>
  );
};
