/**
 * Quran Verse Detail Screen
 * Displays detailed information about a specific Quran verse
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
import {quranVerses, QuranVerse} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import {Card} from '../components/common/Card';
import {Button} from '../components/common/Button';

type QuranVerseDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'QuranVerseDetail'
>;

const QuranVerseDetailScreen: React.FC = () => {
  const route = useRoute<QuranVerseDetailScreenRouteProp>();
  const navigation = useNavigation();
  const {verseId} = route.params;

  const [verse, setVerse] = useState<QuranVerse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundVerse = quranVerses.find(v => v.id === verseId);
    if (foundVerse) {
      setVerse(foundVerse);
    } else {
      Alert.alert('ত্রুটি', 'আয়াত পাওয়া যায়নি');
      navigation.goBack();
    }
  }, [verseId, navigation]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to favorites in storage
  };

  if (!verse) {
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
          <Text style={styles.headerTitle}>{verse.surah}</Text>
          <Text style={styles.headerSubtitle}>আয়াত {verse.ayah}</Text>
          <Text style={styles.headerIcon}>📖</Text>
        </View>

        {/* Arabic Text */}
        <Card style={styles.arabicCard}>
          <Text style={styles.sectionLabel}>আরবি</Text>
          <Text style={styles.arabicText}>{verse.arabic}</Text>
        </Card>

        {/* Bangla Translation */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>বাংলা অনুবাদ</Text>
          <Text style={styles.translationText}>{verse.banglaTranslation}</Text>
        </Card>

        {/* Context */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>প্রসঙ্গ</Text>
          <Text style={styles.contextText}>{verse.context}</Text>
        </Card>

        {/* Relevance */}
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>প্রাসঙ্গিকতা</Text>
          <View style={styles.relevanceContainer}>
            <Text style={styles.relevanceIcon}>💡</Text>
            <Text style={styles.relevanceText}>{verse.relevance}</Text>
          </View>
        </Card>

        {/* Reflection Section */}
        <Card style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>চিন্তা করুন</Text>
          <Text style={styles.reflectionText}>
            এই আয়াতটি আপনার ধূমপান ত্যাগের যাত্রায় কীভাবে প্রযোজ্য? আল্লাহর এই
            বাণী থেকে আপনি কী শিক্ষা নিতে পারেন?
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
    fontSize: typography.fontSize.xxl,
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 40,
  },
  translationText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    lineHeight: 28,
  },
  contextText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
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
    backgroundColor: colors.accent.teal + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.teal,
  },
  reflectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.teal,
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

export default QuranVerseDetailScreen;
