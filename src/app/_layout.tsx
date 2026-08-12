import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* This points directly to your index.tsx file */}
      <Stack.Screen name="index" options={{ title: 'NFC Tool' }} />
    </Stack>
  );
}