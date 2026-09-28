import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AuthFlowProvider } from '@/components/auth-flow-context';
import { Palette } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthFlowProvider>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Palette.canvas },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="verify-contact" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="create-password" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="create-pin" />
          <Stack.Screen name="confirm-pin" />
          <Stack.Screen name="biometric-setup" />
          <Stack.Screen name="complete-profile" />
          <Stack.Screen name="personal-information" />
          <Stack.Screen name="date-of-birth-gender" />
          <Stack.Screen name="address-information" />
          <Stack.Screen name="identity-verification" />
          <Stack.Screen name="select-id-type" />
          <Stack.Screen name="upload-id" />
          <Stack.Screen name="selfie-verification" />
          <Stack.Screen name="verification-processing" />
          <Stack.Screen name="verification-successful" />
          <Stack.Screen name="verification-failed" />
          <Stack.Screen name="kyc-status" />
        </Stack>
      </AuthFlowProvider>
    </ThemeProvider>
  );
}
