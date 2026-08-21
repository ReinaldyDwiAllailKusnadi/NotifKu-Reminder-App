import * as Crypto from 'expo-crypto';

/**
 * Meng-hash kata sandi menggunakan algoritma SHA-256 secara asinkron.
 * Ini mencegah penyimpanan kata sandi dalam bentuk plaintext di AsyncStorage.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Gagal mengamankan kata sandi.');
  }
}
