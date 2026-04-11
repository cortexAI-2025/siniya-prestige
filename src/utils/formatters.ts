// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatPrice = (amount: number): string => {
  return `${amount} MAD`;
};

export const formatPriceAr = (amount: number): string => {
  return `${amount} درهم`;
};

// ─── Date / Time ──────────────────────────────────────────────────────────────
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ar-MA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return 'الآن';
  if (diff < 60) return `منذ ${diff} دقيقة`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return formatDate(date);
};

// ─── Order Status ─────────────────────────────────────────────────────────────
export const translateOrderStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    preparing: 'قيد التحضير',
    ready: 'جاهز',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  };
  return statuses[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    preparing: '#8B5CF6',
    ready: '#10B981',
    delivered: '#022C22',
    cancelled: '#EF4444',
  };
  return colors[status] || '#6B7280';
};

// ─── Number Formatting ────────────────────────────────────────────────────────
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatOrderNumber = (id: string): string => {
  return `#${id.slice(-4).toUpperCase()}`;
};
