import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../components/Container';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Article } from '../services/apiService';

export const ProfileScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Muat data favorit setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchFavorites = async () => {
        if (!user) return;
        setLoading(true);
        try {
          const favs = await storageService.getFavorites(user.email);
          if (isActive) {
            setFavorites(favs);
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchFavorites();

      return () => {
        isActive = false;
      };
    }, [user])
  );

  const renderFavoriteItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={[styles.favCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => navigation.navigate('Detail', { article: item })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.favTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.arrowText, { color: theme.primary }]}>→</Text>
      </View>
      <Text style={[styles.favBody, { color: theme.textSecondary }]} numberOfLines={2}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>⭐</Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Belum ada artikel favorit.
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Buka tab Edukasi di halaman utama dan tambahkan artikel yang Anda sukai ke daftar favorit.
      </Text>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profil & Favorit</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* USER INFO BLOCK */}
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.usernameText, { color: theme.text }]}>
          {user?.username || 'Pengguna'}
        </Text>
        <Text style={[styles.emailText, { color: theme.textSecondary }]}>
          {user?.email || 'email@contoh.com'}
        </Text>
      </View>

      {/* FAVORITE TITLE */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        ARTIKEL DISUKAI ({favorites.length})
      </Text>

      {/* FAVORITE LIST */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  profileCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  favCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  favTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
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
});
export default ProfileScreen;
