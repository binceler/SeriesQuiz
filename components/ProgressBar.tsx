import React from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  style?: ViewStyle;
}

export function ProgressBar({ current, total, style }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>
      <View style={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < current && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: {
    height: '100%',
    backgroundColor: '#DAA520',
    borderRadius: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
  activeDot: {
    backgroundColor: '#DAA520',
  },
});