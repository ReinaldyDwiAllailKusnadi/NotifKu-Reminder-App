import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container } from '../components/Container';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Article } from '../services/apiService';

export const DetailScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const { article }: { article: Article } = route.params;
  const [isFav, setIsFav] = useState(false);

  // Cek status favorit saat halaman dibuka
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && article) {
        const favorite = await storageService.isFavorite(article.id, user.email);
        setIsFav(favorite);
      }
    };
    checkFavoriteStatus();
  }, [user, article]);

  const handleToggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFav) {
        await storageService.removeFavorite(article.id, user.email);
        setIsFav(false);
        if (Platform.OS === 'web') {
          alert('Favorit Dihapus: Artikel telah dihapus dari daftar favorit Anda.');
        } else {
          Alert.alert('Favorit Dihapus', 'Artikel telah dihapus dari daftar favorit Anda.');
        }
      } else {
        await storageService.addFavorite(article, user.email);
        setIsFav(true);
        if (Platform.OS === 'web') {
          alert('Favorit Ditambahkan: Artikel telah ditambahkan ke daftar favorit Anda.');
        } else {
          Alert.alert('Favorit Ditambahkan', 'Artikel telah ditambahkan ke daftar favorit Anda.');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Gagal memproses favorit.');
    }
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
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Detail Artikel
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* GAMBAR ILLUSTRASI PLACEHOLDER */}
        <View style={[styles.imageContainer, { backgroundColor: theme.primary + '15', borderColor: theme.border }]}>
          <Text style={[styles.imagePlaceholderText, { color: theme.primary }]}>
            📰
          </Text>
          <Text style={[styles.imageSubtext, { color: theme.textSecondary }]}>
            Artikel Edukasi Kesehatan
          </Text>
        </View>

        {/* JUDUL ARTIKEL */}
        <Text style={[styles.title, { color: theme.text }]}>
          {article.title}
        </Text>

        {/* METADATA */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            Sumber: API Eksternal (JSONPlaceholder)
          </Text>
          <Text style={[styles.metaText, { color: theme.textSecondary, marginLeft: 16 }]}>
            ID: #{article.id}
          </Text>
        </View>

        {/* PEMBATAS */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* ISI ARTIKEL */}
        <Text style={[styles.body, { color: theme.text }]}>
          {article.body}
          {"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>

        {/* TOMBOL FAVORIT */}
        <TouchableOpacity
          style={[
            styles.favButton,
            {
              backgroundColor: isFav ? theme.danger : theme.primary,
              shadowColor: isFav ? theme.danger : theme.primary,
            },
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.favButtonText}>
            {isFav ? '❤️ Hapus dari Favorit' : '⭐ Tambah ke Favorit'}
          </Text>
        </TouchableOpacity>
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
    maxWidth: 150,
  },
  headerRightPlaceholder: {
    width: 60,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  imageContainer: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePlaceholderText: {
    fontSize: 56,
    marginBottom: 8,
  },
  imageSubtext: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'justify',
  },
  favButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  favButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default DetailScreen;
