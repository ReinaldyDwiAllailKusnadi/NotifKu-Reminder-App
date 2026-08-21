import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Container } from '../components/Container';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storageService, Reminder } from '../services/storageService';
import { notificationService } from '../services/notificationService';

export const CreateReminderScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Date/Time picker state
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper formatting
  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeString = (t: Date) => {
    const hours = String(t.getHours()).padStart(2, '0');
    const minutes = String(t.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDateSelected(true);
      setDateError('');
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      setTimeSelected(true);
      setTimeError('');
    }
  };

  const handleAddReminder = async () => {
    setTitleError('');
    setDateError('');
    setTimeError('');

    let isValid = true;

    if (!title.trim()) {
      setTitleError('Judul pengingat wajib diisi.');
      isValid = false;
    }

    if (!dateSelected) {
      setDateError('Tanggal pengingat wajib dipilih.');
      isValid = false;
    }

    if (!timeSelected) {
      setTimeError('Waktu pengingat wajib dipilih.');
      isValid = false;
    }

    if (!isValid) return;

    // Gabungkan tanggal dan waktu untuk validasi waktu lampau
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    
    const targetDateTime = new Date(year, month, day, hours, minutes, 0, 0);
    const now = new Date();

    if (targetDateTime.getTime() <= now.getTime()) {
      Alert.alert('Waktu Tidak Valid', 'Waktu pengingat harus berada di masa depan.');
      return;
    }

    setLoading(true);

    try {
      const dateStr = formatDateString(date);
      const timeStr = formatTimeString(time);
      const id = 'rem_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

      // Cek apakah notifikasi diaktifkan di pengaturan global
      const notificationsEnabled = await storageService.getNotificationsEnabled();
      let notificationId = undefined;

      if (notificationsEnabled) {
        // Jadwalkan notifikasi lokal
        notificationId = await notificationService.scheduleNotification({
          title: title.trim(),
          description: description.trim(),
          date: dateStr,
          time: timeStr,
        });
      }

      // Buat data reminder baru
      const newReminder: Reminder = {
        id,
        userId: user!.email,
        title: title.trim(),
        description: description.trim(),
        date: dateStr,
        time: timeStr,
        status: 'Aktif',
        notificationId,
      };

      // Simpan reminder ke AsyncStorage
      await storageService.addReminder(newReminder);

      if (Platform.OS === 'web') {
        alert(
          notificationsEnabled 
            ? 'Pengingat dan notifikasi berhasil dijadwalkan!' 
            : 'Pengingat disimpan. (Catatan: Notifikasi dimatikan di Pengaturan)'
        );
        navigation.goBack();
      } else {
        Alert.alert(
          'Pengingat Dibuat',
          notificationsEnabled 
            ? 'Pengingat dan notifikasi berhasil dijadwalkan!' 
            : 'Pengingat disimpan. (Catatan: Notifikasi dimatikan di Pengaturan)',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Gagal Membuat Pengingat', error.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Buat Pengingat Baru</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Atur judul, deskripsi, tanggal, dan waktu untuk pengingat Anda
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Judul Pengingat"
            placeholder="Masukkan judul pengingat (misal: Minum Obat)"
            value={title}
            onChangeText={setTitle}
            error={titleError}
          />

          <CustomInput
            label="Deskripsi (Opsional)"
            placeholder="Masukkan catatan tambahan..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          {/* DATE PICKER TRIGGER */}
          <View style={styles.pickerFieldContainer}>
            <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>Tanggal Pengingat</Text>
            <TouchableOpacity
              style={[styles.pickerTrigger, { backgroundColor: theme.card, borderColor: dateError ? theme.danger : theme.border }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={{ color: dateSelected ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {dateSelected ? formatDateString(date) : 'Pilih Tanggal'}
              </Text>
              <Text style={{ fontSize: 16 }}>📅</Text>
            </TouchableOpacity>

            {/* Quick Date Presets */}
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const today = new Date();
                  setDate(today);
                  setDateSelected(true);
                  setDateError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>Hari Ini</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDate(tomorrow);
                  setDateSelected(true);
                  setDateError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>Besok</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const nextDay = new Date();
                  nextDay.setDate(nextDay.getDate() + 2);
                  setDate(nextDay);
                  setDateSelected(true);
                  setDateError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>Lusa</Text>
              </TouchableOpacity>
            </View>

            {dateError ? <Text style={[styles.errorText, { color: theme.danger }]}>{dateError}</Text> : null}
          </View>

          {/* TIME PICKER TRIGGER */}
          <View style={styles.pickerFieldContainer}>
            <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>Waktu Pengingat</Text>
            <TouchableOpacity
              style={[styles.pickerTrigger, { backgroundColor: theme.card, borderColor: timeError ? theme.danger : theme.border }]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={{ color: timeSelected ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {timeSelected ? formatTimeString(time) : 'Pilih Waktu'}
              </Text>
              <Text style={{ fontSize: 16 }}>⏰</Text>
            </TouchableOpacity>

            {/* Quick Time Presets */}
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const in15Min = new Date(Date.now() + 15 * 60 * 1000);
                  setTime(in15Min);
                  setTimeSelected(true);
                  setTimeError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>+15 Menit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const in1Hour = new Date(Date.now() + 60 * 60 * 1000);
                  setTime(in1Hour);
                  setTimeSelected(true);
                  setTimeError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>+1 Jam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetBadge, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => {
                  const in3Hours = new Date(Date.now() + 3 * 60 * 60 * 1000);
                  setTime(in3Hours);
                  setTimeSelected(true);
                  setTimeError('');
                }}
              >
                <Text style={[styles.presetText, { color: theme.primary }]}>+3 Jam</Text>
              </TouchableOpacity>
            </View>

            {timeError ? <Text style={[styles.errorText, { color: theme.danger }]}>{timeError}</Text> : null}
          </View>

          {/* DATE PICKER COMPONENT */}
          {Platform.OS !== 'web' && showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {/* TIME PICKER COMPONENT */}
          {Platform.OS !== 'web' && showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}

          <CustomButton
            title="Simpan Pengingat"
            onPress={handleAddReminder}
            loading={loading}
            style={styles.submitButton}
          />

          <CustomButton
            title="Batal"
            variant="secondary"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  pickerFieldContainer: {
    marginBottom: 16,
    width: '100%',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  pickerTrigger: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  presetBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 24,
  },
});
export default CreateReminderScreen;
