import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ScreenBackground({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={['#06070D', '#101727', '#190A13']} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(244,63,94,0.18)', 'transparent']}
        start={{ x: 0.9, y: 0.1 }}
        end={{ x: 0.1, y: 0.8 }}
        style={styles.orbTop}
      />
      <LinearGradient
        colors={['rgba(56,189,248,0.14)', 'transparent']}
        start={{ x: 0.1, y: 0.3 }}
        end={{ x: 0.8, y: 0.9 }}
        style={styles.orbBottom}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#090B12',
  },
  orbTop: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
  },
  orbBottom: {
    position: 'absolute',
    bottom: -120,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
  },
});
