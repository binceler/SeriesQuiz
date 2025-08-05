import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
const { width, height } = Dimensions.get('window');
export function FallingLeaves() {
  const leafEmojis = ['🍂', '🍃', '🍁', '🌿'];
  const leaves = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      emoji: leafEmojis[i % leafEmojis.length],
    }))
  ).current;
  useEffect(() => {
    const animateLeaves = () => {
      leaves.forEach((leaf, index) => {
        const duration = 8000 + Math.random() * 4000;
        const delay = index * 1000;
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(leaf.y, {
                toValue: height + 50,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(leaf.x, {
                toValue: Math.random() * width,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(leaf.rotation, {
                toValue: 360,
                duration,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(leaf.y, {
              toValue: -50,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };
    animateLeaves();
  }, []);
  return (
    <View style={styles.container}>
      {leaves.map((leaf) => (
        <Animated.View
          key={leaf.id}
          style={[
            styles.leaf,
            {
              transform: [
                { translateX: leaf.x },
                { translateY: leaf.y },
                { rotate: leaf.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
                { scale: leaf.scale },
              ],
            },
          ]}
        >
          <Text style={styles.leafEmoji}>
            {leaf.emoji}
          </Text>
        </Animated.View>
      ))}
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
    pointerEvents: 'none',
  },
  leaf: {
    position: 'absolute',
  },
  leafEmoji: {
    fontSize: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});