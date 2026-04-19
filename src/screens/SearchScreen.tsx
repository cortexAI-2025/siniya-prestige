import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MenuItem } from '../types';
import { Colors } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { menuService } from '../services/menuService';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { useNavigation } from '@react-navigation/native';

const POPULAR_SEARCHES = [
  'كالجين', 'تريدوس', 'نيمستيلا', 'برغر بلدي', 'فريطوس', 'معرقة', 'سينيا'
];

export const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const items = await menuService.searchMenuItems(searchQuery);
      setResults(items);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  // Pair results for 2-column grid
  const pairedResults: MenuItem[][] = [];
  for (let i = 0; i < results.length; i += 2) {
    pairedResults.push([results[i], results[i + 1]]);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => handleSearch(query)}>
          <Feather name="search" size={20} color={Colors.emerald} />
        </TouchableOpacity>
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text.length > 1) handleSearch(text);
            if (!text) { setResults([]); setHasSearched(false); }
          }}
          placeholder="ابحث عن طبق..."
          placeholderTextColor={Colors.textLight}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(query)}
          textAlign="right"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false); }}>
            <Feather name="x" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!hasSearched && (
          <>
            <Text style={styles.sectionTitle}>البحث الشائع</Text>
            <View style={styles.tagsRow}>
              {POPULAR_SEARCHES.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.tag}
                  onPress={() => handleQuickSearch(term)}
                >
                  <Text style={styles.tagText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {isLoading && <ActivityIndicator color={Colors.emerald} style={{ marginTop: 40 }} />}

        {hasSearched && !isLoading && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>لا توجد نتائج</Text>
            <Text style={styles.emptyText}>جرب كلمات بحث مختلفة</Text>
          </View>
        )}

        {results.length > 0 && (
          <>
            <Text style={styles.resultsCount}>{results.length} نتيجة</Text>
            <View style={styles.gridContainer}>
              {pairedResults.map((pair, i) => (
                <View key={i} style={styles.gridRow}>
                  <MenuItemCard
                    item={pair[0]}
                    onPress={(item) => navigation.navigate('ProductDetail', { itemId: item.id })}
                  />
                  {pair[1] ? (
                    <MenuItemCard
                      item={pair[1]}
                      onPress={(item) => navigation.navigate('ProductDetail', { itemId: item.id })}
                    />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    margin: Spacing.base,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.emerald,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    padding: 0,
  },
  content: { paddingHorizontal: Spacing.base },
  sectionTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
    marginBottom: Spacing.lg,
  },
  tag: {
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  tagText: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
  },
  resultsCount: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  gridContainer: {},
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: 0,
  },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.xl,
    color: Colors.emerald,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
});
