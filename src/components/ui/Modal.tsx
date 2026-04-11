import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  position?: 'center' | 'bottom';
  maxHeight?: number;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  position = 'bottom',
  maxHeight = SCREEN_HEIGHT * 0.85,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={position === 'bottom' ? 'slide' : 'fade'}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                position === 'bottom' && styles.bottomSheet,
                position === 'center' && styles.centerModal,
                { maxHeight },
              ]}
            >
              {/* Handle bar for bottom sheet */}
              {position === 'bottom' && <View style={styles.handle} />}

              {/* Header */}
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  {title ? (
                    <Text style={styles.title}>{title}</Text>
                  ) : (
                    <View />
                  )}
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <AntDesign name="close" size={20} color={Colors.emerald} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.silk,
    overflow: 'hidden',
  },
  bottomSheet: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingBottom: Spacing.xl,
    ...Shadows.cardHover,
  },
  centerModal: {
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.xl,
    alignSelf: 'center',
    width: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.separator,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.montserratBold,
    color: Colors.emerald,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
