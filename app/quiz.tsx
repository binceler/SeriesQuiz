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
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.gradient}
      >
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
                colors={['#FFD700', '#FFC107']}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
  },
  backButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  score: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionLetter: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
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
    color: '#2E7D32',
  },
});
