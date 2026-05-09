import { View, Text, StyleSheet } from 'react-native';
import { getDaysRemaining } from '../services/slaService';

interface Props {
  item: {
    id: string;
    displayId?: string;
    title: string;
    status: string;
    targetDate?: string;
  };
}

export default function ActionCard({ item }: Props) {
  let slaColor = '#6B7280';
  let slaText = 'Termin Belirsiz';

  if (item.targetDate) {
    const days = getDaysRemaining(item.targetDate);
    if (days > 3) {
      slaColor = '#16A34A'; // Green
      slaText = `${days} Gün Kaldı`;
    } else if (days > 0) {
      slaColor = '#F59E0B'; // Orange
      slaText = `${days} Gün Kaldı`;
    } else if (days === 0) {
      slaColor = '#DC2626'; // Red
      slaText = 'Son Gün!';
    } else {
      slaColor = '#991B1B'; // Dark Red
      slaText = `${Math.abs(days)} Gün Gecikti`;
    }
  }

  // If completed, override SLA display
  if (item.status === 'Tamamlandı' || item.status === 'Completed') {
    slaColor = '#16A34A';
    slaText = 'Tamamlandı';
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {item.displayId && <Text style={styles.idText}>{item.displayId}</Text>}
        <View style={[styles.slaBadge, { backgroundColor: slaColor }]}>
          <Text style={styles.slaText}>{slaText}</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  slaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slaText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#6B7280',
  },
});
