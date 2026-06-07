import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
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
import { addFavorite, getFavorites, removeFavorite } from '../services/filmService';
import {
  acceptFriendRequest,
  FriendRequest,
  FriendSearchResult,
  FriendUser,
  getFriendRequests,
  getFriends,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from '../services/friendService';
import { getProfile, updateProfile, UserProfile } from '../services/profileService';
import { colors } from '../theme/colors';
import { Film } from '../types/film';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { email, logout } = useAuth();
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [friendResults, setFriendResults] = useState<FriendSearchResult[]>([]);
  const [friendPanel, setFriendPanel] = useState<'search' | 'requests' | 'friends'>('search');
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendActionId, setFriendActionId] = useState<number | null>(null);
  const [friendMessage, setFriendMessage] = useState<string | null>(null);
  const username = profile?.username ?? getUsernameFromEmail(email);
  const averageFavoriteRating =
    favorites.length > 0
      ? (favorites.reduce((sum, film) => sum + film.averageRating, 0) / favorites.length).toFixed(1)
      : '0.0';

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadFavorites();
      loadFriends();
      loadFriendRequests();
    }, []),
  );

  async function loadProfile() {
    try {
      setProfileMessage(null);
      const nextProfile = await getProfile();
      setProfile(nextProfile);
      setDescriptionDraft(nextProfile.profileDescription ?? '');
    } catch (loadError) {
      setProfileMessage(loadError instanceof Error ? loadError.message : 'Profil bilgisi alınamadı.');
    }
  }

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
      setError(loadError instanceof Error ? loadError.message : 'Favoriler alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadFriends() {
    try {
      setFriends(await getFriends());
    } catch (loadError) {
      setFriendMessage(loadError instanceof Error ? loadError.message : 'Arkadaş listesi alınamadı.');
    }
  }

  async function loadFriendRequests() {
    try {
      setFriendRequests(await getFriendRequests());
    } catch (loadError) {
      setFriendMessage(loadError instanceof Error ? loadError.message : 'Arkadaş istekleri alınamadı.');
    }
  }

  async function handleLogout() {
    await logout();
  }

  async function handleSaveProfile() {
    try {
      setProfileSaving(true);
      setProfileMessage(null);
      const nextProfile = await updateProfile({
        profileDescription: descriptionDraft,
      });
      setProfile(nextProfile);
      setDescriptionDraft(nextProfile.profileDescription ?? '');
      setProfileMessage('Profil açıklaması kaydedildi.');
    } catch (saveError) {
      setProfileMessage(saveError instanceof Error ? saveError.message : 'Profil kaydedilemedi.');
    } finally {
      setProfileSaving(false);
    }
  }

  function openFilmDetail(filmId: number) {
    navigation.navigate('FilmDetail', { filmId });
  }

  function openPublicProfile(friendUsername: string) {
    navigation.navigate('PublicProfile', { username: friendUsername });
  }

  async function handleSearchFriends() {
    const query = friendSearch.trim();

    if (query.length < 2) {
      setFriendMessage('Arama için en az 2 karakter yaz.');
      setFriendResults([]);
      return;
    }

    try {
      setFriendLoading(true);
      setFriendMessage(null);
      setFriendPanel('search');
      setFriendResults(await searchUsers(query));
    } catch (searchError) {
      setFriendMessage(searchError instanceof Error ? searchError.message : 'Kullanıcı aranamadı.');
    } finally {
      setFriendLoading(false);
    }
  }

  async function handleSendFriendRequest(result: FriendSearchResult) {
    try {
      setFriendActionId(result.id);
      setFriendMessage(null);
      await sendFriendRequest(result.username);
      setFriendMessage(`${result.username} kullanıcısına istek gönderildi.`);
      setFriendResults((current) =>
        current.map((item) =>
          item.id === result.id ? { ...item, friendshipStatus: 'pending_sent' } : item,
        ),
      );
    } catch (requestError) {
      setFriendMessage(requestError instanceof Error ? requestError.message : 'İstek gönderilemedi.');
    } finally {
      setFriendActionId(null);
    }
  }

  async function handleRespondToRequest(requestId: number, action: 'accept' | 'reject') {
    try {
      setFriendActionId(requestId);
      setFriendMessage(null);

      if (action === 'accept') {
        await acceptFriendRequest(requestId);
        setFriendMessage('Arkadaş isteği kabul edildi.');
      } else {
        await rejectFriendRequest(requestId);
        setFriendMessage('Arkadaş isteği reddedildi.');
      }

      await loadFriendRequests();
      await loadFriends();
    } catch (requestError) {
      setFriendMessage(requestError instanceof Error ? requestError.message : 'İstek güncellenemedi.');
    } finally {
      setFriendActionId(null);
    }
  }

  async function toggleFavorite(filmId: number) {
    const isFavorite = favorites.some((favorite) => favorite.id === filmId);

    try {
      setFavoriteLoadingId(filmId);

      if (isFavorite) {
        await removeFavorite(filmId);
        setFavorites((current) => current.filter((favorite) => favorite.id !== filmId));
      } else {
        await addFavorite(filmId);
        await loadFavorites();
      }
    } finally {
      setFavoriteLoadingId(null);
    }
  }

  function renderFriendTools() {
    return (
      <View style={styles.friendCard}>
        <View style={styles.friendHeader}>
          <View>
            <Text style={styles.friendTitle}>Arkadaş Ekle</Text>
            <Text style={styles.friendHint}>Kullanıcı adıyla ara, istek gönder.</Text>
          </View>

          <Pressable
            onPress={() => setFriendPanel('requests')}
            style={[styles.friendTab, friendPanel === 'requests' ? styles.friendTabActive : null]}
          >
            <Text style={styles.friendTabText}>İstekler ({friendRequests.length})</Text>
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            value={friendSearch}
            onChangeText={setFriendSearch}
            placeholder="kullanıcıadı"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={styles.friendSearchInput}
            onSubmitEditing={handleSearchFriends}
          />
          <Pressable
            onPress={handleSearchFriends}
            disabled={friendLoading}
            style={[styles.searchButton, friendLoading ? styles.searchButtonDisabled : null]}
          >
            {friendLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.searchButtonText}>Ara</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.friendTabsRow}>
          <Pressable
            onPress={() => setFriendPanel('search')}
            style={[styles.friendTab, friendPanel === 'search' ? styles.friendTabActive : null]}
          >
            <Text style={styles.friendTabText}>Arama</Text>
          </Pressable>

          <Pressable
            onPress={() => setFriendPanel('friends')}
            style={[styles.friendTab, friendPanel === 'friends' ? styles.friendTabActive : null]}
          >
            <Text style={styles.friendTabText}>Arkadaşlar ({friends.length})</Text>
          </Pressable>
        </View>

        {friendMessage ? <Text style={styles.friendMessage}>{friendMessage}</Text> : null}
        {renderFriendPanel()}
      </View>
    );
  }

  function renderFriendPanel() {
    if (friendPanel === 'requests') {
      if (friendRequests.length === 0) {
        return <Text style={styles.friendEmpty}>Bekleyen arkadaş isteği yok.</Text>;
      }

      return (
        <View style={styles.friendList}>
          {friendRequests.map((request) => (
            <View key={request.id} style={styles.friendRow}>
              <Pressable onPress={() => openPublicProfile(request.user.username)} style={styles.friendInfo}>
                <Text style={styles.friendUsername}>{request.user.username}</Text>
                <Text style={styles.friendDescription} numberOfLines={2}>
                  {request.user.profileDescription || 'Profil açıklaması yok.'}
                </Text>
              </Pressable>

              <View style={styles.requestActions}>
                <Pressable
                  onPress={() => handleRespondToRequest(request.id, 'accept')}
                  disabled={friendActionId === request.id}
                  style={styles.acceptButton}
                >
                  <Text style={styles.requestActionText}>Onayla</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleRespondToRequest(request.id, 'reject')}
                  disabled={friendActionId === request.id}
                  style={styles.rejectButton}
                >
                  <Text style={styles.requestActionText}>Reddet</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (friendPanel === 'friends') {
      if (friends.length === 0) {
        return <Text style={styles.friendEmpty}>Arkadaş listen henüz boş.</Text>;
      }

      return (
        <View style={styles.friendList}>
          {friends.map((friend) => (
            <Pressable
              key={friend.id}
              onPress={() => openPublicProfile(friend.username)}
              style={styles.friendRow}
            >
              <View style={styles.friendInfo}>
                <Text style={styles.friendUsername}>{friend.username}</Text>
                <Text style={styles.friendDescription} numberOfLines={2}>
                  {friend.profileDescription || 'Profil açıklaması yok.'}
                </Text>
              </View>
              <Text style={styles.friendChevron}>{'>'}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (friendResults.length === 0) {
      return <Text style={styles.friendEmpty}>Kullanıcı aramak için yukarıdaki kutuyu kullan.</Text>;
    }

    return (
      <View style={styles.friendList}>
        {friendResults.map((result) => (
          <View key={result.id} style={styles.friendRow}>
            <Pressable onPress={() => openPublicProfile(result.username)} style={styles.friendInfo}>
              <Text style={styles.friendUsername}>{result.username}</Text>
              <Text style={styles.friendDescription} numberOfLines={2}>
                {result.profileDescription || getFriendshipStatusLabel(result.friendshipStatus)}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleSendFriendRequest(result)}
              disabled={result.friendshipStatus !== 'none' || friendActionId === result.id}
              style={[
                styles.addFriendButton,
                result.friendshipStatus !== 'none' ? styles.addFriendButtonDisabled : null,
              ]}
            >
              <Text style={styles.addFriendText}>{getFriendshipActionLabel(result.friendshipStatus)}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.headerBlock}>
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.title}>Profilim</Text>

          <View style={styles.accountCard}>
            <Text style={styles.accountLabel}>Kullanıcı adı</Text>
            <Text style={styles.accountValue}>{username || 'Kullanıcı bilgisi bulunamadı'}</Text>
          </View>

          <View style={styles.profileEditorCard}>
            <Text style={styles.accountLabel}>Profil açıklaması</Text>
            <TextInput
              value={descriptionDraft}
              onChangeText={setDescriptionDraft}
              placeholder="Örn: Bilim kurgu ve Nolan filmlerini seviyorum."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              style={styles.profileInput}
            />
            {profileMessage ? (
              <Text
                style={[
                  styles.profileMessage,
                  profileMessage.includes('kaydedildi') ? styles.profileMessageSuccess : null,
                ]}
              >
                {profileMessage}
              </Text>
            ) : null}
            <Pressable
              onPress={handleSaveProfile}
              disabled={profileSaving}
              style={[styles.saveProfileButton, profileSaving ? styles.saveProfileButtonDisabled : null]}
            >
              {profileSaving ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.saveProfileText}>Profili kaydet</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favori film</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{averageFavoriteRating}</Text>
              <Text style={styles.statLabel}>Ort. favori puanı</Text>
            </View>

            <Pressable
              onPress={() => setFriendPanel('friends')}
              style={({ pressed }) => [styles.statCard, pressed ? styles.statCardPressed : null]}
            >
              <Text style={styles.statValue}>{friends.length}</Text>
              <Text style={styles.statLabel}>Arkadaş</Text>
            </Pressable>
          </View>

          {renderFriendTools()}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Favori Listem</Text>
          <Text style={styles.sectionBadge}>{favorites.length} kayıt</Text>
        </View>
      </View>
    );
  }

  function renderFavoriteCard({ item }: ListRenderItemInfo<Film>) {
    const isFavorite = favorites.some((favorite) => favorite.id === item.id);
    const isFavoriteLoading = favoriteLoadingId === item.id;

    return (
      <View style={styles.favoriteCard}>
        <Pressable onPress={() => openFilmDetail(item.id)} style={styles.favoriteCardMain}>
          <Poster title={item.title} posterUrl={item.posterUrl} />

          <View style={styles.favoriteMeta}>
            <Text style={styles.favoriteTitle}>{item.title}</Text>
            <Text style={styles.favoriteGenres}>
              {item.genres.length > 0 ? item.genres.join(' | ') : 'Tür bilgisi yakında'}
            </Text>
          </View>
        </Pressable>

        <View style={styles.favoriteActions}>
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
          <Text style={styles.stateTitle}>Profil yükleniyor</Text>
          <Text style={styles.stateText}>Favori listen yükleniyor.</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Profil bilgisi alınamadı</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={() => loadFavorites()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Henüz favori film yok</Text>
      </View>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.safe}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={favorites}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderFavoriteCard}
            ListHeaderComponent={renderHeader()}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.content}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {
                  loadProfile();
                  loadFavorites(true);
                  loadFriends();
                  loadFriendRequests();
                }}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function getUsernameFromEmail(email: string | null) {
  if (!email) {
    return '';
  }

  const atIndex = email.indexOf('@');
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}

function getFriendshipStatusLabel(status: FriendSearchResult['friendshipStatus']) {
  if (status === 'friends') {
    return 'Zaten arkadas listenizde.';
  }

  if (status === 'pending_sent') {
    return 'İstek gönderildi, onay bekliyor.';
  }

  if (status === 'pending_received') {
    return 'Bu kullanıcıdan gelen istek var.';
  }

  return 'Profil açıklaması yok.';
}

function getFriendshipActionLabel(status: FriendSearchResult['friendshipStatus']) {
  if (status === 'friends') {
    return 'Arkadaş';
  }

  if (status === 'pending_sent') {
    return 'Bekliyor';
  }

  if (status === 'pending_received') {
    return 'Istek var';
  }

  return 'İstek gönder';
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
  profileEditorCard: {
    gap: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  profileInput: {
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  profileMessage: {
    color: colors.warning,
    fontSize: 12,
    lineHeight: 18,
  },
  profileMessageSuccess: {
    color: colors.success,
  },
  saveProfileButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  saveProfileButtonDisabled: {
    opacity: 0.72,
  },
  saveProfileText: {
    color: colors.text,
    fontWeight: '900',
  },
  friendCard: {
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  friendHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  friendTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  friendSearchInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    minWidth: 76,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  searchButtonDisabled: {
    opacity: 0.72,
  },
  searchButtonText: {
    color: colors.text,
    fontWeight: '900',
  },
  friendTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  friendTab: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  friendTabActive: {
    backgroundColor: 'rgba(56,189,248,0.16)',
    borderColor: 'rgba(56,189,248,0.42)',
  },
  friendTabText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  friendMessage: {
    color: colors.warning,
    fontSize: 12,
    lineHeight: 18,
  },
  friendEmpty: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  friendList: {
    gap: 10,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  friendInfo: {
    flex: 1,
    gap: 4,
  },
  friendUsername: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  friendDescription: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  addFriendButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  addFriendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  addFriendText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  requestActions: {
    gap: 8,
  },
  acceptButton: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  rejectButton: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(244,63,94,0.68)',
  },
  requestActionText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  friendChevron: {
    color: colors.accent,
    fontSize: 18,
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statCardPressed: {
    borderColor: 'rgba(56,189,248,0.56)',
    backgroundColor: 'rgba(56,189,248,0.12)',
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
  favoriteCardMain: {
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
  favoriteActions: {
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
});
