import AsyncStorage from '@react-native-async-storage/async-storage';
export interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  duration?: number; 
}
const QUIZ_HISTORY_KEY = 'quiz_history';
export const QuizStorage = {
  async saveQuizAttempt(score: number, totalQuestions: number, duration?: number): Promise<void> {
    try {
      const percentage = Math.round((score / totalQuestions) * 100);
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        score,
        totalQuestions,
        percentage,
        date: new Date().toISOString(),
        duration,
      };
      const existingHistory = await this.getQuizHistory();
      const updatedHistory = [attempt, ...existingHistory].slice(0, 50); 
      await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  },
  async getQuizHistory(): Promise<QuizAttempt[]> {
    try {
      const historyJson = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting quiz history:', error);
      return [];
    }
  },
  async getQuizStats(): Promise<{
    totalAttempts: number;
    bestScore: QuizAttempt | null;
    averagePercentage: number;
    recentAttempts: QuizAttempt[];
  }> {
    try {
      const history = await this.getQuizHistory();
      if (history.length === 0) {
        return {
          totalAttempts: 0,
          bestScore: null,
          averagePercentage: 0,
          recentAttempts: [],
        };
      }
      const bestScore = history.reduce((best, current) => 
        current.percentage > best.percentage ? current : best
      );
      const averagePercentage = Math.round(
        history.reduce((sum, attempt) => sum + attempt.percentage, 0) / history.length
      );
      return {
        totalAttempts: history.length,
        bestScore,
        averagePercentage,
        recentAttempts: history.slice(0, 5), 
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      return {
        totalAttempts: 0,
        bestScore: null,
        averagePercentage: 0,
        recentAttempts: [],
      };
    }
  },
  async clearQuizHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing quiz history:', error);
    }
  },
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      return 'Bugün';
    } else if (diffDays === 2) {
      return 'Dün';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  },
};
