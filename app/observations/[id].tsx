import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import PrimaryButton from '../../components/PrimaryButton';
import PhotoGallery from '../../components/PhotoGallery';
import { useImageStore } from '../../store/imageStore';
import { useObservationStore } from '../../store/observationStore';
import { useActionStore } from '../../store/actionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { analyzeObservation } from '../../services/aiAnalysis';
import { generateDisplayID } from '../../services/idService';
import { calculateTargetDate } from '../../services/slaService';
import { colors } from '../../theme/colors';

// ... (SelectModal and SelectRow stay the same)

export default function ObservationDetailScreen() {
  const { photos } = useImageStore();
  const params = useLocalSearchParams();
  const { locations, departments, activities, idFormat, locationCode } = useSettingsStore();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectionDate] = useState(new Date().toISOString());

  // ... (selections stay the same)

  const currentPhoto = photos.length > 0 ? photos[0] : null;

  useEffect(() => {
    async function runAnalysis() {
      if (!currentPhoto) {
        setError('Görüntü bulunamadı.');
        setLoading(false);
        return;
      }
      try {
        // Read file as base64 for AI analysis
        const base64 = await FileSystem.readAsStringAsync(currentPhoto.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const result = await analyzeObservation(base64);
        setAnalysis(result);
      } catch (err: any) {
        setError(err.message || 'Analiz sırasında bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    runAnalysis();
  }, [currentPhoto]);

  const handleSave = () => {
    if (!currentPhoto) return;

    const obsId = Date.now().toString();
    const observations = useObservationStore.getState().observations;

    const currentYear = new Date().getFullYear().toString().slice(-2);
    const yearObservations = observations.filter((o) =>
      o.displayId?.includes(`SG${currentYear}`)
    );
    const nextSeq = yearObservations.length + 1;

    const displayId = generateDisplayID('SG', nextSeq, currentYear, undefined, undefined, idFormat, locationCode);

    // Gözlemi kaydet
    useObservationStore.getState().addObservation({
      id: obsId,
      displayId,
      hazard: analysis.hazard,
      riskLevel: analysis.riskLevel,
      controls: analysis.controls,
      photos: photos, // Use all photos from the store
      timestamp: Date.now(),
      date: detectionDate,
      location: params.lat ? {
        latitude: parseFloat(params.lat as string),
        longitude: parseFloat(params.lon as string),
        altitude: params.alt ? parseFloat(params.alt as string) : null,
      } : undefined,
      location_name: selectedLocation || undefined,
      subLocation: selectedSubLocation || undefined,
      department: selectedDepartment || undefined,
      activity: selectedActivity || undefined,
    });

    // Aksiyonları kaydet (DÖF)
    analysis.controls.forEach((control: string, index: number) => {
      useActionStore.getState().addAction({
        id: `${obsId}-${index}`,
        displayId: generateDisplayID('DF', nextSeq, currentYear, displayId, index + 1, idFormat, locationCode),
        parentObservationId: obsId,
        parentDisplayId: displayId,
        title: control,
        status: 'Bekliyor',
        targetDate: calculateTargetDate(analysis.riskLevel, new Date(detectionDate)),
        riskLevel: analysis.riskLevel,
        department: selectedDepartment || undefined,
        location: selectedLocation
          ? [selectedLocation, selectedSubLocation].filter(Boolean).join(' / ')
          : undefined,
      });
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <PhotoGallery />

      <Text style={styles.sectionTitle}>Yapay Zeka Tehlike Analizi</Text>
      <Text style={styles.dateLabel}>
        Tespit Tarihi: {new Date(detectionDate).toLocaleString('tr-TR')}
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Yapay zeka analiz ediyor, lütfen bekleyin...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : analysis ? (
        <View>
          {/* --- AI Analiz Sonuçları --- */}
          <Text style={styles.label}>Tespit Edilen Tehlike</Text>
          <Text style={styles.value}>{analysis.hazard}</Text>

          <Text style={styles.label}>Risk Seviyesi</Text>
          <Text
            style={[
              styles.risk,
              {
                color:
                  analysis.riskLevel === 'CRITICAL'
                    ? '#991B1B'
                    : analysis.riskLevel === 'HIGH'
                    ? '#DC2626'
                    : analysis.riskLevel === 'MEDIUM'
                    ? '#F59E0B'
                    : '#16A34A',
              },
            ]}
          >
            {analysis.riskLevel === 'CRITICAL'
              ? 'KRİTİK'
              : analysis.riskLevel === 'HIGH'
              ? 'YÜKSEK'
              : analysis.riskLevel === 'MEDIUM'
              ? 'ORTA'
              : 'DÜŞÜK'}
          </Text>

          <Text style={styles.label}>Önerilen Kontroller / Aksiyonlar</Text>
          <Text style={styles.value}>
            {analysis.controls.map((control: string, idx: number) => (
              <Text key={idx}>{`- ${control}\n`}</Text>
            ))}
          </Text>

          {/* --- Saha Bilgileri --- */}
          <View style={styles.fieldInfoCard}>
            <Text style={styles.fieldInfoTitle}>
              <Ionicons name="location-outline" size={16} color={colors.primary} /> Saha Bilgileri
            </Text>

            <SelectRow
              label="Bölüm (Lokasyon)"
              value={selectedLocation}
              placeholder="Lokasyon seçin..."
              onPress={() => setShowLocationModal(true)}
            />

            {selectedLocation ? (
              <SelectRow
                label="Alt Bölüm"
                value={selectedSubLocation}
                placeholder="Alt lokasyon seçin..."
                onPress={() => setShowSubLocationModal(true)}
              />
            ) : null}

            <SelectRow
              label="Faaliyet"
              value={selectedActivity}
              placeholder="Faaliyet seçin..."
              onPress={() => setShowActivityModal(true)}
            />

            <SelectRow
              label="Sorumlu Departman"
              value={selectedDepartment}
              placeholder="Departman seçin..."
              onPress={() => setShowDepartmentModal(true)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton title="Gözlemi Kaydet & Aksiyon Oluştur" onPress={handleSave} />
          </View>
        </View>
      ) : null}

      <View style={{ height: 40 }} />

      {/* --- Modallar --- */}
      <SelectModal
        visible={showLocationModal}
        title="Bölüm Seç"
        items={locations.map((l) => ({ label: l.name, value: l.name }))}
        onSelect={(val) => {
          setSelectedLocation(val);
          setSelectedSubLocation(''); // Alt lokasyonu sıfırla
        }}
        onClose={() => setShowLocationModal(false)}
      />

      <SelectModal
        visible={showSubLocationModal}
        title="Alt Bölüm Seç"
        items={subLocationItems}
        onSelect={(val) => setSelectedSubLocation(val)}
        onClose={() => setShowSubLocationModal(false)}
      />

      <SelectModal
        visible={showDepartmentModal}
        title="Sorumlu Departman Seç"
        items={departments.map((d) => ({ label: d.name, value: d.name }))}
        onSelect={(val) => setSelectedDepartment(val)}
        onClose={() => setShowDepartmentModal(false)}
      />

      <SelectModal
        visible={showActivityModal}
        title="Faaliyet Seç"
        items={activities.map((a) => ({ label: a.name, value: a.name }))}
        onSelect={(val) => setSelectedActivity(val)}
        onClose={() => setShowActivityModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    fontWeight: '500',
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
    color: '#374151',
  },
  value: {
    color: '#374151',
    lineHeight: 24,
  },
  risk: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  center: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
  },
  // Saha Bilgileri Kartı
  fieldInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  fieldInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  // Seçici satır
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectRowLeft: {
    flex: 1,
    marginRight: 8,
  },
  selectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  selectValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  selectPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});
