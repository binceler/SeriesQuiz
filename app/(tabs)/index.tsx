import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { FallingLeaves } from '@/components/FallingLeaves';
import { TurkishPattern } from '@/components/TurkishPattern';
import { Play, Leaf, LogOut } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, logout, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Redirect to login if no user
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TurkishPattern />
      <FallingLeaves />
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeUser}>Merhaba, {user.username}!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={16} color="#8D6E63" />
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Leaf size={40} color="#DAA520" style={styles.logoLeaf} />
          <Text style={styles.logoText}>Yaprak Dökümü</Text>
          <Text style={styles.logoSubtext}>Quiz Uygulaması</Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Hoş Geldiniz</Text>
          <Text style={styles.welcomeDescription}>
            Yaprak Dökümü dizisinin unutulmaz anlarını ve karakterlerini ne kadar iyi hatırlıyorsunuz? 
            Nostalji dolu bu yolculuğa hazır mısınız?
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartQuiz}
          activeOpacity={0.8}
        >
          <Play size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.startButtonText}>Quiz'e Başla</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>Soru</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Dakika</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Anı</Text>
          </View>
        </View>
      </Animated.View>
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
  userInfo: {
    flex: 1,
  },
  welcomeUser: {
    fontSize: 16,
    color: '#DAA520',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    borderRadius: 8,
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    color: '#8D6E63',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoLeaf: {
    transform: [{ rotate: '15deg' }],
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5DC',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  startButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 40,
    minWidth: 200,
  },
  buttonIcon: {
    marginRight: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8D6E63',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#8D6E63',
    opacity: 0.5,
  },
});