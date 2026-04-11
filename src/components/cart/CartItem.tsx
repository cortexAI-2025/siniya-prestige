import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../../types';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatPrice } from '../../utils/formatters';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: item.menuItem.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.menuItem.nameAr}
        </Text>

        {/* Extras */}
        {item.selectedExtras.length > 0 && (
          <Text style={styles.extras} numberOfLines={1}>
            + {item.selectedExtras.map((e) => e.nameAr).join('، ')}
          </Text>
        )}

        {/* Price */}
        <Text style={styles.price}>{formatPrice(item.totalPrice)}</Text>
      </View>

      {/* Quantity controls */}
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Feather name="minus" size={14} color={Colors.emerald} />
        </TouchableOpacity>

        <Text style={styles.qty}>{item.quantity}</Text>

        <TouchableOpacity
          style={[styles.qtyBtn, styles.qtyBtnAdd]}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Feather name="plus" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Delete */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => removeItem(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="trash-2" size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
  },
  info: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
    textAlign: 'right',
  },
  extras: {
    fontFamily: Fonts.montserrat,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
  price: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.base,
    color: Colors.gold,
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  qtyBtnAdd: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  qty: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: 4,
  },
});
