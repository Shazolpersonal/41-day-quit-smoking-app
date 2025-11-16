/**
 * Hadith List Screen
 * Displays hadith related to health and perseverance
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
import {hadithCollection, Hadith} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import {Card} from '../components/common/Card';

type HadithListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HadithList'
>;

const HadithListScreen: React.FC = () => {
  const navigation = useNavigation<HadithListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories
  const categories = [
    {id: 'all', label: 'সব হাদীস'},
    {id: 'health', label: 'স্বাস্থ্য'},
    {id: 'patience', label: 'ধৈর্য'},
    {id: 'determination', label: 'দৃঢ়তা'},
    {id: 'repentance', label: 'তওবা'},
    {id: 'gratitude', label: 'কৃতজ্ঞতা'},
  ];

  // Filter hadith based on search and category
  const filteredHadith = useMemo(() => {
    let filtered = hadithCollection;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        hadith => hadith.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        hadith =>
          hadith.banglaTranslation.toLowerCase().includes(query) ||
          hadith.source.toLowerCase().includes(query) ||
          hadith.relevance.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleHadithPress = (hadith: Hadith) => {
    navigation.navigate('HadithDetail', {hadithId: hadith.id});
  };

  const renderHadithItem = ({item}: {item: Hadith}) => (
    <TouchableOpacity
      onPress={() => handleHadithPress(item)}
      activeOpacity={0.7}
      style={styles.hadithItemContainer}>
      <Card style={styles.hadithCard}>
        <View style={styles.hadithHeader}>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceName}>{item.source}</Text>
            <Text style={styles.referenceText}>{item.reference}</Text>
          </View>
          <Text style={styles.hadithIcon}>📜</Text>
        </View>

        <Text style={styles.arabicText} numberOfLines={3}>
          {item.arabic}
        </Text>

        <Text style={styles.translationText} numberOfLines={3}>
          {item.banglaTranslation}
        </Text>

        <View style={styles.relevanceContainer}>
          <Text style={styles.relevanceLabel}>প্রাসঙ্গিকতা:</Text>
          <Text style={styles.relevanceText} numberOfLines={2}>
            {item.relevance}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>কোনো হাদীস পাওয়া যায়নি</Text>
      <Text style={styles.emptySubtext}>
        অন্য ক্যাটাগরি বা সার্চ শব্দ চেষ্টা করুন
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>হাদীস সমূহ</Text>
        <Text style={styles.headerSubtitle}>
          {filteredHadith.length}টি হাদীস পাওয়া গেছে
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="হাদীস খুঁজুন..."
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}>
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id &&
                  styles.categoryButtonTextActive,
              ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hadith List */}
      <FlatList
        data={filteredHadith}
        renderItem={renderHadithItem}
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
  categoryContainer: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
  },
  categoryContent: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  categoryButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  categoryButtonTextActive: {
    color: colors.neutral.white,
  },
  listContent: {
    padding: spacing.lg,
  },
  hadithItemContainer: {
    marginBottom: spacing.md,
  },
  hadithCard: {
    padding: spacing.md,
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  referenceText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  hadithIcon: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  arabicText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary.main,
    textAlign: 'right',
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  translationText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  relevanceContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  relevanceLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    marginRight: spacing.xs,
  },
  relevanceText: {
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

export default HadithListScreen;
