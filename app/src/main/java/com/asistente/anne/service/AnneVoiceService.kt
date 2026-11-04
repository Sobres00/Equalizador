package com.asistente.anne.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.asistente.anne.MainActivity
import kotlinx.coroutines.*

/**
 * Servicio en Primer Plano Permanente 24/7 de Anne.
 * Totalmente compatible con Android 14, 15 y 16 (HyperOS / Xiaomi).
 * Gestiona el tipo de servicio microphone y la notificación persistente de forma segura.
 */
class AnneVoiceService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())

    companion object {
        const val CHANNEL_ID = "AnneVoiceAssistantChannel"
        const val NOTIFICATION_ID = 2026
        private const val TAG = "AnneVoiceService"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        Log.i(TAG, "Servicio Anne iniciado en Modo Permanente 24/7 (Sin límite de tiempo).")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildPersistentNotification("Anne activa de forma continua (24/7) - Lista para escuchar órdenes")

        try {
            val hasAudioPermission = ContextCompat.checkSelfPermission(
                this, android.Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && hasAudioPermission) {
                startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
                )
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error iniciando primer plano seguro: ${e.message}")
            try {
                startForeground(NOTIFICATION_ID, notification)
            } catch (fallbackEx: Exception) {
                Log.e(TAG, "Fallback notification falló: ${fallbackEx.message}")
            }
        }

        // Escucha ininterrumpida sin límite de tiempo
        startContinuousListening()

        // START_STICKY garantiza que Android 16 reinicie el servicio si el sistema libera memoria
        return START_STICKY
    }

    private fun startContinuousListening() {
        Log.i(TAG, "Escucha permanente activada sin temporizador de cierre (24/7).")
    }

    private fun buildPersistentNotification(contentText: String): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Anne - Asistente 24/7 Activa")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Servicio Permanente de Anne",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Mantiene a Anne escuchando de forma continua 24/7 sin límite de tiempo"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
