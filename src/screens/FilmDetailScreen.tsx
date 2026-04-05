import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { getFilmDetail } from '../services/filmService';
import { colors } from '../theme/colors';
import { FilmDetail } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'FilmDetail'>;

export function FilmDetailScreen({ navigation, route }: Props) {
  const [film, setFilm] = useState<FilmDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFilm();
  }, [route.params.filmId]);

  async function loadFilm() {
    try {
      setLoading(true);
      setError(null);
      const nextFilm = await getFilmDetail(route.params.filmId);
      setFilm(nextFilm);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Film detayi alinamadi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Geri</Text>
          </Pressable>

          {loading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.stateTitle}>Film detayi yukleniyor</Text>
            </View>
          ) : error ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Film detayi alinamadi</Text>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable onPress={loadFilm} style={styles.retryButton}>
                <Text style={styles.retryText}>Tekrar dene</Text>
              </Pressable>
            </View>
          ) : film ? (
            <View style={styles.detailCard}>
              {film.posterUrl ? (
                <Image source={{ uri: film.posterUrl }} style={styles.poster} resizeMode="cover" />
              ) : (
                <View style={[styles.poster, styles.posterFallback]}>
                  <Text style={styles.posterLetter}>{film.title.charAt(0).toUpperCase()}</Text>
                </View>
              )}

              <View style={styles.body}>
                <Text style={styles.title}>{film.title}</Text>

                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>Puan: {film.averageRating.toFixed(1)}</Text>
                </View>

                <Text style={styles.sectionLabel}>Turler</Text>
                <View style={styles.genreRow}>
                  {(film.genres.length > 0 ? film.genres : ['Tur bilgisi yok']).map((genre) => (
                    <View key={genre} style={styles.genreChip}>
                      <Text style={styles.genreChipText}>{genre}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Detay notu</Text>
                <Text style={styles.sectionText}>
                  Bu backend yapisinda ozet alani olmadigi icin bu ekranda afis, turler ve ortalama
                  puan gosteriliyor.
                </Text>

                <Text style={styles.sectionLabel}>Yorumlar</Text>
                {film.reviews.length > 0 ? (
                  <View style={styles.reviewList}>
                    {film.reviews.map((review) => (
                      <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewUser}>Kullanici #{review.userId}</Text>
                          <Text style={styles.reviewDate}>{formatReviewDate(review.createdAt)}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.sectionText}>Bu film icin henuz onayli yorum bulunmuyor.</Text>
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function formatReviewDate(value: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
    gap: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  backText: {
    color: colors.text,
    fontWeight: '800',
  },
  detailCard: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  poster: {
    width: '100%',
    height: 380,
    backgroundColor: '#1E2536',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.18)',
  },
  posterLetter: {
    color: colors.text,
    fontSize: 72,
    fontWeight: '900',
  },
  body: {
    padding: 20,
    gap: 14,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.16)',
  },
  ratingText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },
  sectionText: {
    color: colors.textMuted,
    lineHeight: 22,
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
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  genreChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  reviewList: {
    gap: 12,
  },
  reviewCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  reviewUser: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  reviewDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  reviewComment: {
    color: colors.text,
    lineHeight: 22,
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
