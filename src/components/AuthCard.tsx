import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type AuthCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle: string;
}>;

export function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: 'rgba(17,23,39,0.84)',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  eyebrow: {
    color: colors.accent,
    letterSpacing: 2.2,
    fontWeight: '800',
    fontSize: 11,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  body: {
    gap: 16,
    marginTop: 12,
  },
});
