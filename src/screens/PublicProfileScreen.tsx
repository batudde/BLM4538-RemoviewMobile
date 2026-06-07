import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { FriendUser, getPublicProfile } from '../services/friendService';
import { colors } from '../theme/colors';
import { Film } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PublicProfile'>;

export function PublicProfileScreen({ navigation, route }: Props) {
  const [profile, setProfile] = useState<FriendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [route.params.username]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);
      setProfile(await getPublicProfile(route.params.username));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Profil alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>

          <View style={styles.card}>
            {loading ? (
              <>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.stateText}>Profil yükleniyor...</Text>
              </>
            ) : error ? (
              <>
                <Text style={styles.title}>Profil alınamadı</Text>
                <Text style={styles.stateText}>{error}</Text>
                <Pressable onPress={loadProfile} style={styles.primaryButton}>
                  <Text style={styles.primaryText}>Tekrar dene</Text>
                </Pressable>
              </>
            ) : profile ? (
              <>
                <Text style={styles.eyebrow}>ARKADAS PROFILI</Text>
                <Text style={styles.title}>{profile.username}</Text>
                <Text style={styles.description}>
                  {profile.profileDescription?.trim() || 'Bu kullanıcı henüz profil açıklaması eklemedi.'}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{profile.friendCount}</Text>
                    <Text style={styles.statLabel}>Arkadaş</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{profile.favoriteCount}</Text>
                    <Text style={styles.statLabel}>Favori film</Text>
                  </View>
                </View>

                <View style={styles.favoritesSection}>
                  <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Favori Filmleri</Text>
                    <Text style={styles.sectionBadge}>{profile.favoriteFilms.length} film</Text>
                  </View>

                  {profile.favoriteFilms.length === 0 ? (
                    <Text style={styles.emptyText}>Bu kullanıcının favori filmi henüz yok.</Text>
                  ) : (
                    <View style={styles.favoriteList}>
                      {profile.favoriteFilms.map((film) => (
                        <Pressable
                          key={film.id}
                          onPress={() => navigation.navigate('FilmDetail', { filmId: film.id })}
                          style={styles.favoriteCard}
                        >
                          <Poster film={film} />
                          <View style={styles.favoriteMeta}>
                            <Text style={styles.favoriteTitle}>{film.title}</Text>
                            <Text style={styles.favoriteGenres} numberOfLines={2}>
                              {film.genres.length > 0 ? film.genres.join(' | ') : 'Tür bilgisi yok'}
                            </Text>
                          </View>
                          <View style={styles.ratingPill}>
                            <Text style={styles.ratingText}>{film.averageRating.toFixed(1)}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function Poster({ film }: { film: Film }) {
  if (film.posterUrl) {
    return <Image source={{ uri: film.posterUrl }} style={styles.poster} resizeMode="cover" />;
  }

  return (
    <View style={[styles.poster, styles.posterFallback]}>
      <Text style={styles.posterLetter}>{film.title.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  backText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  card: {
    gap: 18,
    padding: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(17,23,39,0.86)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  stateText: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  primaryButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.text,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    gap: 6,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  favoritesSection: {
    gap: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionBadge: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  favoriteList: {
    gap: 10,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  poster: {
    width: 52,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#252B3B',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.16)',
  },
  posterLetter: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  favoriteMeta: {
    flex: 1,
    gap: 5,
  },
  favoriteTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  favoriteGenres: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  ratingPill: {
    minWidth: 48,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.16)',
  },
  ratingText: {
    color: colors.text,
    fontWeight: '900',
  },
});
