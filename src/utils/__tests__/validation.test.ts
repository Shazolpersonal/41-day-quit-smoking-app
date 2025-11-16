/**
 * Validation Utilities Tests
 */

import {
  validateOnboardingData,
  validateJournalEntry,
  validateEmergencyContact,
  validatePIN,
  validateSettings,
  isValidPhoneNumber,
  validateNumber,
  validateDate,
  sanitizeInput,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateOnboardingData', () => {
    it('should validate correct onboarding data', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should reject missing quit date', () => {
      const data = {
        quitDate: '',
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.quitDate).toBeDefined();
    });

    it('should reject invalid cigarettes per day', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 0,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.cigarettesPerDay).toBeDefined();
    });

    it('should reject too high cigarettes per day', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 150,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.cigarettesPerDay).toBeDefined();
    });

    it('should reject invalid date format', () => {
      const data = {
        quitDate: 'invalid-date',
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.quitDate).toBeDefined();
    });

    it('should reject quit date too far in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const data = {
        quitDate: futureDate.toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.quitDate).toBeDefined();
    });

    it('should accept quit date within 7 days in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const data = {
        quitDate: futureDate.toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(true);
    });

    it('should reject negative price per pack', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: -10,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.pricePerPack).toBeDefined();
    });

    it('should reject zero price per pack', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 0,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.pricePerPack).toBeDefined();
    });

    it('should reject unrealistic price per pack', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 15000,
        cigarettesPerPack: 20,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.pricePerPack).toBeDefined();
    });

    it('should reject invalid cigarettes per pack', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 10,
        pricePerPack: 150,
        cigarettesPerPack: 0,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.cigarettesPerPack).toBeDefined();
    });

    it('should reject multiple invalid fields', () => {
      const data = {
        quitDate: '',
        cigarettesPerDay: 0,
        pricePerPack: 0,
        cigarettesPerPack: 0,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(4);
    });

    it('should handle boundary values correctly', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 1,
        pricePerPack: 1,
        cigarettesPerPack: 1,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(true);
    });

    it('should handle maximum valid values', () => {
      const data = {
        quitDate: new Date().toISOString(),
        cigarettesPerDay: 100,
        pricePerPack: 10000,
        cigarettesPerPack: 100,
      };

      const result = validateOnboardingData(data);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateJournalEntry', () => {
    it('should validate correct journal entry', () => {
      const data = {
        content: 'আজ ভালো লাগছে',
        mood: 'happy',
        triggers: ['stress'],
        cravingIntensity: 5,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });

    it('should reject empty content', () => {
      const data = {
        content: '',
        mood: 'happy',
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBeDefined();
    });

    it('should reject whitespace-only content', () => {
      const data = {
        content: '   ',
        mood: 'happy',
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBeDefined();
    });

    it('should reject invalid craving intensity', () => {
      const data = {
        content: 'Test',
        cravingIntensity: 15,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.cravingIntensity).toBeDefined();
    });

    it('should reject craving intensity below 1', () => {
      const data = {
        content: 'Test',
        cravingIntensity: 0,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.cravingIntensity).toBeDefined();
    });

    it('should accept minimum craving intensity', () => {
      const data = {
        content: 'Test',
        cravingIntensity: 1,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });

    it('should accept maximum craving intensity', () => {
      const data = {
        content: 'Test',
        cravingIntensity: 10,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });

    it('should reject content exceeding maximum length', () => {
      const data = {
        content: 'a'.repeat(5001),
        mood: 'happy',
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBeDefined();
    });

    it('should accept content at maximum length', () => {
      const data = {
        content: 'a'.repeat(5000),
        mood: 'happy',
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });

    it('should validate entry without optional fields', () => {
      const data = {
        content: 'Simple entry',
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });

    it('should validate entry with all optional fields', () => {
      const data = {
        content: 'Complete entry',
        mood: 'neutral',
        triggers: ['stress', 'social'],
        cravingIntensity: 7,
      };

      const result = validateJournalEntry(data);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateEmergencyContact', () => {
    it('should validate correct contact', () => {
      const data = {
        name: 'জন ডো',
        phone: '01712345678',
        relationship: 'বন্ধু',
      };

      const result = validateEmergencyContact(data);
      expect(result.isValid).toBe(true);
    });

    it('should reject missing name', () => {
      const data = {
        name: '',
        phone: '01712345678',
        relationship: 'বন্ধু',
      };

      const result = validateEmergencyContact(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it('should reject invalid phone', () => {
      const data = {
        name: 'জন ডো',
        phone: '123',
        relationship: 'বন্ধু',
      };

      const result = validateEmergencyContact(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeDefined();
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate Bangladesh phone numbers', () => {
      expect(isValidPhoneNumber('01712345678')).toBe(true);
      expect(isValidPhoneNumber('+8801712345678')).toBe(true);
      expect(isValidPhoneNumber('8801712345678')).toBe(true);
      expect(isValidPhoneNumber('01812345678')).toBe(true);
      expect(isValidPhoneNumber('01912345678')).toBe(true);
    });

    it('should validate all valid operator prefixes', () => {
      expect(isValidPhoneNumber('01312345678')).toBe(true); // Grameenphone
      expect(isValidPhoneNumber('01412345678')).toBe(true); // Banglalink
      expect(isValidPhoneNumber('01512345678')).toBe(true); // Teletalk
      expect(isValidPhoneNumber('01612345678')).toBe(true); // Airtel
      expect(isValidPhoneNumber('01712345678')).toBe(true); // Grameenphone
      expect(isValidPhoneNumber('01812345678')).toBe(true); // Robi
      expect(isValidPhoneNumber('01912345678')).toBe(true); // Banglalink
    });

    it('should validate phone numbers with spaces', () => {
      expect(isValidPhoneNumber('017 1234 5678')).toBe(true);
      expect(isValidPhoneNumber('+880 17 1234 5678')).toBe(true);
    });

    it('should validate phone numbers with dashes', () => {
      expect(isValidPhoneNumber('017-1234-5678')).toBe(true);
      expect(isValidPhoneNumber('+880-17-1234-5678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('01012345678')).toBe(false); // Invalid prefix
      expect(isValidPhoneNumber('017123456')).toBe(false); // Too short
      expect(isValidPhoneNumber('0171234567890')).toBe(false); // Too long
    });

    it('should reject empty or null phone numbers', () => {
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('   ')).toBe(false);
    });

    it('should reject phone numbers with letters', () => {
      expect(isValidPhoneNumber('017abcd5678')).toBe(false);
      expect(isValidPhoneNumber('01712345abc')).toBe(false);
    });

    it('should reject phone numbers starting with 02', () => {
      expect(isValidPhoneNumber('02112345678')).toBe(false);
    });

    it('should reject international numbers from other countries', () => {
      expect(isValidPhoneNumber('+911234567890')).toBe(false); // India
      expect(isValidPhoneNumber('+12025551234')).toBe(false); // USA
    });
  });

  describe('validatePIN', () => {
    it('should validate correct PIN', () => {
      const result = validatePIN('1357');
      expect(result.isValid).toBe(true);
    });

    it('should reject short PIN', () => {
      const result = validatePIN('123');
      expect(result.isValid).toBe(false);
    });

    it('should reject weak PIN', () => {
      expect(validatePIN('1111').isValid).toBe(false);
      expect(validatePIN('1234').isValid).toBe(false);
      expect(validatePIN('0000').isValid).toBe(false);
    });
  });

  describe('validateSettings', () => {
    it('should validate correct settings', () => {
      const data = {
        dailyReminderTime: '08:00',
        fontSize: 'medium',
      };

      const result = validateSettings(data);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid time format', () => {
      const data = {
        dailyReminderTime: '25:00',
      };

      const result = validateSettings(data);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateNumber', () => {
    it('should validate number in range', () => {
      const result = validateNumber(5, 1, 10);
      expect(result.isValid).toBe(true);
    });

    it('should reject number below minimum', () => {
      const result = validateNumber(0, 1, 10);
      expect(result.isValid).toBe(false);
    });

    it('should reject number above maximum', () => {
      const result = validateNumber(15, 1, 10);
      expect(result.isValid).toBe(false);
    });

    it('should reject non-number', () => {
      const result = validateNumber('abc', 1, 10);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('should validate correct date', () => {
      const result = validateDate(new Date().toISOString());
      expect(result.isValid).toBe(true);
    });

    it('should reject future date when not allowed', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const result = validateDate(futureDate.toISOString(), false);
      expect(result.isValid).toBe(false);
    });

    it('should accept future date when allowed', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const result = validateDate(futureDate.toISOString(), true);
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should remove null bytes', () => {
      expect(sanitizeInput('test\0test')).toBe('testtest');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(15000);
      const result = sanitizeInput(longString);
      expect(result.length).toBe(10000);
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null as any)).toBe('');
    });
  });
});
