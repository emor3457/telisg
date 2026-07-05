import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import { exportData, importData, clearAllData } from '../../services/dataManager';
import { syncData, fetchRemoteData } from '../../services/syncService';
import { useSettingsStore } from '../../store/settingsStore';
import { colors } from '../../theme/colors';

// ---------- Küçük yardımcı bileşenler ----------

function EditableListItem({
  text,
  onEdit,
  onDelete,
}: {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{text}</Text>
      <View style={styles.listItemActions}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
          <Ionicons name="pencil-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddItemRow({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState('');
  return (
    <View style={styles.addRow}>
      <TextInput
        style={styles.addInput}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          if (text.trim()) {
            onAdd(text.trim());
            setText('');
          }
        }}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// ---------- Ana Ekran ----------

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);

  const {
    userName, setUserName,
    userTitle, setUserTitle,
    expertName, setExpertName,
    companyName, setCompanyName,
    companyLogo, setCompanyLogo,
    // Listeler
    locations, addLocation, updateLocation, removeLocation,
    addSubLocation, updateSubLocation, removeSubLocation,
    departments, addDepartment, updateDepartment, removeDepartment,
    activities, addActivity, updateActivity, removeActivity,
    // ID Format
    idFormat, setIdFormat, locationCode, setLocationCode,
    // AI Ayarları
    customApiKey, setCustomApiKey, aiModel, setAiModel,
  } = useSettingsStore();

  const [editingIdFormat, setEditingIdFormat] = useState(idFormat);
  const [editingLocCode, setEditingLocCode] = useState(locationCode);

  const toggleSection = (key: string) =>
    setExpandedSection(expandedSection === key ? null : key);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncData();
      await fetchRemoteData();
      Alert.alert('Başarılı', 'Bulut senkronizasyonu tamamlandı.');
    } catch {
      Alert.alert('Hata', 'Senkronizasyon sırasında bir sorun oluştu.');
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportData();
    } catch {
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir hata oluştu.');
    }
  };

  const handleImport = async () => {
    try {
      const success = await importData();
      if (success) Alert.alert('Başarılı', 'Veriler başarıyla içe aktarıldı.');
    } catch {
      Alert.alert('Hata', 'Veriler içe aktarılırken bir hata oluştu.');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Bu işlem tüm gözlem ve aksiyon kayıtlarını cihazınızdan silecektir. Geri alınamaz. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Temizlendi', 'Tüm yerel veriler silindi.');
          },
        },
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
      setCompanyLogo(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const promptEdit = (current: string, onSave: (val: string) => void) => {
    Alert.prompt(
      'Düzenle',
      'Yeni adı girin:',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaydet',
          onPress: (val?: string) => {
            if (val?.trim()) onSave(val.trim());
          },
        },
      ],
      'plain-text',
      current
    );
  };

  // Örnek ID oluştur
  const previewId = editingIdFormat
    .replace('{LOC}', editingLocCode || 'IST')
    .replace('{TYPE}', 'SG')
    .replace('{YEAR}', new Date().getFullYear().toString().slice(-2))
    .replace('{MONTH}', (new Date().getMonth() + 1).toString().padStart(2, '0'))
    .replace('{SEQ}', '0001');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Profil ve Kurumsal Ayarlar</Text>

      {/* Hesap Bilgileri */}
      <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
      <View style={styles.card}>
        <Text style={styles.label}>E-posta</Text>
        <Text style={styles.userInfoText}>{user?.email}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.userInfoText}>
          {user?.role === 'admin' ? 'Yönetici' : 'Saha Personeli'}
        </Text>
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
          <PrimaryButton title="Şimdi Senkronize Et" onPress={handleSync} />
        )}
      </View>

      {/* Kurumsal Kimlik */}
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

      {/* Rapor İmza Yetkilileri */}
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

      {/* ================================================
          YENİ: Yapay Zeka Ayarları
          ================================================ */}
      <Text style={styles.sectionTitle}>Yapay Zeka Ayarları</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Kendi Gemini API Anahtarınız (Opsiyonel)</Text>
        <TextInput
          style={styles.input}
          value={customApiKey || ''}
          onChangeText={setCustomApiKey}
          placeholder="AI-..."
          secureTextEntry={true}
        />
        <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>AI Motoru Seçimi</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={[
              styles.modelOption,
              aiModel === 'gemini-2.5-flash' && styles.modelOptionSelected
            ]}
            onPress={() => setAiModel('gemini-2.5-flash')}
          >
            <Ionicons name="flash-outline" size={20} color={aiModel === 'gemini-2.5-flash' ? colors.primary : colors.muted} />
            <Text style={[styles.modelOptionText, aiModel === 'gemini-2.5-flash' && styles.modelOptionTextSelected]}>
              Ücretsiz / Hızlı
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modelOption,
              aiModel === 'gemini-2.5-pro' && styles.modelOptionSelected
            ]}
            onPress={() => setAiModel('gemini-2.5-pro')}
          >
            <Ionicons name="sparkles-outline" size={20} color={aiModel === 'gemini-2.5-pro' ? colors.primary : colors.muted} />
            <Text style={[styles.modelOptionText, aiModel === 'gemini-2.5-pro' && styles.modelOptionTextSelected]}>
              Ücretli / Detaylı
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================================================
          YENİ: Saha Referans Verileri
          ================================================ */}
      <Text style={styles.sectionTitle}>Saha Referans Verileri</Text>

      {/* --- Lokasyonlar --- */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('locations')}
        activeOpacity={0.8}
      >
        <View style={styles.accordionLeft}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.accordionTitle}>Bölümler ve Alt Bölümler</Text>
        </View>
        <Ionicons
          name={expandedSection === 'locations' ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.muted}
        />
      </TouchableOpacity>

      {expandedSection === 'locations' && (
        <View style={styles.accordionBody}>
          <AddItemRow
            placeholder="Yeni bölüm ekle (örn. C Hangar)..."
            onAdd={addLocation}
          />
          {locations.map((loc) => (
            <View key={loc.id} style={styles.locationGroup}>
              <View style={styles.locationHeader}>
                <Text style={styles.locationName}>{loc.name}</Text>
                <View style={styles.listItemActions}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() =>
                      promptEdit(loc.name, (val) => updateLocation(loc.id, val))
                    }
                  >
                    <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => removeLocation(loc.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() =>
                      setExpandedLocationId(
                        expandedLocationId === loc.id ? null : loc.id
                      )
                    }
                  >
                    <Ionicons
                      name={expandedLocationId === loc.id ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {expandedLocationId === loc.id && (
                <View style={styles.subLocationGroup}>
                  <AddItemRow
                    placeholder="Alt bölüm ekle..."
                    onAdd={(name) => addSubLocation(loc.id, name)}
                  />
                  {loc.subLocations.map((sub) => (
                    <EditableListItem
                      key={sub.id}
                      text={`  ↳ ${sub.name}`}
                      onEdit={() =>
                        promptEdit(sub.name, (val) =>
                          updateSubLocation(loc.id, sub.id, val)
                        )
                      }
                      onDelete={() => removeSubLocation(loc.id, sub.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* --- Departmanlar --- */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('departments')}
        activeOpacity={0.8}
      >
        <View style={styles.accordionLeft}>
          <Ionicons name="people-outline" size={20} color={colors.primary} />
          <Text style={styles.accordionTitle}>Sorumlu Departmanlar</Text>
        </View>
        <Ionicons
          name={expandedSection === 'departments' ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.muted}
        />
      </TouchableOpacity>

      {expandedSection === 'departments' && (
        <View style={styles.accordionBody}>
          <AddItemRow
            placeholder="Yeni departman ekle..."
            onAdd={addDepartment}
          />
          {departments.map((dept) => (
            <EditableListItem
              key={dept.id}
              text={dept.name}
              onEdit={() =>
                promptEdit(dept.name, (val) => updateDepartment(dept.id, val))
              }
              onDelete={() => removeDepartment(dept.id)}
            />
          ))}
        </View>
      )}

      {/* --- Faaliyetler --- */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('activities')}
        activeOpacity={0.8}
      >
        <View style={styles.accordionLeft}>
          <Ionicons name="construct-outline" size={20} color={colors.primary} />
          <Text style={styles.accordionTitle}>Faaliyet Türleri</Text>
        </View>
        <Ionicons
          name={expandedSection === 'activities' ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.muted}
        />
      </TouchableOpacity>

      {expandedSection === 'activities' && (
        <View style={styles.accordionBody}>
          <AddItemRow
            placeholder="Yeni faaliyet türü ekle..."
            onAdd={addActivity}
          />
          {activities.map((act) => (
            <EditableListItem
              key={act.id}
              text={act.name}
              onEdit={() =>
                promptEdit(act.name, (val) => updateActivity(act.id, val))
              }
              onDelete={() => removeActivity(act.id)}
            />
          ))}
        </View>
      )}

      {/* ================================================
          YENİ: Kayıt Numarası Formatı
          ================================================ */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Kayıt Numarası Formatı</Text>
      <View style={styles.card}>
        <Text style={[styles.label, { marginBottom: 4 }]}>Lokasyon Kodu</Text>
        <TextInput
          style={styles.input}
          value={editingLocCode}
          onChangeText={setEditingLocCode}
          placeholder="Örn: IST, ANK, TBZ..."
          autoCapitalize="characters"
          maxLength={5}
        />

        <Text style={[styles.label, { marginTop: 12, marginBottom: 4 }]}>ID Format Şablonu</Text>
        <TextInput
          style={styles.input}
          value={editingIdFormat}
          onChangeText={setEditingIdFormat}
          placeholder="{LOC}-{TYPE}{YEAR}-{SEQ}"
          autoCapitalize="characters"
        />

        <View style={styles.tokenHints}>
          {['{LOC}', '{TYPE}', '{YEAR}', '{MONTH}', '{SEQ}'].map((token) => (
            <View key={token} style={styles.tokenBadge}>
              <Text style={styles.tokenText}>{token}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Örnek Çıktı:</Text>
          <Text style={styles.previewId}>{previewId}</Text>
        </View>

        <TouchableOpacity
          style={styles.saveFormatBtn}
          onPress={() => {
            setIdFormat(editingIdFormat);
            setLocationCode(editingLocCode);
            Alert.alert('Kaydedildi', 'Kayıt numarası formatı güncellendi.');
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="white" />
          <Text style={styles.saveFormatText}>Formatı Kaydet</Text>
        </TouchableOpacity>
      </View>

      {/* Veri Yönetimi */}
      <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
      <View style={styles.card}>
        <View style={styles.buttonGroup}>
          <PrimaryButton title="Verileri Yedekle (.json)" onPress={handleExport} />
          <View style={styles.spacer} />
          <PrimaryButton title="Yedekten Geri Yükle" onPress={handleImport} />
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.dangerTextButton} onPress={handleClear}>
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 24 },
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
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
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
  logoImage: { width: '100%', height: '100%' },
  logoPlaceholder: { alignItems: 'center' },
  logoPlaceholderText: { fontSize: 10, fontWeight: '700', color: colors.muted, marginTop: 4 },
  logoInfo: { flex: 1 },
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
    marginBottom: 8,
  },
  divider: { height: 1, backgroundColor: colors.surface, marginVertical: 16 },
  buttonGroup: { flexDirection: 'column' },
  spacer: { height: 12 },
  dangerTextButton: { padding: 12, alignItems: 'center' },
  dangerText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  userInfoText: { fontSize: 16, fontWeight: '600', color: colors.text },
  logoutContainer: { marginTop: 8 },

  // Accordion
  accordionHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accordionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  accordionBody: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  // List items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  listItemText: { fontSize: 15, color: colors.text, flex: 1 },
  listItemActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },

  // Add row
  addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  addInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Location group
  locationGroup: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  locationName: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  subLocationGroup: { padding: 8 },

  // ID Format
  tokenHints: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tokenBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tokenText: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
  previewBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewLabel: { fontSize: 11, color: '#166534', fontWeight: '700', marginBottom: 4 },
  previewId: { fontSize: 18, fontWeight: '800', color: '#15803D', letterSpacing: 1 },
  saveFormatBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveFormatText: { color: 'white', fontWeight: '700', fontSize: 15 },
  
  // AI Settings
  modelOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'white',
  },
  modelOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  modelOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textAlign: 'center',
  },
  modelOptionTextSelected: {
    color: colors.primary,
  },
});
