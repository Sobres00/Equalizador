import React from 'react';
import { ShieldCheck, MessageCircle, X, Send } from 'lucide-react';

interface WhatsAppConfirmModalProps {
  isOpen: boolean;
  contactName: string;
  messageText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const WhatsAppConfirmModal: React.FC<WhatsAppConfirmModalProps> = ({
  isOpen,
  contactName,
  messageText,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirmación de Seguridad</h3>
              <p className="text-xs text-slate-400">Anne solicita tu autorización antes de despachar</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Destinatario
            </div>
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{contactName}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mensaje a Enviar
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{messageText}"
            </p>
          </div>

          <div className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            🔒 Protocolo de Protección: Ningún mensaje sale de tu teléfono sin que presiones confirmar o digas "Autorizado".
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
          >
            Cancelar Envío
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sí, Enviar a WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
