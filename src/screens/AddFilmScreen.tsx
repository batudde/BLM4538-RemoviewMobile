import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { createFilm } from '../services/filmService';
import { getGenres } from '../services/genreService';
import { colors } from '../theme/colors';
import { Genre } from '../types/genre';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddFilm'>;

export function AddFilmScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    loadGenres();
  }, []);

  async function loadGenres() {
    try {
      setLoadingGenres(true);
      setError(null);
      const nextGenres = await getGenres();
      setGenres(nextGenres);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Turler alinamadi.');
    } finally {
      setLoadingGenres(false);
    }
  }

  function toggleGenre(genreId: number) {
    setSelectedGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((item) => item !== genreId)
        : [...current, genreId],
    );
  }

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedPosterUrl = posterUrl.trim();

    if (trimmedTitle.length < 2) {
      setSubmitMessage('Film adi en az 2 karakter olmali.');
      return;
    }

    if (selectedGenreIds.length === 0) {
      setSubmitMessage('En az 1 tur secmelisin.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage(null);

      await createFilm({
        title: trimmedTitle,
        posterUrl: trimmedPosterUrl.length > 0 ? trimmedPosterUrl : null,
        genreIds: selectedGenreIds,
      });

      navigation.goBack();
    } catch (submitError) {
      setSubmitMessage(
        submitError instanceof Error ? submitError.message : 'Film eklenemedi.',
      );
    } finally {
      setSubmitting(false);
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
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
              </Pressable>
            </View>

            <View style={styles.hero}>
              <Text style={styles.title}>Film Ekle</Text>
              <Text style={styles.subtitle}>
                Gonderilen filmler once pending durumuna duser. Superadmin onayi gelince mobil listede gorunur.
              </Text>
            </View>

            <View style={styles.formCard}>
              <FormInput
                label="Film adi"
                placeholder="Orn: Inception"
                value={title}
                onChangeText={setTitle}
              />

              <FormInput
                label="Poster URL (opsiyonel)"
                placeholder="https://..."
                value={posterUrl}
                onChangeText={setPosterUrl}
                keyboardType="url"
              />

              <View style={styles.genreSection}>
                <Text style={styles.genreLabel}>Turler</Text>

                {loadingGenres ? (
                  <View style={styles.genreState}>
                    <ActivityIndicator color={colors.primary} />
                    <Text style={styles.genreStateText}>Turler yukleniyor</Text>
                  </View>
                ) : error ? (
                  <View style={styles.genreState}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable onPress={loadGenres} style={styles.retryChip}>
                      <Text style={styles.retryChipText}>Tekrar dene</Text>
                    </Pressable>
                  </View>
                ) : genres.length === 0 ? (
                  <View style={styles.genreState}>
                    <Text style={styles.genreStateText}>
                      Hic tur bulunamadi. Once backend tarafinda turlerin tanimli olmasi gerekiyor.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.genreWrap}>
                    {genres.map((genre) => {
                      const selected = selectedGenreIds.includes(genre.id);

                      return (
                        <Pressable
                          key={genre.id}
                          onPress={() => toggleGenre(genre.id)}
                          style={[styles.genreChip, selected ? styles.genreChipSelected : undefined]}
                        >
                          <Text
                            style={[
                              styles.genreChipText,
                              selected ? styles.genreChipTextSelected : undefined,
                            ]}
                          >
                            {genre.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              {submitMessage ? <Text style={styles.errorText}>{submitMessage}</Text> : null}

              <PrimaryButton title="+ Filmi ekle" loading={submitting} onPress={handleSubmit} />
            </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  topRow: {
    flexDirection: 'row',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  hero: {
    gap: 8,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  formCard: {
    gap: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  genreSection: {
    gap: 12,
  },
  genreLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  genreWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  genreChipSelected: {
    backgroundColor: 'rgba(244,63,94,0.18)',
    borderColor: 'rgba(244,63,94,0.45)',
  },
  genreChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  genreChipTextSelected: {
    color: colors.text,
  },
  genreState: {
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  genreStateText: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  retryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  retryChipText: {
    color: colors.text,
    fontWeight: '700',
  },
  errorText: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 20,
  },
});
