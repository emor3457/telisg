import { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import ActionCard from '../../components/ActionCard';
import { useActionStore } from '../../store/actionStore';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

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

  const onComplete = (id: string) => {
    updateActionStatus(id, 'Tamamlandı');
  };

  const onDelete = (id: string) => {
    Alert.alert(
      'Aksiyonu Sil',
      'Bu aksiyonu silmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteAction(id) },
      ]
    );
  };

  const onStart = (id: string) => {
    updateActionStatus(id, 'Devam Ediyor');
  };

  const renderHiddenItem = (data: any) => (
    <View style={styles.hiddenContainer}>
      <View style={styles.leftHiddenContainer}>
        {data.item.status === 'Bekliyor' && (
          <TouchableOpacity
            style={[styles.hiddenButton, styles.startButton]}
            onPress={() => onStart(data.item.id)}
          >
            <Ionicons name="play" size={28} color="white" />
            <Text style={styles.hiddenText}>Başlat</Text>
          </TouchableOpacity>
        )}
        
        {data.item.status !== 'Tamamlandı' && (
          <TouchableOpacity
            style={[styles.hiddenButton, styles.completeButton]}
            onPress={() => onComplete(data.item.id)}
          >
            <Ionicons name="checkmark-done" size={28} color="white" />
            <Text style={styles.hiddenText}>Tamamla</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.hiddenButton, styles.deleteButton]}
        onPress={() => onDelete(data.item.id)}
      >
        <Ionicons name="trash" size={28} color="white" />
        <Text style={styles.hiddenText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aksiyon Takibi</Text>
        <Text style={styles.subtitle}>{actions.length} Aktif Görev</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Aksiyon ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.muted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.muted} />
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
        leftOpenValue={200}
        rightOpenValue={-100}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  hiddenContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
  },
  leftHiddenContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  hiddenButton: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  startButton: {
    backgroundColor: colors.accentBlue,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  completeButton: {
    backgroundColor: colors.success,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  hiddenText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 4,
  },
});


