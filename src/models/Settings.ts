// Settings model with default values

import {Settings, EmergencyContact} from '../types';

export class SettingsModel {
  static createDefault(): Settings {
    return {
      notifications: {
        enabled: true,
        dailyReminder: true,
        dailyReminderTime: '08:00',
        prayerTimes: true,
        milestones: true,
        encouragement: true,
      },
      appearance: {
        fontSize: 'medium',
        theme: 'light',
        soundEffects: true,
        hapticFeedback: true,
      },
      privacy: {
        pinLock: false,
        biometric: false,
        dataEncryption: false,
      },
      emergencyContacts: [],
      updatedAt: new Date().toISOString(),
    };
  }

  static update(
    settings: Settings,
    updates: Partial<Settings>,
  ): Settings {
    return {
      ...settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static addEmergencyContact(
    settings: Settings,
    contact: Omit<EmergencyContact, 'id'>,
  ): Settings {
    const newContact: EmergencyContact = {
      id: this.generateContactId(),
      ...contact,
    };

    return {
      ...settings,
      emergencyContacts: [...settings.emergencyContacts, newContact],
      updatedAt: new Date().toISOString(),
    };
  }

  static updateEmergencyContact(
    settings: Settings,
    contactId: string,
    updates: Partial<Omit<EmergencyContact, 'id'>>,
  ): Settings {
    return {
      ...settings,
      emergencyContacts: settings.emergencyContacts.map(contact =>
        contact.id === contactId ? {...contact, ...updates} : contact,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  static removeEmergencyContact(
    settings: Settings,
    contactId: string,
  ): Settings {
    return {
      ...settings,
      emergencyContacts: settings.emergencyContacts.filter(
        contact => contact.id !== contactId,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  private static generateContactId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
