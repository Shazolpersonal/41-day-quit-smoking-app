/**
 * Quran Verses Screen
 * Displays relevant Quran verses with translations
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {quranVerses, QuranVerse} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import {Card} from '../components/common/Card';

type QuranVersesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuranVerses'
>;

const QuranVersesScreen: React.FC = () => {
  const navigation = useNavigation<QuranVersesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter options based on relevance
  const filters = [
    {id: 'all', label: 'সব আয়াত'},
    {id: 'patience', label: 'ধৈর্য'},
    {id: 'ease', label: 'সহজতা'},
    {id: 'gratitude', label: 'কৃতজ্ঞতা'},
    {id: 'strength', label: 'শক্তি'},
    {id: 'health', label: 'স্বাস্থ্য'},
  ];

  // Filter verses based on search and category
  const filteredVerses = useMemo(() => {
    let filtered = quranVerses;

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(verse =>
        verse.id.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        verse.relevance.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        verse.context.toLowerCase().includes(selectedFilter.toLowerCase()),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        verse =>
          verse.surah.toLowerCase().includes(query) ||
          verse.banglaTranslation.toLowerCase().includes(query) ||
          verse.context.toLowerCase().includes(query) ||
          verse.relevance.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedFilter]);

  const handleVersePress = (verse: QuranVerse) => {
    navigation.navigate('QuranVerseDetail', {verseId: verse.id});
  };

  const renderVerseItem = ({item}: {item: QuranVerse}) => (
    <TouchableOpacity
      onPress={() => handleVersePress(item)}
      activeOpacity={0.7}
      style={styles.verseItemContainer}>
      <Card style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <View style={styles.surahInfo}>
            <Text style={styles.surahName}>{item.surah}</Text>
            <Text style={styles.ayahNumber}>আয়াত {item.ayah}</Text>
          </View>
          <Text style={styles.verseIcon}>📖</Text>
        </View>
        
        <Text style={styles.arabicText} numberOfLines={3}>
          {item.arabic}
        </Text>
        
        <Text style={styles.translationText} numberOfLines={3}>
          {item.banglaTranslation}
        </Text>
        
        <View style={styles.contextContainer}>
          <Text style={styles.contextLabel}>প্রসঙ্গ:</Text>
          <Text style={styles.contextText}>{item.context}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>কোনো আয়াত পাওয়া যায়নি</Text>
      <Text style={styles.emptySubtext}>
        অন্য ফিল্টার বা সার্চ শব্দ চেষ্টা করুন
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>কুরআনের আয়াত</Text>
        <Text style={styles.headerSubtitle}>
          {filteredVerses.length}টি আয়াত পাওয়া গেছে
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="আয়াত খুঁজুন..."
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}>
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive,
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Verses List */}
      <FlatList
        data={filteredVerses}
        renderItem={renderVerseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.main,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
  },
  searchInput: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterContainer: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: colors.neutral.white,
  },
  listContent: {
    padding: spacing.lg,
  },
  verseItemContainer: {
    marginBottom: spacing.md,
  },
  verseCard: {
    padding: spacing.md,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  ayahNumber: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  verseIcon: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  arabicText: {
    fontSize: typography.fontSize.xl,
    color: colors.primary.main,
    textAlign: 'right',
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  translationText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  contextContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  contextLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    marginRight: spacing.xs,
  },
  contextText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default QuranVersesScreen;
