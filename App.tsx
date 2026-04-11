import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, I18nManager, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';
import { Fonts } from './src/constants/theme';

// Enable RTL for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        [Fonts.cinzel]: require('./assets/fonts/Cinzel-Regular.ttf'),
        [Fonts.cinzelBold]: require('./assets/fonts/Cinzel-Bold.ttf'),
        [Fonts.cinzelSemiBold]: require('./assets/fonts/Cinzel-SemiBold.ttf'),
        [Fonts.montserrat]: require('./assets/fonts/Montserrat-Regular.ttf'),
        [Fonts.montserratBold]: require('./assets/fonts/Montserrat-Bold.ttf'),
        [Fonts.montserratSemiBold]: require('./assets/fonts/Montserrat-SemiBold.ttf'),
        [Fonts.montserratMedium]: require('./assets/fonts/Montserrat-Medium.ttf'),
        [Fonts.montserratLight]: require('./assets/fonts/Montserrat-Light.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.warn('Font loading error:', error);
      // Continue without custom fonts (fallback to system fonts)
      setFontError(true);
      setFontsLoaded(true);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>سينيا بريستيج</Text>
        <Text style={styles.splashSub}>Siniya Prestige</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.emerald} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  splashLogo: {
    fontSize: 32,
    color: '#F59E0B',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  splashSub: {
    fontSize: 14,
    color: 'rgba(253, 250, 246, 0.7)',
    letterSpacing: 4,
  },
});
