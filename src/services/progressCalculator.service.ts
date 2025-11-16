/**
 * Progress Calculator Service
 * Calculates smoke-free time, money saved, health benefits, and milestones
 */

import {User, SmokeFreeTime, HealthBenefit, Milestone} from '../types';
import {
  healthTimeline,
  getNextHealthMilestone,
  getAchievedHealthMilestones,
  HealthMilestone,
} from '../data/healthTimeline';

export interface MoneySavedBreakdown {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface NextMilestone {
  milestone: HealthMilestone;
  progress: number; // 0-100
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
}

class ProgressCalculatorService {
  /**
   * Calculate smoke-free time since quit date
   */
  calculateSmokeFreeTime(quitDate: string): SmokeFreeTime {
    const quit = new Date(quitDate);
    const now = new Date();
    const totalSeconds = Math.floor((now.getTime() - quit.getTime()) / 1000);

    // Ensure non-negative values
    const validTotalSeconds = Math.max(0, totalSeconds);

    const days = Math.floor(validTotalSeconds / 86400);
    const hours = Math.floor((validTotalSeconds % 86400) / 3600);
    const minutes = Math.floor((validTotalSeconds % 3600) / 60);
    const seconds = validTotalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: validTotalSeconds,
    };
  }

  /**
   * Calculate money saved based on user's smoking habits
   */
  calculateMoneySaved(user: User, quitDate?: string): MoneySavedBreakdown {
    const quit = quitDate || user.quitDate;
    const smokeFreeTime = this.calculateSmokeFreeTime(quit);

    // Calculate daily cost
    const packsPerDay = user.cigarettesPerDay / user.cigarettesPerPack;
    const dailyCost = packsPerDay * user.pricePerPack;

    // Calculate total money saved
    const daysSinceQuit = smokeFreeTime.totalSeconds / 86400;
    const total = Math.floor(dailyCost * daysSinceQuit);

    // Calculate breakdown
    const weekly = Math.floor(dailyCost * 7);
    const monthly = Math.floor(dailyCost * 30);
    const yearly = Math.floor(dailyCost * 365);

    return {
      total,
      daily: Math.floor(dailyCost),
      weekly,
      monthly,
      yearly,
    };
  }

  /**
   * Get health benefits achieved and upcoming
   */
  getHealthBenefits(quitDate: string): {
    achieved: HealthBenefit[];
    upcoming: HealthBenefit[];
    total: number;
  } {
    const smokeFreeTime = this.calculateSmokeFreeTime(quitDate);
    const minutesSinceQuit = Math.floor(smokeFreeTime.totalSeconds / 60);

    // Get achieved milestones
    const achievedMilestones = getAchievedHealthMilestones(minutesSinceQuit);
    const achieved: HealthBenefit[] = achievedMilestones.map((milestone) => ({
      id: `health_${milestone.timeInMinutes}`,
      title: milestone.title,
      description: milestone.description,
      timeframe: milestone.timeframe,
      icon: milestone.icon,
      achieved: true,
      achievedDate: this.calculateAchievedDate(quitDate, milestone.timeInMinutes),
    }));

    // Get upcoming milestones (next 5)
    const upcomingMilestones = healthTimeline
      .filter((milestone) => milestone.timeInMinutes > minutesSinceQuit)
      .slice(0, 5);

    const upcoming: HealthBenefit[] = upcomingMilestones.map((milestone) => ({
      id: `health_${milestone.timeInMinutes}`,
      title: milestone.title,
      description: milestone.description,
      timeframe: milestone.timeframe,
      icon: milestone.icon,
      achieved: false,
    }));

    return {
      achieved,
      upcoming,
      total: healthTimeline.length,
    };
  }

  /**
   * Get the next milestone with progress
   */
  getNextMilestone(quitDate: string): NextMilestone | null {
    const smokeFreeTime = this.calculateSmokeFreeTime(quitDate);
    const minutesSinceQuit = Math.floor(smokeFreeTime.totalSeconds / 60);

    const nextMilestone = getNextHealthMilestone(minutesSinceQuit);
    if (!nextMilestone) {
      return null;
    }

    // Calculate progress to next milestone
    const achievedMilestones = getAchievedHealthMilestones(minutesSinceQuit);
    const lastAchieved = achievedMilestones[achievedMilestones.length - 1];
    const startTime = lastAchieved ? lastAchieved.timeInMinutes : 0;
    const endTime = nextMilestone.timeInMinutes;

    const progress = Math.min(
      100,
      Math.max(
        0,
        Math.round(((minutesSinceQuit - startTime) / (endTime - startTime)) * 100)
      )
    );

    // Calculate time remaining
    const minutesRemaining = Math.max(0, endTime - minutesSinceQuit);
    const days = Math.floor(minutesRemaining / 1440);
    const hours = Math.floor((minutesRemaining % 1440) / 60);
    const minutes = minutesRemaining % 60;

    return {
      milestone: nextMilestone,
      progress,
      timeRemaining: {
        days,
        hours,
        minutes,
      },
    };
  }

  /**
   * Calculate cigarettes not smoked
   */
  calculateCigarettesNotSmoked(user: User, quitDate?: string): number {
    const quit = quitDate || user.quitDate;
    const smokeFreeTime = this.calculateSmokeFreeTime(quit);
    const daysSinceQuit = smokeFreeTime.totalSeconds / 86400;
    return Math.floor(user.cigarettesPerDay * daysSinceQuit);
  }

  /**
   * Calculate current day in the 41-day program
   */
  calculateCurrentDay(quitDate: string): number {
    const smokeFreeTime = this.calculateSmokeFreeTime(quitDate);
    return Math.min(smokeFreeTime.days + 1, 41);
  }

  /**
   * Get all milestones with achievement status
   */
  getMilestones(quitDate: string): Milestone[] {
    const currentDay = this.calculateCurrentDay(quitDate);

    const milestones: Milestone[] = [
      {
        id: 'milestone_1',
        title: 'প্রথম দিন সম্পূর্ণ',
        description: 'আলহামদুলিল্লাহ! আপনি প্রথম দিন সফলভাবে সম্পূর্ণ করেছেন',
        day: 1,
        badge: 'bronze',
        achieved: currentDay >= 1,
        achievedDate: currentDay >= 1 ? this.calculateDayAchievedDate(quitDate, 1) : undefined,
      },
      {
        id: 'milestone_3',
        title: '৩ দিন ধূমপানমুক্ত',
        description: 'মাশাআল্লাহ! নিকোটিন আপনার শরীর থেকে বের হয়ে যাচ্ছে',
        day: 3,
        badge: 'bronze',
        achieved: currentDay >= 3,
        achievedDate: currentDay >= 3 ? this.calculateDayAchievedDate(quitDate, 3) : undefined,
      },
      {
        id: 'milestone_7',
        title: '১ সপ্তাহ সম্পূর্ণ',
        description: 'সুবহানাল্লাহ! আপনি এক সপ্তাহ ধূমপানমুক্ত থাকতে পেরেছেন',
        day: 7,
        badge: 'silver',
        achieved: currentDay >= 7,
        achievedDate: currentDay >= 7 ? this.calculateDayAchievedDate(quitDate, 7) : undefined,
      },
      {
        id: 'milestone_14',
        title: '২ সপ্তাহ সম্পূর্ণ',
        description: 'আলহামদুলিল্লাহ! আপনার ফুসফুস এখন আরও ভালো কাজ করছে',
        day: 14,
        badge: 'silver',
        achieved: currentDay >= 14,
        achievedDate: currentDay >= 14 ? this.calculateDayAchievedDate(quitDate, 14) : undefined,
      },
      {
        id: 'milestone_21',
        title: '৩ সপ্তাহ সম্পূর্ণ',
        description: 'মাশাআল্লাহ! নতুন অভ্যাস তৈরি হয়ে যাচ্ছে',
        day: 21,
        badge: 'gold',
        achieved: currentDay >= 21,
        achievedDate: currentDay >= 21 ? this.calculateDayAchievedDate(quitDate, 21) : undefined,
      },
      {
        id: 'milestone_30',
        title: '১ মাস সম্পূর্ণ',
        description: 'সুবহানাল্লাহ! আপনি একটি বড় মাইলফলক অর্জন করেছেন',
        day: 30,
        badge: 'gold',
        achieved: currentDay >= 30,
        achievedDate: currentDay >= 30 ? this.calculateDayAchievedDate(quitDate, 30) : undefined,
      },
      {
        id: 'milestone_41',
        title: '৪১ দিন সম্পূর্ণ',
        description: 'আলহামদুলিল্লাহ! আপনি সম্পূর্ণ প্রোগ্রাম সফলভাবে সম্পন্ন করেছেন',
        day: 41,
        badge: 'diamond',
        achieved: currentDay >= 41,
        achievedDate: currentDay >= 41 ? this.calculateDayAchievedDate(quitDate, 41) : undefined,
      },
    ];

    return milestones;
  }

  /**
   * Helper: Calculate achieved date for a health milestone
   */
  private calculateAchievedDate(quitDate: string, minutesAfterQuit: number): string {
    const quit = new Date(quitDate);
    const achieved = new Date(quit.getTime() + minutesAfterQuit * 60 * 1000);
    return achieved.toISOString();
  }

  /**
   * Helper: Calculate achieved date for a day milestone
   */
  private calculateDayAchievedDate(quitDate: string, day: number): string {
    const quit = new Date(quitDate);
    const achieved = new Date(quit.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
    return achieved.toISOString();
  }
}

export const progressCalculatorService = new ProgressCalculatorService();
