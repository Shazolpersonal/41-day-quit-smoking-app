/**
 * Hadith Detail Screen
 * Displays detailed information about a specific hadith
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
import {hadithCollection, Hadith} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import {Card} from '../components/common/Card';
import {Button} from '../components/common/Button';

type HadithDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'HadithDetail'
>;

const HadithDetailScreen: React.FC = () => {
  const route = useRoute<HadithDetailScreenRouteProp>();
  const navigation = useNavigation();
  const {hadithId} = route.params;

  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundHadith = hadithCollection.find(h => h.id === hadithId);
    if (foundHadith) {
      setHadith(foundHadith);
    } else {
      Alert.alert('ত্রুটি', 'হাদীস পাওয়া যায়নি');
      navigation.goBack();
    }
  }, [hadithId, navigation]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to favorites in storage
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      health: 'স্বাস্থ্য',
      patience: 'ধৈর্য',
      determination: 'দৃঢ়তা',
      repentance: 'তওবা',
      gratitude: 'কৃতজ্ঞতা',
    };
    return labels[category] || category;
  };

  if (!hadith) {
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
          <Text style={styles.headerTitle}>{hadith.source}</Text>
          <Text style={styles.headerSubtitle}>{hadith.reference}</Text>
          <Text style={styles.headerIcon}>📜</Text>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {getCategoryLabel(hadith.category)}
            </Text>
          </View>
        </View>

        {/* Arabic Text */}
        <Card style={styles.arabicCard}>
          <Text style={styles.sectionLabel}>আরবি</Text>
          <Text style={styles.arabicText}>{hadith.arabic}</Text>
        </Card>

        {/* Bangla Translation */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>বাংলা অনুবাদ</Text>
          <Text style={styles.translationText}>{hadith.banglaTranslation}</Text>
        </Card>

        {/* Relevance */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>প্রাসঙ্গিকতা</Text>
          <View style={styles.relevanceContainer}>
            <Text style={styles.relevanceIcon}>💡</Text>
            <Text style={styles.relevanceText}>{hadith.relevance}</Text>
          </View>
        </Card>

        {/* Reflection Section */}
        <Card style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>চিন্তা করুন</Text>
          <Text style={styles.reflectionText}>
            এই হাদীসটি আপনার ধূমপান ত্যাগের যাত্রায় কীভাবে প্রযোজ্য? রাসূলুল্লাহ
            (সা.) এর এই শিক্ষা থেকে আপনি কী অনুপ্রেরণা পেতে পারেন?
          </Text>
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
    backgroundColor: colors.background.default,
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
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
  header: {
    backgroundColor: colors.primary.main,
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
    color: colors.neutral.white,
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
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  headerIcon: {
    fontSize: 48,
  },
  categoryBadgeContainer: {
    alignItems: 'center',
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  arabicCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  arabicText: {
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 36,
  },
  translationText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    lineHeight: 28,
  },
  relevanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  relevanceIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  relevanceText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
  reflectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.accent.purple + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.purple,
  },
  reflectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.purple,
    marginBottom: spacing.sm,
  },
  reflectionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default HadithDetailScreen;
