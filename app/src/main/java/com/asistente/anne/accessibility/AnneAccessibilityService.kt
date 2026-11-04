package com.asistente.anne.accessibility

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent

/**
 * Servicio de Accesibilidad para interacción asistida en pantalla.
 * Permite a Anne detectar eventos relevantes cuando se requiere asistencia de confirmación.
 */
class AnneAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "AnneAccessibility"
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        // Gestión de eventos en pantalla cuando sea invocado por el usuario
        Log.d(TAG, "Evento de pantalla recibido: ${event.eventType}")
    }

    override fun onInterrupt() {
        Log.i(TAG, "Servicio de accesibilidad interrumpido.")
    }
}
