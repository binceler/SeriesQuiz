import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { QuizStorage } from '../utils/quizStorage';
const { width } = Dimensions.get('window');
export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [quizStats, setQuizStats] = useState({
    totalAttempts: 0,
    bestScore: null as any,
    averagePercentage: 0,
    recentAttempts: [] as any[],
  });
  useEffect(() => {
    const loadStats = async () => {
      const stats = await QuizStorage.getQuizStats();
      setQuizStats(stats);
    };
    loadStats();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const startQuiz = () => {
    router.push('/quiz');
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.gradient}
      >
        {/* Background decorative leaves */}
        <View style={styles.backgroundDecor}>
          <Text style={[styles.decorLeaf, { top: '10%', left: '10%' }]}>🍂</Text>
          <Text style={[styles.decorLeaf, { top: '15%', right: '15%' }]}>🍃</Text>
          <Text style={[styles.decorLeaf, { top: '70%', left: '5%' }]}>🍁</Text>
          <Text style={[styles.decorLeaf, { bottom: '20%', right: '10%' }]}>🍂</Text>
        </View>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.leafIcon}>�</Text>
            <Text style={styles.title}>Yaprak Dökümü</Text>
          </View>
          <Text style={styles.subtitle}>Quiz Uygulamasına Hoş Geldiniz</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>
              Yaprak Dökümü dizisinin unutulmaz anlarını ve karakterlerini ne kadar iyi hatırlıyorsunuz?
            </Text>
            <Text style={styles.descriptionSub}>
              Bilginizi test edin ve puanınızı öğrenin!
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={startQuiz}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFD700', '#FFC107']}
              style={styles.buttonGradient}
            >
              <Text style={styles.startButtonText}>🎯 Quiz'e Başla</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* History Button */}
          {quizStats.totalAttempts > 0 && (
            <TouchableOpacity 
              style={styles.historyButton} 
              onPress={() => router.push('/history')}
              activeOpacity={0.8}
            >
              <Text style={styles.historyButtonText}>📊 Geçmiş ({quizStats.totalAttempts})</Text>
            </TouchableOpacity>
          )}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{quizStats.totalAttempts}</Text>
              <Text style={styles.statLabel}>Deneme</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {quizStats.bestScore ? `${quizStats.bestScore.percentage}%` : '-'}
              </Text>
              <Text style={styles.statLabel}>En İyi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {quizStats.totalAttempts > 0 ? `${quizStats.averagePercentage}%` : '-'}
              </Text>
              <Text style={styles.statLabel}>Ortalama</Text>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorLeaf: {
    position: 'absolute',
    fontSize: 30,
    opacity: 0.1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  leafIcon: {
    fontSize: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
  },
  content: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  descriptionSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  startButton: {
    marginBottom: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width - 80,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
});
