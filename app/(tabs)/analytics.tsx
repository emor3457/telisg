import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { useObservationStore } from '../../store/observationStore';
import { useActionStore } from '../../store/actionStore';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const observations = useObservationStore((state) => state.observations);
  const actions = useActionStore((state) => state.actions);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Veri Kontrolü
  const hasData = observations.length > 0 || actions.length > 0;
  const showDemo = isDemoMode || !hasData;

  // --- Veri Hazırlığı ---

  // Gözlemler (Risk Dağılımı)
  const stats = showDemo ? {
    critical: 5,
    high: 12,
    medium: 8,
    low: 15
  } : {
    critical: observations.filter(o => o.riskLevel === 'CRITICAL').length,
    high: observations.filter(o => o.riskLevel === 'HIGH').length,
    medium: observations.filter(o => o.riskLevel === 'MEDIUM').length,
    low: observations.filter(o => o.riskLevel === 'LOW').length,
  };

  const pieData = [
    { name: 'Kritik', population: stats.critical, color: '#991B1B', legendFontColor: colors.text, legendFontSize: 12 },
    { name: 'Yüksek', population: stats.high, color: colors.danger, legendFontColor: colors.text, legendFontSize: 12 },
    { name: 'Orta', population: stats.medium, color: colors.warning, legendFontColor: colors.text, legendFontSize: 12 },
    { name: 'Düşük', population: stats.low, color: colors.success, legendFontColor: colors.text, legendFontSize: 12 },
  ].filter(d => d.population > 0);

  // Aksiyonlar (Durum Dağılımı)
  const actionStats = showDemo ? {
    pending: 10,
    inProgress: 14,
    completed: 25
  } : {
    pending: actions.filter(a => a.status === 'Bekliyor').length,
    inProgress: actions.filter(a => a.status === 'Devam Ediyor').length,
    completed: actions.filter(a => a.status === 'Tamamlandı').length,
  };

  const barData = {
    labels: ['Bekliyor', 'Devam Eden', 'Tamamlanan'],
    datasets: [
      {
        data: [actionStats.pending, actionStats.inProgress, actionStats.completed],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`, // primary color
    labelColor: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>İSG Analitik</Text>
          <Text style={styles.subtitle}>{showDemo ? '📊 Demo Verileri Gösteriliyor' : '📈 Gerçek Zamanlı Veriler'}</Text>
        </View>
        {hasData && (
          <TouchableOpacity 
            style={[styles.demoBadge, isDemoMode && styles.demoBadgeActive]} 
            onPress={() => setIsDemoMode(!isDemoMode)}
          >
            <Text style={styles.demoBadgeText}>{isDemoMode ? 'Gerçeğe Dön' : 'Demo Modu'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Risk Dağılımı Kartı */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Seviyesi Dağılımı</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Veri bulunamadı.</Text>
          </View>
        )}
      </View>

      {/* Aksiyon Durumları Kartı */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Aksiyon İzleme (DÖF)</Text>
        <BarChart
          data={barData}
          width={screenWidth - 64}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.barChart}
          showValuesOnTopOfBars
        />
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryItem, { borderLeftColor: colors.accentOrange }]}>
          <Text style={styles.summaryLabel}>Toplam Gözlem</Text>
          <Text style={styles.summaryValue}>{showDemo ? '40' : observations.length}</Text>
        </View>
        <View style={[styles.summaryItem, { borderLeftColor: colors.accentBlue }]}>
          <Text style={styles.summaryLabel}>Aktif Aksiyon</Text>
          <Text style={styles.summaryValue}>{showDemo ? '24' : actionStats.pending + actionStats.inProgress}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  demoBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  demoBadgeActive: {
    backgroundColor: colors.accentOrange,
    borderColor: colors.accentOrange,
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 40,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
  },
});
