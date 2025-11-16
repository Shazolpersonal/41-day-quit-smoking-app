/**
 * useHaptic Hook
 * 
 * Custom hook to use haptic feedback with settings integration
 */

import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import hapticService from '../services/haptic.service';

export const useHaptic = () => {
  const { settings } = useSettings();

  // Sync haptic enabled state with settings
  useEffect(() => {
    if (settings) {
      hapticService.setEnabled(settings.appearance.hapticEnabled);
    }
  }, [settings?.appearance.hapticEnabled]);

  return hapticService;
};

export default useHaptic;
