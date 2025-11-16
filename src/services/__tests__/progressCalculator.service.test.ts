/**
 * Tests for ProgressCalculator Service
 */

import {progressCalculatorService} from '../progressCalculator.service';
import {User} from '../../types';

describe('ProgressCalculatorService', () => {
  // Mock user data
  const mockUser: User = {
    id: 'user_123',
    quitDate: '2024-01-01T00:00:00.000Z',
    cigarettesPerDay: 20,
    pricePerPack: 350,
    cigarettesPerPack: 20,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  describe('calculateSmokeFreeTime', () => {
    it('should calculate smoke-free time correctly', () => {
      // Mock current time to be 5 days, 12 hours, 30 minutes, 45 seconds after quit date
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-06T12:30:45.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(5);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
      expect(result.totalSeconds).toBe(476445);

      jest.restoreAllMocks();
    });

    it('should handle quit date in the future gracefully', () => {
      const futureQuitDate = '2025-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(futureQuitDate);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.totalSeconds).toBe(0);

      jest.restoreAllMocks();
    });

    it('should calculate time for less than a day', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T05:30:15.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(5);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(15);

      jest.restoreAllMocks();
    });

    it('should handle exactly one day', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-02T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(1);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.totalSeconds).toBe(86400);

      jest.restoreAllMocks();
    });

    it('should handle exactly one hour', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T01:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.totalSeconds).toBe(3600);

      jest.restoreAllMocks();
    });

    it('should handle exactly one minute', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:01:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(0);
      expect(result.totalSeconds).toBe(60);

      jest.restoreAllMocks();
    });

    it('should handle large time spans (over 41 days)', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-03-01T00:00:00.000Z'); // 60 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateSmokeFreeTime(quitDate);

      expect(result.days).toBe(60);
      expect(result.totalSeconds).toBeGreaterThan(0);

      jest.restoreAllMocks();
    });
  });

  describe('calculateMoneySaved', () => {
    it('should calculate money saved correctly', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-06T00:00:00.000Z'); // 5 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(mockUser, quitDate);

      // Daily cost: (20 cigarettes / 20 per pack) * 350 = 350 BDT
      // 5 days * 350 = 1750 BDT
      expect(result.total).toBe(1750);
      expect(result.daily).toBe(350);
      expect(result.weekly).toBe(2450); // 7 * 350
      expect(result.monthly).toBe(10500); // 30 * 350
      expect(result.yearly).toBe(127750); // 365 * 350

      jest.restoreAllMocks();
    });

    it('should handle fractional packs per day', () => {
      const userWithFractionalPacks: User = {
        ...mockUser,
        cigarettesPerDay: 10, // Half a pack
      };

      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-03T00:00:00.000Z'); // 2 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(
        userWithFractionalPacks,
        quitDate
      );

      // Daily cost: (10 / 20) * 350 = 175 BDT
      // 2 days * 175 = 350 BDT
      expect(result.total).toBe(350);
      expect(result.daily).toBe(175);

      jest.restoreAllMocks();
    });

    it('should use user quit date if not provided', () => {
      const mockNow = new Date('2024-01-08T00:00:00.000Z'); // 7 days after user quit date
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(mockUser);

      // 7 days * 350 = 2450 BDT
      expect(result.total).toBe(2450);

      jest.restoreAllMocks();
    });

    it('should handle zero cigarettes per day', () => {
      const userWithZero: User = {
        ...mockUser,
        cigarettesPerDay: 0,
      };

      const result = progressCalculatorService.calculateMoneySaved(userWithZero);

      expect(result.total).toBe(0);
      expect(result.daily).toBe(0);
      expect(result.weekly).toBe(0);
      expect(result.monthly).toBe(0);
      expect(result.yearly).toBe(0);
    });

    it('should handle multiple packs per day', () => {
      const heavySmoker: User = {
        ...mockUser,
        cigarettesPerDay: 40, // 2 packs per day
      };

      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-02T00:00:00.000Z'); // 1 day later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(heavySmoker, quitDate);

      // Daily cost: (40 / 20) * 350 = 700 BDT
      expect(result.total).toBe(700);
      expect(result.daily).toBe(700);

      jest.restoreAllMocks();
    });

    it('should handle expensive cigarettes', () => {
      const expensiveSmoker: User = {
        ...mockUser,
        pricePerPack: 1000,
      };

      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-02T00:00:00.000Z'); // 1 day later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(expensiveSmoker, quitDate);

      expect(result.daily).toBe(1000);
      expect(result.total).toBe(1000);

      jest.restoreAllMocks();
    });

    it('should handle different pack sizes', () => {
      const user10Pack: User = {
        ...mockUser,
        cigarettesPerDay: 10,
        cigarettesPerPack: 10,
        pricePerPack: 200,
      };

      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-02T00:00:00.000Z'); // 1 day later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(user10Pack, quitDate);

      // Daily cost: (10 / 10) * 200 = 200 BDT
      expect(result.daily).toBe(200);
      expect(result.total).toBe(200);

      jest.restoreAllMocks();
    });

    it('should floor money values to avoid decimals', () => {
      const userWithOddNumbers: User = {
        ...mockUser,
        cigarettesPerDay: 7,
        cigarettesPerPack: 20,
        pricePerPack: 333,
      };

      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-02T00:00:00.000Z'); // 1 day later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(userWithOddNumbers, quitDate);

      // All values should be integers
      expect(Number.isInteger(result.total)).toBe(true);
      expect(Number.isInteger(result.daily)).toBe(true);
      expect(Number.isInteger(result.weekly)).toBe(true);
      expect(Number.isInteger(result.monthly)).toBe(true);
      expect(Number.isInteger(result.yearly)).toBe(true);

      jest.restoreAllMocks();
    });

    it('should calculate correctly for partial days', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T12:00:00.000Z'); // 0.5 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateMoneySaved(mockUser, quitDate);

      // 0.5 days * 350 = 175 BDT
      expect(result.total).toBe(175);

      jest.restoreAllMocks();
    });
  });

  describe('getHealthBenefits', () => {
    it('should return achieved and upcoming health benefits', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T02:00:00.000Z'); // 2 hours later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getHealthBenefits(quitDate);

      // After 2 hours (120 minutes), should have achieved:
      // - 20 minutes milestone
      // - 2 hours milestone
      expect(result.achieved.length).toBe(2);
      expect(result.achieved[0].achieved).toBe(true);
      expect(result.achieved[0].achievedDate).toBeDefined();

      // Should have upcoming milestones
      expect(result.upcoming.length).toBeGreaterThan(0);
      expect(result.upcoming.length).toBeLessThanOrEqual(5);
      expect(result.upcoming[0].achieved).toBe(false);
      expect(result.upcoming[0].achievedDate).toBeUndefined();

      // Total should be all milestones in timeline
      expect(result.total).toBeGreaterThan(0);

      jest.restoreAllMocks();
    });

    it('should return no achieved benefits immediately after quitting', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:00:00.000Z'); // Same time
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getHealthBenefits(quitDate);

      expect(result.achieved.length).toBe(0);
      expect(result.upcoming.length).toBeGreaterThan(0);

      jest.restoreAllMocks();
    });

    it('should limit upcoming benefits to 5', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:01:00.000Z'); // 1 minute later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getHealthBenefits(quitDate);

      expect(result.upcoming.length).toBeLessThanOrEqual(5);

      jest.restoreAllMocks();
    });
  });

  describe('getNextMilestone', () => {
    it('should return next milestone with progress', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:10:00.000Z'); // 10 minutes later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getNextMilestone(quitDate);

      expect(result).not.toBeNull();
      expect(result!.milestone).toBeDefined();
      expect(result!.milestone.timeInMinutes).toBe(20); // Next milestone is at 20 minutes
      expect(result!.progress).toBeGreaterThan(0);
      expect(result!.progress).toBeLessThanOrEqual(100);
      expect(result!.timeRemaining).toBeDefined();
      expect(result!.timeRemaining.days).toBe(0);
      expect(result!.timeRemaining.hours).toBe(0);
      expect(result!.timeRemaining.minutes).toBe(10);

      jest.restoreAllMocks();
    });

    it('should calculate progress correctly', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T00:10:00.000Z'); // 10 minutes (50% to 20 min milestone)
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getNextMilestone(quitDate);

      expect(result!.progress).toBe(50);

      jest.restoreAllMocks();
    });

    it('should return null when all milestones achieved', () => {
      const quitDate = '2000-01-01T00:00:00.000Z'; // Very old quit date
      const mockNow = new Date('2024-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getNextMilestone(quitDate);

      expect(result).toBeNull();

      jest.restoreAllMocks();
    });
  });

  describe('calculateCigarettesNotSmoked', () => {
    it('should calculate cigarettes not smoked correctly', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-06T00:00:00.000Z'); // 5 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCigarettesNotSmoked(
        mockUser,
        quitDate
      );

      // 5 days * 20 cigarettes per day = 100
      expect(result).toBe(100);

      jest.restoreAllMocks();
    });

    it('should use user quit date if not provided', () => {
      const mockNow = new Date('2024-01-04T00:00:00.000Z'); // 3 days after user quit date
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCigarettesNotSmoked(mockUser);

      // 3 days * 20 = 60
      expect(result).toBe(60);

      jest.restoreAllMocks();
    });

    it('should handle fractional days', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T12:00:00.000Z'); // 0.5 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCigarettesNotSmoked(
        mockUser,
        quitDate
      );

      // 0.5 days * 20 = 10
      expect(result).toBe(10);

      jest.restoreAllMocks();
    });
  });

  describe('calculateCurrentDay', () => {
    it('should calculate current day correctly', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-05T00:00:00.000Z'); // 4 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCurrentDay(quitDate);

      // Day 1 is the quit day, so 4 days later is day 5
      expect(result).toBe(5);

      jest.restoreAllMocks();
    });

    it('should return 1 on quit day', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T12:00:00.000Z'); // Same day
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCurrentDay(quitDate);

      expect(result).toBe(1);

      jest.restoreAllMocks();
    });

    it('should cap at day 41', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-03-15T00:00:00.000Z'); // More than 41 days later
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.calculateCurrentDay(quitDate);

      expect(result).toBe(41);

      jest.restoreAllMocks();
    });
  });

  describe('getMilestones', () => {
    it('should return all milestones with achievement status', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-08T00:00:00.000Z'); // 7 days later (day 8)
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getMilestones(quitDate);

      expect(result.length).toBe(7); // Total milestones

      // Day 1, 3, 7 should be achieved
      const day1 = result.find(m => m.day === 1);
      const day3 = result.find(m => m.day === 3);
      const day7 = result.find(m => m.day === 7);
      const day14 = result.find(m => m.day === 14);

      expect(day1?.achieved).toBe(true);
      expect(day1?.achievedDate).toBeDefined();
      expect(day3?.achieved).toBe(true);
      expect(day3?.achievedDate).toBeDefined();
      expect(day7?.achieved).toBe(true);
      expect(day7?.achievedDate).toBeDefined();
      expect(day14?.achieved).toBe(false);
      expect(day14?.achievedDate).toBeUndefined();

      jest.restoreAllMocks();
    });

    it('should mark no milestones as achieved on day 1', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-01-01T12:00:00.000Z'); // Same day
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getMilestones(quitDate);

      const day1 = result.find(m => m.day === 1);
      expect(day1?.achieved).toBe(true); // Day 1 is achieved on the quit day

      const day3 = result.find(m => m.day === 3);
      expect(day3?.achieved).toBe(false);

      jest.restoreAllMocks();
    });

    it('should mark all milestones as achieved after 41 days', () => {
      const quitDate = '2024-01-01T00:00:00.000Z';
      const mockNow = new Date('2024-02-15T00:00:00.000Z'); // More than 41 days
      jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

      const result = progressCalculatorService.getMilestones(quitDate);

      const allAchieved = result.every(m => m.achieved);
      expect(allAchieved).toBe(true);

      jest.restoreAllMocks();
    });
  });
});
