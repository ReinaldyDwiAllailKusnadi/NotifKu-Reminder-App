import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Konfigurasi handler notifikasi ketika aplikasi sedang terbuka (foreground)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldSetBadge: false,
    }),
  });
}

export const notificationService = {
  /**
   * Mengecek status izin notifikasi
   */
  async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          return Notification.permission === 'granted';
        }
        return true;
      }
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  },

  /**
   * Meminta izin notifikasi
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          const res = await Notification.requestPermission();
          return res === 'granted';
        }
        return true;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4A90E2',
        });
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  /**
   * Menjadwalkan notifikasi lokal berdasarkan tanggal dan waktu pengingat
   */
  async scheduleNotification(reminder: { title: string; description: string; date: string; time: string }): Promise<string> {
    try {
      // Dapatkan status izin terlebih dahulu
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const requested = await this.requestPermissions();
        if (!requested) {
          throw new Error('Izin notifikasi tidak diberikan oleh pengguna.');
        }
      }

      // Parsing input tanggal dan waktu (lokal)
      const [year, month, day] = reminder.date.split('-').map(Number);
      const [hour, minute] = reminder.time.split(':').map(Number);
      const targetDate = new Date(year, month - 1, day, hour, minute, 0, 0);

      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        throw new Error('Waktu pengingat harus di masa depan.');
      }

      const diffSeconds = Math.ceil(diffMs / 1000);

      if (Platform.OS === 'web') {
        const notificationId = 'web_rem_' + Date.now();
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          setTimeout(() => {
            new Notification(reminder.title, {
              body: reminder.description || 'Pengingat untuk Anda!',
            });
          }, Math.min(diffMs, 2147483647));
        }
        return notificationId;
      }

      // Menjadwalkan notifikasi menggunakan trigger detik pada Android / iOS
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description || 'Pengingat untuk Anda!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: diffSeconds,
          repeats: false,
        },
      });

      console.log(`Notification scheduled successfully. ID: ${notificationId} in ${diffSeconds} seconds`);
      return notificationId;
    } catch (error: any) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  /**
   * Mengirim notifikasi pengujian langsung (untuk verifikasi / evidence screenshot)
   */
  async triggerTestNotification(): Promise<string> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const requested = await this.requestPermissions();
        if (!requested) {
          throw new Error('Izin notifikasi tidak diberikan.');
        }
      }

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('🔔 Uji Notifikasi NotifKu', {
            body: 'Notifikasi lokal berhasil dipicu dan berfungsi dengan baik!',
          });
        }
        return 'web_test_notif';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Uji Notifikasi NotifKu',
          body: 'Notifikasi lokal berhasil dipicu dan berfungsi dengan baik!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          repeats: false,
        },
      });

      return notificationId;
    } catch (error: any) {
      console.error('Error triggering test notification:', error);
      throw error;
    }
  },

  /**
   * Membatalkan notifikasi terjadwal berdasarkan ID
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      console.log(`Notification ${notificationId} canceled successfully`);
    } catch (error) {
      console.error(`Error canceling notification ${notificationId}:`, error);
    }
  },

  /**
   * Membatalkan semua notifikasi
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      console.log('All scheduled notifications canceled successfully');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },
};

