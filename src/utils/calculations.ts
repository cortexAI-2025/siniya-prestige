// ─── Loyalty ─────────────────────────────────────────────────────────────────
// 10 DH = 1 loyalty point
export const LOYALTY_RATE = 10;
export const ZAKAT_RATE = 0.025; // 2.5%
export const FRANCHISE_FEE_RATE = 0.05; // 5%

export const calculateLoyaltyPoints = (amount: number): number => {
  return Math.floor(amount / LOYALTY_RATE);
};

export const pointsToValue = (points: number): number => {
  return points; // 1 point = 1 DH
};

// ─── Zakat El Maal ────────────────────────────────────────────────────────────
export const calculateZakat = (amount: number): number => {
  return parseFloat((amount * ZAKAT_RATE).toFixed(2));
};

// ─── Franchise Fee ────────────────────────────────────────────────────────────
export const calculateFranchiseFee = (netRevenue: number): number => {
  return parseFloat((netRevenue * FRANCHISE_FEE_RATE).toFixed(2));
};

// ─── Tip ─────────────────────────────────────────────────────────────────────
export const calculateTip = (subtotal: number, percentage: number): number => {
  return parseFloat((subtotal * (percentage / 100)).toFixed(2));
};

// ─── Order Total ─────────────────────────────────────────────────────────────
export const calculateOrderTotal = (subtotal: number, tip: number): number => {
  return subtotal + tip;
};

// ─── Loyalty Tier ─────────────────────────────────────────────────────────────
export const getLoyaltyTierInfo = (tier: string) => {
  const tiers = {
    bronze: {
      label: 'برونزي',
      labelEn: 'Bronze',
      color: '#CD7F32',
      minSpent: 0,
      maxSpent: 499,
      icon: '🥉',
    },
    silver: {
      label: 'فضي',
      labelEn: 'Silver',
      color: '#C0C0C0',
      minSpent: 500,
      maxSpent: 1999,
      icon: '🥈',
    },
    gold: {
      label: 'ذهبي',
      labelEn: 'Gold',
      color: '#B45309',
      minSpent: 2000,
      maxSpent: 4999,
      icon: '🥇',
    },
    platinum: {
      label: 'بلاتيني',
      labelEn: 'Platinum',
      color: '#E5E4E2',
      minSpent: 5000,
      maxSpent: Infinity,
      icon: '💎',
    },
  };
  return tiers[tier as keyof typeof tiers] || tiers.bronze;
};

// ─── Distance ─────────────────────────────────────────────────────────────────
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
