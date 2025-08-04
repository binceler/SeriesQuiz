import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Volume2, Palette, CircleHelp as HelpCircle, Info, ChevronRight, LogOut, User } from 'lucide-react-native';
import { TurkishPattern } from '@/components/TurkishPattern';

export default function SettingsScreen() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Redirect to login if no user
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return null;
  }

  const settingsItems = [
    {
      icon: User,
      title: 'Profil',
      subtitle: `Kullanıcı: ${user.username}`,
      onPress: () => console.log('Profile'),
    },
    {
      icon: Bell,
      title: 'Bildirimler',
      subtitle: 'Yeni quiz bildirimleri',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: Volume2,
      title: 'Ses Ayarları',
      subtitle: 'Ses efektleri ve müzik',
      onPress: () => console.log('Sound'),
    },
    {
      icon: Palette,
      title: 'Tema',
      subtitle: 'Görünüm ayarları',
      onPress: () => console.log('Theme'),
    },
    {
      icon: HelpCircle,
      title: 'Yardım',
      subtitle: 'Sıkça sorulan sorular',
      onPress: () => console.log('Help'),
    },
    {
      icon: Info,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      onPress: () => console.log('About'),
    },
    {
      icon: LogOut,
      title: 'Çıkış Yap',
      subtitle: 'Hesaptan çıkış yap',
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <TurkishPattern />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Ayarlar</Text>
            <Text style={styles.subtitle}>Uygulamayı özelleştirin</Text>
          </View>

          <View style={styles.settingsContainer}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <item.icon size={20} color="#DAA520" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#8D6E63" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Yaprak Dökümü Quiz</Text>
            <Text style={styles.infoText}>
              Bu uygulama, unutulmaz Yaprak Dökümü dizisinin hayranları için özel olarak tasarlanmıştır. 
              Dizinin en önemli anlarını ve karakterlerini hatırlatarak nostalji dolu bir deneyim sunar.
            </Text>
            <Text style={styles.versionText}>Sürüm 1.0.0</Text>
          </View>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
  },
  settingsContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5DC',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8D6E63',
  },
  infoContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#8D6E63',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#8D6E63',
    opacity: 0.7,
  },
});