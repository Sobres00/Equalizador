plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
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

    signingConfigs {
        create("release") {
            val keystoreFile = file("${rootProject.projectDir}/anne-release.keystore")
            if (keystoreFile.exists()) {
                storeFile = keystoreFile
                storePassword = "anneassistant"
                keyAlias = "anne"
                keyPassword = "anneassistant"
                enableV1Signing = true
                enableV2Signing = true
                enableV3Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            val keystoreFile = file("${rootProject.projectDir}/anne-release.keystore")
            if (keystoreFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            val keystoreFile = file("${rootProject.projectDir}/anne-release.keystore")
            if (keystoreFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
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

    // Serialización JSON
    implementation("com.google.code.gson:gson:2.11.0")
}
