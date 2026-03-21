import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'remoview.auth.token';
const EMAIL_KEY = 'remoview.auth.email';

export async function saveSession(token: string, email: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(EMAIL_KEY, email);
}

export async function getSession() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const email = await AsyncStorage.getItem(EMAIL_KEY);

  return {
    token: token ?? null,
    email: email ?? null,
  };
}

export async function clearSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(EMAIL_KEY);
}
