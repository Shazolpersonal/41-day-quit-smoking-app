import React, {useEffect} from 'react';
import {MilestoneCelebrationAnimation} from '../animations/MilestoneCelebrationAnimation';
import {useHaptic} from '../../hooks/useHaptic';

export interface Milestone {
  day: number;
  title: string;
  description: string;
  badge: string;
  emoji: string;
}

export interface MilestoneCelebrationProps {
  visible: boolean;
  milestone: Milestone | null;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  visible,
  milestone,
  onClose,
}) => {
  const haptic = useHaptic();

  // Trigger haptic feedback when milestone celebration becomes visible
  useEffect(() => {
    if (visible && milestone) {
      haptic.milestoneAchieved();
    }
  }, [visible, milestone, haptic]);

  if (!milestone) return null;

  const celebrationDescription = `${milestone.description}\n\n"নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন" (সূরা বাকারা: ১৫৩)\n\nদিন ${milestone.day} সম্পূর্ণ!`;

  return (
    <MilestoneCelebrationAnimation
      visible={visible}
      title={`আলহামদুলিল্লাহ! ${milestone.emoji}\n${milestone.title}`}
      description={celebrationDescription}
      icon="trophy-award"
      onClose={onClose}
    />
  );
};


