import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderOpen,
  Search,
  BookOpen,
  Terminal,
  ExternalLink,
  Layers
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { AndroidFile } from '../types/assistant';

export const CodeInspector: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(ANDROID_PROJECT_FILES[0].path);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedFile =
    ANDROID_PROJECT_FILES.find((f) => f.path === selectedFilePath) || ANDROID_PROJECT_FILES[0];

  const filteredFiles = ANDROID_PROJECT_FILES.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || file.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFullZip = async () => {
    try {
      setIsExportingZip(true);
      const zip = new JSZip();

      // Add each file to its exact folder structure
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Also add root settings.gradle.kts and gradlew scripts
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AnneAssistant"
include(":app")
`
      );

      // Wrapper script for Linux/Mac/GitHub Actions
      zip.file(
        'gradlew',
        `#!/bin/sh
exec gradle "$@"
`
      );

      // Wrapper script for Windows
      zip.file(
        'gradlew.bat',
        `@rem Gradle execution script for Windows
gradle %*
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Anne_Android16_Assistant_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando zip:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & ZIP Export CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Código Fuente Nativo en Kotlin para Android Studio</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Arquitectura Completa del Proyecto APK
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Todos los archivos están listos para ser compilados en Android Studio Ladybug (o superior) con soporte para Android 10 a 16.
          </p>
        </div>

        <button
          onClick={handleDownloadFullZip}
          disabled={isExportingZip}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingZip ? 'Comprimiendo ZIP...' : 'Descargar Proyecto Completo (.ZIP)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar File Tree */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col h-[650px]">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar archivo (ej: Watchdog, Gmail...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
            {['all', 'kotlin', 'manifest', 'gradle', 'xml', 'docs'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todos (12)' : cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-xs font-semibold truncate">{file.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate pl-6">
                    {file.path}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden">
          {/* File Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-medium text-indigo-400 truncate">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs font-medium transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Description snippet */}
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span>{selectedFile.description}</span>
          </div>

          {/* Syntax Code Editor Window */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
            <pre className="whitespace-pre">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
