import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { useTheme } from '../context/ThemeContext';

export const AboutScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tentang Aplikasi</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentCard}>
          <Text style={[styles.logoText, { color: theme.primary }]}>NotifKu</Text>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>Versi 1.0.0</Text>
          
          <Text style={[styles.bodyText, { color: theme.text }]}>
            Aplikasi NotifKu adalah sistem pengingat lokal yang dirancang khusus untuk membantu mahasiswa dalam memahami implementasi penyimpanan data lokal menggunakan <Text style={{ fontWeight: 'bold' }}>AsyncStorage</Text> serta penjadwalan notifikasi menggunakan <Text style={{ fontWeight: 'bold' }}>expo-notifications</Text>.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>FITUR UTAMA</Text>
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.bulletItem, { color: theme.text }]}>
            🔐 <Text style={{ fontWeight: 'bold' }}>Autentikasi Lokal</Text>: Registrasi dan login menggunakan enkripsi password SHA-256 yang aman.
          </Text>
          <Text style={[styles.bulletItem, { color: theme.text }]}>
            📅 <Text style={{ fontWeight: 'bold' }}>Pengingat Terjadwal</Text>: Membuat pengingat dengan validasi waktu agar tidak melampaui waktu sekarang.
          </Text>
          <Text style={[styles.bulletItem, { color: theme.text }]}>
            🔔 <Text style={{ fontWeight: 'bold' }}>Notifikasi Lokal</Text>: Notifikasi berbunyi tepat waktu meskipun aplikasi sedang ditutup.
          </Text>
          <Text style={[styles.bulletItem, { color: theme.text }]}>
            🎨 <Text style={{ fontWeight: 'bold' }}>Tema Dinamis</Text>: Mendukung Mode Terang (Light) dan Mode Gelap (Dark) secara otomatis atau manual.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TEKNOLOGI</Text>
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.techText, { color: theme.text }]}>• React Native & Expo SDK 57</Text>
          <Text style={[styles.techText, { color: theme.text }]}>• TypeScript</Text>
          <Text style={[styles.techText, { color: theme.text }]}>• React Navigation V6</Text>
          <Text style={[styles.techText, { color: theme.text }]}>• @react-native-async-storage/async-storage</Text>
          <Text style={[styles.techText, { color: theme.text }]}>• expo-notifications & expo-crypto</Text>
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Dibuat untuk Tugas Implementasi Sistem Notifikasi Lokal
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.textSecondary, marginTop: 4 }]}>
            © 2026 NotifKu Team. All Rights Reserved.
          </Text>
        </View>
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
    width: 60,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  techText: {
    fontSize: 14,
    lineHeight: 22,
  },
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    textAlign: 'center',
  },
});
export default AboutScreen;
