import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/filmService';
import { colors } from '../theme/colors';
import { Film } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { email, logout } = useAuth();
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const averageFavoriteRating =
    favorites.length > 0
      ? (favorites.reduce((sum, film) => sum + film.averageRating, 0) / favorites.length).toFixed(1)
      : '0.0';

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  async function loadFavorites(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const nextFavorites = await getFavorites();
      setFavorites(nextFavorites);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Favoriler alinamadi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    await logout();
  }

  function openFilmDetail(filmId: number) {
    navigation.navigate('FilmDetail', { filmId });
  }

  function renderHeader() {
    return (
      <View style={styles.headerBlock}>
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cikis</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>WEEK 7</Text>
          <Text style={styles.title}>Profilim</Text>
          <Text style={styles.subtitle}>
            Hesap ozeti ve favori listen burada dinamik olarak gosteriliyor.
          </Text>

          <View style={styles.accountCard}>
            <Text style={styles.accountLabel}>Giris yapilan hesap</Text>
            <Text style={styles.accountValue}>{email ?? 'Email bilgisi bulunamadi'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favori film</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{averageFavoriteRating}</Text>
              <Text style={styles.statLabel}>Ort. favori puani</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Favori Listem</Text>
          <Text style={styles.sectionBadge}>{favorites.length} kayit</Text>
        </View>
      </View>
    );
  }

  function renderFavoriteCard({ item }: ListRenderItemInfo<Film>) {
    return (
      <Pressable onPress={() => openFilmDetail(item.id)} style={styles.favoriteCard}>
        <Poster title={item.title} posterUrl={item.posterUrl} />

        <View style={styles.favoriteMeta}>
          <Text style={styles.favoriteTitle}>{item.title}</Text>
          <Text style={styles.favoriteGenres}>
            {item.genres.length > 0 ? item.genres.join(' | ') : 'Tur bilgisi yakinda'}
          </Text>
        </View>

        <View style={styles.ratingPill}>
          <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
        </View>
      </Pressable>
    );
  }

  function renderEmpty() {
    if (loading) {
      return (
        <View style={styles.stateCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateTitle}>Profil yukleniyor</Text>
          <Text style={styles.stateText}>Favori listen backend'den cekiliyor.</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Profil bilgisi alinamadi</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={() => loadFavorites()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Henuz favori film yok</Text>
        <Text style={styles.stateText}>
          Bu hafta profil sayfasini bagladik. Favorilere ekleme-cikarma akisini sonraki adimda
          tamamlayacagiz.
        </Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderFavoriteCard}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => loadFavorites(true)}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

type PosterProps = {
  title: string;
  posterUrl: string | null;
};

function Poster({ title, posterUrl }: PosterProps) {
  if (posterUrl) {
    return <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />;
  }

  return (
    <View style={[styles.poster, styles.posterFallback]}>
      <Text style={styles.posterLetter}>{title.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  headerBlock: {
    gap: 18,
    marginBottom: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  iconButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
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
    gap: 16,
    padding: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  accountCard: {
    gap: 6,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  accountLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  accountValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
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
    backgroundColor: 'rgba(255,255,255,0.04)',
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
    fontWeight: '700',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionBadge: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  poster: {
    width: 62,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#252B3B',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.16)',
  },
  posterLetter: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  favoriteMeta: {
    flex: 1,
    gap: 5,
  },
  favoriteTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  favoriteGenres: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  ratingPill: {
    minWidth: 58,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.16)',
  },
  ratingText: {
    color: colors.text,
    fontWeight: '800',
  },
  separator: {
    height: 12,
  },
  stateCard: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateText: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: colors.text,
    fontWeight: '800',
  },
});
