import React from 'react';
import { cn } from '../../utils/cn';

type Status = 'pending' | 'approved' | 'rejected' | 'suspended' |
              'in_stock' | 'low_stock' | 'out_of_stock' | 'ordered' |
              'collected' | 'distributed' | 'confirmed' | 'delivering' |
              'draft' | 'sent';

const STATUS_CONFIG: Record<Status, { label: string; className: string; dot: string }> = {
  pending:      { label: 'في الانتظار',    className: 'badge-yellow', dot: 'bg-amber-400' },
  approved:     { label: 'مقبول',          className: 'badge-green',  dot: 'bg-green-500' },
  rejected:     { label: 'مرفوض',          className: 'badge-red',    dot: 'bg-red-500' },
  suspended:    { label: 'معلق',           className: 'badge-red',    dot: 'bg-orange-500' },
  in_stock:     { label: 'متوفر',          className: 'badge-green',  dot: 'bg-green-500' },
  low_stock:    { label: 'مخزون منخفض',   className: 'badge-yellow', dot: 'bg-amber-400' },
  out_of_stock: { label: 'نفذ المخزون',   className: 'badge-red',    dot: 'bg-red-500' },
  ordered:      { label: 'طلب مرسل',      className: 'badge-emerald',dot: 'bg-emerald-400' },
  collected:    { label: 'محصّل',          className: 'badge-green',  dot: 'bg-green-500' },
  distributed:  { label: 'موزَّع',         className: 'badge-emerald',dot: 'bg-emerald' },
  confirmed:    { label: 'مؤكد',          className: 'badge-emerald',dot: 'bg-emerald' },
  delivering:   { label: 'قيد التوصيل',   className: 'badge-gold',   dot: 'bg-gold' },
  draft:        { label: 'مسودة',         className: 'badge-yellow', dot: 'bg-gray-400' },
  sent:         { label: 'مرسل',          className: 'badge-emerald',dot: 'bg-emerald-400' },
};

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={cn(config.className, 'inline-flex items-center gap-1.5')}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};
