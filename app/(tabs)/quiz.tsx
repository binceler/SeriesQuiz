import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { TurkishPattern } from '@/components/TurkishPattern';
import { ProgressBar } from '@/components/ProgressBar';
import questionsData from '@/data/questions.json';

const { width } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = questionsData;

export default function QuizScreen() {
  const { user, isLoading } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Redirect to login if no user
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }
    // Initialize user answers array
    setUserAnswers(new Array(questions.length).fill(null));
  }, [user, isLoading]);
  useEffect(() => {
    if (isLoading || !user) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Save user answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newUserAnswers);
    
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(prev => prev + 1);
      }
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleFinish = () => {
    // Save quiz results to leaderboard
    saveToLeaderboard();
    
    // Save quiz results to local storage
    const quizResult = {
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      date: new Date().toISOString(),
      userAnswers,
      questions: questions.map((q, index) => ({
        question: q.question,
        userAnswer: userAnswers[index],
        correctAnswer: q.correct,
        isCorrect: userAnswers[index] === q.correct
      }))
    };
    
    // You can save this to AsyncStorage if needed
    router.push({
      pathname: '/(tabs)/results',
      params: { quizResult: JSON.stringify(quizResult) }
    });
  };

  const saveToLeaderboard = async () => {
    if (!user) return;
    
    try {
      const leaderboardData = await AsyncStorage.getItem('leaderboard');
      let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];
      
      // Find existing user entry
      const existingUserIndex = leaderboard.findIndex((entry: any) => entry.username === user.username);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        const existingUser = leaderboard[existingUserIndex];
        const newTotalQuizzes = existingUser.totalQuizzes + 1;
        const newTotalScore = (existingUser.averageScore * existingUser.totalQuizzes) + score;
        
        leaderboard[existingUserIndex] = {
          ...existingUser,
          bestScore: Math.max(existingUser.bestScore, score),
          totalQuizzes: newTotalQuizzes,
          averageScore: newTotalScore / newTotalQuizzes,
          lastPlayDate: new Date().toISOString(),
        };
      } else {
        // Add new user
        leaderboard.push({
          username: user.username,
          bestScore: score,
          totalQuizzes: 1,
          averageScore: score,
          lastPlayDate: new Date().toISOString(),
        });
      }
      
      await AsyncStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error('Error saving to leaderboard:', error);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <TurkishPattern />
        <View style={styles.resultContainer}>
          <CheckCircle size={80} color="#4CAF50" />
          <Text style={styles.resultTitle}>Tebrikler!</Text>
          <Text style={styles.resultScore}>
            {score} / {questions.length} doğru cevap
          </Text>
          <Text style={styles.resultMessage}>
            {score >= 4 ? 'Yaprak Dökümü uzmanısınız!' : 
             score >= questions.length / 2 ? 'Fena değil, tekrar izleme vakti!' : 
             'Diziyi tekrar izlemenizi öneririz!'}
          </Text>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Sonuçları Gör</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TurkishPattern />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#DAA520" />
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <Clock size={16} color="#DAA520" />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <ProgressBar 
        current={currentQuestion + 1} 
        total={questions.length}
        style={styles.progressBar}
      />

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionNumber}>
          Soru {currentQuestion + 1} / {questions.length}
        </Text>
        
        <Text style={styles.questionText}>
          {questions[currentQuestion].question}
        </Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer === index && 
                index === questions[currentQuestion].correct && 
                styles.correctOption,
                selectedAnswer === index && 
                index !== questions[currentQuestion].correct && 
                styles.incorrectOption,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
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
  backButton: {
    padding: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#DAA520',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressBar: {
    marginHorizontal: 24,
    marginBottom: 30,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F5DC',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#DAA520',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#F5F5DC',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520',
    marginVertical: 24,
  },
  resultScore: {
    fontSize: 24,
    color: '#F5F5DC',
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  finishButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});