package com.asistente.anne

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.asistente.anne.service.AnneVoiceService

class MainActivity : AppCompatActivity() {

    private val PERMISSIONS_REQUEST_CODE = 2026
    private lateinit var statusText: TextView
    private lateinit var btnPermissions: Button
    private lateinit var btnOverlay: Button
    private lateinit var btnStart: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        try {
            val scrollView = ScrollView(this).apply {
                setBackgroundColor(Color.parseColor("#0F172A"))
                isFillViewport = true
            }

            val layout = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(48, 64, 48, 64)
                gravity = Gravity.CENTER_HORIZONTAL
            }
            scrollView.addView(layout)

            // Título Principal
            val title = TextView(this).apply {
                text = "✨ Anne Asistente"
                textSize = 26f
                setTextColor(Color.WHITE)
                setTypeface(null, Typeface.BOLD)
                gravity = Gravity.CENTER
                setPadding(0, 0, 0, 8)
            }
            layout.addView(title)

            // Subtítulo
            val subtitle = TextView(this).apply {
                text = "Asistente Personal Autónoma • Android 16 • 24/7"
                textSize = 14f
                setTextColor(Color.parseColor("#94A3B8"))
                gravity = Gravity.CENTER
                setPadding(0, 0, 0, 48)
            }
            layout.addView(subtitle)

            // Tarjeta de Estado
            val statusCard = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(40, 32, 40, 32)
                val bg = GradientDrawable().apply {
                    setColor(Color.parseColor("#1E293B"))
                    cornerRadius = 24f
                    setStroke(2, Color.parseColor("#334155"))
                }
                background = bg
                gravity = Gravity.CENTER
            }

            statusText = TextView(this).apply {
                text = "🟢 Sistema Listo • Modo Permanente Activo"
                textSize = 15f
                setTextColor(Color.parseColor("#38BDF8"))
                setTypeface(null, Typeface.BOLD)
                gravity = Gravity.CENTER
            }
            statusCard.addView(statusText)
            layout.addView(statusCard)

            // Espaciador
            val spacer = View(this).apply {
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, 48
                )
            }
            layout.addView(spacer)

            // Botón 1: Permisos de Micrófono y Notificaciones
            btnPermissions = createStyledButton("🎤  1. Conceder Permisos de Voz", "#4F46E5") {
                requestCorePermissions()
            }
            layout.addView(btnPermissions)

            // Botón 2: Permiso de Ventana Flotante / Superposición
            btnOverlay = createStyledButton("🪟  2. Permiso Ventana Flotante", "#0284C7") {
                requestOverlayPermission()
            }
            layout.addView(btnOverlay)

            // Botón 3: Iniciar Servicio Activo 24/7
            btnStart = createStyledButton("🚀  3. Iniciar Anne (24/7 Activa)", "#10B981") {
                startAnneService()
            }
            layout.addView(btnStart)

            setContentView(scrollView)
            updateButtonStates()

        } catch (e: Exception) {
            Log.e("MainActivity", "Error en onCreate: ${e.message}", e)
            Toast.makeText(this, "Iniciando Anne: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    override fun onResume() {
        super.onResume()
        updateButtonStates()
    }

    private fun createStyledButton(textStr: String, hexColor: String, onClick: () -> Unit): Button {
        return Button(this).apply {
            text = textStr
            textSize = 15f
            setTextColor(Color.WHITE)
            isAllCaps = false
            setPadding(32, 28, 32, 28)
            val params = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 24)
            }
            layoutParams = params
            val bg = GradientDrawable().apply {
                setColor(Color.parseColor(hexColor))
                cornerRadius = 20f
            }
            background = bg
            setOnClickListener { onClick() }
        }
    }

    private fun updateButtonStates() {
        try {
            val hasMic = ContextCompat.checkSelfPermission(
                this, Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED

            if (hasMic) {
                btnPermissions.text = "✅  1. Permiso de Voz Concedido"
                btnPermissions.alpha = 0.85f
            }

            val hasOverlay = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Settings.canDrawOverlays(this)
            } else true

            if (hasOverlay) {
                btnOverlay.text = "✅  2. Ventana Flotante Concedida"
                btnOverlay.alpha = 0.85f
            }
        } catch (ignored: Exception) {}
    }

    private fun requestCorePermissions() {
        try {
            val permissions = mutableListOf(Manifest.permission.RECORD_AUDIO)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                permissions.add(Manifest.permission.POST_NOTIFICATIONS)
            }
            ActivityCompat.requestPermissions(this, permissions.toTypedArray(), PERMISSIONS_REQUEST_CODE)
        } catch (e: Exception) {
            Toast.makeText(this, "Error solicitando permisos: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun requestOverlayPermission() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName")
                )
                startActivity(intent)
            } else {
                Toast.makeText(this, "Superposición ya concedida", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Abriendo ajustes de superposición...", Toast.LENGTH_SHORT).show()
        }
    }

    private fun startAnneService() {
        try {
            val serviceIntent = Intent(this, AnneVoiceService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent)
            } else {
                startService(serviceIntent)
            }
            statusText.text = "🟢 Anne Activa y Escuchando 24/7"
            Toast.makeText(this, "🎉 Anne iniciada en segundo plano permanente", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            Log.e("MainActivity", "Error al iniciar servicio: ${e.message}", e)
            Toast.makeText(this, "Error iniciando servicio: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }
}
