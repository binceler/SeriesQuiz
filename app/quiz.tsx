import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import questions from '@/data/questions.json';
import { QuizStorage } from '../utils/quizStorage';
const { width } = Dimensions.get('window');
export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [startTime] = useState(Date.now()); 
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentQuestion]);
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(answerIndex);
    setShowNext(true);
    if (answerIndex === question.correct) {
      setScore(score + 1);
    }
  };
  const handleNext = async () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowNext(false);
    } else {
      const duration = Math.round((Date.now() - startTime) / 1000); 
      await QuizStorage.saveQuizAttempt(score, totalQuestions, duration);
      router.replace({
        pathname: '/results',
        params: { score: score.toString(), total: totalQuestions.toString() }
      });
    }
  };
  const handleBack = () => {
    Alert.alert(
      "Quiz'den Çık",
      "Quiz'den çıkmak istediğinizden emin misiniz? İlerlemeniz kaybolacak.",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çık",
          style: "destructive",
          onPress: () => router.back()
        }
      ]
    );
  };
  const getOptionStyle = (index: number) => {
    const baseStyle = [styles.option];
    if (selectedAnswer === null) {
      return baseStyle;
    }
    if (index === question.correct) {
      return [...baseStyle, styles.correctOption];
    } else if (index === selectedAnswer) {
      return [...baseStyle, styles.wrongOption];
    } else {
      return [...baseStyle, styles.disabledOption];
    }
  };
  const getOptionIcon = (index: number) => {
    if (selectedAnswer === null) return '';
    if (index === question.correct) {
      return '✅';
    } else if (index === selectedAnswer) {
      return '❌';
    }
    return '';
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

        {/* Header with progress */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1} / {totalQuestions}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Skor</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
        </View>
        {/* Question section */}
        <Animated.View
          style={[
            styles.questionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>Soru {currentQuestion + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
        </Animated.View>
        {/* Options section */}
        <Animated.View
          style={[
            styles.optionsContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionLetterContainer}>
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
                <Text style={styles.optionIcon}>{getOptionIcon(index)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
        {/* Next button */}
        {showNext && (
          <Animated.View
            style={[
              styles.nextButtonContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#A0522D', '#8B4513', '#CD853F']}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion + 1 < totalQuestions ? '➡️ Sonraki Soru' : '🎯 Sonuçları Gör'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(93, 64, 55, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
  },
  backButtonText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(93, 64, 55, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A0522D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(160, 82, 45, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginBottom: 2,
  },
  score: {
    fontSize: 20,
    color: '#A0522D',
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 25,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 14,
    color: '#A0522D',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  optionLetterContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(93, 64, 55, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionLetter: {
    fontSize: 16,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#5D4037',
    flex: 1,
    lineHeight: 22,
  },
  optionIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  nextButtonContainer: {
    marginTop: 20,
  },
  nextButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5DC',
  },
});
