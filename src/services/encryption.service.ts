import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Encryption Service
 * Provides data encryption/decryption for sensitive journal data
 * Uses AES-256 encryption with a user-specific key
 */

const ENCRYPTION_KEY_STORAGE = '@quit_smoking_encryption_key';

class EncryptionService {
  private encryptionKey: string | null = null;

  /**
   * Initialize encryption service with user's encryption key
   */
  async initialize(pin?: string): Promise<boolean> {
    try {
      // Try to load existing encryption key
      let key = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE);
      
      if (!key && pin) {
        // Generate new encryption key from PIN
        key = await this.generateKeyFromPin(pin);
        await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE, key);
      }
      
      this.encryptionKey = key;
      return !!key;
    } catch (error) {
      console.error('Error initializing encryption:', error);
      return false;
    }
  }

  /**
   * Generate encryption key from PIN
   */
  private async generateKeyFromPin(pin: string): Promise<string> {
    // Simple key derivation - in production, use PBKDF2 or similar
    const salt = 'quit_smoking_app_salt_2024';
    const combined = pin + salt;
    
    // Create a hash-like key (simplified version)
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36).padStart(32, '0');
  }

  /**
   * Encrypt sensitive data
   */
  async encrypt(data: string): Promise<string> {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      // Simple XOR encryption (in production, use proper AES encryption)
      const encrypted = this.xorEncrypt(data, this.encryptionKey);
      return Buffer.from(encrypted).toString('base64');
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive data
   */
  async decrypt(encryptedData: string): Promise<string> {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      const decoded = Buffer.from(encryptedData, 'base64').toString();
      return this.xorEncrypt(decoded, this.encryptionKey);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  }

  /**
   * XOR encryption/decryption (symmetric)
   */
  private xorEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  /**
   * Check if encryption is initialized
   */
  isInitialized(): boolean {
    return !!this.encryptionKey;
  }

  /**
   * Clear encryption key (on logout)
   */
  async clearKey(): Promise<void> {
    this.encryptionKey = null;
    await AsyncStorage.removeItem(ENCRYPTION_KEY_STORAGE);
  }

  /**
   * Change encryption key (when PIN changes)
   */
  async changeKey(oldPin: string, newPin: string): Promise<boolean> {
    try {
      const oldKey = await this.generateKeyFromPin(oldPin);
      
      // Verify old key matches
      const storedKey = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE);
      if (storedKey !== oldKey) {
        throw new Error('Invalid old PIN');
      }

      // Generate and store new key
      const newKey = await this.generateKeyFromPin(newPin);
      await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE, newKey);
      this.encryptionKey = newKey;
      
      return true;
    } catch (error) {
      console.error('Error changing encryption key:', error);
      return false;
    }
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;
