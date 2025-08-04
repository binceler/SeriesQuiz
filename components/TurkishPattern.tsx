import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export function TurkishPattern() {
  return (
    <View style={styles.container}>
      <View style={styles.pattern}>
        {Array.from({ length: 20 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.patternElement,
              {
                left: (i % 4) * (width / 4),
                top: Math.floor(i / 4) * (height / 8),
                transform: [
                  { rotate: `${i * 18}deg` },
                  { scale: 0.8 + (i % 3) * 0.1 },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  pattern: {
    flex: 1,
  },
  patternElement: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#DAA520',
    borderStyle: 'dashed',
  },
});