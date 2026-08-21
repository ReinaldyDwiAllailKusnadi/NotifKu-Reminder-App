import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container } from '../components/Container';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { hashPassword } from '../utils/crypto';

export const RegisterScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Error states untuk setiap input
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleRegister = async () => {
    // Reset errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    // Validasi input kosong
    if (!username.trim()) {
      setUsernameError('Nama pengguna wajib diisi.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email wajib diisi.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Format email tidak valid.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Kata sandi harus minimal 6 karakter.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Konfirmasi kata sandi wajib diisi.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Konfirmasi kata sandi tidak cocok.');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const passwordHash = await hashPassword(password);
      
      const success = await storageService.registerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      });

      if (success) {
        if (Platform.OS === 'web') {
          alert('Registrasi Berhasil! Akun Anda berhasil dibuat. Silakan login.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Registrasi Berhasil', 'Akun Anda berhasil dibuat. Silakan login.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
        }
      }
    } catch (error: any) {
      Alert.alert('Registrasi Gagal', error.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Buat Akun</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Daftar untuk mulai mengelola pengingat Anda
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Nama Pengguna"
            placeholder="Masukkan nama pengguna"
            value={username}
            onChangeText={setUsername}
            error={usernameError}
            autoCapitalize="none"
          />

          <CustomInput
            label="Email"
            placeholder="contoh@email.com"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Kata Sandi"
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            autoCapitalize="none"
          />

          <CustomInput
            label="Konfirmasi Kata Sandi"
            placeholder="Ulangi kata sandi Anda"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry
            autoCapitalize="none"
          />

          <CustomButton title="Daftar Sekarang" onPress={handleRegister} loading={loading} style={styles.button} />

          <View style={styles.loginLinkContainer}>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Sudah memiliki akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: 'bold' }}>Login</Text>
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
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
export default RegisterScreen;
