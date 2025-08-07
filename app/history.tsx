import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { QuizStorage, QuizAttempt } from '../utils/quizStorage';
export default function HistoryScreen() {
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    bestScore: null as QuizAttempt | null,
    averagePercentage: 0,
    recentAttempts: [] as QuizAttempt[],
  });
  useEffect(() => {
    loadHistory();
  }, []);
  const loadHistory = async () => {
    const historyData = await QuizStorage.getQuizHistory();
    const statsData = await QuizStorage.getQuizStats();
    setHistory(historyData);
    setStats(statsData);
  };
  const clearHistory = () => {
    Alert.alert(
      'Geçmişi Temizle',
      'Tüm quiz geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await QuizStorage.clearQuizHistory();
            loadHistory();
          },
        },
      ]
    );
  };
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    if (percentage >= 40) return '#FFC107';
    return '#F44336';
  };
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F5DC', '#FFF8E7', '#E6D5B8']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Quiz Geçmişi</Text>
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Stats Summary */}
        {stats.totalAttempts > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Özet İstatistikler</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{stats.totalAttempts}</Text>
                <Text style={styles.summaryLabel}>Toplam Deneme</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: '#4CAF50' }]}>
                  {stats.bestScore?.percentage}%
                </Text>
                <Text style={styles.summaryLabel}>En İyi Skor</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{stats.averagePercentage}%</Text>
                <Text style={styles.summaryLabel}>Ortalama</Text>
              </View>
            </View>
          </View>
        )}
        {/* History List */}
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Henüz Quiz Çözmemişsiniz</Text>
              <Text style={styles.emptyText}>
                İlk quiz'inizi çözdüğünüzde geçmişiniz burada görünecek.
              </Text>
              <TouchableOpacity 
                style={styles.startQuizButton} 
                onPress={() => router.push('/quiz')}
              >
                <Text style={styles.startQuizButtonText}>Quiz'e Başla</Text>
              </TouchableOpacity>
            </View>
          ) : (
            history.map((attempt, index) => (
              <View key={attempt.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDate}>
                      {QuizStorage.formatDate(attempt.date)}
                    </Text>
                    <Text style={styles.historyTime}>
                      {new Date(attempt.date).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={[
                    styles.scoreCircle,
                    { backgroundColor: getScoreColor(attempt.percentage) }
                  ]}>
                    <Text style={styles.scorePercentage}>{attempt.percentage}%</Text>
                  </View>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Doğru Cevap:</Text>
                    <Text style={styles.detailValue}>
                      {attempt.score}/{attempt.totalQuestions}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Süre:</Text>
                    <Text style={styles.detailValue}>
                      {formatDuration(attempt.duration)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  clearButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  startQuizButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startQuizButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  historyTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
