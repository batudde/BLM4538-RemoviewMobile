import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail.includes('@') || trimmedPassword.length < 3) {
      setError('Lutfen gecerli bir email ve en az 3 karakterli sifre gir.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email: trimmedEmail, password: trimmedPassword });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Giris yapilamadi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.safe}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.hero}>
              <Text style={styles.brand}>Remoview</Text>
              <Text style={styles.lead}>Film geceleri icin tek adres. Giris yap, listeni ac ve yorumlarini birak.</Text>
            </View>

            <AuthCard
              eyebrow="WELCOME BACK"
              title="Giris yap"
              subtitle="Gecen donemdeki akisin aynisi: email ve sifre ile oturum ac, JWT token saklansin."
            >
              <FormInput
                label="Email"
                placeholder="ornek@mail.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <FormInput
                label="Sifre"
                placeholder="********"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton title="Giris Yap" loading={loading} onPress={handleLogin} />

              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.switchText}>Hesabin yok mu? Kayit ekranina gec.</Text>
              </Pressable>
            </AuthCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  hero: {
    gap: 10,
    paddingHorizontal: 6,
  },
  brand: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
  },
  lead: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 320,
  },
  error: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 20,
  },
  switchText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
