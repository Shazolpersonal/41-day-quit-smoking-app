/**
 * Dua Detail Screen
 * Displays detailed information about a dua with audio playback
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {duas, Dua} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {AudioPlayer} from '../components/islamic/AudioPlayer';

type DuaDetailScreenRouteProp = RouteProp<RootStackParamList, 'DuaDetail'>;

const DuaDetailScreen: React.FC = () => {
  const route = useRoute<DuaDetailScreenRouteProp>();
  const navigation = useNavigation();
  const {duaId} = route.params;

  const [dua, setDua] = useState<Dua | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundDua = duas.find(d => d.id === duaId);
    if (foundDua) {
      setDua(foundDua);
    } else {
      Alert.alert('ত্রুটি', 'দোয়া পাওয়া যায়নি');
      navigation.goBack();
    }
  }, [duaId, navigation]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to favorites in storage
  };

  if (!dua) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>{dua.title}</Text>
          <Text style={styles.headerIcon}>🤲</Text>
        </View>

        {/* Arabic Text */}
        <Card style={styles.arabicCard}>
          <Text style={styles.sectionLabel}>আরবি</Text>
          <Text style={styles.arabicText}>{dua.arabic}</Text>
        </Card>

        {/* Audio Player */}
        <AudioPlayer duaId={dua.id} duaTitle={dua.title} />

        {/* Transliteration */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>উচ্চারণ</Text>
          <Text style={styles.transliterationText}>{dua.transliteration}</Text>
        </Card>

        {/* Bangla Translation */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>বাংলা অনুবাদ</Text>
          <Text style={styles.translationText}>{dua.banglaTranslation}</Text>
        </Card>

        {/* Purpose */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>কখন পড়বেন</Text>
          <Text style={styles.purposeText}>{dua.purpose}</Text>
        </Card>

        {/* Benefits */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>উপকারিতা</Text>
          {dua.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>✓</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="শেয়ার করুন"
            onPress={() => {
              // TODO: Implement share functionality
              Alert.alert('শেয়ার', 'শেয়ার ফিচার শীঘ্রই আসছে');
            }}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerIcon: {
    fontSize: 48,
  },
  arabicCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  arabicText: {
    fontSize: typography.sizes.xxl,
    color: colors.text,
    textAlign: 'right',
    lineHeight: 40,
  },
  transliterationText: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  translationText: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    lineHeight: 28,
  },
  purposeText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  benefitBullet: {
    fontSize: typography.sizes.lg,
    color: colors.success,
    marginRight: spacing.sm,
    fontWeight: typography.weights.bold,
  },
  benefitText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default DuaDetailScreen;
