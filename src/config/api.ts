import { Platform } from 'react-native';

const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:5183',
  ios: 'http://localhost:5183',
  default: 'http://localhost:5183',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultBaseUrl;
