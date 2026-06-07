import { Platform } from 'react-native';

/**
 * Server URL. The Android emulator reaches the host machine via 10.0.2.2;
 * the iOS simulator can use localhost. For a physical device, set your LAN IP.
 */
export const SERVER_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
