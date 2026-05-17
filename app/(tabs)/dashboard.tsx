import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FloatingCameraButton from '../../components/FloatingCameraButton';
import DashboardCard from '../../components/DashboardCard';
import BrandLogo from '../../components/BrandLogo';
import { useActionStore } from '../../store/actionStore';
import { useObservationStore } from '../../store/observationStore';
import { colors } from '../../theme/colors';

export default function DashboardScreen() {
  const actions = useActionStore((state) => state.actions);
  const observations = useObservationStore((state) => state.observations);

  const pendingCount = actions.filter((a) => a.status === 'Bekliyor').length;
  const inProgressCount = actions.filter((a) => a.status === 'Devam Ediyor').length;
  const completedCount = actions.filter((a) => a.status === 'Tamamlandı').length;
  
  const openObsCount = observations.length;

  // Kritik Uyarı Kontrolü (Bugünkü Kritik Riskler)
  const today = new Date().toISOString().split('T')[0];
  const criticalToday = observations.filter(o => 
    o.riskLevel === 'CRITICAL' && 
    o.date.startsWith(today)
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandLogo size={40} />
          <View>
            <Text style={styles.welcomeText}>Hoş Geldiniz,</Text>
            <Text style={styles.title}>İSG Paneli</Text>
          </View>
        </View>

        {criticalToday.length > 0 && (
          <TouchableOpacity style={styles.criticalBanner}>
            <View style={styles.criticalBadge}>
              <Ionicons name="warning" size={24} color="white" />
            </View>
            <View style={styles.criticalTextContainer}>
              <Text style={styles.criticalTitle}>KRİTİK GÜVENLİK UYARISI</Text>
              <Text style={styles.criticalSubtitle}>
                Bugün {criticalToday.length} adet kritik risk tespit edildi! Hemen aksiyon alın.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        )}

        <View style={styles.grid}>
          <DashboardCard
            title="Bekleyen Aksiyonlar"
            value={pendingCount.toString()}
            color={colors.accentOrange}
          />

          <DashboardCard
            title="Devam Edenler"
            value={inProgressCount.toString()}
            color={colors.accentBlue}
          />

          <DashboardCard
            title="Tamamlananlar"
            value={completedCount.toString()}
            color={colors.success}
          />

          <DashboardCard
            title="Saha Gözlemleri"
            value={openObsCount.toString()}
            color={colors.text}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Aksiyonlar</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/scanner')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Ekipman Denetimi (QR)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Özet</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="analytics" size={24} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={styles.summaryText}>Aksiyon Tamamlama Oranı</Text>
              <Text style={styles.summaryValue}>
                {actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0}%
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <FloatingCameraButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  criticalBanner: {
    backgroundColor: colors.danger,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  criticalBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },
  criticalTextContainer: {
    flex: 1,
  },
  criticalTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  criticalSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryIconContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
  },
  summaryText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  quickActionsContainer: {
    marginBottom: 10,
  },
  quickActionButton: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  quickActionIcon: {
    padding: 12,
    borderRadius: 16,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});

