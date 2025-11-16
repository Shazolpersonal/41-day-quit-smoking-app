/**
 * Dua List Screen
 * Displays a list of duas with search and filter functionality
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
import {duas, Dua} from '../data/islamicContent';
import {colors, spacing, typography} from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

type DuaListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DuaList'
>;

const DuaListScreen: React.FC = () => {
  const navigation = useNavigation<DuaListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories based on dua purposes
  const categories = [
    {id: 'all', label: 'সব দোয়া'},
    {id: 'craving', label: 'কঠিন সময়'},
    {id: 'gratitude', label: 'শুকরিয়া'},
    {id: 'strength', label: 'শক্তি'},
    {id: 'protection', label: 'রক্ষা'},
    {id: 'tawbah', label: 'তওবা'},
  ];

  // Filter duas based on search and category
  const filteredDuas = useMemo(() => {
    let filtered = duas;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dua =>
        dua.id.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        dua =>
          dua.title.toLowerCase().includes(query) ||
          dua.purpose.toLowerCase().includes(query) ||
          dua.banglaTranslation.toLowerCase().includes(query) ||
          dua.transliteration.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', {duaId: dua.id});
  };

  const renderDuaItem = ({item}: {item: Dua}) => (
    <TouchableOpacity
      onPress={() => handleDuaPress(item)}
      activeOpacity={0.7}
      style={styles.duaItemContainer}>
      <Card style={styles.duaCard}>
        <View style={styles.duaHeader}>
          <Text style={styles.duaTitle}>{item.title}</Text>
          <Text style={styles.duaIcon}>🤲</Text>
        </View>
        <Text style={styles.duaArabic} numberOfLines={2}>
          {item.arabic}
        </Text>
        <Text style={styles.duaPurpose} numberOfLines={2}>
          {item.purpose}
        </Text>
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsLabel}>
            উপকারিতা: {item.benefits.length}টি
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>কোনো দোয়া পাওয়া যায়নি</Text>
      <Text style={styles.emptySubtext}>
        অন্য ক্যাটাগরি বা সার্চ শব্দ চেষ্টা করুন
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>দোয়া সমূহ</Text>
        <Text style={styles.headerSubtitle}>
          {filteredDuas.length}টি দোয়া পাওয়া গেছে
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="দোয়া খুঁজুন..."
          placeholderTextColor={colors.textSecondary}
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

      {/* Dua List */}
      <FlatList
        data={filteredDuas}
        renderItem={renderDuaItem}
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  categoryContent: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
  },
  duaItemContainer: {
    marginBottom: spacing.md,
  },
  duaCard: {
    padding: spacing.md,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  duaTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  duaIcon: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  duaArabic: {
    fontSize: typography.sizes.xl,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  duaPurpose: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  benefitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  benefitsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.success,
    fontWeight: typography.weights.medium,
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
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default DuaListScreen;
