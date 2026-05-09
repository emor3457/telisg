import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useObservationStore, ObservationItem } from '../../store/observationStore';
import { useAuth } from '../../context/AuthContext';

export default function ObservationsScreen() {
  const { user } = useAuth();
  const observations = useObservationStore((state) => state.observations);
  const removeObservation = useObservationStore((state) => state.removeObservation);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredObservations = useMemo(() => {
    if (!searchQuery.trim()) return observations;
    const lowerQuery = searchQuery.toLowerCase();
    return observations.filter(obs => 
      obs.hazard.toLowerCase().includes(lowerQuery) ||
      obs.displayId?.toLowerCase().includes(lowerQuery) ||
      obs.riskLevel.toLowerCase().includes(lowerQuery)
    );
  }, [observations, searchQuery]);

  const renderItem = ({ item }: { item: ObservationItem }) => (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => router.push(`/observations/view/${item.id}`)}
      style={styles.card}
    >
      <Image
        source={{ uri: item.imageUri || 'https://picsum.photos/200' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        {item.displayId && <Text style={styles.idText}>{item.displayId}</Text>}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.hazard}
        </Text>
        <Text
          style={[
            styles.riskBadge,
            { backgroundColor: item.riskLevel === 'CRITICAL' ? '#991B1B' : item.riskLevel === 'HIGH' ? '#DC2626' : item.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A' },
          ]}
        >
          {item.riskLevel === 'CRITICAL' ? 'KRİTİK' : item.riskLevel === 'HIGH' ? 'YÜKSEK' : item.riskLevel === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK'}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data: any) => (
    <View style={styles.hiddenContainer}>
      {user?.role === 'admin' && (
        <TouchableOpacity
          style={[styles.hiddenButton, { backgroundColor: '#EF4444' }]}
          onPress={() => removeObservation(data.item.id)}
        >
          <Text style={styles.hiddenText}>Sil</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saha Gözlemleri</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Gözlem ara (Tehlike, ID veya Risk)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {filteredObservations.length === 0 ? (
        <Text style={styles.emptyText}>Sonuç bulunamadı.</Text>
      ) : (
        <SwipeListView
          data={filteredObservations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  hiddenContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hiddenButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
