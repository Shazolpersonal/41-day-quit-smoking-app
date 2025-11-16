import React, {createContext, useContext, useState, useEffect, useCallback, ReactNode} from 'react';
import {Progress, Milestone, HealthBenefit} from '../types';
import {ProgressModel} from '../models/Progress';
import {storageService} from '../services/storage.service';
import {useUser} from './UserContext';
import {
  healthTimeline,
  getAchievedHealthMilestones,
  getNextHealthMilestone,
} from '../data/healthTimeline';
import {UserModel} from '../models/User';

interface ProgressContextType {
  progress: Progress | null;
  loading: boolean;
  error: string | null;
  calculateProgress: () => Promise<boolean>;
  updateMilestone: (milestoneId: string, achieved: boolean) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  clearProgress: () => Promise<boolean>;
  getNextMilestone: () => Milestone | null;
  getAchievedMilestones: () => Milestone[];
  getNextHealthBenefit: () => HealthBenefit | null;
  getAchievedHealthBenefits: () => HealthBenefit[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({children}) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useUser();

  // Load progress data on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Auto-calculate progress when user changes
  useEffect(() => {
    if (user) {
      calculateProgress();
    }
  }, [user]);

  /**
   * Load progress data from storage
   */
  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const progressData = await storageService.getProgress();
      setProgress(progressData);
    } catch (err) {
      setError('অগ্রগতির তথ্য লোড করতে ব্যর্থ');
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate and update all progress metrics
   * - Smoke-free time
   * - Money saved
   * - Cigarettes not smoked
   * - Current day
   * - Milestone achievements
   * - Health benefits based on time elapsed
   */
  const calculateProgress = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      if (!user) {
        setError('ব্যবহারকারীর তথ্য পাওয়া যায়নি');
        return false;
      }

      // Calculate smoke-free time
      const smokeFreeTime = ProgressModel.calculateSmokeFreeTime(user.quitDate);

      // Calculate current day (1-41)
      const currentDay = ProgressModel.calculateCurrentDay(user.quitDate);

      // Calculate money saved
      const dailyCost = UserModel.getDailyCost(user);
      const moneySaved = Math.floor(dailyCost * smokeFreeTime.days);

      // Calculate cigarettes not smoked
      const cigarettesNotSmoked = Math.floor(user.cigarettesPerDay * smokeFreeTime.days);

      // Calculate health benefits based on time elapsed
      const minutesSinceQuit = Math.floor(smokeFreeTime.totalSeconds / 60);
      const achievedHealthMilestones = getAchievedHealthMilestones(minutesSinceQuit);

      // Convert health milestones to HealthBenefit format
      const healthBenefits: HealthBenefit[] = healthTimeline.map(milestone => {
        const isAchieved = achievedHealthMilestones.some(
          achieved => achieved.timeframe === milestone.timeframe
        );
        
        // Check if this benefit was previously achieved to preserve achievedDate
        const existingBenefit = progress?.healthBenefits.find(
          b => b.timeframe === milestone.timeframe
        );

        return {
          id: `health_${milestone.timeframe.replace(/\s+/g, '_')}`,
          timeframe: milestone.timeframe,
          title: milestone.title,
          description: milestone.description,
          achieved: isAchieved,
          achievedDate: isAchieved 
            ? (existingBenefit?.achievedDate || new Date().toISOString())
            : undefined,
          icon: milestone.icon,
        };
      });

      // Generate milestones for key days (1, 3, 7, 14, 21, 30, 41)
      const keyDays = [1, 3, 7, 14, 21, 30, 41];
      const milestones: Milestone[] = keyDays.map(day => {
        const isAchieved = currentDay >= day;
        
        // Check if this milestone was previously achieved to preserve achievedDate
        const existingMilestone = progress?.milestones.find(m => m.day === day);

        return {
          id: `milestone_day_${day}`,
          day,
          title: getMilestoneTitle(day),
          description: getMilestoneDescription(day),
          achieved: isAchieved,
          achievedDate: isAchieved
            ? (existingMilestone?.achievedDate || new Date().toISOString())
            : undefined,
          badge: getMilestoneBadge(day),
        };
      });

      // Create updated progress object
      const updatedProgress: Progress = {
        smokeFreeTime,
        moneySaved,
        cigarettesNotSmoked,
        currentDay,
        milestones,
        healthBenefits,
        lastUpdated: new Date().toISOString(),
      };

      // Save to storage
      const success = await storageService.saveProgress(updatedProgress);
      
      if (success) {
        setProgress(updatedProgress);
        return true;
      } else {
        setError('অগ্রগতি সংরক্ষণ করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('অগ্রগতি গণনা করতে ত্রুটি');
      console.error('Error calculating progress:', err);
      return false;
    }
  }, [user, progress]);

  /**
   * Update a specific milestone's achievement status
   */
  const updateMilestone = async (
    milestoneId: string,
    achieved: boolean,
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!progress) {
        setError('অগ্রগতির তথ্য পাওয়া যায়নি');
        return false;
      }

      // Find and update the milestone
      const updatedMilestones = progress.milestones.map(milestone => {
        if (milestone.id === milestoneId) {
          return ProgressModel.updateMilestone(milestone, achieved);
        }
        return milestone;
      });

      // Create updated progress
      const updatedProgress: Progress = {
        ...progress,
        milestones: updatedMilestones,
        lastUpdated: new Date().toISOString(),
      };

      // Save to storage
      const success = await storageService.saveProgress(updatedProgress);
      
      if (success) {
        setProgress(updatedProgress);
        return true;
      } else {
        setError('মাইলফলক আপডেট করতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('মাইলফলক আপডেট করতে ত্রুটি');
      console.error('Error updating milestone:', err);
      return false;
    }
  };

  /**
   * Refresh progress data from storage
   */
  const refreshProgress = async (): Promise<void> => {
    await loadProgress();
  };

  /**
   * Clear progress data
   */
  const clearProgress = async (): Promise<boolean> => {
    try {
      setError(null);
      
      // Create empty progress
      const emptyProgress = ProgressModel.create();
      const success = await storageService.saveProgress(emptyProgress);
      
      if (success) {
        setProgress(emptyProgress);
        return true;
      } else {
        setError('অগ্রগতি মুছে ফেলতে ব্যর্থ');
        return false;
      }
    } catch (err) {
      setError('অগ্রগতি মুছে ফেলতে ত্রুটি');
      console.error('Error clearing progress:', err);
      return false;
    }
  };

  /**
   * Get the next unachieved milestone
   */
  const getNextMilestone = (): Milestone | null => {
    if (!progress) {
      return null;
    }

    const nextMilestone = progress.milestones.find(m => !m.achieved);
    return nextMilestone || null;
  };

  /**
   * Get all achieved milestones
   */
  const getAchievedMilestones = (): Milestone[] => {
    if (!progress) {
      return [];
    }

    return progress.milestones.filter(m => m.achieved);
  };

  /**
   * Get the next unachieved health benefit
   */
  const getNextHealthBenefit = (): HealthBenefit | null => {
    if (!progress) {
      return null;
    }

    const nextBenefit = progress.healthBenefits.find(b => !b.achieved);
    return nextBenefit || null;
  };

  /**
   * Get all achieved health benefits
   */
  const getAchievedHealthBenefits = (): HealthBenefit[] => {
    if (!progress) {
      return [];
    }

    return progress.healthBenefits.filter(b => b.achieved);
  };

  const value: ProgressContextType = {
    progress,
    loading,
    error,
    calculateProgress,
    updateMilestone,
    refreshProgress,
    clearProgress,
    getNextMilestone,
    getAchievedMilestones,
    getNextHealthBenefit,
    getAchievedHealthBenefits,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

/**
 * Hook to use ProgressContext
 */
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  
  return context;
};

/**
 * Helper function to get milestone title based on day
 */
function getMilestoneTitle(day: number): string {
  const titles: Record<number, string> = {
    1: 'প্রথম দিন সম্পূর্ণ!',
    3: 'তিন দিন ধূমপানমুক্ত!',
    7: 'এক সপ্তাহ সম্পূর্ণ!',
    14: 'দুই সপ্তাহ সম্পূর্ণ!',
    21: 'তিন সপ্তাহ সম্পূর্ণ!',
    30: 'এক মাস সম্পূর্ণ!',
    41: '৪১ দিন সম্পূর্ণ - আলহামদুলিল্লাহ!',
  };
  
  return titles[day] || `${day} দিন সম্পূর্ণ!`;
}

/**
 * Helper function to get milestone description based on day
 */
function getMilestoneDescription(day: number): string {
  const descriptions: Record<number, string> = {
    1: 'মাশাআল্লাহ! আপনি প্রথম দিন সফলভাবে সম্পূর্ণ করেছেন। এটি একটি বড় পদক্ষেপ!',
    3: 'সুবহানাল্লাহ! তিন দিন ধূমপান ছাড়া। আপনার শরীর সুস্থ হতে শুরু করেছে।',
    7: 'আলহামদুলিল্লাহ! এক সপ্তাহ সম্পূর্ণ। আপনার ফুসফুস পরিষ্কার হতে শুরু করেছে।',
    14: 'মাশাআল্লাহ! দুই সপ্তাহ সম্পূর্ণ। আপনার রক্ত সঞ্চালন উন্নত হয়েছে।',
    21: 'সুবহানাল্লাহ! তিন সপ্তাহ সম্পূর্ণ। নতুন অভ্যাস তৈরি হচ্ছে।',
    30: 'আলহামদুলিল্লাহ! এক মাস সম্পূর্ণ। আপনার ফুসফুস উল্লেখযোগ্যভাবে সুস্থ হয়েছে।',
    41: 'সুবহানাল্লাহ! ৪১ দিন সম্পূর্ণ। আপনি সফলভাবে ধূমপান ত্যাগ করেছেন। আল্লাহ আপনাকে সুস্থ রাখুন!',
  };
  
  return descriptions[day] || `আপনি ${day} দিন ধূমপানমুক্ত থাকতে সক্ষম হয়েছেন। চালিয়ে যান!`;
}

/**
 * Helper function to get milestone badge based on day
 */
function getMilestoneBadge(day: number): 'bronze' | 'silver' | 'gold' | 'diamond' {
  if (day >= 41) return 'diamond';
  if (day >= 30) return 'gold';
  if (day >= 14) return 'silver';
  return 'bronze';
}

export default ProgressContext;
