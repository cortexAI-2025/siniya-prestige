import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useRestaurantStore } from '../store/restaurantStore';
import { WeekDay, DaySchedule } from '../types';

const DAY_LABELS: Record<WeekDay, string> = {
  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  sunday: 'الأحد',
};

const WEEK_ORDER: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const RestaurantSettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { selectedRestaurant, restaurantHours, updateRestaurantHours, updateRestaurantInfo } = useRestaurantStore();

  const hours = restaurantHours?.schedule ?? {} as Record<WeekDay, DaySchedule>;

  const [draftHours, setDraftHours] = useState<Record<WeekDay, DaySchedule>>(
    WEEK_ORDER.reduce((acc, day) => {
      acc[day] = hours[day] ?? { isOpen: true, openTime: '09:00', closeTime: '23:00' };
      return acc;
    }, {} as Record<WeekDay, DaySchedule>)
  );

  const [phone, setPhone] = useState(selectedRestaurant?.phone ?? '');
  const [description, setDescription] = useState(selectedRestaurant?.openingHours ?? '');
  const [editingHours, setEditingHours] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: WeekDay) => {
    setDraftHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const setTime = (day: WeekDay, field: 'openTime' | 'closeTime', value: string) => {
    setDraftHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = () => {
    updateRestaurantHours(selectedRestaurant!.id, draftHours);
    updateRestaurantInfo(selectedRestaurant!.id, { phone, openingHours: description });
    setEditingHours(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    Alert.alert('✅', 'تم حفظ الإعدادات بنجاح');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient colors={Gradients.emeraldHeader} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>إعدادات المطعم</Text>
          <Text style={styles.headerSub}>{selectedRestaurant?.nameAr}</Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>حفظ</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات التواصل</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>رقم الهاتف</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.fieldInput}
              textAlign="right"
              placeholder="+212 6XX XXX XXX"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>وصف أوقات العمل</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.fieldInput, styles.fieldInputMulti]}
              textAlign="right"
              multiline
              numberOfLines={2}
              placeholder="مثال: يومياً 9 ص – 11 م"
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </View>

        {/* Opening Hours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity
              onPress={() => setEditingHours(!editingHours)}
              style={styles.editToggleBtn}
            >
              <Feather name={editingHours ? 'check' : 'edit-2'} size={14} color={Colors.emerald} />
              <Text style={styles.editToggleText}>{editingHours ? 'معاينة' : 'تعديل'}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>أوقات العمل الأسبوعية</Text>
          </View>

          {WEEK_ORDER.map((day) => {
            const s = draftHours[day];
            return (
              <View key={day} style={[styles.dayRow, !s.isOpen && styles.dayRowClosed]}>
                <View style={styles.dayTimes}>
                  {editingHours && s.isOpen ? (
                    <View style={styles.timeInputs}>
                      <TextInput
                        value={s.closeTime}
                        onChangeText={(v) => setTime(day, 'closeTime', v)}
                        style={styles.timeInput}
                        placeholder="23:00"
                        placeholderTextColor={Colors.textLight}
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                      />
                      <Text style={styles.timeSep}>–</Text>
                      <TextInput
                        value={s.openTime}
                        onChangeText={(v) => setTime(day, 'openTime', v)}
                        style={styles.timeInput}
                        placeholder="09:00"
                        placeholderTextColor={Colors.textLight}
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                      />
                    </View>
                  ) : (
                    <Text style={[styles.timeText, !s.isOpen && styles.timeTextClosed]}>
                      {s.isOpen ? `${s.openTime} – ${s.closeTime}` : 'مغلق'}
                    </Text>
                  )}
                </View>

                <View style={styles.dayLeft}>
                  {editingHours && (
                    <Switch
                      value={s.isOpen}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{ false: Colors.separator, true: Colors.emerald }}
                      thumbColor={Colors.white}
                      style={styles.daySwitch}
                    />
                  )}
                  <Text style={[styles.dayLabel, !s.isOpen && styles.dayLabelClosed]}>
                    {DAY_LABELS[day]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {saved && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedText}>✅ تم الحفظ بنجاح</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

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
  saveBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BorderRadius.md,
  },
  saveBtnText: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.sm, color: Colors.textOnDark },
  content: { padding: Spacing.base, gap: Spacing.lg },
  section: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.xl,
    padding: Spacing.base, gap: Spacing.md,
    ...Shadows.card, borderWidth: 1, borderColor: Colors.separator,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontFamily: Fonts.montserratBold, fontSize: FontSizes.base,
    color: Colors.emerald, textAlign: 'right',
  },
  editToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: Colors.overlayLight, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.separator,
  },
  editToggleText: { fontFamily: Fonts.montserratMedium, fontSize: FontSizes.xs, color: Colors.emerald },
  field: { gap: 6 },
  fieldLabel: {
    fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm,
    color: Colors.textSecondary, textAlign: 'right',
  },
  fieldInput: {
    backgroundColor: Colors.silk, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontFamily: Fonts.montserrat, fontSize: FontSizes.base, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.separator,
  },
  fieldInputMulti: { minHeight: 60, textAlignVertical: 'top' },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.separator,
  },
  dayRowClosed: { opacity: 0.5 },
  dayLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dayLabel: {
    fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm,
    color: Colors.emerald, minWidth: 70, textAlign: 'right',
  },
  dayLabelClosed: { color: Colors.textLight },
  daySwitch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  dayTimes: { flex: 1, alignItems: 'flex-start' },
  timeText: {
    fontFamily: Fonts.montserrat, fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  timeTextClosed: { color: Colors.textLight, fontStyle: 'italic' },
  timeInputs: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeInput: {
    borderBottomWidth: 1, borderBottomColor: Colors.emerald,
    fontFamily: Fonts.montserrat, fontSize: FontSizes.sm, color: Colors.textPrimary,
    width: 52, textAlign: 'center', paddingVertical: 2,
  },
  timeSep: { color: Colors.textLight, fontSize: FontSizes.sm },
  savedBanner: {
    backgroundColor: '#D1FAE5', borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  savedText: { fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm, color: '#065F46' },
});
