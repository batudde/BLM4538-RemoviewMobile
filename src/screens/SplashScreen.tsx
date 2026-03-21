import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '../components/ScreenBackground';
import { colors } from '../theme/colors';

export function SplashScreen() {
  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RMV</Text>
          </View>
          <Text style={styles.title}>Remoview</Text>
          <Text style={styles.subtitle}>Filmleri kesfet, puanla ve yorumlarla birlikte aninda hatirla.</Text>
          <Text style={styles.caption}>Session kontrol ediliyor...</Text>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  badge: {
    width: 106,
    height: 106,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,63,94,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.42)',
    marginBottom: 24,
  },
  badgeText: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
  },
  caption: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 28,
  },
});
