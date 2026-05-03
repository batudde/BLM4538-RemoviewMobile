import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
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
import { getFilms } from '../services/filmService';
import { colors } from '../theme/colors';
import { Film } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFilms();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFilms();
    }, []),
  );

  async function loadFilms(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const nextFilms = await getFilms();
      setFilms(nextFilms);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Filmler alinamadi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const featuredFilm = films.find((film) => film.posterUrl) ?? films[0] ?? null;

  function openFilmDetail(filmId: number) {
    navigation.navigate('FilmDetail', { filmId });
  }

  function openAddFilm() {
    navigation.navigate('AddFilm');
  }

  function renderHeader() {
    return (
      <View style={styles.headerBlock}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Remoview</Text>
            <Text style={styles.subtitle}>Kesfet | Puanla | Yorum yap</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={openAddFilm} style={styles.iconButton}>
              <Text style={styles.iconButtonText}>+</Text>
            </Pressable>
            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Cikis</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={openAddFilm} style={styles.searchBar}>
          <Text style={styles.searchIcon}>+</Text>
          <Text style={styles.searchPlaceholder}>Film eklemek icin dokun</Text>
          <View style={styles.searchAddBadge}>
            <Text style={styles.searchAddBadgeText}>Yeni</Text>
          </View>
        </Pressable>

        {featuredFilm ? (
          <Pressable onPress={() => openFilmDetail(featuredFilm.id)} style={styles.featuredCard}>
            {featuredFilm.posterUrl ? (
              <Image
                source={{ uri: featuredFilm.posterUrl }}
                style={styles.featuredPoster}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.featuredPoster, styles.featuredPosterFallback]}>
                <Text style={styles.featuredPosterLetter}>
                  {featuredFilm.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.featuredOverlay} />

            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>

              <View style={styles.featuredBottom}>
                <Text style={styles.featuredTitle}>{featuredFilm.title}</Text>

                <View style={styles.featuredMetaRow}>
                  <Text style={styles.featuredRating}>
                    Puan {featuredFilm.averageRating.toFixed(1)}
                  </Text>
                  <Text style={styles.featuredArrow}>{'>'}</Text>
                </View>

                <View style={styles.genreRow}>
                  {(featuredFilm.genres.length > 0
                    ? featuredFilm.genres.slice(0, 3)
                    : ['Tur yok']
                  ).map((genre) => (
                    <View key={genre} style={styles.genreChip}>
                      <Text style={styles.genreChipText}>{genre}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Pressable>
        ) : (
          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>WEEK 4</Text>
            <Text style={styles.heroTitle}>Featured movie yakinda</Text>
            <Text style={styles.heroText}>
              Film listesi geldigi anda burada one cikan film gorunecek.
            </Text>
          </View>
        )}

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Film Listesi</Text>
          <Text style={styles.sectionBadge}>{films.length} film</Text>
        </View>
      </View>
    );
  }

  function renderFilmCard({ item }: ListRenderItemInfo<Film>) {
    return (
      <Pressable onPress={() => openFilmDetail(item.id)} style={styles.movieCard}>
        <Poster title={item.title} posterUrl={item.posterUrl} />

        <View style={styles.movieMeta}>
          <Text style={styles.movieTitle}>{item.title}</Text>
          <Text style={styles.movieGenres}>
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
          <Text style={styles.stateTitle}>Filmler yukleniyor</Text>
          <Text style={styles.stateText}>Backend'den onayli film listesi getiriliyor.</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Film listesi alinamadi</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={() => loadFilms()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Henuz onayli film yok</Text>
        <Text style={styles.stateText}>
          Backend sadece approved durumundaki filmleri dondurdugu icin liste su an bos olabilir.
        </Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={films}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderFilmCard}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => loadFilms(true)}
            />
          }
          showsVerticalScrollIndicator={false}
        />
        <Pressable onPress={openAddFilm} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCopy: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
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
    fontSize: 24,
    lineHeight: 24,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  searchIcon: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '800',
  },
  searchPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
  },
  searchAddBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(244,63,94,0.18)',
  },
  searchAddBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
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
  featuredCard: {
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: '#151A28',
  },
  featuredPoster: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  featuredPosterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.18)',
  },
  featuredPosterLetter: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '900',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(115,96,178,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  featuredBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  featuredBottom: {
    gap: 10,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredRating: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  featuredArrow: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  genreChipText: {
    color: colors.text,
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
  movieMeta: {
    flex: 1,
    gap: 5,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  movieGenres: {
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
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 26,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.34,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  fabText: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '700',
  },
});
