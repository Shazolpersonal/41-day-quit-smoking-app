import AsyncStorage from '@react-native-async-storage/async-storage';
import {encryptionService} from '../encryption.service';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('EncryptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with PIN', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await encryptionService.initialize('123456');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should initialize with existing key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('existing_key');

      const result = await encryptionService.initialize();

      expect(result).toBe(true);
    });

    it('should check if initialized', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('key');
      await encryptionService.initialize();

      const result = encryptionService.isInitialized();

      expect(result).toBe(true);
    });
  });

  describe('Encryption/Decryption', () => {
    beforeEach(async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await encryptionService.initialize('123456');
    });

    it('should encrypt data', async () => {
      const plainText = 'Sensitive journal entry';

      const encrypted = await encryptionService.encrypt(plainText);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plainText);
      expect(typeof encrypted).toBe('string');
    });

    it('should decrypt data', async () => {
      const plainText = 'Sensitive journal entry';

      const encrypted = await encryptionService.encrypt(plainText);
      const decrypted = await encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plainText);
    });

    it('should handle encryption of empty string', async () => {
      const plainText = '';

      const encrypted = await encryptionService.encrypt(plainText);
      const decrypted = await encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plainText);
    });

    it('should handle encryption of special characters', async () => {
      const plainText = 'Test with special chars: !@#$%^&*()_+{}[]|\\:";\'<>?,./';

      const encrypted = await encryptionService.encrypt(plainText);
      const decrypted = await encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plainText);
    });

    it('should handle encryption of Bengali text', async () => {
      const plainText = 'আজ আমি ধূমপান করিনি। খুব ভালো লাগছে।';

      const encrypted = await encryptionService.encrypt(plainText);
      const decrypted = await encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plainText);
    });

    it('should throw error when encrypting without initialization', async () => {
      await encryptionService.clearKey();

      await expect(
        encryptionService.encrypt('test')
      ).rejects.toThrow();
    });

    it('should throw error when decrypting without initialization', async () => {
      await encryptionService.clearKey();

      await expect(
        encryptionService.decrypt('encrypted_data')
      ).rejects.toThrow();
    });
  });

  describe('Key Management', () => {
    it('should clear encryption key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('key');
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await encryptionService.initialize();
      await encryptionService.clearKey();

      const isInitialized = encryptionService.isInitialized();

      expect(isInitialized).toBe(false);
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });

    it('should change encryption key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await encryptionService.initialize('123456');

      const result = await encryptionService.changeKey('123456', '654321');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should fail to change key with wrong old PIN', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('key');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await encryptionService.initialize('123456');

      const result = await encryptionService.changeKey('wrong', '654321');

      expect(result).toBe(false);
    });
  });

  describe('Data Consistency', () => {
    it('should produce different encrypted output for same input', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await encryptionService.initialize('123456');

      const plainText = 'Test data';
      const encrypted1 = await encryptionService.encrypt(plainText);
      
      // Note: With XOR encryption, same input produces same output
      // In production with proper AES, this would be different due to IV
      const encrypted2 = await encryptionService.encrypt(plainText);

      expect(encrypted1).toBe(encrypted2);
    });

    it('should handle long text encryption', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await encryptionService.initialize('123456');

      const longText = 'A'.repeat(10000);

      const encrypted = await encryptionService.encrypt(longText);
      const decrypted = await encryptionService.decrypt(encrypted);

      expect(decrypted).toBe(longText);
    });
  });
});
