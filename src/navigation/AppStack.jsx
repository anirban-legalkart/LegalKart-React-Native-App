import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import RegisterProfileScreen from '../screens/RegisterProfileScreen';
import TalkZone from '../screens/TalkZone/MainScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileMain from '../screens/Profile/ProfileMain';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


{/* Add Drawer.Navigation to a function.*/ }
function Root() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileMain} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}


const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={Root}  
        options={{ headerShown: false }} />  
        {/*  Call function as Stack.Screen(component={Root}  )  ,  This will disable function header(headerShown: false)*/}

      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      /> */}

      <Stack.Screen
        name="TalkZoneMain"
        component={TalkZone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterProfile"
        component={RegisterProfileScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  )
}

export default AppStack