import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {ProgressProvider, useProgress} from '../ProgressContext';
import {UserProvider} from '../UserContext';
import {storageService} from '../../services/storage.service';
import {User, Progress} from '../../types';

// Mock the storage service
jest.mock('../../services/storage.service');

// Mock user data
const mockUser: User = {
  id: 'test-user-1',
  quitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  cigarettesPerDay: 20,
  pricePerPack: 350,
  cigarettesPerPack: 20,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Wrapper component with both providers
const wrapper = ({children}: {children: React.ReactNode}) => (
  <UserProvider>
    <ProgressProvider>{children}</ProgressProvider>
  </UserProvider>
);

describe('ProgressContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock storage service methods
    (storageService.getUser as jest.Mock).mockResolvedValue(mockUser);
    (storageService.getProgress as jest.Mock).mockResolvedValue(null);
    (storageService.saveProgress as jest.Mock).mockResolvedValue(true);
  });

  describe('useProgress hook', () => {
    it('should throw error when used outside ProgressProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        renderHook(() => useProgress());
      }).toThrow('useProgress must be used within a ProgressProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide progress context when used within ProgressProvider', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.progress).toBeDefined();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('calculateProgress', () => {
    it('should calculate smoke-free time correctly', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        expect(result.current.progress?.smokeFreeTime.days).toBe(7);
      });
    });

    it('should calculate money saved correctly', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        // 20 cigarettes/day, 20 per pack, 350 BDT per pack = 350 BDT/day
        // 7 days * 350 = 2450 BDT
        expect(result.current.progress?.moneySaved).toBe(2450);
      });
    });

    it('should calculate cigarettes not smoked correctly', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        // 20 cigarettes/day * 7 days = 140 cigarettes
        expect(result.current.progress?.cigarettesNotSmoked).toBe(140);
      });
    });

    it('should calculate current day correctly', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        expect(result.current.progress?.currentDay).toBe(8); // Day 8 (7 days completed)
      });
    });

    it('should track milestone achievements', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        const milestones = result.current.progress?.milestones || [];
        
        // Day 1, 3, 7 should be achieved
        const day1 = milestones.find(m => m.day === 1);
        const day3 = milestones.find(m => m.day === 3);
        const day7 = milestones.find(m => m.day === 7);
        const day14 = milestones.find(m => m.day === 14);
        
        expect(day1?.achieved).toBe(true);
        expect(day3?.achieved).toBe(true);
        expect(day7?.achieved).toBe(true);
        expect(day14?.achieved).toBe(false);
      });
    });

    it('should update health benefits based on time elapsed', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.calculateProgress();
      });

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        const healthBenefits = result.current.progress?.healthBenefits || [];
        
        // Should have health benefits
        expect(healthBenefits.length).toBeGreaterThan(0);
        
        // Some benefits should be achieved after 7 days
        const achievedBenefits = healthBenefits.filter(b => b.achieved);
        expect(achievedBenefits.length).toBeGreaterThan(0);
      });
    });

    it('should return false when no user is available', async () => {
      (storageService.getUser as jest.Mock).mockResolvedValue(null);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.calculateProgress();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });

    it('should handle storage errors gracefully', async () => {
      (storageService.saveProgress as jest.Mock).mockResolvedValue(false);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.calculateProgress();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('updateMilestone', () => {
    it('should update milestone achievement status', async () => {
      const mockProgress: Progress = {
        smokeFreeTime: {
          days: 7,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 604800,
        },
        moneySaved: 2450,
        cigarettesNotSmoked: 140,
        currentDay: 8,
        milestones: [
          {
            id: 'milestone_day_1',
            day: 1,
            title: 'প্রথম দিন সম্পূর্ণ!',
            description: 'মাশাআল্লাহ! আপনি প্রথম দিন সফলভাবে সম্পূর্ণ করেছেন।',
            achieved: true,
            badge: 'bronze',
          },
        ],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      (storageService.getProgress as jest.Mock).mockResolvedValue(mockProgress);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.updateMilestone('milestone_day_1', false);
      });

      expect(success).toBe(true);
      expect(storageService.saveProgress).toHaveBeenCalled();
    });

    it('should return false when no progress is available', async () => {
      (storageService.getProgress as jest.Mock).mockResolvedValue(null);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.updateMilestone('milestone_day_1', true);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('getNextMilestone', () => {
    it('should return the next unachieved milestone', async () => {
      const mockProgress: Progress = {
        smokeFreeTime: {
          days: 7,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 604800,
        },
        moneySaved: 2450,
        cigarettesNotSmoked: 140,
        currentDay: 8,
        milestones: [
          {
            id: 'milestone_day_1',
            day: 1,
            title: 'প্রথম দিন সম্পূর্ণ!',
            description: 'মাশাআল্লাহ!',
            achieved: true,
            badge: 'bronze',
          },
          {
            id: 'milestone_day_14',
            day: 14,
            title: 'দুই সপ্তাহ সম্পূর্ণ!',
            description: 'মাশাআল্লাহ!',
            achieved: false,
            badge: 'silver',
          },
        ],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      (storageService.getProgress as jest.Mock).mockResolvedValue(mockProgress);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const nextMilestone = result.current.getNextMilestone();
      expect(nextMilestone).not.toBeNull();
      expect(nextMilestone?.day).toBe(14);
    });

    it('should return null when all milestones are achieved', async () => {
      const mockProgress: Progress = {
        smokeFreeTime: {
          days: 41,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 3542400,
        },
        moneySaved: 14350,
        cigarettesNotSmoked: 820,
        currentDay: 41,
        milestones: [
          {
            id: 'milestone_day_41',
            day: 41,
            title: '৪১ দিন সম্পূর্ণ!',
            description: 'সুবহানাল্লাহ!',
            achieved: true,
            badge: 'diamond',
          },
        ],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      (storageService.getProgress as jest.Mock).mockResolvedValue(mockProgress);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const nextMilestone = result.current.getNextMilestone();
      expect(nextMilestone).toBeNull();
    });
  });

  describe('getAchievedMilestones', () => {
    it('should return all achieved milestones', async () => {
      const mockProgress: Progress = {
        smokeFreeTime: {
          days: 7,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 604800,
        },
        moneySaved: 2450,
        cigarettesNotSmoked: 140,
        currentDay: 8,
        milestones: [
          {
            id: 'milestone_day_1',
            day: 1,
            title: 'প্রথম দিন সম্পূর্ণ!',
            description: 'মাশাআল্লাহ!',
            achieved: true,
            badge: 'bronze',
          },
          {
            id: 'milestone_day_3',
            day: 3,
            title: 'তিন দিন ধূমপানমুক্ত!',
            description: 'সুবহানাল্লাহ!',
            achieved: true,
            badge: 'bronze',
          },
          {
            id: 'milestone_day_14',
            day: 14,
            title: 'দুই সপ্তাহ সম্পূর্ণ!',
            description: 'মাশাআল্লাহ!',
            achieved: false,
            badge: 'silver',
          },
        ],
        healthBenefits: [],
        lastUpdated: new Date().toISOString(),
      };

      (storageService.getProgress as jest.Mock).mockResolvedValue(mockProgress);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const achievedMilestones = result.current.getAchievedMilestones();
      expect(achievedMilestones).toHaveLength(2);
      expect(achievedMilestones.every(m => m.achieved)).toBe(true);
    });
  });

  describe('clearProgress', () => {
    it('should clear progress data', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.clearProgress();
      });

      expect(success).toBe(true);
      expect(storageService.saveProgress).toHaveBeenCalled();
    });

    it('should handle storage errors when clearing', async () => {
      (storageService.saveProgress as jest.Mock).mockResolvedValue(false);
      
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.clearProgress();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('refreshProgress', () => {
    it('should reload progress from storage', async () => {
      const {result} = renderHook(() => useProgress(), {wrapper});

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshProgress();
      });

      expect(storageService.getProgress).toHaveBeenCalled();
    });
  });
});
