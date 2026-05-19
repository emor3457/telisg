import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useObservationStore } from '../../store/observationStore';
import { useActionStore } from '../../store/actionStore';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const observations = useObservationStore((state) => state.observations);
  const actions = useActionStore((state) => state.actions);

  // --- Gerçek Verilerden Hesaplama ---
  const stats = {
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

  const actionStats = {
    pending: actions.filter(a => a.status === 'Bekliyor').length,
    inProgress: actions.filter(a => a.status === 'Devam Ediyor').length,
    completed: actions.filter(a => a.status === 'Tamamlandı').length,
  };

  const hasActionData = actionStats.pending + actionStats.inProgress + actionStats.completed > 0;

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
    color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>İSG Analitik</Text>
        <Text style={styles.subtitle}>📈 Gerçek Zamanlı Veriler</Text>
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryItem, { borderLeftColor: colors.accentOrange }]}>
          <Text style={styles.summaryLabel}>Toplam Gözlem</Text>
          <Text style={styles.summaryValue}>{observations.length}</Text>
        </View>
        <View style={[styles.summaryItem, { borderLeftColor: colors.accentBlue }]}>
          <Text style={styles.summaryLabel}>Aktif Aksiyon</Text>
          <Text style={styles.summaryValue}>{actionStats.pending + actionStats.inProgress}</Text>
        </View>
        <View style={[styles.summaryItem, { borderLeftColor: colors.success }]}>
          <Text style={styles.summaryLabel}>Tamamlanan</Text>
          <Text style={styles.summaryValue}>{actionStats.completed}</Text>
        </View>
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
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Henüz Gözlem Yok</Text>
            <Text style={styles.emptyText}>Kamera ile ilk saha gözlemini kaydedin.</Text>
          </View>
        )}
      </View>

      {/* Aksiyon Durumları Kartı */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Aksiyon İzleme (DÖF)</Text>
        {hasActionData ? (
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
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Henüz Aksiyon Yok</Text>
            <Text style={styles.emptyText}>Gözlemlerden aksiyon oluşturulduğunda burada görünecek.</Text>
          </View>
        )}
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
    marginBottom: 20,
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
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 20,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
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
  emptyContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
