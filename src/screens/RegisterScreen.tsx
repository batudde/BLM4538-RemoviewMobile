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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail.includes('@') || trimmedPassword.length < 3) {
      setError('Kayit icin gecerli bir email ve en az 3 karakterli sifre gerekli.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register({ email: trimmedEmail, password: trimmedPassword });
      navigation.navigate('Login', {
        registeredEmail: trimmedEmail,
        registeredMessage: 'Kayit basarili. Simdi giris yapabilirsin.',
      });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Kayit tamamlanamadi.');
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
              <Text style={styles.brand}>Yeni hesap</Text>
              <Text style={styles.lead}>Register ekranini once kuruyoruz; backend ayni `api/Auth/register` endpointiyle calisiyor.</Text>
            </View>

            <AuthCard
              eyebrow="JOIN REMOVIEW"
              title="Kayit ol"
              subtitle="Hafta 2 kapsaminda form, validasyon ve JWT tabanli oturum akisi icin gerekli ilk adim burada."
            >
              <FormInput
                label="Email"
                placeholder="email@ornek.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <FormInput
                label="Sifre"
                placeholder="En az 3 karakter"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton title="Kayit Ol" loading={loading} onPress={handleRegister} />

              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchText}>Zaten hesabim var. Giris ekranina don.</Text>
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
    fontSize: 40,
    fontWeight: '900',
  },
  lead: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 330,
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
