import { StyleSheet, Text, View } from 'react-native';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const featuredMovies = [
  { title: 'Interstellar', tag: 'Sci-Fi', rating: '4.8' },
  { title: 'Whiplash', tag: 'Drama', rating: '4.7' },
  { title: 'The Dark Knight', tag: 'Action', rating: '4.9' },
];

export function HomeScreen() {
  const { email, logout } = useAuth();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Remoview</Text>
              <Text style={styles.subtitle}>Kesfet | Puanla | Yorum yap</Text>
            </View>
            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Cikis</Text>
            </Pressable>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>HOME PREVIEW</Text>
            <Text style={styles.heroTitle}>Merhaba{email ? `, ${email}` : ''}</Text>
            <Text style={styles.heroText}>
              Hafta 1 icin home tasarimi hazir. Hafta 2 sonunda kullanici JWT ile giris yaptiginda dogrudan bu ekrana dusuyor.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>One cikan filmler</Text>

          {featuredMovies.map((movie) => (
            <View key={movie.title} style={styles.movieCard}>
              <View style={styles.posterStub}>
                <Text style={styles.posterLetter}>{movie.title.charAt(0)}</Text>
              </View>
              <View style={styles.movieMeta}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <Text style={styles.movieTag}>{movie.tag}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>{movie.rating}</Text>
              </View>
            </View>
          ))}

          <View style={styles.todoCard}>
            <Text style={styles.todoTitle}>Siradaki sprint</Text>
            <Text style={styles.todoText}>Film listesi, detay, yorumlar, favoriler ve profil ekranini burada eski projeye sadik kalarak tamamlayacagiz.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  logoutText: {
    color: colors.text,
    fontWeight: '700',
  },
  heroCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 10,
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  heroText: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  posterStub: {
    width: 58,
    height: 78,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.16)',
  },
  posterLetter: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  movieMeta: {
    flex: 1,
    gap: 4,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  movieTag: {
    color: colors.textMuted,
    fontSize: 13,
  },
  ratingPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.16)',
  },
  ratingText: {
    color: colors.text,
    fontWeight: '800',
  },
  todoCard: {
    marginTop: 8,
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  todoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  todoText: {
    color: colors.textMuted,
    lineHeight: 22,
  },
});
