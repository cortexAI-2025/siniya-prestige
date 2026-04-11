import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChefCollection } from '../../types';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

interface ChefCollectionCardProps {
  collection: ChefCollection;
  onPress?: (collection: ChefCollection) => void;
  isSelected?: boolean;
}

const CARD_SIZE = 90;

export const ChefCollectionCard: React.FC<ChefCollectionCardProps> = ({
  collection,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(collection)}
      style={[styles.container, isSelected && styles.selected]}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: collection.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {isSelected && (
          <LinearGradient
            colors={['rgba(180,83,9,0.5)', 'rgba(180,83,9,0.2)']}
            style={styles.selectedOverlay}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

// Section header for chef collections
export const ChefCollectionsRow: React.FC<{
  collections: ChefCollection[];
  selectedId: string | null;
  onSelect: (collection: ChefCollection) => void;
  sectionLabel?: string;
  subLabel?: string;
}> = ({ collections, selectedId, onSelect, sectionLabel = 'مجموعات الشيف', subLabel = 'المصراف' }) => {
  return (
    <View style={styles.rowContainer}>
      {/* Header */}
      <View style={styles.rowHeader}>
        <Text style={styles.subLabel}>{subLabel}</Text>
        <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      </View>

      {/* Horizontal scroll */}
      <View style={styles.cardsRow}>
        {collections.map((col) => (
          <ChefCollectionCard
            key={col.id}
            collection={col}
            isSelected={selectedId === col.id}
            onPress={onSelect}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: CARD_SIZE,
    height: CARD_SIZE,
    ...Shadows.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.gold,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Section styles
  rowContainer: {
    marginBottom: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.textOnDark,
    textAlign: 'right',
  },
  subLabel: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: 'rgba(253, 250, 246, 0.6)',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
});
