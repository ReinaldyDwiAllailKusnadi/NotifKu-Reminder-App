import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../components/Container';
import { ReminderCard } from '../components/ReminderCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService, Reminder } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { apiService, Article } from '../services/apiService';

export const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'pengingat' | 'edukasi'>('pengingat');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Load reminders when screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchReminders = async () => {
        if (!user) return;
        setLoadingReminders(true);
        try {
          const fetchedData = await storageService.getReminders(user.email);
          if (isActive) {
            // Urutkan berdasarkan tanggal & waktu terdekat
            const sortedReminders = fetchedData.sort((a, b) => {
              const dateTimeA = new Date(`${a.date}T${a.time}:00`);
              const dateTimeB = new Date(`${b.date}T${b.time}:00`);
              return dateTimeA.getTime() - dateTimeB.getTime();
            });
            setReminders(sortedReminders);
          }
        } catch (error) {
          console.error('Failed to load reminders:', error);
          Alert.alert('Gagal', 'Terjadi kesalahan saat memuat daftar pengingat.');
        } finally {
          if (isActive) {
            setLoadingReminders(false);
          }
        }
      };

      fetchReminders();

      return () => {
        isActive = false;
      };
    }, [user])
  );

  // Fetch articles from external API
  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const data = await apiService.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles from API:', error);
      Alert.alert('Gagal Memuat Artikel', 'Terjadi kesalahan saat mengambil artikel edukasi dari API eksternal.');
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'edukasi') {
      fetchArticles();
    }
  }, [activeTab]);

  const executeDeleteReminder = async (id: string) => {
    try {
      // Hapus dari AsyncStorage dan ambil reminder yang dihapus
      const deleted = await storageService.deleteReminder(id);
      
      if (deleted && deleted.notificationId) {
        // Batalkan notifikasi dari sistem lokal
        await notificationService.cancelNotification(deleted.notificationId);
      }

      // Update State UI
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      Alert.alert('Error', 'Gagal menghapus pengingat.');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin menghapus pengingat ini? Notifikasi terjadwal juga akan dibatalkan.')) {
        await executeDeleteReminder(id);
      }
      return;
    }

    Alert.alert(
      'Hapus Pengingat',
      'Apakah Anda yakin ingin menghapus pengingat ini? Notifikasi terjadwal juga akan dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => executeDeleteReminder(id),
        },
      ]
    );
  };

  const renderEmptyReminders = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔔</Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Belum ada pengingat.
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Ketuk tombol (+) di bawah untuk membuat pengingat baru.
      </Text>
    </View>
  );

  const renderEmptyArticles = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📰</Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Belum ada artikel edukasi.
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Tarik ke bawah atau aktifkan koneksi internet Anda.
      </Text>
    </View>
  );

  const renderArticleCard = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => navigation.navigate('Detail', { article: item })}
      activeOpacity={0.8}
    >
      <View style={styles.articleHeader}>
        <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        {/* IKON NAVIGASI KE LAYAR DETAIL */}
        <Text style={[styles.navigationIcon, { color: theme.primary }]}>→</Text>
      </View>
      <Text style={[styles.articleBody, { color: theme.textSecondary }]} numberOfLines={2}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      {/* HEADER SECTION (WITH LOGO & SETTINGS ICON) */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLogoContainer}>
          <Text style={[styles.headerLogoEmoji, { color: theme.primary }]}>🔔</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>NotifKu</Text>
        </View>
        
        <View style={styles.headerActions}>
          {/* PROFILE / FAVORITE ICON */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionIconText, { color: theme.text }]}>👤</Text>
          </TouchableOpacity>

          {/* SETTINGS MENU ICON */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border, marginLeft: 10 }]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionIconText, { color: theme.text }]}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WELCOME SECTION */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeGreeting, { color: theme.textSecondary }]}>Halo,</Text>
        <Text style={[styles.welcomeUsername, { color: theme.text }]}>
          Selamat datang, {user?.username || 'Pengguna'} 👋
        </Text>
      </View>

      {/* TAB SELECTOR */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pengingat' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('pengingat')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'pengingat' ? theme.primary : theme.textSecondary }]}>
            Pengingat Saya
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'edukasi' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('edukasi')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'edukasi' ? theme.primary : theme.textSecondary }]}>
            Edukasi (API)
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB CONTENT */}
      {activeTab === 'pengingat' ? (
        loadingReminders ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReminderCard reminder={item} onDelete={handleDeleteReminder} />
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyReminders}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        loadingArticles ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArticleCard}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyArticles}
            showsVerticalScrollIndicator={false}
            refreshing={loadingArticles}
            onRefresh={fetchArticles}
          />
        )
      )}

      {/* FLOATING ACTION BUTTON (ONLY SHOW ON REMINDERS TAB) */}
      {activeTab === 'pengingat' && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('CreateReminder')}
          activeOpacity={0.9}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIconText: {
    fontSize: 16,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeGreeting: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  welcomeUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  articleCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  navigationIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articleBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
});
export default HomeScreen;
