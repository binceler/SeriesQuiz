import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Star, RotateCcw, Share2 } from 'lucide-react-native';
import { TurkishPattern } from '@/components/TurkishPattern';

export default function ResultsScreen() {
  const { user, isLoading } = useAuth();
  const { quizResult } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Parse quiz result if available
  let result = null;
  if (quizResult && typeof quizResult === 'string') {
    try {
      result = JSON.parse(quizResult);
    } catch (error) {
      console.error('Error parsing quiz result:', error);
    }
  }

  // Default values if no result
  const score = result?.score || 4;
  const total = result?.total || 5;
  const percentage = result?.percentage || 80;
  const starRating = Math.ceil((score / total) * 5);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }
    
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
    ]).start();
  }, [user, isLoading]);

  if (isLoading || !user) {
    return null;
  }

  const handleRetakeQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    console.log('Share results');
  };

  return (
    <View style={styles.container}>
      <TurkishPattern />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <Trophy size={60} color="#DAA520" />
            <Text style={styles.title}>Quiz Sonuçları</Text>
            <Text style={styles.subtitle}>Performansınızı inceleyin</Text>
          </View>

          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Son Quiz</Text>
              <View style={styles.scoreValue}>
                <Text style={styles.scoreNumber}>{score}</Text>
                <Text style={styles.scoreTotal}>/ {total}</Text>
              </View>
            </View>
            
            <View style={styles.scoreDetails}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Doğru Cevaplar:</Text>
                <Text style={styles.scoreText}>{score}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Yanlış Cevaplar:</Text>
                <Text style={styles.scoreText}>{total - score}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Başarı Oranı:</Text>
                <Text style={styles.scoreText}>{percentage}%</Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingTitle}>Değerlendirme</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    color={star <= starRating ? '#DAA520' : '#8D6E63'}
                    fill={star <= starRating ? '#DAA520' : 'transparent'}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {percentage >= 80 ? 'Yaprak Dökümü Uzmanı!' :
                 percentage >= 60 ? 'İyi Performans!' :
                 percentage >= 40 ? 'Orta Seviye' :
                 'Tekrar Deneyin!'}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Genel İstatistikler</Text>
            
            <View style={styles.statItem}>
              <View style={styles.statLeft}>
                <Text style={styles.statLabel}>Toplam Quiz</Text>
                <Text style={styles.statValue}>12</Text>
              </View>
              <View style={styles.statRight}>
                <Text style={styles.statLabel}>Ortalama Puan</Text>
                <Text style={styles.statValue}>{percentage}%</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statLeft}>
                <Text style={styles.statLabel}>En Yüksek Puan</Text>
                <Text style={styles.statValue}>{score}/{total}</Text>
              </View>
              <View style={styles.statRight}>
                <Text style={styles.statLabel}>Toplam Süre</Text>
                <Text style={styles.statValue}>5 dk</Text>
              </View>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Başarılar</Text>
            
            <View style={styles.achievementItem}>
              <Trophy size={32} color="#DAA520" />
              <View style={styles.achievementText}>
                <Text style={styles.achievementName}>İlk Quiz</Text>
                <Text style={styles.achievementDesc}>İlk quiz'inizi tamamladınız</Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <Star size={32} color="#DAA520" />
              <View style={styles.achievementText}>
                <Text style={styles.achievementName}>4 Yıldız</Text>
                <Text style={styles.achievementDesc}>Bir quiz'de 4 yıldız aldınız</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetakeQuiz}
            >
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.retakeButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={20} color="#8B4513" />
              <Text style={styles.shareButtonText}>Paylaş</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E2723',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DAA520',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  scoreTotal: {
    fontSize: 18,
    color: '#8D6E63',
    marginLeft: 4,
  },
  scoreDetails: {
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#8D6E63',
  },
  scoreText: {
    fontSize: 14,
    color: '#F5F5DC',
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(141, 110, 99, 0.3)',
  },
  ratingTitle: {
    fontSize: 16,
    color: '#F5F5DC',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#DAA520',
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginBottom: 16,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statLeft: {
    flex: 1,
  },
  statRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 14,
    color: '#8D6E63',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementText: {
    marginLeft: 16,
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#8D6E63',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shareButton: {
    flex: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
});