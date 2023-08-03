import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import RegisterProfileScreen from '../screens/RegisterProfileScreen';
import TalkZoneScreen from '../screens/TalkZoneScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TalkZone"
        component={TalkZoneScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterProfile"
        component={RegisterProfileScreen}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  )
}

export default AppStack