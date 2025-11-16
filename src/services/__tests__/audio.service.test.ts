/**
 * Tests for Audio Service
 */

import audioService, {AUDIO_FILES} from '../audio.service';

describe('AudioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes successfully', async () => {
      await expect(audioService.initialize()).resolves.not.toThrow();
    });
  });

  describe('audio availability', () => {
    it('checks if audio is available for dua', () => {
      expect(audioService.isAudioAvailable('dua_craving_1')).toBe(true);
      expect(audioService.isAudioAvailable('nonexistent_dua')).toBe(false);
    });

    it('returns audio info for valid dua', () => {
      const audioInfo = audioService.getAudioInfo('dua_craving_1');
      expect(audioInfo).toBeTruthy();
      expect(audioInfo?.id).toBe('dua_craving_1');
      expect(audioInfo?.filename).toBe('hasbunallah.mp3');
    });

    it('returns null for invalid dua', () => {
      const audioInfo = audioService.getAudioInfo('nonexistent_dua');
      expect(audioInfo).toBeNull();
    });
  });

  describe('audio files', () => {
    it('has audio files defined', () => {
      expect(Object.keys(AUDIO_FILES).length).toBeGreaterThan(0);
    });

    it('has correct structure for audio files', () => {
      const audioFile = AUDIO_FILES.dua_craving_1;
      expect(audioFile).toHaveProperty('id');
      expect(audioFile).toHaveProperty('filename');
      expect(audioFile).toHaveProperty('duration');
      expect(audioFile).toHaveProperty('size');
    });

    it('has audio for all main duas', () => {
      const expectedDuas = [
        'dua_craving_1',
        'dua_craving_2',
        'dua_craving_3',
        'dua_gratitude_1',
        'dua_gratitude_2',
        'dua_strength_1',
        'dua_strength_2',
        'dua_strength_3',
        'dua_protection_1',
        'dua_tawbah_1',
      ];

      expectedDuas.forEach(duaId => {
        expect(AUDIO_FILES[duaId]).toBeTruthy();
      });
    });
  });

  describe('audio loading', () => {
    it('loads audio successfully for valid dua', async () => {
      const result = await audioService.loadAudio('dua_craving_1');
      expect(result).toBe(true);
    });

    it('returns false for invalid dua', async () => {
      const result = await audioService.loadAudio('nonexistent_dua');
      expect(result).toBe(false);
    });
  });

  describe('playback controls', () => {
    it('handles play without loaded audio', async () => {
      await expect(audioService.play()).rejects.toThrow();
    });

    it('handles pause gracefully', async () => {
      await expect(audioService.pause()).resolves.not.toThrow();
    });

    it('handles stop gracefully', async () => {
      await expect(audioService.stop()).resolves.not.toThrow();
    });

    it('handles seek gracefully', async () => {
      await expect(audioService.seek(10)).resolves.not.toThrow();
    });
  });

  describe('position and duration', () => {
    it('returns 0 for current position when no audio loaded', async () => {
      const position = await audioService.getCurrentPosition();
      expect(position).toBe(0);
    });

    it('returns 0 for duration when no audio loaded', async () => {
      const duration = await audioService.getDuration();
      expect(duration).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('cleans up successfully', async () => {
      await expect(audioService.cleanup()).resolves.not.toThrow();
    });
  });
});
