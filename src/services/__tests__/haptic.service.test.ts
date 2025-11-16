import hapticService, { HapticFeedbackType } from '../haptic.service';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Mock the haptic feedback library
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

describe('HapticService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hapticService.setEnabled(true);
  });

  describe('setEnabled and getEnabled', () => {
    it('should enable haptic feedback', () => {
      hapticService.setEnabled(true);
      expect(hapticService.getEnabled()).toBe(true);
    });

    it('should disable haptic feedback', () => {
      hapticService.setEnabled(false);
      expect(hapticService.getEnabled()).toBe(false);
    });
  });

  describe('basic haptic methods', () => {
    it('should trigger light haptic', () => {
      hapticService.light();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.LIGHT,
        expect.any(Object)
      );
    });

    it('should trigger medium haptic', () => {
      hapticService.medium();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.MEDIUM,
        expect.any(Object)
      );
    });

    it('should trigger heavy haptic', () => {
      hapticService.heavy();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.HEAVY,
        expect.any(Object)
      );
    });

    it('should trigger success haptic', () => {
      hapticService.success();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.SUCCESS,
        expect.any(Object)
      );
    });

    it('should trigger warning haptic', () => {
      hapticService.warning();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.WARNING,
        expect.any(Object)
      );
    });

    it('should trigger error haptic', () => {
      hapticService.error();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.ERROR,
        expect.any(Object)
      );
    });

    it('should trigger selection haptic', () => {
      hapticService.selection();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.SELECTION,
        expect.any(Object)
      );
    });
  });

  describe('specialized haptic methods', () => {
    it('should trigger task completed haptic', () => {
      hapticService.taskCompleted();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.SUCCESS,
        expect.any(Object)
      );
    });

    it('should trigger milestone achieved haptic pattern', () => {
      jest.useFakeTimers();
      hapticService.milestoneAchieved();
      
      // First haptic should be immediate
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledTimes(1);
      
      // Advance timers and check for pattern
      jest.advanceTimersByTime(100);
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledTimes(2);
      
      jest.advanceTimersByTime(100);
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledTimes(3);
      
      jest.useRealTimers();
    });

    it('should trigger button press haptic', () => {
      hapticService.buttonPress();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.LIGHT,
        expect.any(Object)
      );
    });

    it('should trigger SOS button press haptic', () => {
      hapticService.sosButtonPress();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.HEAVY,
        expect.any(Object)
      );
    });

    it('should trigger toggle switch haptic', () => {
      hapticService.toggleSwitch();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.SELECTION,
        expect.any(Object)
      );
    });

    it('should trigger craving logged haptic', () => {
      hapticService.cravingLogged();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.MEDIUM,
        expect.any(Object)
      );
    });

    it('should trigger journal saved haptic', () => {
      hapticService.journalSaved();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        HapticFeedbackType.SUCCESS,
        expect.any(Object)
      );
    });
  });

  describe('when haptic is disabled', () => {
    beforeEach(() => {
      hapticService.setEnabled(false);
    });

    it('should not trigger haptic when disabled', () => {
      hapticService.light();
      expect(ReactNativeHapticFeedback.trigger).not.toHaveBeenCalled();
    });

    it('should not trigger task completed haptic when disabled', () => {
      hapticService.taskCompleted();
      expect(ReactNativeHapticFeedback.trigger).not.toHaveBeenCalled();
    });

    it('should not trigger milestone achieved haptic when disabled', () => {
      jest.useFakeTimers();
      hapticService.milestoneAchieved();
      jest.advanceTimersByTime(300);
      expect(ReactNativeHapticFeedback.trigger).not.toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should handle haptic trigger errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      (ReactNativeHapticFeedback.trigger as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Haptic error');
      });

      hapticService.light();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Haptic feedback error:', expect.any(Error));
      
      consoleWarnSpy.mockRestore();
    });
  });
});
