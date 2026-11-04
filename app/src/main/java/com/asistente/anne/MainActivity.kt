package com.asistente.anne

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.asistente.anne.service.AnneVoiceService

class MainActivity : AppCompatActivity() {

    private val PERMISSIONS_REQUEST_CODE = 2026

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Interfaz de bienvenida y permisos generada programáticamente
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(40, 60, 40, 60)
            gravity = android.view.Gravity.CENTER_HORIZONTAL
        }

        val title = TextView(this).apply {
            text = "Anne - Asistente Personal Android 16"
            textSize = 20f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 0, 0, 30)
        }
        layout.addView(title)

        val btnPermissions = Button(this).apply {
            text = "1. Conceder Permisos de Voz y Notificaciones"
            setOnClickListener { requestCorePermissions() }
        }
        layout.addView(btnPermissions)

        val btnOverlay = Button(this).apply {
            text = "2. Activar Superposición (Ventana Flotante)"
            setOnClickListener { requestOverlayPermission() }
        }
        layout.addView(btnOverlay)

        val btnStart = Button(this).apply {
            text = "3. Iniciar Servicio de Anne (Escucha Activa)"
            setOnClickListener { startAnneService() }
        }
        layout.addView(btnStart)

        setContentView(layout)
    }

    private fun requestCorePermissions() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        ActivityCompat.requestPermissions(this, permissions.toTypedArray(), PERMISSIONS_REQUEST_CODE)
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
        }
    }

    private fun startAnneService() {
        val serviceIntent = Intent(this, AnneVoiceService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }
}
