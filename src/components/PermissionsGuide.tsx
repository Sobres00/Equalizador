import React, { useState } from 'react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Key, Smartphone, Info } from 'lucide-react';
import { PermissionItem } from '../types/assistant';

const INITIAL_PERMISSIONS: PermissionItem[] = [
  {
    id: 'mic',
    name: 'Captura de Micrófono',
    constant: 'android.permission.RECORD_AUDIO',
    category: 'Voz',
    description: 'Permite a Anne procesar comandos por voz tras detectar la palabra "Anne".',
    whyAndroid16RequiresIt: 'Android 16 requiere solicitud en tiempo de ejecución en MainActivity antes de inicializar AudioRecord.',
    granted: true,
    intentAction: 'ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.RECORD_AUDIO), 101)'
  },
  {
    id: 'foreground_mic',
    name: 'Servicio en Primer Plano con Micrófono',
    constant: 'android.permission.FOREGROUND_SERVICE_MICROPHONE',
    category: 'Voz',
    description: 'Permite que el servicio de escucha permanezca activo sin que Android congele el proceso.',
    whyAndroid16RequiresIt: 'En Android 14+ y 16, es obligatorio declarar foregroundServiceType="microphone" en el Manifest.',
    granted: true,
    intentAction: 'startForeground(NOTIFICATION_ID, notification, FOREGROUND_SERVICE_TYPE_MICROPHONE)'
  },
  {
    id: 'overlay',
    name: 'Ventana Flotante / Mostrar Sobre Otras Apps',
    constant: 'android.permission.SYSTEM_ALERT_WINDOW',
    category: 'Sistema',
    description: 'Permite mostrar la ventana de confirmación de WhatsApp o la burbuja de Anne mientras usas Chrome o Spotify.',
    whyAndroid16RequiresIt: 'Requiere que el usuario autorice manualmente en Ajustes del Sistema para evitar aplicaciones invasivas.',
    granted: true,
    intentAction: 'Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))'
  },
  {
    id: 'battery',
    name: 'Exención de Optimización de Batería (Doze Mode)',
    constant: 'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
    category: 'Seguridad',
    description: 'Evita que Android duerma el proceso a los 10 minutos de inactividad de pantalla.',
    whyAndroid16RequiresIt: 'Sin esta exención, los núcleos del CPU entran en suspensión profunda y la escucha a distancia se interrumpe.',
    granted: true,
    intentAction: 'Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName"))'
  },
  {
    id: 'notifications',
    name: 'Notificaciones en Barra de Estado',
    constant: 'android.permission.POST_NOTIFICATIONS',
    category: 'Sistema',
    description: 'Muestra la notificación activa obligatoria y el indicador del temporizador de 6 minutos.',
    whyAndroid16RequiresIt: 'Requerido en Android 13+ para cualquier servicio en primer plano que interactúe con el usuario.',
    granted: true,
    intentAction: 'ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 102)'
  },
  {
    id: 'gmail_oauth',
    name: 'Google Identity & Credential Manager (Gmail API)',
    constant: 'https://www.googleapis.com/auth/gmail.readonly',
    category: 'Google API',
    description: 'Acceso seguro y de solo lectura para buscar correos y descargar adjuntos de forma silenciosa.',
    whyAndroid16RequiresIt: 'Sustituye a los obsoletos WebViews por el Credential Manager nativo de Google Play Services con biometría.',
    granted: true,
    intentAction: 'CredentialManager.create(context).getCredential(context, request)'
  },
  {
    id: 'accessibility',
    name: 'Servicio de Accesibilidad (Opcional)',
    constant: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
    category: 'Seguridad',
    description: 'Permite pulsar automáticamente el botón "Enviar" de WhatsApp o leer texto visual en pantalla.',
    whyAndroid16RequiresIt: 'Permiso de máxima sensibilidad que debe activarse manualmente en Ajustes > Accesibilidad.',
    granted: false,
    intentAction: 'Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)'
  }
];

export const PermissionsGuide: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionItem[]>(INITIAL_PERMISSIONS);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, granted: !item.granted } : item))
    );
  };

  const grantedCount = permissions.filter((p) => p.granted).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Matriz de Seguridad & Permisos de Android 16</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Configuración del Sistema Operativo para Anne
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Android 16 introduce políticas estrictas de privacidad. Anne está arquitecturada para solicitar exactamente lo necesario sin violar las políticas del sistema.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-xs text-slate-400">Estado:</span>
            <span className="text-sm font-bold text-emerald-400">
              {grantedCount} de {permissions.length} Activos
            </span>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="space-y-3">
        {permissions.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.granted
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    item.granted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {item.granted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                      {item.constant}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{item.description}</p>

                  <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 mt-2 font-mono">
                    <span className="text-indigo-400 font-semibold">Código Kotlin: </span>
                    {item.intentAction}
                  </div>
                </div>
              </div>

              {/* Action Toggle */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => togglePermission(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    item.granted
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {item.granted ? 'Concedido' : 'Simular Conceder'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
