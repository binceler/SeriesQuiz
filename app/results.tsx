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
        colors={['#F5F5DC', '#FFF8E7', '#E6D5B8']}
        style={styles.gradient}
      >
        {/* Background decorative leaves */}
        <View style={styles.backgroundDecor}>
          <Text style={[styles.decorLeaf, { top: '10%', left: '10%' }]}>🍂</Text>
          <Text style={[styles.decorLeaf, { top: '15%', right: '15%' }]}>🍃</Text>
          <Text style={[styles.decorLeaf, { top: '70%', left: '5%' }]}>🍁</Text>
          <Text style={[styles.decorLeaf, { bottom: '20%', right: '10%' }]}>🍂</Text>
        </View>

        {/* Header with welcome message */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeTitle}>🍂 Yaprak Dökümü Quiz</Text>
          <Text style={styles.welcomeSubtitle}>Quiz Uygulamasına Hoş Geldiniz</Text>
        </View>

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
                colors={['#A0522D', '#8B4513', '#CD853F']}
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  decorLeaf: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.1,
    color: '#8B4513',
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    opacity: 0.8,
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
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreCircle: {
    marginBottom: 40,
    borderRadius: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    alignSelf: 'center',
  },
  scoreCircleGradient: {
    width: Math.min(240, width * 0.6),
    height: Math.min(240, width * 0.6),
    borderRadius: Math.min(120, width * 0.3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: Math.min(64, width * 0.16),
    fontWeight: 'bold',
    color: '#5D4037',
  },
  totalText: {
    fontSize: Math.min(32, width * 0.08),
    color: '#8B4513',
    marginLeft: 5,
  },
  percentage: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: '#5D4037',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 2,
    backdropFilter: 'blur(10px)',
    width: '100%',
    maxWidth: 500,
  },
  resultEmoji: {
    fontSize: Math.min(48, width * 0.12),
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: Math.min(16, width * 0.04),
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    maxWidth: 500,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: Math.min(16, width * 0.04),
    color: '#8B4513',
  },
  statValue: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: '#5D4037',
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
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    color: '#F5F5DC',
  },
});
