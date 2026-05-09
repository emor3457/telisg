import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import { exportData, importData, clearAllData } from '../../services/dataManager';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>Profil ve Ayarlar</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Ad Soyad</Text>
        <Text style={styles.value}>{user?.name || 'Misafir Kullanıcı'}</Text>

        <Text style={styles.label}>E-posta</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>

        <Text style={styles.label}>Yetki</Text>
        <Text style={styles.value}>{user?.role === 'inspector' ? 'İSG Uzmanı' : 'Personel'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Veri Yönetimi (Yedekleme)</Text>
      <View style={styles.card}>
        <View style={styles.buttonGroup}>
          <PrimaryButton title="Verileri Dışa Aktar (.json)" onPress={handleExport} />
          <View style={styles.spacer} />
          <PrimaryButton title="Yedekten Geri Yükle" onPress={handleImport} />
          <View style={styles.spacer} />
          <PrimaryButton title="Tüm Verileri Sıfırla" onPress={handleClear} />
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <PrimaryButton title="Çıkış Yap" onPress={signOut} />
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    marginTop: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  spacer: {
    height: 12,
  },
  logoutContainer: {
    marginTop: 20,
  },
});
