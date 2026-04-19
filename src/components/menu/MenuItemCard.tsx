import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../../types';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatPrice } from '../../utils/formatters';
import { useCartStore } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.base * 2 - Spacing.sm) / 2;

interface MenuItemCardProps {
  item: MenuItem;
  onPress?: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const user = useUserStore((s) => s.user);

  const cartCount = getItemCount(item.id);
  const isFavorite = user?.favoriteItems.includes(item.id) ?? false;

  const handleAddToCart = () => {
    addItem(item, 1);
  };

  const handleFavorite = () => {
    toggleFavorite(item.id);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(item)}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          onError={() => setImageError(true)}
        />

        {/* Gradient overlay on image */}
        <LinearGradient
          colors={['transparent', 'rgba(2,44,34,0.15)']}
          style={styles.imageOverlay}
        />

        {/* Favorite button */}
        <TouchableOpacity style={styles.favoriteBtn} onPress={handleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#EF4444' : Colors.white}
          />
        </TouchableOpacity>

        {/* Rating chip */}
        <View style={styles.ratingChip}>
          <AntDesign name="star" size={10} color={Colors.goldShimmer} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        {/* Cart count bubble */}
        {cartCount > 0 && (
          <View style={styles.cartCountBubble}>
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        {/* Name */}
        <Text style={styles.nameAr} numberOfLines={2}>
          {item.nameAr}
        </Text>

        {/* Description */}
        {item.descriptionAr ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.descriptionAr}
          </Text>
        ) : null}

        {/* Price row */}
        <View style={styles.priceRow}>
          <View style={styles.mimaLogo}>
            <Text style={styles.mimaText}>SINIYA</Text>
            <Text style={styles.mimaSub}>PRESTIGE</Text>
          </View>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>

        {/* Add to cart button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.8}>
          <Feather name="shopping-bag" size={14} color={Colors.emerald} />
          <Text style={styles.addButtonText}>أصف إلى الحفية</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(2, 44, 34, 0.06)',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.85,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingChip: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 44, 34, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.montserratSemiBold,
  },
  cartCountBubble: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.gold,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  cartCountText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: Fonts.montserratBold,
  },
  infoContainer: {
    padding: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  nameAr: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
    textAlign: 'right',
    lineHeight: 20,
  },
  description: {
    fontFamily: Fonts.montserrat,
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
    lineHeight: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  mimaLogo: {
    alignItems: 'flex-start',
  },
  mimaText: {
    fontFamily: Fonts.cinzel,
    fontSize: 12,
    color: Colors.emerald,
    letterSpacing: 1,
  },
  mimaSub: {
    fontFamily: Fonts.montserrat,
    fontSize: 6,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: -2,
  },
  price: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.overlayLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs + 2,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(2, 44, 34, 0.12)',
  },
  addButtonText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: 11,
    color: Colors.emerald,
  },
});
