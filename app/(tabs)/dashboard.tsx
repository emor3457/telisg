import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingCameraButton from '../../components/FloatingCameraButton';
import DashboardCard from '../../components/DashboardCard';
import BrandLogo from '../../components/BrandLogo';
import { useActionStore } from '../../store/actionStore';
import { useObservationStore } from '../../store/observationStore';

export default function DashboardScreen() {
  const actions = useActionStore((state) => state.actions);
  const observations = useObservationStore((state) => state.observations);

  const pendingCount = actions.filter((a) => a.status === 'Bekliyor').length;
  const inProgressCount = actions.filter((a) => a.status === 'Devam Ediyor').length;
  const completedCount = actions.filter((a) => a.status === 'Tamamlandı').length;
  
  // Assuming all observations are "Open" for now, or you can filter by a property if added
  const openObsCount = observations.length;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <BrandLogo size={40} />
          <Text style={styles.title}>İSG Kontrol Paneli</Text>
        </View>

        <DashboardCard
          title="Bekleyen Aksiyonlar"
          value={pendingCount.toString()}
          color="#F59E0B"
        />

        <DashboardCard
          title="Devam Edenler"
          value={inProgressCount.toString()}
          color="#0EA5E9"
        />

        <DashboardCard
          title="Tamamlananlar"
          value={completedCount.toString()}
          color="#16A34A"
        />

        <DashboardCard
          title="Açık Saha Gözlemleri"
          value={openObsCount.toString()}
          color="#DC2626"
        />
      </ScrollView>

      <FloatingCameraButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#141413',
  },
});
