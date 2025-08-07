import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
interface SplashScreenProps {
  onAnimationComplete: () => void;
}
export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const leafAnims = useRef(
    Array.from({ length: 15 }, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(Math.random() * width),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;
  useEffect(() => {
    leafAnims.forEach((leaf, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(leaf.opacity, {
            toValue: 0.8,
            duration: 1000,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(leaf.translateY, {
              toValue: height + 100,
              duration: 4000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(leaf.rotate, {
              toValue: 360 * (2 + Math.random() * 2),
              duration: 4000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(leaf.translateX, {
                toValue: Math.random() * width * 0.3,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(leaf.translateX, {
                toValue: Math.random() * width * 0.7,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(leaf.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  const Leaf = ({ index }: { index: number }) => {
    const leaf = leafAnims[index];
    const leafTypes = ['🍂', '🍃', '🍁'];
    const leafType = leafTypes[index % leafTypes.length];
    return (
      <Animated.Text
        style={[
          styles.leaf,
          {
            transform: [
              { translateX: leaf.translateX },
              { translateY: leaf.translateY },
              { 
                rotate: leaf.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })
              },
            ],
            opacity: leaf.opacity,
          },
        ]}
      >
        {leafType}
      </Animated.Text>
    );
  };
  return (
    <LinearGradient
      colors={['#5D4037', '#8B4513', '#A0522D']}
      style={styles.container}
    >
      {/* Falling leaves */}
      {leafAnims.map((_, index) => (
        <Leaf key={index} index={index} />
      ))}
      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>🍂</Text>
        <Text style={styles.appName}>Yaprak Dökümü</Text>
        <Text style={styles.subtitle}>Quiz Uygulaması</Text>
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.loadingDot} />
          <Animated.View style={[styles.loadingDot, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.loadingDot, { opacity: scaleAnim }]} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaf: {
    position: 'absolute',
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    padding: 40,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 80,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    opacity: 0.6,
  },
});
