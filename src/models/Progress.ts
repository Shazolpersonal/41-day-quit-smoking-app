// Progress model with calculation methods

import {Progress, SmokeFreeTime, Milestone, HealthBenefit} from '../types';

export class ProgressModel {
  static create(): Progress {
    return {
      smokeFreeTime: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      },
      moneySaved: 0,
      cigarettesNotSmoked: 0,
      currentDay: 1,
      milestones: [],
      healthBenefits: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  static calculateSmokeFreeTime(quitDate: string): SmokeFreeTime {
    const quit = new Date(quitDate);
    const now = new Date();
    const totalSeconds = Math.floor((now.getTime() - quit.getTime()) / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
    };
  }

  static calculateCurrentDay(quitDate: string): number {
    const smokeFreeTime = this.calculateSmokeFreeTime(quitDate);
    return Math.min(smokeFreeTime.days + 1, 41);
  }

  static updateMilestone(
    milestone: Milestone,
    achieved: boolean,
  ): Milestone {
    return {
      ...milestone,
      achieved,
      achievedDate: achieved ? new Date().toISOString() : undefined,
    };
  }

  static updateHealthBenefit(
    benefit: HealthBenefit,
    achieved: boolean,
  ): HealthBenefit {
    return {
      ...benefit,
      achieved,
      achievedDate: achieved ? new Date().toISOString() : undefined,
    };
  }
}
