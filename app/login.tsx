import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { TurkishPattern } from '@/components/TurkishPattern';
import { User, Leaf } from 'lucide-react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Hata', 'Lütfen kullanıcı adınızı girin');
      return;
    }

    if (username.trim().length < 2) {
      Alert.alert('Hata', 'Kullanıcı adı en az 2 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim());
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TurkishPattern />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Leaf size={50} color="#DAA520" style={styles.logoLeaf} />
          <Text style={styles.logoText}>Yaprak Dökümü</Text>
          <Text style={styles.logoSubtext}>Quiz Uygulaması</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
          <Text style={styles.instructionText}>
            Quiz'e başlamak için kullanıcı adınızı girin
          </Text>

          <View style={styles.inputContainer}>
            <User size={20} color="#8D6E63" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adınızı girin"
              placeholderTextColor="#8D6E63"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Kullanıcı adınız cihazınızda güvenli bir şekilde saklanacaktır
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E2723',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoLeaf: {
    transform: [{ rotate: '15deg' }],
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DAA520',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 18,
    color: '#8D6E63',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F5DC',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 220, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#F5F5DC',
    paddingVertical: 12,
  },
  loginButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#8D6E63',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});