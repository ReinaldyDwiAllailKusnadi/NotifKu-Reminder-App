import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  username: string;
  email: string;
  passwordHash: string;
}

export interface Reminder {
  id: string;
  userId: string; // Mengaitkan reminder dengan user tertentu
  title: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  status: 'Aktif' | 'Selesai' | 'Dibatalkan';
  notificationId?: string;
}

const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  REMINDERS: 'reminders',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  THEME: 'theme',
  FAVORITES: 'favorites',
};

export const storageService = {
  // === USER & AUTHENTICATION STORAGE ===

  /**
   * Mengambil semua user yang terdaftar
   */
  async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  /**
   * Menyimpan user baru (Register)
   */
  async registerUser(newUser: User): Promise<boolean> {
    try {
      const users = await this.getUsers();
      // Periksa apakah email atau username sudah digunakan
      const isExist = users.some(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase() || 
               u.username.toLowerCase() === newUser.username.toLowerCase()
      );
      if (isExist) {
        throw new Error('Username atau Email sudah terdaftar.');
      }
      users.push(newUser);
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error: any) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Menyimpan session login
   */
  async saveLoginSession(user: Omit<User, 'passwordHash'>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, 'true');
    } catch (error) {
      console.error('Error saving login session:', error);
    }
  },

  /**
   * Mengambil status login saat ini
   */
  async getLoginSession(): Promise<{ isLoggedIn: boolean; user: Omit<User, 'passwordHash'> | null }> {
    try {
      const isLoggedIn = await AsyncStorage.getItem(KEYS.IS_LOGGED_IN);
      const userJson = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return {
        isLoggedIn: isLoggedIn === 'true',
        user: userJson ? JSON.parse(userJson) : null,
      };
    } catch (error) {
      console.error('Error getting login session:', error);
      return { isLoggedIn: false, user: null };
    }
  },

  /**
   * Menghapus session login (Logout)
   */
  async clearLoginSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
      await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, 'false');
    } catch (error) {
      console.error('Error clearing login session:', error);
    }
  },

  // === REMINDERS STORAGE ===

  /**
   * Mengambil semua reminder untuk user tertentu
   */
  async getReminders(userId: string): Promise<Reminder[]> {
    try {
      const remindersJson = await AsyncStorage.getItem(KEYS.REMINDERS);
      const allReminders: Reminder[] = remindersJson ? JSON.parse(remindersJson) : [];
      // Filter reminder berdasarkan user yang sedang aktif
      return allReminders.filter((r) => r.userId.toLowerCase() === userId.toLowerCase());
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  },

  /**
   * Menambahkan reminder baru
   */
  async addReminder(reminder: Reminder): Promise<void> {
    try {
      const remindersJson = await AsyncStorage.getItem(KEYS.REMINDERS);
      const allReminders: Reminder[] = remindersJson ? JSON.parse(remindersJson) : [];
      allReminders.push(reminder);
      await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(allReminders));
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw new Error('Gagal menyimpan pengingat.');
    }
  },

  /**
   * Menghapus reminder berdasarkan ID
   */
  async deleteReminder(reminderId: string): Promise<Reminder | null> {
    try {
      const remindersJson = await AsyncStorage.getItem(KEYS.REMINDERS);
      const allReminders: Reminder[] = remindersJson ? JSON.parse(remindersJson) : [];
      const deletedReminder = allReminders.find((r) => r.id === reminderId) || null;
      
      const filteredReminders = allReminders.filter((r) => r.id !== reminderId);
      await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(filteredReminders));
      return deletedReminder;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw new Error('Gagal menghapus pengingat.');
    }
  },

  // === SETTINGS PREFERENCES STORAGE ===

  /**
   * Mengambil preferensi notifikasi (default: true)
   */
  async getNotificationsEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
      return value !== 'false'; // default true jika belum diset
    } catch (error) {
      console.error('Error getting notification preference:', error);
      return true;
    }
  },

  /**
   * Menyimpan preferensi notifikasi
   */
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting notification preference:', error);
    }
  },

  /**
   * Mengambil preferensi tema (default: light)
   */
  async getThemePreference(): Promise<'light' | 'dark'> {
    try {
      const value = await AsyncStorage.getItem(KEYS.THEME);
      return value === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.error('Error getting theme preference:', error);
      return 'light';
    }
  },

  /**
   * Menyimpan preferensi tema
   */
  async setThemePreference(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme preference:', error);
    }
  },

  // === FAVORITES STORAGE ===

  /**
   * Mengambil semua artikel favorit untuk user tertentu
   */
  async getFavorites(userId: string): Promise<any[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(KEYS.FAVORITES);
      const allFavorites: any[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      return allFavorites.filter((fav) => fav.userId.toLowerCase() === userId.toLowerCase());
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  /**
   * Menambahkan artikel ke dalam favorit
   */
  async addFavorite(article: any, userId: string): Promise<void> {
    try {
      const favoritesJson = await AsyncStorage.getItem(KEYS.FAVORITES);
      const allFavorites: any[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      const isExist = allFavorites.some(
        (fav) => fav.id === article.id && fav.userId.toLowerCase() === userId.toLowerCase()
      );
      
      if (!isExist) {
        allFavorites.push({ ...article, userId: userId.toLowerCase() });
        await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(allFavorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  /**
   * Menghapus artikel dari daftar favorit
   */
  async removeFavorite(articleId: number, userId: string): Promise<void> {
    try {
      const favoritesJson = await AsyncStorage.getItem(KEYS.FAVORITES);
      const allFavorites: any[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      const filteredFavorites = allFavorites.filter(
        (fav) => !(fav.id === articleId && fav.userId.toLowerCase() === userId.toLowerCase())
      );
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(filteredFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  /**
   * Mengecek apakah artikel merupakan favorit bagi user tertentu
   */
  async isFavorite(articleId: number, userId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.some((fav) => fav.id === articleId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },
};
