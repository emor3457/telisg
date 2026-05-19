import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import { useImageStore } from '../../store/imageStore';
import { useObservationStore } from '../../store/observationStore';
import { useActionStore } from '../../store/actionStore';
import { analyzeObservation } from '../../services/aiAnalysis';
import { generateDisplayID } from '../../services/idService';
import { calculateTargetDate } from '../../services/slaService';

export default function ObservationDetailScreen() {
  const { currentImageUri, currentImageBase64 } = useImageStore();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectionDate] = useState(new Date().toISOString());

  useEffect(() => {
    async function runAnalysis() {
      if (!currentImageBase64) {
        setError("Görüntü bulunamadı.");
        setLoading(false);
        return;
      }
      
      try {
        const result = await analyzeObservation(currentImageBase64);
        setAnalysis(result);
      } catch (err: any) {
        setError(err.message || "Analiz sırasında bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [currentImageBase64]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: currentImageUri || 'https://picsum.photos/400' }}
        style={styles.image}
      />

      <Text style={styles.sectionTitle}>Yapay Zeka Tehlike Analizi</Text>
      
      <Text style={styles.dateLabel}>Tespit Tarihi: {new Date(detectionDate).toLocaleString('tr-TR')}</Text>

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
          <Text style={styles.label}>Tespit Edilen Tehlike</Text>
          <Text style={styles.value}>{analysis.hazard}</Text>

          <Text style={styles.label}>Risk Seviyesi</Text>
          <Text style={[styles.risk, { color: analysis.riskLevel === 'CRITICAL' ? '#991B1B' : analysis.riskLevel === 'HIGH' ? '#DC2626' : analysis.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A' }]}>
            {analysis.riskLevel === 'CRITICAL' ? 'KRİTİK' : analysis.riskLevel === 'HIGH' ? 'YÜKSEK' : analysis.riskLevel === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK'}
          </Text>

          <Text style={styles.label}>Önerilen Kontroller / Aksiyonlar</Text>
          <Text style={styles.value}>
            {analysis.controls.map((control: string, idx: number) => (
              <Text key={idx}>{`- ${control}\n`}</Text>
            ))}
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Gözlemi Kaydet & Aksiyon Oluştur"
              onPress={() => {
                const obsId = Date.now().toString();
                const observations = useObservationStore.getState().observations;
                const actions = useActionStore.getState().actions;
                
                // Get next sequence number based on current year
                const currentYear = new Date().getFullYear().toString().slice(-2);
                const yearObservations = observations.filter(o => o.displayId?.includes(`SG${currentYear}`));
                const nextSeq = yearObservations.length + 1;
                
                const displayId = generateDisplayID('SG', nextSeq, currentYear);
                
                // Kaydet: Observation Store
                useObservationStore.getState().addObservation({
                  id: obsId,
                  displayId: displayId,
                  hazard: analysis.hazard,
                  riskLevel: analysis.riskLevel,
                  controls: analysis.controls,
                  imageUri: currentImageUri,
                  date: detectionDate,
                });

                // Kaydet: Action Store (DÖF'ler)
                analysis.controls.forEach((control: string, index: number) => {
                  useActionStore.getState().addAction({
                    id: `${obsId}-${index}`,
                    displayId: generateDisplayID('DF', nextSeq, currentYear, displayId, index + 1),
                    parentDisplayId: displayId,
                    title: control,
                    status: 'Bekliyor',
                    targetDate: calculateTargetDate(analysis.riskLevel, new Date(detectionDate)),
                    riskLevel: analysis.riskLevel,
                  });
                });

                // Geri dön
                router.back();
              }}
            />
          </View>
        </View>
      ) : null}
      
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
  }
});
