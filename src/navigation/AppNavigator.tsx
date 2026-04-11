import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { FranchiseDashboard } from '../screens/FranchiseDashboard';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoyaltyScreen } from '../screens/LoyaltyScreen';
import type { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FDFaf6' },
          presentation: 'card',
        }}
      >
        {/* Main bottom tabs */}
        <Stack.Screen name="Main" component={BottomTabNavigator} />

        {/* Checkout flow */}
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{ presentation: 'card', gestureEnabled: false }}
        />

        {/* Other screens */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Loyalty" component={LoyaltyScreen} />
        <Stack.Screen name="FranchiseDashboard" component={FranchiseDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
