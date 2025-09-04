import * as React from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, LibreCaslonText_400Regular, LibreCaslonText_700Bold } 
  from '@expo-google-fonts/libre-caslon-text';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import PhotoScreen from './screens/PhotoScreen';
import LiveScreen from './screens/LiveScreen';
import ResultScreen from './screens/ResultScreen';
import { LogoTitle } from './components/LogoTitle';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    LibreCaslonText_400Regular,
    LibreCaslonText_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerTitle: () => <LogoTitle />, headerTitleAlign: 'center' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SignLensAI' }} />
        <Stack.Screen name="Photo" component={PhotoScreen} options={{ title: 'Photo' }} />
        <Stack.Screen name="Live" component={LiveScreen} options={{ title: 'Live' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Résultats' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
