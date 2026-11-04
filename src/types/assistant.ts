export interface AndroidFile {
  path: string;
  name: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'xml' | 'docs';
  description: string;
  content: string;
}

export type VoiceEmotion = 'amigable' | 'entusiasta' | 'calmada' | 'profesional' | 'empatica';

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'Femenino' | 'Masculino';
  timbre: string;
  description: string;
  defaultPitch: number;
  defaultRate: number;
  samplePhrase: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  constant: string;
  category: 'Sistema' | 'Voz' | 'Seguridad' | 'Google API';
  description: string;
  whyAndroid16RequiresIt: string;
  granted: boolean;
  intentAction: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  sender: 'user' | 'anne' | 'system';
  text: string;
  emotion?: VoiceEmotion;
  actionTag?: string;
  details?: string;
}
