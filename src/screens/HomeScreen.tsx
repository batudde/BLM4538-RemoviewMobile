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
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { useAuth } from '../context/AuthContext';
import { addFavorite, getFavorites, getFilms, removeFavorite } from '../services/filmService';
import { colors } from '../theme/colors';
import { Film } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ratingFilters = [
  { label: 'Tum puanlar', value: 0 },
  { label: '4.5+', value: 4.5 },
  { label: '4.0+', value: 4 },
  { label: '3.0+', value: 3 },
];

const sortOptions = [
  { label: 'Varsayilan', value: 'default' },
  { label: 'Puan azalan', value: 'ratingDesc' },
  { label: 'Puan artan', value: 'ratingAsc' },
  { label: 'Yorum azalan', value: 'reviewDesc' },
  { label: 'Yorum artan', value: 'reviewAsc' },
] as const;

type FilterMenu = 'genre' | 'rating' | 'sort' | null;
type SortValue = (typeof sortOptions)[number]['value'];

export function HomeScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const [films, setFilms] = useState<Film[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tum');
  const [minimumRating, setMinimumRating] = useState(0);
  const [sortValue, setSortValue] = useState<SortValue>('default');
  const [openFilterMenu, setOpenFilterMenu] = useState<FilterMenu>(null);

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
      const [nextFilms, favorites] = await Promise.all([getFilms(), getFavorites()]);
      setFilms(nextFilms);
      setFavoriteIds(favorites.map((favorite) => favorite.id));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Filmler alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const featuredFilm = films.find((film) => film.posterUrl) ?? films[0] ?? null;
  const availableGenres = Array.from(new Set(films.flatMap((film) => film.genres))).sort((a, b) =>
    a.localeCompare(b),
  );
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');
  const filteredFilms = films.filter((film) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      film.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery) ||
      film.genres.some((genre) => genre.toLocaleLowerCase('tr-TR').includes(normalizedQuery));
    const matchesGenre = selectedGenre === 'Tum' || film.genres.includes(selectedGenre);
    const matchesRating = film.averageRating >= minimumRating;

    return matchesSearch && matchesGenre && matchesRating;
  });
  const visibleFilms = [...filteredFilms].sort((first, second) => {
    if (sortValue === 'ratingDesc') {
      return second.averageRating - first.averageRating;
    }

    if (sortValue === 'ratingAsc') {
      return first.averageRating - second.averageRating;
    }

    if (sortValue === 'reviewDesc') {
      return second.reviewCount - first.reviewCount;
    }

    if (sortValue === 'reviewAsc') {
      return first.reviewCount - second.reviewCount;
    }

    return 0;
  });
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedGenre !== 'Tum' ||
    minimumRating > 0 ||
    sortValue !== 'default';
  const visibleFeaturedFilm =
    visibleFilms.find((film) => film.posterUrl) ?? visibleFilms[0] ?? featuredFilm;
  const selectedRatingLabel =
    ratingFilters.find((filter) => filter.value === minimumRating)?.label ?? 'Tum puanlar';
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortValue)?.label ?? 'Varsayilan';

  function openFilmDetail(filmId: number) {
    navigation.navigate('FilmDetail', { filmId });
  }

  function openAddFilm() {
    navigation.navigate('AddFilm');
  }

  function openProfile() {
    navigation.navigate('Profile');
  }

  function clearFilters() {
    setSearchQuery('');
    setSelectedGenre('Tum');
    setMinimumRating(0);
    setSortValue('default');
    setOpenFilterMenu(null);
  }

  function toggleFilterMenu(menu: Exclude<FilterMenu, null>) {
    setOpenFilterMenu((current) => (current === menu ? null : menu));
  }

  async function toggleFavorite(filmId: number) {
    const isFavorite = favoriteIds.includes(filmId);

    try {
      setFavoriteLoadingId(filmId);

      if (isFavorite) {
        await removeFavorite(filmId);
        setFavoriteIds((current) => current.filter((id) => id !== filmId));
      } else {
        await addFavorite(filmId);
        setFavoriteIds((current) => [...current, filmId]);
      }
    } catch {
      // Home ekraninda sessiz kalsin; detay ekranda daha acik geri bildirim var.
    } finally {
      setFavoriteLoadingId(null);
    }
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
            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Çıkış</Text>
            </Pressable>
            <Pressable onPress={openProfile} style={styles.iconButton}>
              <Text style={styles.iconButtonText}>P</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>Ara</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Film adi veya tur ara"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.trim().length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchText}>x</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filterPanel}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtreler</Text>
            {hasActiveFilters ? (
              <Pressable onPress={clearFilters} style={styles.clearFiltersButton}>
                <Text style={styles.clearFiltersText}>Temizle</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.filterButtons}>
            <Pressable onPress={() => toggleFilterMenu('genre')} style={styles.filterButton}>
              <Text style={styles.filterButtonLabel}>Tür</Text>
              <Text style={styles.filterButtonValue}>{selectedGenre}</Text>
            </Pressable>

            <Pressable onPress={() => toggleFilterMenu('rating')} style={styles.filterButton}>
              <Text style={styles.filterButtonLabel}>Puan</Text>
              <Text style={styles.filterButtonValue}>{selectedRatingLabel}</Text>
            </Pressable>

            <Pressable onPress={() => toggleFilterMenu('sort')} style={styles.filterButton}>
              <Text style={styles.filterButtonLabel}>Sirala</Text>
              <Text style={styles.filterButtonValue}>{selectedSortLabel}</Text>
            </Pressable>
          </View>

          {openFilterMenu === 'genre' ? (
            <View style={styles.optionList}>
              {['Tum', ...availableGenres].map((genre) => (
                <Pressable
                  key={genre}
                  onPress={() => {
                    setSelectedGenre(genre);
                    setOpenFilterMenu(null);
                  }}
                  style={[
                    styles.optionRow,
                    selectedGenre === genre ? styles.optionRowActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedGenre === genre ? styles.optionTextActive : null,
                    ]}
                  >
                    {genre}
                  </Text>
                  {selectedGenre === genre ? <Text style={styles.optionCheck}>Secili</Text> : null}
                </Pressable>
              ))}
            </View>
          ) : null}

          {openFilterMenu === 'rating' ? (
            <View style={styles.optionList}>
              {ratingFilters.map((filter) => (
                <Pressable
                  key={filter.label}
                  onPress={() => {
                    setMinimumRating(filter.value);
                    setOpenFilterMenu(null);
                  }}
                  style={[
                    styles.optionRow,
                    minimumRating === filter.value ? styles.optionRowActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      minimumRating === filter.value ? styles.optionTextActive : null,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  {minimumRating === filter.value ? (
                    <Text style={styles.optionCheck}>Secili</Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}

          {openFilterMenu === 'sort' ? (
            <View style={styles.optionList}>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setSortValue(option.value);
                    setOpenFilterMenu(null);
                  }}
                  style={[
                    styles.optionRow,
                    sortValue === option.value ? styles.optionRowActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortValue === option.value ? styles.optionTextActive : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortValue === option.value ? <Text style={styles.optionCheck}>Secili</Text> : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {visibleFeaturedFilm ? (
          <Pressable onPress={() => openFilmDetail(visibleFeaturedFilm.id)} style={styles.featuredCard}>
            {visibleFeaturedFilm.posterUrl ? (
              <Image
                source={{ uri: visibleFeaturedFilm.posterUrl }}
                style={styles.featuredPoster}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.featuredPoster, styles.featuredPosterFallback]}>
                <Text style={styles.featuredPosterLetter}>
                  {visibleFeaturedFilm.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.featuredOverlay} />

            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>

              <View style={styles.featuredBottom}>
                <Text style={styles.featuredTitle}>{visibleFeaturedFilm.title}</Text>

                <View style={styles.featuredMetaRow}>
                  <Text style={styles.featuredRating}>
                    Puan {visibleFeaturedFilm.averageRating.toFixed(1)}
                  </Text>
                  <Text style={styles.featuredArrow}>{'>'}</Text>
                </View>

                <View style={styles.genreRow}>
                  {(visibleFeaturedFilm.genres.length > 0
                    ? visibleFeaturedFilm.genres.slice(0, 3)
                    : ['Tür yok']
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
          <Text style={styles.sectionBadge}>
            {visibleFilms.length}/{films.length} film
          </Text>
        </View>
      </View>
    );
  }

  function renderFilmCard({ item }: ListRenderItemInfo<Film>) {
    const isFavorite = favoriteIds.includes(item.id);
    const isFavoriteLoading = favoriteLoadingId === item.id;

    return (
      <View style={styles.movieCard}>
        <Pressable onPress={() => openFilmDetail(item.id)} style={styles.movieCardMain}>
          <Poster title={item.title} posterUrl={item.posterUrl} />

          <View style={styles.movieMeta}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieGenres}>
              {item.genres.length > 0 ? item.genres.join(' | ') : 'Tür bilgisi yakında'}
            </Text>
          </View>
        </Pressable>

        <View style={styles.movieActions}>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            disabled={isFavoriteLoading}
            style={[styles.favoriteChip, isFavorite ? styles.favoriteChipActive : null]}
          >
            <Text style={styles.favoriteChipText}>{isFavorite ? '♥' : '♡'}</Text>
          </Pressable>

          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderEmpty() {
    if (loading) {
      return (
        <View style={styles.stateCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateTitle}>Filmler yükleniyor</Text>
          <Text style={styles.stateText}>Backend'den onayli film listesi getiriliyor.</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Film listesi alınamadı</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={() => loadFilms()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </Pressable>
        </View>
      );
    }

    if (hasActiveFilters) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Filtreye uygun film yok</Text>
          <Text style={styles.stateText}>
            Arama metnini, tur secimini veya puan filtresini degistirerek tekrar deneyebilirsin.
          </Text>
          <Pressable onPress={clearFilters} style={styles.retryButton}>
            <Text style={styles.retryText}>Filtreleri temizle</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Henüz onaylı film yok</Text>
        <Text style={styles.stateText}>
          Backend sadece onaylı filmleri döndürdüğü için liste şu an boş olabilir.
        </Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={visibleFilms}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderFilmCard}
          ListHeaderComponent={renderHeader()}
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
    minHeight: 54,
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
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 12,
  },
  clearSearchButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  clearSearchText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  filterPanel: {
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(17,23,39,0.72)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(244,63,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.32)',
  },
  clearFiltersText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexGrow: 1,
    flexBasis: '31%',
    minWidth: 96,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  filterButtonLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  filterButtonValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  optionList: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  optionRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  optionRowActive: {
    backgroundColor: 'rgba(56,189,248,0.13)',
  },
  optionText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  optionTextActive: {
    color: colors.text,
  },
  optionCheck: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
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
  movieCardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  movieActions: {
    alignItems: 'center',
    gap: 10,
  },
  favoriteChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  favoriteChipActive: {
    backgroundColor: 'rgba(244,63,94,0.18)',
    borderColor: 'rgba(244,63,94,0.44)',
  },
  favoriteChipText: {
    color: colors.primaryStrong,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 18,
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
