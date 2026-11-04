import React from 'react';
import { FileText, Download, CheckCircle2, ArrowRight } from 'lucide-react';

interface PdfPenguinDemoProps {
  onDownloadMockPdf: () => void;
  lastGeneratedTime?: string;
}

export const PdfPenguinDemo: React.FC<PdfPenguinDemoProps> = ({
  onDownloadMockPdf,
  lastGeneratedTime,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <FileText className="w-4 h-4" />
          <span>Documento Científico: Migración de Pingüinos</span>
        </div>
        {lastGeneratedTime && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Actualizado a las {lastGeneratedTime}
          </span>
        )}
      </div>

      <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 leading-relaxed">
        <p className="text-indigo-300 font-bold mb-1">
          [PDFBox Engine] migracion_pinguino_actualizado.pdf
        </p>
        <p>• Especies: Pingüino Adelia (Pygoscelis adeliae) y Emperador.</p>
        <p>• Telemetría GPS: 1.200 km de desplazamiento hacia aguas abiertas.</p>
        <p>• Estado de estructura: Encabezados, tablas y metadatos preservados al 100%.</p>
        <p className="text-emerald-400 mt-1">✔ Generado y listo en /storage/emulated/0/Download/</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-slate-400 text-[11px]">
          Procesado localmente con PDFBox + Gemini 2.0
        </span>
        <button
          onClick={onDownloadMockPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descargar Copia de Verificación (.txt/.pdf)</span>
        </button>
      </div>
    </div>
  );
};
