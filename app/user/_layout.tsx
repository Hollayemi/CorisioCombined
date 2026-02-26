import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { UserDataProvider } from '@/context/userContext';
import { store } from '@/redux/user/store';
import { Provider } from 'react-redux';


function UserLayout() {

  return (
    <View className="flex-1">
      <Provider store={store}>
        <UserDataProvider>
          <Stack>
            <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name="earn/index" options={{ headerShown: false }} />
            <Stack.Screen name="store/index" options={{ headerShown: false }} />
            <Stack.Screen name="earn/help" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="order" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="map" options={{ headerShown: false }} />
            <Stack.Screen name="broken" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </UserDataProvider>
      </Provider>
    </View>
  );
}

export default UserLayout