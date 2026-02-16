import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { OrderDetailScreen } from '../screens/Orders/OrderDetailScreen';
import { OrderListScreen } from '../screens/Orders/OrderListScreen';
import { NavigationContainer } from '@react-navigation/native';
import MapTrackingScreen from '../screens/Orders/MapDetialScreen';
import CreateRequestScreen from '../screens/Orders/AddRequestScreen';

export type OrderStackParamlist = {
  OrderListScreen: undefined;
  MapTrackingScreen: undefined;
  OrderDetailScreen: undefined;
  AddRequestScreen: undefined;
};

const OrderStack = createNativeStackNavigator<OrderStackParamlist>();

export function OrderStackNavigator() {
  return (
    <NavigationContainer>
      <OrderStack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: '#2D9CDB',
          headerTitleStyle: {
            fontWeight: 'medium',
            fontSize: 16,
            fontFamily: 'Arial ',
          },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <OrderStack.Screen
          name="OrderListScreen"
          component={OrderListScreen}
          options={{ title: 'My ORDERS' }}
        />
        <OrderStack.Screen
          name="OrderDetailScreen"
          component={OrderDetailScreen}
          options={({ route }) => ({ title: 'Detail' })}
        />

        <OrderStack.Screen
          options={{
            header: () => null,
          }}
          name="MapTrackingScreen"
          component={MapTrackingScreen}
        />

        <OrderStack.Screen
          name="AddRequestScreen"
          component={CreateRequestScreen}
        />
      </OrderStack.Navigator>
    </NavigationContainer>
  );
}
