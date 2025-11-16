import {BadgeType} from '../types';

export const config = {
  app: {
    version: '1.0.0',
    totalDays: 41,
    defaultCigarettesPerPack: 20,
  },
  storage: {
    keys: {
      user: '@user',
      progress: '@progress',
      settings: '@settings',
      journal: '@journal',
      tasks: '@tasks',
      cravings: '@cravings',
    },
  },
  notifications: {
    channelId: 'quit-smoking-notifications',
    channelName: 'ধূমপান ত্যাগ রিমাইন্ডার',
    dailyReminderId: 'daily-reminder',
    milestoneId: 'milestone-notification',
    encouragementId: 'encouragement-notification',
  },
  milestones: [
    {day: 1, badge: 'bronze' as BadgeType, title: 'প্রথম দিন'},
    {day: 3, badge: 'bronze' as BadgeType, title: '৩ দিন'},
    {day: 7, badge: 'silver' as BadgeType, title: '১ সপ্তাহ'},
    {day: 14, badge: 'silver' as BadgeType, title: '২ সপ্তাহ'},
    {day: 21, badge: 'gold' as BadgeType, title: '৩ সপ্তাহ'},
    {day: 28, badge: 'gold' as BadgeType, title: '৪ সপ্তাহ'},
    {day: 35, badge: 'diamond' as BadgeType, title: '৫ সপ্তাহ'},
    {day: 41, badge: 'diamond' as BadgeType, title: '৪১ দিন সম্পূর্ণ'},
  ],
  breathing: {
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    cycles: 5,
  },
  craving: {
    averageDurationMinutes: 5,
    intensityLevels: 10,
  },
};
