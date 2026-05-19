import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import { exportData, importData, clearAllData } from '../../services/dataManager';
import { syncData, fetchRemoteData } from '../../services/syncService';
import { useSettingsStore } from '../../store/settingsStore';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const { 
    userName, setUserName, 
    userTitle, setUserTitle, 
    expertName, setExpertName,
    companyName, setCompanyName,
    companyLogo, setCompanyLogo 
  } = useSettingsStore();

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncData();
      await fetchRemoteData();
      Alert.alert('Başarılı', 'Bulut senkronizasyonu tamamlandı.');
    } catch (error) {
      Alert.alert('Hata', 'Senkronizasyon sırasında bir sorun oluştu.');
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportData();
    } catch (error) {
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir hata oluştu.');
    }
  };

  const handleImport = async () => {
    try {
      const success = await importData();
      if (success) {
        Alert.alert('Başarılı', 'Veriler başarıyla içe aktarıldı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Veriler içe aktarılırken veya okunurken bir hata oluştu.');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Bu işlem tüm gözlem ve aksiyon kayıtlarını cihazınızdan silecektir. Bu işlem geri alınamaz. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet, Sil', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Temizlendi', 'Tüm yerel veriler silindi.');
          }
        }
      ]
    );
  };

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      // PDF service expects base64 or a URI that it can read. 
      // For easier PDF generation, let's store base64 prefixed with data:image/png;base64,
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      setCompanyLogo(base64);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Profil ve Kurumsal Ayarlar</Text>

      {/* Kullanıcı Bilgisi */}
      <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
      <View style={styles.card}>
        <Text style={styles.label}>E-posta</Text>
        <Text style={styles.userInfoText}>{user?.email}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.userInfoText}>{user?.role === 'admin' ? 'Yönetici' : 'Saha Personeli'}</Text>
      </View>

      {/* Bulut Senkronizasyonu */}
      <Text style={styles.sectionTitle}>Bulut Senkronizasyonu</Text>
      <View style={styles.card}>
        <Text style={[styles.label, { marginBottom: 12 }]}>
          Verilerinizi tüm cihazlarınızda görmek için bulut ile senkronize edin.
        </Text>
        {syncing ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PrimaryButton 
            title="Şimdi Senkronize Et" 
            onPress={handleSync} 
          />
        )}
      </View>

      {/* Şirket Logosu */}
      <Text style={styles.sectionTitle}>Kurumsal Kimlik</Text>
      <View style={styles.card}>
        <View style={styles.logoRow}>
          <TouchableOpacity style={styles.logoPicker} onPress={pickLogo}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="business" size={32} color={colors.muted} />
                <Text style={styles.logoPlaceholderText}>Logo Seç</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.logoInfo}>
            <Text style={styles.label}>Şirket Adı</Text>
            <TextInput
              style={styles.input}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Şirket ismini girin..."
            />
          </View>
        </View>
      </View>

      {/* Rapor Bilgileri */}
      <Text style={styles.sectionTitle}>Rapor İmza Yetkilileri</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Hazırlayan Ad Soyad</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Ad Soyad..."
        />

        <Text style={styles.label}>Hazırlayan Unvan</Text>
        <TextInput
          style={styles.input}
          value={userTitle}
          onChangeText={setUserTitle}
          placeholder="Örn: Saha Şefi..."
        />

        <View style={styles.divider} />

        <Text style={styles.label}>Onaylayan İSG Uzmanı</Text>
        <TextInput
          style={styles.input}
          value={expertName}
          onChangeText={setExpertName}
          placeholder="İSG Uzmanı Ad Soyad..."
        />
      </View>

      <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
      <View style={styles.card}>
        <View style={styles.buttonGroup}>
          <PrimaryButton title="Verileri Yedekle (.json)" onPress={handleExport} />
          <View style={styles.spacer} />
          <PrimaryButton title="Yedekten Geri Yükle" onPress={handleImport} />
          <View style={styles.spacer} />
          <TouchableOpacity 
            style={styles.dangerTextButton} 
            onPress={handleClear}
          >
            <Text style={styles.dangerText}>Tüm Verileri Temizle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <PrimaryButton title="Oturumu Kapat" onPress={signOut} />
      </View>
      
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accentOrange,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoPicker: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    marginTop: 4,
  },
  logoInfo: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.surface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 16,
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  spacer: {
    height: 12,
  },
  dangerTextButton: {
    padding: 12,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutContainer: {
    marginTop: 8,
  },
});

