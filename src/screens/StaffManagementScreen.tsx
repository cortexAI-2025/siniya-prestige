import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Switch, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useRestaurantStore } from '../store/restaurantStore';
import { StaffMember, StaffRole } from '../types';

const ROLE_LABELS: Record<StaffRole, string> = {
  manager: 'مدير',
  chef: 'طاهي',
  server: 'نادل',
  cashier: 'أمين الصندوق',
  barista: 'باريستا',
  delivery: 'توصيل',
};

const ROLE_COLORS: Record<StaffRole, string> = {
  manager: '#7C3AED',
  chef: '#DC2626',
  server: '#0284C7',
  cashier: '#059669',
  barista: '#92400E',
  delivery: '#EA580C',
};

const ROLES: StaffRole[] = ['manager', 'chef', 'server', 'cashier', 'barista', 'delivery'];

const EMPTY_FORM = {
  name: '',
  nameAr: '',
  role: 'server' as StaffRole,
  phone: '',
};

export const StaffManagementScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { selectedRestaurant, staff, toggleStaffActive, addStaffMember } = useRestaurantStore();

  const restaurantStaff = staff.filter((s) => s.restaurantId === selectedRestaurant?.id);
  const activeCount = restaurantStaff.filter((s) => s.isActive).length;

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all');

  const filtered = restaurantStaff.filter(
    (s) => roleFilter === 'all' || s.role === roleFilter
  );

  const handleAdd = () => {
    if (!form.nameAr.trim() || !form.name.trim()) {
      Alert.alert('خطأ', 'يرجى تعبئة الاسم بالعربية والفرنسية');
      return;
    }
    addStaffMember({
      id: `staff_${Date.now()}`,
      restaurantId: selectedRestaurant!.id,
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      role: form.role,
      phone: form.phone.trim(),
      isActive: true,
      avatar: form.nameAr.trim().charAt(0),
      hireDate: new Date(),
    });
    setForm(EMPTY_FORM);
    setShowAddModal(false);
    Alert.alert('✅', 'تم إضافة الموظف بنجاح');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient colors={Gradients.emeraldHeader} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>إدارة الفريق</Text>
          <Text style={styles.headerSub}>{activeCount}/{restaurantStaff.length} موظف نشط</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn}>
          <Feather name="user-plus" size={18} color={Colors.textOnDark} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Role filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, roleFilter === 'all' && styles.filterChipActive]}
          onPress={() => setRoleFilter('all')}
        >
          <Text style={[styles.filterLabel, roleFilter === 'all' && styles.filterLabelActive]}>
            الكل ({restaurantStaff.length})
          </Text>
        </TouchableOpacity>
        {ROLES.map((role) => {
          const count = restaurantStaff.filter((s) => s.role === role).length;
          if (count === 0) return null;
          return (
            <TouchableOpacity
              key={role}
              style={[styles.filterChip, roleFilter === role && styles.filterChipActive]}
              onPress={() => setRoleFilter(role)}
            >
              <Text style={[styles.filterLabel, roleFilter === role && styles.filterLabelActive]}>
                {ROLE_LABELS[role]} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Staff list */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            onToggle={() => toggleStaffActive(member.id)}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👤</Text>
            <Text style={styles.emptyText}>لا يوجد موظفون في هذه الفئة</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Staff Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>إضافة موظف جديد</Text>

            <TextInput
              value={form.nameAr}
              onChangeText={(v) => setForm({ ...form, nameAr: v })}
              placeholder="الاسم بالعربية *"
              placeholderTextColor={Colors.textLight}
              style={styles.modalInput}
              textAlign="right"
            />
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              placeholder="Nom en Français *"
              placeholderTextColor={Colors.textLight}
              style={styles.modalInput}
            />
            <TextInput
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
              placeholder="رقم الهاتف"
              placeholderTextColor={Colors.textLight}
              style={styles.modalInput}
              textAlign="right"
              keyboardType="phone-pad"
            />

            {/* Role picker */}
            <Text style={styles.rolePickerLabel}>المنصب</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rolePicker}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleChip,
                    form.role === role && { backgroundColor: ROLE_COLORS[role] },
                  ]}
                  onPress={() => setForm({ ...form, role })}
                >
                  <Text style={[styles.roleChipText, form.role === role && { color: Colors.white }]}>
                    {ROLE_LABELS[role]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setShowAddModal(false); setForm(EMPTY_FORM); }}>
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleAdd}>
                <Text style={styles.modalConfirmText}>إضافة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StaffCard: React.FC<{ member: StaffMember; onToggle: () => void }> = ({ member, onToggle }) => (
  <View style={[styles.card, !member.isActive && styles.cardInactive]}>
    <View style={[styles.avatar, { backgroundColor: ROLE_COLORS[member.role] + '22' }]}>
      <Text style={[styles.avatarText, { color: ROLE_COLORS[member.role] }]}>
        {member.avatar}
      </Text>
    </View>

    <View style={styles.cardInfo}>
      <Text style={[styles.cardName, !member.isActive && styles.cardNameInactive]} numberOfLines={1}>
        {member.nameAr}
      </Text>
      <Text style={styles.cardNameFr} numberOfLines={1}>{member.name}</Text>
      <View style={styles.cardMeta}>
        <Text style={styles.cardPhone}>{member.phone}</Text>
        <View style={[styles.roleBadge, { backgroundColor: ROLE_COLORS[member.role] + '18' }]}>
          <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[member.role] }]}>
            {ROLE_LABELS[member.role]}
          </Text>
        </View>
      </View>
    </View>

    <Switch
      value={member.isActive}
      onValueChange={onToggle}
      trackColor={{ false: Colors.separator, true: Colors.emerald }}
      thumbColor={Colors.white}
      style={styles.cardSwitch}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.lg, color: Colors.textOnDark },
  headerSub: { fontFamily: Fonts.montserrat, fontSize: FontSizes.xs, color: 'rgba(253,250,246,0.7)' },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  filterScroll: { maxHeight: 48 },
  filterContent: { paddingHorizontal: Spacing.base, paddingBottom: 4, gap: Spacing.sm, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.separator,
  },
  filterChipActive: { backgroundColor: Colors.emerald, borderColor: Colors.emerald },
  filterLabel: { fontFamily: Fonts.montserratMedium, fontSize: FontSizes.xs, color: Colors.emerald },
  filterLabelActive: { color: Colors.white },
  list: { padding: Spacing.base, gap: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, borderWidth: 1, borderColor: Colors.separator,
  },
  cardInactive: { opacity: 0.55 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.lg },
  cardInfo: { flex: 1 },
  cardName: {
    fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm,
    color: Colors.emerald, textAlign: 'right',
  },
  cardNameInactive: { color: Colors.textLight },
  cardNameFr: {
    fontFamily: Fonts.montserrat, fontSize: FontSizes.xs,
    color: Colors.textLight, textAlign: 'right', marginTop: 1,
  },
  cardMeta: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  cardPhone: { fontFamily: Fonts.montserrat, fontSize: FontSizes.xs, color: Colors.textSecondary },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  roleBadgeText: { fontFamily: Fonts.montserratSemiBold, fontSize: 10 },
  cardSwitch: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyText: { fontFamily: Fonts.montserrat, fontSize: FontSizes.base, color: Colors.textLight },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: BorderRadius['2xl'], borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl, gap: Spacing.md,
  },
  modalTitle: {
    fontFamily: Fonts.montserratBold, fontSize: FontSizes.lg,
    color: Colors.emerald, textAlign: 'center', marginBottom: 4,
  },
  modalInput: {
    backgroundColor: Colors.silk, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontFamily: Fonts.montserrat, fontSize: FontSizes.base, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.separator,
  },
  rolePickerLabel: {
    fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm,
    color: Colors.textSecondary, textAlign: 'right',
  },
  rolePicker: { maxHeight: 44 },
  roleChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.silk, borderRadius: BorderRadius.full,
    marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.separator,
  },
  roleChipText: { fontFamily: Fonts.montserratMedium, fontSize: FontSizes.xs, color: Colors.textSecondary },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: 4 },
  modalCancel: {
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.separator, alignItems: 'center',
  },
  modalCancelText: { fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm, color: Colors.textSecondary },
  modalConfirm: {
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.emerald, alignItems: 'center',
  },
  modalConfirmText: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.sm, color: Colors.white },
});
