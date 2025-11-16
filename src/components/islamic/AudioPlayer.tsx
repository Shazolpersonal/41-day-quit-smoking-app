/**
 * Audio Player Component
 * Handles audio playback for duas with controls
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {colors, spacing, typography} from '../../constants/theme';
import Card from '../common/Card';

interface AudioPlayerProps {
  duaId: string;
  duaTitle: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({duaId, duaTitle}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioAvailable, setAudioAvailable] = useState(true);

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioAvailable) {
      Alert.alert(
        'অডিও উপলব্ধ নেই',
        'এই দোয়ার অডিও ফাইল এখনো যুক্ত করা হয়নি। শীঘ্রই যুক্ত করা হবে।',
      );
      return;
    }

    if (isPlaying) {
      // Pause audio
      setIsPlaying(false);
      // TODO: Implement actual audio pause
    } else {
      // Play audio
      setIsPlaying(true);
      setIsLoading(true);
      // TODO: Implement actual audio play
      setTimeout(() => {
        setIsLoading(false);
        setDuration(120); // Mock duration
      }, 500);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // TODO: Implement actual audio stop
  };

  const handleSeek = (position: number) => {
    setCurrentTime(position);
    // TODO: Implement actual audio seek
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>অডিও প্লেয়ার</Text>
        <Text style={styles.audioIcon}>🔊</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleStop}
          style={styles.controlButton}
          disabled={!isPlaying}>
          <Text style={[styles.controlIcon, !isPlaying && styles.disabledIcon]}>
            ⏹
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSeek(Math.min(currentTime + 10, duration))}
          style={styles.controlButton}
          disabled={!isPlaying}>
          <Text style={[styles.controlIcon, !isPlaying && styles.disabledIcon]}>
            ⏩
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      {!audioAvailable && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 অডিও ফাইল শীঘ্রই যুক্ত করা হবে
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  audioIcon: {
    fontSize: 20,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlIcon: {
    fontSize: 20,
    color: colors.text,
  },
  disabledIcon: {
    opacity: 0.3,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playButtonActive: {
    backgroundColor: colors.secondary,
  },
  playIcon: {
    fontSize: 24,
    color: colors.white,
  },
  infoContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
