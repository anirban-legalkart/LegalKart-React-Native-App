/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React , { createContext, useContext, useState } from 'react';
// import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import AuthStack from './src/navigation/AuthStack';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import AppStack from './src/navigation/AppStack';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';


// const FakeContext = createContext();

// const FakeProvider = (props) => {
//   const [event, setEvent] = useState({ text: "Hello!", name: "molly" });

//   return (
//     <FakeContext.Provider value={event}>{props.children}</FakeContext.Provider>
//   );
// };

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // const { test } = useContext(AuthContext)
  // const storedEvents = useContext(FakeContext);
  // const test  = useContext(AuthContext);
  const [event, setEvent] = useState({ text: "Hello!", name: "molly" });
  
  
  return (
    <>
      {/* <SafeAreaView style={backgroundStyle}> */}
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
        />
      <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header />
      <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
            <ReloadInstructions />
            </Section>
            <Section title="Debug">
            <DebugInstructions />
            </Section>
            <Section title="Learn More">
            Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
        </View>
      </ScrollView> */}
      {/* <Text style={{}}>App.tsx</Text> */}
      {/* </SafeAreaView> */}

      <Provider store={store}>

      <NativeBaseProvider>
      <AuthProvider >
      {/* <AuthContext.Provider value={event}  > */}
        {/* <NavigationContainer> */}
        {/* {
          userToken !== null ? <AppStack /> : <AuthStack />
        } */}
        <AppNav/>
        {/* </NavigationContainer> */}
        {/* <Text>{storedEvents}</Text> */}
      {/* </AuthContext.Provider> */}
      </AuthProvider>
      </NativeBaseProvider>
      </Provider>

    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
