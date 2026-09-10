import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/context/CartContext';
import { ShoppingCartScreen } from './src/screens/ShoppingCartScreen';
import { SecurePaymentScreen } from './src/screens/SecurePaymentScreen';

export type RootStackParamList = {
  ShoppingCart: undefined;
  SecurePayment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ShoppingCart"
          screenOptions={{
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: { fontWeight: 'bold' },
            headerTintColor: '#007AFF',
          }}
        >
          <Stack.Screen
            name="ShoppingCart"
            component={ShoppingCartScreen}
            options={{ title: 'Shopping Cart' }}
          />
          <Stack.Screen
            name="SecurePayment"
            component={SecurePaymentScreen}
            options={{ title: 'Secure Payment' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}