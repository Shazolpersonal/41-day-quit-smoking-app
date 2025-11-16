import {Milestone} from '../components/home/MilestoneCelebration';

/**
 * Milestone achievements throughout the 41-day journey
 * These are special days that deserve celebration
 */
export const milestones: Milestone[] = [
  {
    day: 1,
    title: 'প্রথম দিন সম্পূর্ণ!',
    description:
      'মাশাআল্লাহ! আপনি আপনার যাত্রার প্রথম দিন সফলভাবে সম্পন্ন করেছেন। এটি একটি বড় পদক্ষেপ!',
    badge: '১',
    emoji: '🌟',
  },
  {
    day: 3,
    title: 'তিন দিনের মাইলস্টোন!',
    description:
      'সুবহানাল্লাহ! তিন দিন ধূমপান মুক্ত। আপনার শরীর ইতিমধ্যে পরিবর্তন অনুভব করছে।',
    badge: '৩',
    emoji: '💪',
  },
  {
    day: 7,
    title: 'এক সপ্তাহ সম্পূর্ণ!',
    description:
      'আলহামদুলিল্লাহ! পুরো এক সপ্তাহ ধূমপান ছাড়া। আপনি অসাধারণ কাজ করছেন!',
    badge: '৭',
    emoji: '🎯',
  },
  {
    day: 14,
    title: 'দুই সপ্তাহের বিজয়!',
    description:
      'মাশাআল্লাহ! দুই সপ্তাহ সম্পূর্ণ। আপনার ফুসফুস এখন আরও ভালো কাজ করছে।',
    badge: '১৪',
    emoji: '🏆',
  },
  {
    day: 21,
    title: 'তিন সপ্তাহের সাফল্য!',
    description:
      'সুবহানাল্লাহ! তিন সপ্তাহ ধূমপান মুক্ত। নতুন অভ্যাস তৈরি হচ্ছে।',
    badge: '২১',
    emoji: '🌈',
  },
  {
    day: 30,
    title: 'এক মাস সম্পূর্ণ!',
    description:
      'আলহামদুলিল্লাহ! পুরো এক মাস ধূমপান ছাড়া। এটি একটি বিশাল অর্জন!',
    badge: '৩০',
    emoji: '🎊',
  },
  {
    day: 41,
    title: '৪১ দিনের যাত্রা সম্পূর্ণ!',
    description:
      'আলহামদুলিল্লাহ! আপনি ৪১ দিনের যাত্রা সফলভাবে সম্পন্ন করেছেন। আপনি একজন বিজয়ী!',
    badge: '৪১',
    emoji: '👑',
  },
];

/**
 * Check if a given day is a milestone
 */
export const isMilestoneDay = (day: number): boolean => {
  return milestones.some(milestone => milestone.day === day);
};

/**
 * Get milestone for a specific day
 */
export const getMilestone = (day: number): Milestone | undefined => {
  return milestones.find(milestone => milestone.day === day);
};

/**
 * Get next milestone from current day
 */
export const getNextMilestone = (currentDay: number): Milestone | undefined => {
  return milestones.find(milestone => milestone.day > currentDay);
};

/**
 * Get all achieved milestones up to current day
 */
export const getAchievedMilestones = (currentDay: number): Milestone[] => {
  return milestones.filter(milestone => milestone.day <= currentDay);
};

/**
 * Get all upcoming milestones from current day
 */
export const getUpcomingMilestones = (currentDay: number): Milestone[] => {
  return milestones.filter(milestone => milestone.day > currentDay);
};
