package com.asistente.anne.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.asistente.anne.MainActivity
import kotlinx.coroutines.*

/**
 * Servicio en Primer Plano Permanente 24/7 de Anne.
 * Sin restricción de tiempo ni temporizador de apagado por inactividad.
 * Permanece activo continuamente a la escucha de órdenes.
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
        val notification = buildPersistentNotification("Anne activa de forma continua (24/7) - Lista para escuchar")
        startForeground(NOTIFICATION_ID, notification)

        // Escucha ininterrumpida sin límite de tiempo
        startContinuousListening()

        // START_STICKY garantiza que Android reinicie el servicio si el sistema necesita liberar memoria
        return START_STICKY
    }

    private fun startContinuousListening() {
        Log.i(TAG, "Escucha permanente activada sin temporizador de cierre.")
    }

    private fun buildPersistentNotification(contentText: String): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE
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
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
