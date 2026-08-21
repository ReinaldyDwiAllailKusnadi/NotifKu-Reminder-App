import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container } from '../components/Container';
import { CustomButton } from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';

export const SettingsScreen = ({ navigation }: any) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logoutSession } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testingNotification, setTestingNotification] = useState(false);

  // Load preferences
  useEffect(() => {
    const loadPreferences = async () => {
      const enabled = await storageService.getNotificationsEnabled();
      setNotificationsEnabled(enabled);
    };
    loadPreferences();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        // Minta izin
        const granted = await notificationService.requestPermissions();
        if (granted) {
          setNotificationsEnabled(true);
          await storageService.setNotificationsEnabled(true);
          Alert.alert('Notifikasi Aktif', 'Notifikasi lokal telah berhasil diaktifkan.');
        } else {
          setNotificationsEnabled(false);
          await storageService.setNotificationsEnabled(false);
          Alert.alert('Izin Ditolak', 'Harap aktifkan izin notifikasi di pengaturan perangkat Anda.');
        }
      } else {
        // Matikan notifikasi & batalkan semua notifikasi aktif
        setNotificationsEnabled(false);
        await storageService.setNotificationsEnabled(false);
        await notificationService.cancelAllNotifications();
        Alert.alert('Notifikasi Nonaktif', 'Semua notifikasi pengingat terjadwal telah dibatalkan.');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    try {
      await notificationService.triggerTestNotification();
      if (Platform.OS === 'web') {
        alert('🔔 Uji Notifikasi Terkirim! Notifikasi pengujian berhasil dipicu.');
      } else {
        Alert.alert(
          'Uji Notifikasi Berhasil',
          'Notifikasi lokal pengujian telah dijadwalkan dan akan muncul dalam beberapa detik.'
        );
      }
    } catch (error: any) {
      Alert.alert('Gagal Menguji Notifikasi', error.message || 'Terjadi kesalahan.');
    } finally {
      setTestingNotification(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
        logoutSession().then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        });
      }
      return;
    }

    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logoutSession();
          // Reset navigation ke Login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };


  return (
    <Container>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backText, { color: theme.primary }]}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Pengaturan</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SECTION 1: PROFILE */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PROFIL PENGGUNA</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.profileRow}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.usernameText, { color: theme.text }]}>{user?.username || 'Pengguna'}</Text>
              <Text style={[styles.emailText, { color: theme.textSecondary }]}>{user?.email || 'email@contoh.com'}</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: PREFERENCES */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PENGATURAN APLIKASI</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Switch Notifikasi */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Aktifkan Notifikasi</Text>
              <Text style={[styles.settingSublabel, { color: theme.textSecondary }]}>
                Terima pengingat notifikasi lokal pada waktu yang disetel
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: theme.border, true: theme.primary + '50' }}
              thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
            />
          </View>

          {/* Tombol Uji Notifikasi (Untuk Evidence Pengujian) */}
          {notificationsEnabled && (
            <TouchableOpacity
              style={[styles.testNotifButton, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }]}
              onPress={handleTestNotification}
              disabled={testingNotification}
              activeOpacity={0.7}
            >
              <Text style={[styles.testNotifText, { color: theme.primary }]}>
                {testingNotification ? 'Memproses Uji...' : '🔔 Uji Notifikasi Sekarang'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          {/* Switch Tema */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Mode Gelap</Text>
              <Text style={[styles.settingSublabel, { color: theme.textSecondary }]}>
                Ubah tampilan warna aplikasi menjadi gelap atau terang
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary + '50' }}
              thumbColor={isDark ? theme.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* SECTION 3: OTHER */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>LAINNYA</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('About')}
            activeOpacity={0.7}
          >
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Tentang Aplikasi</Text>
              <Text style={[styles.settingSublabel, { color: theme.textSecondary }]}>
                Informasi detail pembuat dan versi aplikasi
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <CustomButton
          title="Keluar / Logout"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 60, // Menyamakan ukuran tombol kembali agar judul seimbang di tengah
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  testNotifButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testNotifText: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSublabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  logoutButton: {
    marginTop: 24,
  },
});
export default SettingsScreen;
