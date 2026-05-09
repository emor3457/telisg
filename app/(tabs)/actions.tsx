import { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import ActionCard from '../../components/ActionCard';
import { useActionStore } from '../../store/actionStore';
import { useAuth } from '../../context/AuthContext';

export default function ActionsScreen() {
  const { user } = useAuth();
  const actions = useActionStore((state) => state.actions);
  const updateActionStatus = useActionStore((state) => state.updateActionStatus);
  const deleteAction = useActionStore((state) => state.deleteAction);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return actions;
    const lowerQuery = searchQuery.toLowerCase();
    return actions.filter(action => 
      action.title.toLowerCase().includes(lowerQuery) ||
      action.displayId?.toLowerCase().includes(lowerQuery) ||
      action.status.toLowerCase().includes(lowerQuery)
    );
  }, [actions, searchQuery]);

  const renderHiddenItem = (data: any) => (
    <View style={styles.hiddenContainer}>
      {data.item.status !== 'Tamamlandı' && (
        <TouchableOpacity
          style={[styles.hiddenButton, { backgroundColor: '#16A34A' }]}
          onPress={() => updateActionStatus(data.item.id, 'Tamamlandı')}
        >
          <Text style={styles.hiddenText}>Tamamla</Text>
        </TouchableOpacity>
      )}
      {data.item.status === 'Bekliyor' && (
        <TouchableOpacity
          style={[styles.hiddenButton, { backgroundColor: '#0EA5E9' }]}
          onPress={() => updateActionStatus(data.item.id, 'Devam Ediyor')}
        >
          <Text style={styles.hiddenText}>Başla</Text>
        </TouchableOpacity>
      )}
      {user?.role === 'admin' && (
        <TouchableOpacity
          style={[styles.hiddenButton, { backgroundColor: '#EF4444' }]}
          onPress={() => deleteAction(data.item.id)}
        >
          <Text style={styles.hiddenText}>Sil</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Aksiyon ara (Başlık, ID veya Durum)"
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

      <SwipeListView
        data={filteredActions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActionCard item={item} />
        )}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
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
