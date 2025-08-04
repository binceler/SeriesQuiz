import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, Crown, User, LogOut } from 'lucide-react-native';
import { TurkishPattern } from '@/components/TurkishPattern';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LeaderboardEntry {
  username: string;
  bestScore: number;
  totalQuizzes: number;
  averageScore: number;
  lastPlayDate: string;
}

export default function LeaderboardScreen() {
  const { user, logout, isLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }
    
    if (user) {
      loadLeaderboard();
    }
  }, [user, isLoading]);

  useEffect(() => {
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
  }, []);

  const loadLeaderboard = async () => {
    try {
      const leaderboardData = await AsyncStorage.getItem('leaderboard');
      if (leaderboardData) {
        const data: LeaderboardEntry[] = JSON.parse(leaderboardData);
        // Sort by best score descending, then by average score
        const sortedData = data.sort((a, b) => {
          if (b.bestScore !== a.bestScore) {
            return b.bestScore - a.bestScore;
          }
          return b.averageScore - a.averageScore;
        });
        setLeaderboard(sortedData);
        
        // Find current user's rank
        const currentUserRank = sortedData.findIndex(entry => entry.username === user?.username) + 1;
        setUserRank(currentUserRank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Medal size={24} color="#CD7F32" />;
      default:
        return <Text style={styles.rankNumber}>{rank}</Text>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.firstPlace;
      case 2:
        return styles.secondPlace;
      case 3:
        return styles.thirdPlace;
      default:
        return styles.regularPlace;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TurkishPattern />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Trophy size={24} color="#DAA520" />
          <Text style={styles.headerTitle}>Sıralama</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#8D6E63" />
        </TouchableOpacity>
      </View>

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
          {userRank > 0 && (
            <View style={styles.userRankCard}>
              <Text style={styles.userRankTitle}>Sizin Sıralamanız</Text>
              <View style={styles.userRankInfo}>
                <View style={styles.userRankLeft}>
                  {getRankIcon(userRank)}
                  <Text style={styles.userRankText}>{user.username}</Text>
                </View>
                <Text style={styles.userRankPosition}>#{userRank}</Text>
              </View>
            </View>
          )}

          <View style={styles.leaderboardContainer}>
            <Text style={styles.leaderboardTitle}>En İyi Performanslar</Text>
            
            {leaderboard.length === 0 ? (
              <View style={styles.emptyState}>
                <Trophy size={48} color="#8D6E63" />
                <Text style={styles.emptyStateTitle}>Henüz Sıralama Yok</Text>
                <Text style={styles.emptyStateText}>
                  İlk quiz'i tamamlayın ve sıralamada yerinizi alın!
                </Text>
              </View>
            ) : (
              leaderboard.map((entry, index) => (
                <View
                  key={entry.username}
                  style={[styles.leaderboardItem, getRankStyle(index + 1)]}
                >
                  <View style={styles.rankContainer}>
                    {getRankIcon(index + 1)}
                  </View>
                  
                  <View style={styles.playerInfo}>
                    <View style={styles.playerHeader}>
                      <Text style={[
                        styles.playerName,
                        entry.username === user.username && styles.currentUser
                      ]}>
                        {entry.username}
                        {entry.username === user.username && ' (Sen)'}
                      </Text>
                      <Text style={styles.bestScore}>
                        En İyi: {entry.bestScore}/9
                      </Text>
                    </View>
                    
                    <View style={styles.playerStats}>
                      <Text style={styles.statText}>
                        Ortalama: {entry.averageScore.toFixed(1)}/9
                      </Text>
                      <Text style={styles.statText}>
                        Quiz Sayısı: {entry.totalQuizzes}
                      </Text>
                      <Text style={styles.statText}>
                        Son Oyun: {formatDate(entry.lastPlayDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Sıralama Nasıl Çalışır?</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>1.</Text>
              <Text style={styles.infoText}>En yüksek puan önceliklidir</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>2.</Text>
              <Text style={styles.infoText}>Eşitlik durumunda ortalama puan belirleyicidir</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>3.</Text>
              <Text style={styles.infoText}>Her quiz sonrası sıralama güncellenir</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DAA520',
    marginLeft: 12,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  userRankCard: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  userRankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 12,
    textAlign: 'center',
  },
  userRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginLeft: 12,
  },
  userRankPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  leaderboardContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8D6E63',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8D6E63',
    textAlign: 'center',
    lineHeight: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  firstPlace: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  secondPlace: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.3)',
  },
  thirdPlace: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(205, 127, 50, 0.3)',
  },
  regularPlace: {
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8D6E63',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5F5DC',
  },
  currentUser: {
    color: '#DAA520',
  },
  bestScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 12,
    color: '#8D6E63',
  },
  infoContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
    width: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#8D6E63',
    flex: 1,
    lineHeight: 20,
  },
});