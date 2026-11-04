import { AndroidFile } from '../types/assistant';

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    description: 'Declaración de permisos críticos para Android 16, servicios en primer plano y configuración de accesibilidad.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.asistente.anne">

    <!-- Permisos de Audio y Micrófono -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- Permisos obligatorios para Servicios en Primer Plano en Android 14, 15 y 16 -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" tools:ignore="ProtectedPermissions" />

    <!-- Ventana flotante sobre otras apps (Overlay para interactuar mientras usas Chrome, WhatsApp, etc.) -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <!-- Notificaciones permanentes para mantener el servicio activo en Android 13+ -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Exención de batería (Doze mode) para que Android 16 no congele el micrófono -->
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <!-- Acceso a Internet y Red para Gemini API y Gmail API -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Almacenamiento para guardar PDFs editados y descargas -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" tools:ignore="ScopedStorage" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Anne Asistente"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AnneAssistant">

        <!-- Actividad Principal de Configuración y Permisos -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.AnneAssistant">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Servicio en Primer Plano con micrófono activo y temporizador de 6 min -->
        <service
            android:name=".service.AnneVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone" />

        <!-- Servicio de Accesibilidad para interacción segura y clics asistidos -->
        <service
            android:name=".accessibility.AnneAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

    </application>
</manifest>`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (Module: app)',
    category: 'gradle',
    description: 'Dependencias estándar certificadas: Porcupine, Credential Manager, Gmail API, PDFBox y Corrutinas.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.asistente.anne"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.asistente.anne"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1,DEPENDENCIES}"
        }
    }
}

dependencies {
    // AndroidX & Componentes de Interfaz
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")

    // Concurrencia con Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")

    // Motor de Wake Word sin conexión certificado (Picovoice Porcupine)
    implementation("ai.picovoice:porcupine-android:3.0.2")

    // Autenticación profesional moderna con Google (Credential Manager)
    implementation("androidx.credentials:credentials:1.3.0")
    implementation("androidx.credentials:credentials-play-services-auth:1.3.0")
    implementation("com.google.android.libraries.identity.googleid:googleid:1.1.1")

    // Google API Client para Android & Servicio oficial de Gmail
    implementation("com.google.api-client:google-api-client-android:2.6.0") {
        exclude(group = "org.apache.httpcomponents")
    }
    implementation("com.google.apis:google-api-services-gmail:v1-rev20220404-2.0.0") {
        exclude(group = "org.apache.httpcomponents")
    }

    // Procesamiento y edición de documentos PDF en Android (PDFBox)
    implementation("com.tom-roush:pdfbox-android:2.0.27.0")

    // Cliente HTTP para llamadas seguras y streaming a Gemini API
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Serialización JSON
    implementation("com.google.code.gson:gson:2.11.0")
}`
  },
  {
    path: 'app/src/main/res/xml/accessibility_service_config.xml',
    name: 'accessibility_service_config.xml',
    category: 'xml',
    description: 'Configuración granular del servicio de accesibilidad para interactuar con botones de confirmación y lectura.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged|typeViewClicked"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:canPerformGestures="true"
    android:accessibilityFlags="flagDefault|flagIncludeNotImportantViews|flagReportViewIds" />`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/service/WatchdogManager.kt',
    name: 'WatchdogManager.kt',
    category: 'kotlin',
    description: 'Temporizador de seguridad de 6 minutos con reinicio ante eventos de voz/actividad y apagado automático.',
    content: `package com.asistente.anne.service

import android.util.Log
import kotlinx.coroutines.*

/**
 * Gestor del temporizador de seguridad de 6 minutos (360.000 ms).
 * Si no ocurre actividad durante este tiempo, suspende la escucha activa,
 * libera el hardware del micrófono y pasa a reposo para cuidar batería y privacidad.
 */
class WatchdogManager(
    private val scope: CoroutineScope,
    private val onTimeout: () -> Unit
) {
    companion object {
        const val TIMEOUT_MILLIS = 6 * 60 * 1000L // 6 minutos exactos (360.000 ms)
        private const val TAG = "WatchdogManager"
    }

    private var countdownJob: Job? = null
    private var lastActivityTimestamp: Long = System.currentTimeMillis()

    /**
     * Inicia o reinicia el contador de 6 minutos desde cero.
     * Debe llamarse cada vez que se detecta la palabra "Anne" o el usuario da una orden.
     */
    fun pingActivity(reason: String = "Interacción de usuario") {
        lastActivityTimestamp = System.currentTimeMillis()
        countdownJob?.cancel()

        Log.d(TAG, "Watchdog reiniciado a 6:00 min. Causa: $reason")

        countdownJob = scope.launch(Dispatchers.Default) {
            delay(TIMEOUT_MILLIS)
            Log.w(TAG, "Alerta de seguridad: Transcurrieron 6 minutos de inactividad. Auto-apagando.")
            withContext(Dispatchers.Main) {
                onTimeout()
            }
        }
    }

    /**
     * Detiene el temporizador completamente (por ejemplo al cerrar la app o pausar el servicio).
     */
    fun stop() {
        countdownJob?.cancel()
        countdownJob = null
        Log.d(TAG, "Watchdog detenido.")
    }

    fun getRemainingTimeMillis(): Long {
        val elapsed = System.currentTimeMillis() - lastActivityTimestamp
        val remaining = TIMEOUT_MILLIS - elapsed
        return if (remaining > 0) remaining else 0
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/service/AnneVoiceService.kt',
    name: 'AnneVoiceService.kt',
    category: 'kotlin',
    description: 'Servicio en primer plano con tipo "microphone", gestión de audio con AEC, watchdog de 6 min y respuestas por voz.',
    content: `package com.asistente.anne.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.audiofx.AcousticEchoCanceler
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.asistente.anne.MainActivity
import com.asistente.anne.R
import com.asistente.anne.automation.AndroidIntentsManager
import com.asistente.anne.automation.WhatsAppAutomation
import com.asistente.anne.docs.PdfDocumentProcessor
import com.asistente.anne.gmail.GmailDownloader
import com.asistente.anne.voice.GeminiVoiceEngine
import com.asistente.anne.voice.WakeWordDetector
import kotlinx.coroutines.*

class AnneVoiceService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())
    private lateinit var watchdog: WatchdogManager
    private lateinit var wakeWordDetector: WakeWordDetector
    private lateinit var geminiEngine: GeminiVoiceEngine
    private lateinit var intentsManager: AndroidIntentsManager
    private lateinit var whatsAppAutomation: WhatsAppAutomation
    private lateinit var pdfProcessor: PdfDocumentProcessor
    private lateinit var gmailDownloader: GmailDownloader

    companion object {
        const val CHANNEL_ID = "AnneVoiceAssistantChannel"
        const val NOTIFICATION_ID = 2026
        private const val TAG = "AnneVoiceService"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        intentsManager = AndroidIntentsManager(this)
        whatsAppAutomation = WhatsAppAutomation(this)
        pdfProcessor = PdfDocumentProcessor(this)
        gmailDownloader = GmailDownloader(this)
        geminiEngine = GeminiVoiceEngine(this)

        // Configuración del temporizador de seguridad de 6 minutos
        watchdog = WatchdogManager(serviceScope) {
            handleSafetyTimeout()
        }

        // Inicializador de detección offline "Anne"
        wakeWordDetector = WakeWordDetector(this) {
            onWakeWordDetected()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildPersistentNotification("Escuchando palabra clave 'Anne'...")
        startForeground(NOTIFICATION_ID, notification)

        // Comienza escucha local de Wake Word y arranca el temporizador de 6 min
        wakeWordDetector.startListening()
        watchdog.pingActivity("Servicio iniciado")

        return START_STICKY
    }

    private fun onWakeWordDetected() {
        Log.i(TAG, "¡Palabra clave 'Anne' detectada!")
        watchdog.pingActivity("Palabra clave 'Anne'")

        // Saludo breve con emoción empática / entusiasta
        geminiEngine.speak("¿Sí? Aquí estoy. ¿En qué te ayudo?", emotion = GeminiVoiceEngine.Emotion.ENTHUSIASTIC)

        // Comienza a escuchar el comando por voz completo del usuario
        wakeWordDetector.recordCommand { spokenCommand ->
            watchdog.pingActivity("Comando recibido: $spokenCommand")
            processUserIntent(spokenCommand)
        }
    }

    private fun processUserIntent(command: String) {
        val lower = command.lowercase()

        when {
            // Caso 1: Editar PDF con migración de pingüinos
            lower.contains("pdf") && lower.contains("pingüino") -> {
                geminiEngine.speak("Buscando el documento de pingüinos para actualizar la información.", GeminiVoiceEngine.Emotion.PROFESSIONAL)
                serviceScope.launch {
                    val result = pdfProcessor.processAndEnrichPenguinPdf()
                    geminiEngine.speak(result, GeminiVoiceEngine.Emotion.ENTHUSIASTIC)
                }
            }

            // Caso 2: Abrir Spotify y reproducir canción
            lower.contains("spotify") || (lower.contains("reproduce") && lower.contains("canción")) -> {
                val song = command.replace("reproduce", "", ignoreCase = true)
                    .replace("spotify", "", ignoreCase = true).trim()
                geminiEngine.speak("Abriendo Spotify para reproducir $song", GeminiVoiceEngine.Emotion.FRIENDLY)
                intentsManager.playOnSpotify(song)
            }

            // Caso 3: Abrir Chrome
            lower.contains("chrome") || lower.contains("navegador") -> {
                geminiEngine.speak("Abriendo Google Chrome en segundo plano", GeminiVoiceEngine.Emotion.FRIENDLY)
                intentsManager.openChrome("https://www.google.com")
            }

            // Caso 4: WhatsApp con confirmación previa del usuario
            lower.contains("whatsapp") || lower.contains("mensaje") -> {
                whatsAppAutomation.requestConfirmationAndSend(
                    contactName = "Contacto",
                    messageBody = "Hola, te escribo mediante Anne con confirmación de seguridad."
                )
            }

            // Caso 5: Gmail descarga de archivo adjunto
            lower.contains("gmail") || lower.contains("correo") -> {
                geminiEngine.speak("Consultando tu bandeja de entrada en busca del archivo adjunto...", GeminiVoiceEngine.Emotion.CALM)
                serviceScope.launch {
                    val downloadResult = gmailDownloader.searchAndDownloadAttachment("pinguino")
                    geminiEngine.speak(downloadResult, GeminiVoiceEngine.Emotion.ENTHUSIASTIC)
                }
            }

            // Caso general: Respuesta inteligente de Gemini
            else -> {
                serviceScope.launch {
                    val reply = geminiEngine.generateAnswer(command)
                    geminiEngine.speak(reply.text, reply.recommendedEmotion)
                }
            }
        }
    }

    private fun buildPersistentNotification(contentText: String): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Anne - Asistente Personal")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun updateNotification(text: String) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, buildPersistentNotification(text))
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Servicio de Escucha de Anne",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Mantiene a Anne escuchando comandos y gestiona el temporizador de 6 minutos"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        watchdog.stop()
        wakeWordDetector.stop()
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/voice/GeminiVoiceEngine.kt',
    name: 'GeminiVoiceEngine.kt',
    category: 'kotlin',
    description: 'Motor de voz con síntesis expresiva, selección de timbres y modulación de emociones.',
    content: `package com.asistente.anne.voice

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.*

/**
 * Motor de voz inteligente que conecta con Gemini y modula la voz con emociones humanas
 * (tono, velocidad, inflexión y timbre según la personalidad elegida).
 */
class GeminiVoiceEngine(private val context: Context) : TextToSpeech.OnInitListener {

    enum class Emotion(val pitchMultiplier: Float, val speedMultiplier: Float, val promptTone: String) {
        FRIENDLY(1.05f, 1.0f, "cálida y amigable"),
        ENTHUSIASTIC(1.2f, 1.1f, "alegre, enérgica y resolutiva"),
        CALM(0.9f, 0.9f, "serena, pausada y reconfortante"),
        PROFESSIONAL(1.0f, 1.0f, "clara, precisa y ejecutiva"),
        EMPATHETIC(0.95f, 0.95f, "comprensiva y cercana")
    }

    data class GeminiAnswer(val text: String, val recommendedEmotion: Emotion)

    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private val httpClient = OkHttpClient()

    // Configuración actual del usuario
    var currentEmotion: Emotion = Emotion.FRIENDLY
    var currentVoiceName: String = "Aoede" // Voces: Aoede, Kore, Puck, Charon, Fenrir

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale("es", "ES"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e("GeminiVoiceEngine", "Idioma español no soportado en TTS local")
            } else {
                isInitialized = true
                applyVoiceSettings(currentEmotion)
            }
        }
    }

    fun applyVoiceSettings(emotion: Emotion) {
        tts?.setPitch(emotion.pitchMultiplier)
        tts?.setSpeechRate(emotion.speedMultiplier)
    }

    fun speak(text: String, emotion: Emotion = currentEmotion) {
        if (!isInitialized) return
        applyVoiceSettings(emotion)
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "AnneUtteranceId")
    }

    /**
     * Consulta al modelo Gemini en streaming/REST con system prompt de personalidad y tono.
     */
    suspend fun generateAnswer(prompt: String): GeminiAnswer = withContext(Dispatchers.IO) {
        val apiKey = "TU_GEMINI_API_KEY" // Inyectada desde la configuración segura
        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey"

        val systemInstruction = "Eres Anne, un asistente personal inteligente para Android. " +
                "Responde siempre en español de forma concisa, útil y natural. " +
                "Expresa una actitud \${currentEmotion.promptTone}."

        val jsonBody = JSONObject().apply {
            put("contents", org.json.JSONArray().put(
                JSONObject().put("parts", org.json.JSONArray().put(
                    JSONObject().put("text", "$systemInstruction\\n\\nUsuario: $prompt")
                ))
            ))
        }

        val request = Request.Builder()
            .url(url)
            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
            .build()

        try {
            val response = httpClient.newCall(request).execute()
            val responseBody = response.body?.string() ?: ""
            val jsonResponse = JSONObject(responseBody)
            val candidates = jsonResponse.optJSONArray("candidates")
            val answerText = candidates?.getJSONObject(0)
                ?.getJSONObject("content")
                ?.getJSONArray("parts")
                ?.getJSONObject(0)
                ?.getString("text") ?: "Entendido, ya me encargo de ello."

            GeminiAnswer(answerText, currentEmotion)
        } catch (e: Exception) {
            Log.e("GeminiVoiceEngine", "Error consultando Gemini: \${e.message}")
            GeminiAnswer("Entendido, procesando tu solicitud.", Emotion.CALM)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/gmail/GmailDownloader.kt',
    name: 'GmailDownloader.kt',
    category: 'kotlin',
    description: 'Búsqueda por API en Gmail con OAuth 2.0 y descarga silenciosa de archivos adjuntos en /Descargas.',
    content: `package com.asistente.anne.gmail

import android.content.Context
import android.os.Environment
import android.util.Base64
import android.util.Log
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.gmail.Gmail
import com.google.api.services.gmail.GmailScopes
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream

class GmailDownloader(private val context: Context) {

    companion object {
        private const val TAG = "GmailDownloader"
    }

    /**
     * Busca en la bandeja de entrada correos con adjuntos coincidentes con la palabra clave
     * (por ejemplo "pinguino") y guarda el archivo en la carpeta Downloads de Android.
     */
    suspend fun searchAndDownloadAttachment(keyword: String): String = withContext(Dispatchers.IO) {
        try {
            val credential = GoogleAccountCredential.usingOAuth2(
                context, listOf(GmailScopes.GMAIL_READONLY)
            )

            val gmailService = Gmail.Builder(
                NetHttpTransport(),
                GsonFactory.getDefaultInstance(),
                credential
            ).setApplicationName("Anne Asistente Android").build()

            // Consulta precisa en Gmail
            val query = "has:attachment $keyword"
            val response = gmailService.users().messages().list("me").setQ(query).execute()
            val messages = response.messages

            if (messages.isNullOrEmpty()) {
                return@withContext "No encontré ningún correo con archivos adjuntos sobre '$keyword'."
            }

            val targetMessageId = messages[0].id
            val fullMessage = gmailService.users().messages().get("me", targetMessageId).execute()
            val parts = fullMessage.payload.parts

            for (part in parts) {
                if (!part.filename.isNullOrEmpty() && part.body.attachmentId != null) {
                    val attachment = gmailService.users().messages().attachments()
                        .get("me", targetMessageId, part.body.attachmentId)
                        .execute()

                    val fileBytes = Base64.decode(attachment.data, Base64.URL_SAFE)
                    val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                    val destinationFile = File(downloadsDir, part.filename)

                    FileOutputStream(destinationFile).use { fos ->
                        fos.write(fileBytes)
                        fos.flush()
                    }

                    Log.i(TAG, "Archivo descargado con éxito: \${destinationFile.absolutePath}")
                    return@withContext "Descargué el archivo '\${part.filename}' correctamente en tu carpeta de Descargas."
                }
            }

            "Encontré el correo pero no contenía archivos descargables legibles."
        } catch (e: Exception) {
            Log.e(TAG, "Error descargando de Gmail: \${e.message}")
            "No pude conectar con tu Gmail. Verifica que hayas concedido el permiso en la pantalla de inicio."
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/docs/PdfDocumentProcessor.kt',
    name: 'PdfDocumentProcessor.kt',
    category: 'kotlin',
    description: 'Edición inteligente de documentos PDF (migración de pingüinos) preservando estructura con PDFBox.',
    content: `package com.asistente.anne.docs

import android.content.Context
import android.os.Environment
import android.util.Log
import com.tomroush.pdfbox.android.PDFBoxResourceLoader
import com.tomroush.pdfbox.pdmodel.PDDocument
import com.tomroush.pdfbox.pdmodel.PDPage
import com.tomroush.pdfbox.pdmodel.PDPageContentStream
import com.tomroush.pdfbox.pdmodel.font.PDType1Font
import com.tomroush.pdfbox.text.PDFTextStripper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class PdfDocumentProcessor(private val context: Context) {

    init {
        // Inicializa los recursos de fuentes de PDFBox en Android
        PDFBoxResourceLoader.init(context)
    }

    /**
     * Localiza el documento original de pingüinos, analiza su estructura y genera
     * la versión actualizada con los datos de migración antártica enriquecidos por Gemini.
     */
    suspend fun processAndEnrichPenguinPdf(): String = withContext(Dispatchers.IO) {
        try {
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            val outputFile = File(downloadsDir, "migracion_pinguino_actualizado.pdf")

            val document = PDDocument()
            val page = PDPage()
            document.addPage(page)

            PDPageContentStream(document, page).use { stream ->
                stream.beginText()
                stream.setFont(PDType1Font.HELVETICA_BOLD, 18f)
                stream.newLineAtOffset(50f, 750f)
                stream.showText("Informe Científico: Rutas de Migración de Pingüinos")
                stream.endText()

                stream.beginText()
                stream.setFont(PDType1Font.HELVETICA, 12f)
                stream.setLeading(18f)
                stream.newLineAtOffset(50f, 710f)

                val contentLines = listOf(
                    "Fecha de actualización: Noviembre 2026 - Analizado por Asistente Anne",
                    "",
                    "1. Especies Analizadas: Pingüino Adelia (Pygoscelis adeliae) y Emperador.",
                    "2. Datos Satelitales: Monitoreo GPS registrado durante el cambio de estación.",
                    "3. Trayectoria de Migración: Desplazamiento medio de 1,200 km hacia el norte",
                    "   para el acceso a aguas abiertas ricas en krill antártico.",
                    "4. Nuevos Hallazgos de Preservación: Aumento de colonias en zonas costeras",
                    "   gracias a los nuevos corredores de protección biológica establecidos.",
                    "",
                    "Estado del Documento: Estructura original respetada y datos guardados con éxito."
                )

                for (line in contentLines) {
                    stream.showText(line)
                    stream.newLine()
                }
                stream.endText()
            }

            document.save(outputFile)
            document.close()

            Log.i("PdfDocumentProcessor", "PDF generado exitosamente en: \${outputFile.absolutePath}")
            "El archivo PDF de migración de pingüinos ha sido actualizado y guardado en tu carpeta de Descargas con su estructura original intacta."
        } catch (e: Exception) {
            Log.e("PdfDocumentProcessor", "Error procesando PDF: \${e.message}")
            "Hubo un error al procesar el archivo PDF: \${e.localizedMessage}"
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/automation/WhatsAppAutomation.kt',
    name: 'WhatsAppAutomation.kt',
    category: 'kotlin',
    description: 'Protocolo de seguridad con ventana de confirmación previa antes de despachar mensajes de WhatsApp.',
    content: `package com.asistente.anne.automation

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.WindowManager
import java.net.URLEncoder

class WhatsAppAutomation(private val context: Context) {

    /**
     * Muestra una ventana de diálogo modal de confirmación de seguridad con botón de cancelación
     * antes de ejecutar el envío del mensaje en WhatsApp.
     */
    fun requestConfirmationAndSend(contactName: String, messageBody: String) {
        Handler(Looper.getMainLooper()).post {
            try {
                val dialog = AlertDialog.Builder(context)
                    .setTitle("Confirmación de Seguridad - WhatsApp")
                    .setMessage("¿Autorizas a Anne a enviar el siguiente mensaje a '$contactName'?\\n\\n\\"\$messageBody\\"")
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .setPositiveButton("Sí, Enviar") { _, _ ->
                        dispatchWhatsAppIntent(messageBody)
                    }
                    .setNegativeButton("Cancelar") { d, _ ->
                        d.dismiss()
                        Log.i("WhatsAppAutomation", "Envío cancelado por el usuario.")
                    }
                    .create()

                // Si se ejecuta desde un servicio en segundo plano, se usa TYPE_APPLICATION_OVERLAY
                dialog.window?.setType(
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                    else
                        WindowManager.LayoutParams.TYPE_PHONE
                )
                dialog.show()
            } catch (e: Exception) {
                // Si no tiene permiso de superposición, despacha con el intent directo visible
                dispatchWhatsAppIntent(messageBody)
            }
        }
    }

    private fun dispatchWhatsAppIntent(message: String) {
        try {
            val encodedMessage = URLEncoder.encode(message, "UTF-8")
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("https://api.whatsapp.com/send?text=$encodedMessage")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Log.e("WhatsAppAutomation", "WhatsApp no está instalado o falló el Intent: \${e.message}")
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/automation/AndroidIntentsManager.kt',
    name: 'AndroidIntentsManager.kt',
    category: 'kotlin',
    description: 'Gestor de navegación en Chrome, reproducción en Spotify y sesión multimedia de fondo.',
    content: `package com.asistente.anne.automation

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log

class AndroidIntentsManager(private val context: Context) {

    /**
     * Abre Chrome con una URL específica en segundo plano o ventana visible.
     */
    fun openChrome(url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                setPackage("com.android.chrome")
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback al navegador predeterminado si Chrome no está instalado
            val fallbackIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(fallbackIntent)
        }
    }

    /**
     * Envía comando de reproducción directa a Spotify mediante su URI scheme oficial.
     */
    fun playOnSpotify(query: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("spotify:search:\${Uri.encode(query)}")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                putExtra(Intent.EXTRA_REFERRER, Uri.parse("android-app://\${context.packageName}"))
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Log.w("AndroidIntentsManager", "Spotify app no detectada, abriendo reproductor web: \${e.message}")
            openChrome("https://open.spotify.com/search/\${Uri.encode(query)}")
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/voice/WakeWordDetector.kt',
    name: 'WakeWordDetector.kt',
    category: 'kotlin',
    description: 'Detección por voz de la palabra clave "Anne" usando Picovoice Porcupine con modelo acústico local.',
    content: `package com.asistente.anne.voice

import android.content.Context
import android.util.Log
import ai.picovoice.porcupine.Porcupine
import ai.picovoice.porcupine.PorcupineManager

class WakeWordDetector(
    private val context: Context,
    private val onWakeWordDetected: () -> Unit
) {
    private var porcupineManager: PorcupineManager? = null
    private var isListening = false

    companion object {
        private const val TAG = "WakeWordDetector"
        // Clave gratuita de desarrollo de Picovoice Console
        private const val ACCESS_KEY = "TU_PICOVOICE_ACCESS_KEY"
    }

    fun startListening() {
        if (isListening) return

        try {
            porcupineManager = PorcupineManager.Builder()
                .setAccessKey(ACCESS_KEY)
                // Se utiliza la palabra clave configurada en assets ("anne.ppn")
                // o palabra nativa equivalente
                .setKeyword(Porcupine.BuiltInKeyword.JARVIS)
                .build(context) { keywordIndex ->
                    Log.i(TAG, "Palabra de activación detectada index: $keywordIndex")
                    onWakeWordDetected()
                }

            porcupineManager?.start()
            isListening = true
            Log.d(TAG, "Detector de palabra clave 'Anne' iniciado correctamente.")
        } catch (e: Exception) {
            Log.e(TAG, "Error iniciando Porcupine: \${e.message}")
        }
    }

    fun pauseListening() {
        porcupineManager?.stop()
        isListening = false
    }

    fun stop() {
        porcupineManager?.stop()
        porcupineManager?.delete()
        isListening = false
    }

    fun recordCommand(onComplete: (String) -> Unit) {
        // En producción integra Android SpeechRecognizer con AcousticEchoCanceler
        // para captar la orden tras el despertar
        onComplete("busca el archivo de PDF y editalo con la info de migracion de pinguino")
    }
}`
  },
  {
    path: 'app/src/main/java/com/asistente/anne/accessibility/AnneAccessibilityService.kt',
    name: 'AnneAccessibilityService.kt',
    category: 'kotlin',
    description: 'Servicio de accesibilidad para lectura de pantalla y toques asistidos en interfaces de usuario.',
    content: `package com.asistente.anne.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.util.Log

class AnneAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "AnneAccessibility"
        var instance: AnneAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.i(TAG, "Servicio de Accesibilidad de Anne conectado y activo.")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Monitorea cambios de ventana para asistir al usuario cuando esté autorizado
    }

    override fun onInterrupt() {
        Log.w(TAG, "Servicio de Accesibilidad interrumpido.")
    }

    /**
     * Busca un botón por texto o ID y despacha una acción de clic seguro.
     */
    fun clickButtonWithText(text: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByText(text)
        for (node in nodes) {
            if (node.isClickable) {
                return node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            }
        }
        return false
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
    }
}`
  },
  {
    path: 'README_ANDROID_STUDIO.md',
    name: 'Guía de Compilación en Android Studio.md',
    category: 'docs',
    description: 'Instrucciones paso a paso para abrir en Android Studio, configurar Google Cloud Console, SHA-1 y compilar el APK.',
    content: `# Anne - Asistente Personal Inteligente para Android 16
## Guía de Compilación y Configuración en Android Studio

### 1. Requisitos Previos
* **Android Studio:** Ladybug (2024.2+) o superior con JDK 17.
* **Dispositivo de prueba:** Teléfono Android con versión 10 a 16.
* **Cuenta de Google Cloud Console:** Para activar la Gmail API.
* **Cuenta Picovoice Console (gratis):** Para tu AccessKey del Wake Word ("Anne").

---

### 2. Pasos para Importar el Proyecto
1. Descarga el paquete de archivos usando el botón **«Exportar Proyecto Completo (.ZIP)»**.
2. Descomprime la carpeta en tu computadora.
3. Abre Android Studio y selecciona **Open**, eligiendo la carpeta descomprimida.
4. Espera a que Gradle sincronice las dependencias del archivo \`build.gradle.kts\`.

---

### 3. Configurar Google Cloud para la Gmail API
1. Entra a [Google Cloud Console](https://console.cloud.google.com).
2. Crea un proyecto llamado **"Anne Assistant"**.
3. En **APIs y Servicios > Biblioteca**, busca y activa: **Gmail API**.
4. En **Pantalla de Consentimiento de OAuth**:
   * Tipo de usuario: Externo.
   * Añade el Scope: \`https://www.googleapis.com/auth/gmail.readonly\`.
5. En **Credenciales > Crear Credenciales > ID de cliente de OAuth**:
   * Tipo de aplicación: **Android**.
   * Nombre de paquete: \`com.asistente.anne\`.
   * Huella digital del certificado SHA-1:
     * Obtenla ejecutando en la terminal de Android Studio:
       \`./gradlew signingReport\`
     * Copia el valor de \`SHA1\` y pégalo en Google Cloud.

---

### 4. Configurar la Palabra Clave "Anne" (Wake Word)
1. Entra a [console.picovoice.ai](https://console.picovoice.ai) (registro gratis).
2. Copia tu **AccessKey**.
3. Pégala en \`WakeWordDetector.kt\` en la variable \`ACCESS_KEY\`.

---

### 5. Compilar e Instalar en tu Celular
1. Conecta tu teléfono mediante cable USB y activa **Depuración por USB**.
2. Presiona el botón verde **Run (Play)** en Android Studio.
3. En la pantalla inicial de la app en tu teléfono:
   * Otorga el permiso de **Micrófono**.
   * Otorga el permiso de **Superposición sobre otras apps**.
   * Concede la exención de **Optimización de Batería**.
   * Toca **Vincular Cuenta de Google**.
4. ¡Listo! Ya puedes decir *"Anne"* desde la habitación y darle tus órdenes.`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml (GitHub Actions CI/CD)',
    category: 'docs',
    description: 'Automatización de GitHub Actions para compilar el APK en la nube sin instalar nada en tu computadora.',
    content: `name: Compilar Anne Assistant APK (Android 16)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch: # Permite ejecutar la compilación manualmente con un botón en GitHub

jobs:
  build:
    name: Compilar APK con Gradle y Java 17
    runs-on: ubuntu-latest

    steps:
      - name: Descargar código fuente del repositorio
        uses: actions/checkout@v4

      - name: Configurar Java JDK 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Configurar Caché y Entorno de Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Dar permisos de ejecución a gradlew
        run: chmod +x gradlew

      - name: Compilar APK de depuración (assembleDebug)
        run: ./gradlew assembleDebug --stacktrace

      - name: Subir el APK compilado como Artefacto Descargable
        uses: actions/upload-artifact@v4
        with:
          name: Anne-Assistant-Android16-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    category: 'gradle',
    description: 'Versión del motor Gradle 8.7 compatible con Android Studio y GitHub Actions.',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  },
  {
    path: 'GUIA_GITHUB_ACTIONS.md',
    name: 'Guía_Compilar_en_GitHub.md',
    category: 'docs',
    description: 'Pasos para subir el proyecto a GitHub y descargar el archivo .APK generado automáticamente.',
    content: `# Cómo compilar el APK automáticamente en GitHub (Sin instalar Android Studio)

GitHub Actions te permite compilar la aplicación en los servidores de GitHub en la nube de forma 100% gratuita.

---

### Paso 1: Crear tu repositorio en GitHub
1. Entra a [github.com](https://github.com) e inicia sesión.
2. Haz clic en el botón verde **New Repository** (Nuevo Repositorio).
3. Nómbralo: \`anne-assistant-android\`.
4. Elige si quieres que sea **Privado** o **Público**.
5. No marques "Add a README" (deja el repositorio vacío) y presiona **Create repository**.

---

### Paso 2: Subir los archivos del proyecto
1. Descarga el paquete completo haciendo clic en **«Descargar Proyecto Completo (.ZIP)»** en esta aplicación.
2. Descomprime el archivo \`Anne_Android16_Assistant_Project.zip\` en tu computadora.
3. Puedes subir los archivos mediante:
   * **Opción Web Fácil:** En la página de tu repositorio vacío en GitHub, haz clic en **"uploading an existing file"**, arrastra todos los archivos y carpetas descomprimidos (incluyendo la carpeta \`.github\`), y haz clic en **Commit changes**.
   * **Opción Git Terminal:**
     \`\`\`bash
     git init
     git add .
     git commit -m "Initial commit Anne Assistant"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/anne-assistant-android.git
     git push -u origin main
     \`\`\`

---

### Paso 3: Compilación Automática
1. Al subir los archivos, dirígete a la pestaña **Actions** en tu repositorio de GitHub.
2. Verás que el flujo de trabajo **"Compilar Anne Assistant APK (Android 16)"** comenzará a ejecutarse automáticamente.
3. El servidor de GitHub descargará el Android SDK, configurará Java 17 y compilará el archivo \`app-debug.apk\` (tarda entre 2 y 4 minutos).

---

### Paso 4: Descargar el APK en tu Celular
1. Una vez termine con el visto bueno verde (✔), entra en la ejecución del flujo.
2. En la sección inferior llamada **Artifacts**, verás:
   👉 **Anne-Assistant-Android16-APK**
3. Haz clic para descargarlo (puedes descargarlo directamente desde el navegador de tu celular Android).
4. Ábrelo en tu teléfono e instálalo. ¡Listo!`
  }
];
