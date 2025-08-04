import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');
export default function ResultsScreen() {
  const { score, total } = useLocalSearchParams();
  const scoreNum = parseInt(score as string) || 0;
  const totalNum = parseInt(total as string) || 1;
  const percentage = Math.round((scoreNum / totalNum) * 100);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scoreAnim, {
        toValue: percentage,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);
  const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        title: "Mükemmel! 🎉",
        message: "Yaprak Dökümü'nün gerçek bir hayranısın!",
        emoji: "🏆",
        color: "#FFD700"
      };
    } else if (percentage >= 60) {
      return {
        title: "İyi! 👍",
        message: "Diziyi oldukça iyi biliyorsun!",
        emoji: "🌟",
        color: "#4CAF50"
      };
    } else if (percentage >= 40) {
      return {
        title: "Fena değil! 🙂",
        message: "Biraz daha dikkatli izlemen gerekiyor.",
        emoji: "📖",
        color: "#FF9800"
      };
    } else {
      return {
        title: "Tekrar izle! 📺",
        message: "Yaprak Dökümü'nü tekrar izleme zamanı!",
        emoji: "🔄",
        color: "#F44336"
      };
    }
  };
  const result = getResultMessage();
  const restartQuiz = () => {
    router.replace('/');
  };
  const CelebrationLeaves = () => {
    const leaves = ['🍀', '🍃', '🍂', '🍁'];
    return (
      <View style={styles.celebrationContainer}>
        {[...Array(8)].map((_, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.celebrationLeaf,
              {
                left: `${(index * 12.5)}%`,
                opacity: celebrationAnim,
                transform: [
                  {
                    translateY: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                  {
                    rotate: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {leaves[index % leaves.length]}
          </Animated.Text>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.gradient}
      >
        {/* Celebration leaves for high scores */}
        {percentage >= 60 && <CelebrationLeaves />}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Quiz Tamamlandı!</Text>
          {/* Main score circle */}
          <View style={styles.scoreCircle}>
            <LinearGradient
              colors={[result.color, `${result.color}80`]}
              style={styles.scoreCircleGradient}
            >
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{scoreNum}</Text>
                <Text style={styles.totalText}>/ {totalNum}</Text>
              </View>
              <Text style={styles.percentage}>{percentage}%</Text>
            </LinearGradient>
          </View>
          {/* Result message */}
          <View style={[styles.resultContainer, { borderColor: result.color }]}>
            <Text style={styles.resultEmoji}>{result.emoji}</Text>
            <Text style={styles.resultTitle}>{result.title}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
          </View>
          {/* Performance breakdown */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Doğru Cevaplar</Text>
              <Text style={styles.statValue}>{scoreNum}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Yanlış Cevaplar</Text>
              <Text style={styles.statValue}>{totalNum - scoreNum}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Başarı Oranı</Text>
              <Text style={[styles.statValue, { color: result.color }]}>{percentage}%</Text>
            </View>
          </View>
          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.restartButton} 
              onPress={restartQuiz}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD700', '#FFC107']}
                style={styles.buttonGradient}
              >
                <Text style={styles.restartButtonText}>🔄 Tekrar Quiz Çöz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  celebrationLeaf: {
    position: 'absolute',
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scoreCircle: {
    marginBottom: 40,
    borderRadius: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  scoreCircleGradient: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  totalText: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  percentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 2,
    backdropFilter: 'blur(10px)',
    width: width - 80,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: width - 80,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  restartButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
