import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Container } from '../components/Container';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { hashPassword } from '../utils/crypto';

export const LoginScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { loginSession } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    setIdentifierError('');
    setPasswordError('');

    let isValid = true;

    if (!identifier.trim()) {
      setIdentifierError('Email atau Nama Pengguna wajib diisi.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi.');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const users = await storageService.getUsers();
      
      // Cari pengguna berdasarkan email atau username
      const matchedUser = users.find(
        (u) =>
          u.email.toLowerCase() === identifier.trim().toLowerCase() ||
          u.username.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (!matchedUser) {
        throw new Error('Akun tidak ditemukan. Silakan registrasi terlebih dahulu.');
      }

      // Hash password input dan bandingkan dengan hash tersimpan
      const inputHash = await hashPassword(password);
      if (inputHash !== matchedUser.passwordHash) {
        throw new Error('Kata sandi yang Anda masukkan salah.');
      }

      // Login berhasil, simpan session
      const userSession = {
        username: matchedUser.username,
        email: matchedUser.email,
      };

      await loginSession(userSession);

      // Navigasi ke halaman Home (reset stack agar tidak bisa Back ke Login)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Text style={[styles.appName, { color: theme.primary }]}>NotifKu</Text>
          <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
            Kelola Pengingat dan Notifikasi Anda dengan Mudah
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Selamat Datang</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Masuk dengan akun Anda yang sudah terdaftar
          </Text>

          <CustomInput
            label="Email / Nama Pengguna"
            placeholder="Masukkan email atau nama pengguna"
            value={identifier}
            onChangeText={setIdentifier}
            error={identifierError}
            autoCapitalize="none"
          />

          <CustomInput
            label="Kata Sandi"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            autoCapitalize="none"
          />

          <CustomButton title="Masuk" onPress={handleLogin} loading={loading} style={styles.button} />

          <View style={styles.registerLinkContainer}>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Belum memiliki akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: 'bold' }}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
export default LoginScreen;
