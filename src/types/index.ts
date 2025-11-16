// Global type definitions for the app

export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark';
export type Language = 'bn';

export interface AppConfig {
  version: string;
  totalDays: number;
}

export interface StorageKeys {
  user: string;
  progress: string;
  settings: string;
  journal: string;
  tasks: string;
  cravings: string;
}

// ==================== User Model ====================
export interface User {
  id: string;
  quitDate: string; // ISO date string
  cigarettesPerDay: number;
  pricePerPack: number; // in BDT
  cigarettesPerPack: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ==================== Progress Model ====================
export interface Progress {
  smokeFreeTime: SmokeFreeTime;
  moneySaved: number;
  cigarettesNotSmoked: number;
  currentDay: number;
  milestones: Milestone[];
  healthBenefits: HealthBenefit[];
  lastUpdated: string; // ISO date string
}

export interface SmokeFreeTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface Milestone {
  id: string;
  day: number;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: string; // ISO date string
  badge: BadgeType;
}

export type BadgeType = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface HealthBenefit {
  id: string;
  timeframe: string; // e.g., "20 minutes", "1 day", "1 week"
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: string; // ISO date string
  icon: string; // emoji or icon name
}

// ==================== Journal Entry Model ====================
export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  content: string;
  mood: MoodType;
  triggers: TriggerType[];
  cravingIntensity?: number; // 1-10
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type MoodType = 
  | 'very_happy' 
  | 'happy' 
  | 'neutral' 
  | 'sad' 
  | 'very_sad' 
  | 'anxious' 
  | 'stressed' 
  | 'confident';

export type TriggerType = 
  | 'stress' 
  | 'social' 
  | 'boredom' 
  | 'after_meal' 
  | 'coffee' 
  | 'alcohol' 
  | 'work' 
  | 'home' 
  | 'other';

// ==================== Daily Content Model ====================
export interface DailyContent {
  day: number;
  title: string;
  emoji: string;
  introduction: string;
  tasks: DailyTask[];
  affirmations: string[];
  islamicReminder: IslamicReminder;
  cravingTips: string[];
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface IslamicReminder {
  title: string;
  content: string;
  verse?: QuranVerse;
  hadith?: Hadith;
  dua?: Dua;
}

// ==================== Islamic Content Models ====================
export interface QuranVerse {
  id: string;
  surah: string;
  ayah: string;
  arabic: string;
  translation: string;
  transliteration?: string;
}

export interface Hadith {
  id: string;
  arabic: string;
  translation: string;
  source: string;
  reference: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  benefit: string;
  audioUrl?: string;
}

export interface Dhikr {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  benefit: string;
}

export interface IslamicQuote {
  id: string;
  text: string;
  author: string;
  category: 'motivation' | 'patience' | 'gratitude' | 'strength';
}

// ==================== Settings Model ====================
export interface Settings {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
  emergencyContacts: EmergencyContact[];
  updatedAt: string; // ISO date string
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm format
  prayerTimes: boolean;
  milestones: boolean;
  encouragement: boolean;
}

export interface AppearanceSettings {
  fontSize: FontSize;
  theme: Theme;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export interface PrivacySettings {
  pinLock: boolean;
  pin?: string;
  biometric: boolean;
  dataEncryption: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

// ==================== Craving Log Model ====================
export interface CravingLog {
  id: string;
  timestamp: string; // ISO date string
  intensity: number; // 1-10
  duration?: number; // in seconds
  triggers: TriggerType[];
  copingStrategy?: CopingStrategyType;
  notes?: string;
  overcome: boolean;
}

export type CopingStrategyType = 
  | 'breathing' 
  | 'dua' 
  | 'dhikr' 
  | 'water' 
  | 'walk' 
  | 'call' 
  | 'distraction' 
  | 'other';

// ==================== Task Completion Model ====================
export interface TaskCompletion {
  taskId: string;
  day: number;
  completed: boolean;
  completedAt?: string; // ISO date string
}

// ==================== Prayer Times Model ====================
export interface PrayerTimes {
  date: string; // ISO date string
  fajr: string; // HH:mm format
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  location: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// ==================== Statistics Model ====================
export interface Statistics {
  totalCravings: number;
  cravingsOvercome: number;
  averageCravingIntensity: number;
  mostCommonTriggers: TriggerType[];
  longestStreakDays: number;
  journalEntriesCount: number;
  tasksCompleted: number;
  totalTasksAvailable: number;
}
