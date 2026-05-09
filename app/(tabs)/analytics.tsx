import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useObservationStore } from '../../store/observationStore';
import { useActionStore } from '../../store/actionStore';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const observations = useObservationStore((state) => state.observations);
  const actions = useActionStore((state) => state.actions);

  // Gözlemler (Pie Chart) Veri Hazırlığı
  const criticalCount = observations.filter((o) => o.riskLevel === 'CRITICAL').length;
  const highCount = observations.filter((o) => o.riskLevel === 'HIGH').length;
  const mediumCount = observations.filter((o) => o.riskLevel === 'MEDIUM').length;
  const lowCount = observations.filter((o) => o.riskLevel === 'LOW').length;

  const pieData = [
    { name: 'Kritik', population: criticalCount, color: '#991B1B', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'Yüksek', population: highCount, color: '#DC2626', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'Orta', population: mediumCount, color: '#F59E0B', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'Düşük', population: lowCount, color: '#16A34A', legendFontColor: '#374151', legendFontSize: 12 },
  ].filter((item) => item.population > 0);

  // Aksiyonlar (Bar Chart) Veri Hazırlığı
  const pendingCount = actions.filter((a) => a.status === 'Bekliyor').length;
  const inProgressCount = actions.filter((a) => a.status === 'Devam Ediyor').length;
  const completedCount = actions.filter((a) => a.status === 'Tamamlandı').length;

  const barData = {
    labels: ['Bekliyor', 'Devam Ediyor', 'Bitti'],
    datasets: [
      {
        data: [pendingCount, inProgressCount, completedCount],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // primary color
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // text color
    barPercentage: 0.6,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>İSG Analitik</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Seviyelerine Göre Gözlemler</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 72}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        ) : (
          <Text style={styles.emptyText}>Henüz gözlem verisi yok.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Aksiyon Durumları</Text>
        <BarChart
          data={barData}
          width={screenWidth - 72}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          chartConfig={chartConfig}
          style={styles.chartStyle}
          showValuesOnTopOfBars
        />
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
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartStyle: {
    borderRadius: 16,
  },
  emptyText: {
    color: '#6B7280',
    marginVertical: 40,
  },
});
