import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Reminder } from '../services/storageService';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDelete }) => {
  const { theme } = useTheme();

  // Tentukan warna badge status
  let badgeBg = theme.border;
  let badgeText = theme.textSecondary;

  if (reminder.status === 'Aktif') {
    badgeBg = theme.success + '20'; // 12% opacity
    badgeText = theme.success;
  } else if (reminder.status === 'Selesai') {
    badgeBg = theme.textSecondary + '20';
    badgeText = theme.textSecondary;
  } else if (reminder.status === 'Dibatalkan') {
    badgeBg = theme.danger + '20';
    badgeText = theme.danger;
  }

  // Format format tanggal yang lebih mudah dibaca
  // Contoh input: "2026-08-21" -> output "21 Agt 2026"
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = parseInt(parts[2], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        return `${day} ${months[monthIdx]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {reminder.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeText }]}>{reminder.status}</Text>
          </View>
        </View>

        {reminder.description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {reminder.description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.dateTimeContainer}>
            <Text style={[styles.dateTimeText, { color: theme.textSecondary }]}>
              📅 {formatDate(reminder.date)}
            </Text>
            <Text style={[styles.dateTimeText, { color: theme.textSecondary, marginLeft: 12 }]}>
              ⏰ {reminder.time}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.danger + '15' }]}
            onPress={() => onDelete(reminder.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.deleteText, { color: theme.danger }]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
export default ReminderCard;
