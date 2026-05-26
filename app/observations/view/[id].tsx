import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useObservationStore } from '../../../store/observationStore';
import PrimaryButton from '../../../components/PrimaryButton';
import { generateObservationPDF } from '../../../services/reportService';

export default function ViewObservationScreen() {
  const { id } = useLocalSearchParams();
  const observations = useObservationStore((state) => state.observations);
  const observation = observations.find((o) => o.id === id);
  const [isExporting, setIsExporting] = useState(false);

  if (!observation) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Gözlem bulunamadı.</Text>
        <PrimaryButton title="Geri Dön" onPress={() => router.back()} />
      </View>
    );
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateObservationPDF(observation);
    } catch (error) {
      Alert.alert('Hata', 'PDF raporu oluşturulurken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  const riskLabel = observation.riskLevel === 'CRITICAL' ? 'KRİTİK' 
                  : observation.riskLevel === 'HIGH' ? 'YÜKSEK' 
                  : observation.riskLevel === 'MEDIUM' ? 'ORTA' 
                  : 'DÜŞÜK';

  // İlk fotoğrafı al veya fallback göster
  const mainImageUri = observation.photos && observation.photos.length > 0 
    ? observation.photos[0].uri 
    : 'https://picsum.photos/400';

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: mainImageUri }}
        style={styles.image}
      />

      <Text style={styles.sectionTitle}>{observation.displayId || 'Saha Gözlem Detayı'}</Text>
      
      <Text style={styles.dateLabel}>Tespit Tarihi: {new Date(observation.date).toLocaleString('tr-TR')}</Text>

      {observation.location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            GPS: {observation.location.latitude.toFixed(6)}, {observation.location.longitude.toFixed(6)}
            {observation.location.altitude ? ` (Alt: ${observation.location.altitude.toFixed(1)}m)` : ''}
          </Text>
        </View>
      )}

      <Text style={styles.label}>Tespit Edilen Tehlike</Text>
      <Text style={styles.value}>{observation.hazard}</Text>

      <Text style={styles.label}>Risk Seviyesi</Text>
      <Text style={[styles.risk, { 
        color: observation.riskLevel === 'CRITICAL' ? '#991B1B' 
             : observation.riskLevel === 'HIGH' ? '#DC2626' 
             : observation.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A' 
      }]}>
        {riskLabel}
      </Text>

      <Text style={styles.label}>Önerilen Kontroller / Aksiyonlar</Text>
      <Text style={styles.value}>
        {observation.controls.map((control: string, idx: number) => (
          <Text key={idx}>{`- ${control}\n`}</Text>
        ))}
      </Text>

      <View style={styles.buttonContainer}>
        {isExporting ? (
          <ActivityIndicator size="large" color="#0F766E" style={{ marginBottom: 20 }} />
        ) : (
          <View style={{ marginBottom: 12 }}>
            <PrimaryButton 
              title="PDF Raporu Oluştur" 
              onPress={handleExportPDF} 
            />
          </View>
        )}
        <PrimaryButton title="Geri Dön" onPress={() => router.back()} />
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
  locationContainer: {
    backgroundColor: '#E0F2F1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0F766E',
  },
  locationText: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  }
});
