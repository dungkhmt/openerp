/**
 * Learning Management System
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import configureStore from './redux-saga/store';
import {Provider} from 'react-redux';

import {navigationRef} from './navigation/Navigation.js';
import SplashScreen from './screens/SplashScreen';
import Tutorial from './screens/Tutorial';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DrawerNavigationRoutes from './screens/DrawerNavigationRoutes';

const Stack = createNativeStackNavigator();
const store = configureStore();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tutorial"
            component={Tutorial}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DrawerNavigationRoutes"
            component={DrawerNavigationRoutes}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
