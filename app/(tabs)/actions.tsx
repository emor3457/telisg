import { useState, useMemo } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, TextInput, Alert, Modal,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import ActionCard from '../../components/ActionCard';
import { useActionStore } from '../../store/actionStore';
import { colors } from '../../theme/colors';
import { generateSummaryPDF } from '../../services/reportService';

// Filtre seçenekleri — bunları projenize göre genişletebilirsiniz
const DEPARTMENTS = ['Üretim', 'Bakım', 'Depo', 'Güvenlik', 'İdari', 'Saha'];
const LOCATIONS   = ['A Blok', 'B Blok', 'Hangar', 'Dış Saha', 'Yemekhane', 'Atölye'];
const STATUSES    = ['Bekliyor', 'Devam Ediyor', 'Tamamlandı'];

export default function ActionsScreen() {
  const actions = useActionStore((state) => state.actions);
  const updateActionStatus = useActionStore((state) => state.updateActionStatus);
  const deleteAction = useActionStore((state) => state.deleteAction);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterDept, setFilterDept] = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const activeFilterCount = [filterDept, filterLoc, filterStatus].filter(Boolean).length;

  const filteredActions = useMemo(() => {
    let result = [...actions];
    if (filterDept)   result = result.filter(a => a.department === filterDept);
    if (filterLoc)    result = result.filter(a => a.location === filterLoc);
    if (filterStatus) result = result.filter(a => a.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.displayId?.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [actions, filterDept, filterLoc, filterStatus, searchQuery]);

  const handleGenerateReport = async () => {
    setGeneratingPDF(true);
    try {
      await generateSummaryPDF(filteredActions, {
        department: filterDept || undefined,
        location: filterLoc || undefined,
        status: filterStatus || undefined,
      });
    } catch (e) {
      Alert.alert('Hata', 'PDF raporu oluşturulurken bir hata oluştu.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const onComplete = (id: string) => updateActionStatus(id, 'Tamamlandı');
  const onStart    = (id: string) => updateActionStatus(id, 'Devam Ediyor');
  const onDelete   = (id: string) => {
    Alert.alert('Aksiyonu Sil', 'Bu aksiyonu kalıcı olarak silmek istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Evet, Sil', style: 'destructive', onPress: () => deleteAction(id) },
    ]);
  };

  const renderHiddenItem = (data: any) => (
    <View style={styles.hiddenContainer}>
      <View style={styles.leftHiddenContainer}>
        {data.item.status === 'Bekliyor' && (
          <TouchableOpacity style={[styles.hiddenButton, styles.startButton]} onPress={() => onStart(data.item.id)}>
            <Ionicons name="play" size={24} color="white" />
            <Text style={styles.hiddenText}>Başlat</Text>
          </TouchableOpacity>
        )}
        {data.item.status !== 'Tamamlandı' && (
          <TouchableOpacity style={[styles.hiddenButton, styles.completeButton]} onPress={() => onComplete(data.item.id)}>
            <Ionicons name="checkmark-done" size={24} color="white" />
            <Text style={styles.hiddenText}>Tamamla</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={[styles.hiddenButton, styles.deleteButton]} onPress={() => onDelete(data.item.id)}>
        <Ionicons name="trash" size={24} color="white" />
        <Text style={styles.hiddenText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  const ChipRow = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.chip, !value && styles.chipActive]} onPress={() => onChange('')}>
          <Text style={[styles.chipText, !value && styles.chipTextActive]}>Tümü</Text>
        </TouchableOpacity>
        {options.map(opt => (
          <TouchableOpacity key={opt} style={[styles.chip, value === opt && styles.chipActive]} onPress={() => onChange(opt)}>
            <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Aksiyon Takibi</Text>
          <Text style={styles.subtitle}>{filteredActions.length} / {actions.length} Aksiyon</Text>
        </View>
        <TouchableOpacity style={styles.reportBtn} onPress={handleGenerateReport} disabled={generatingPDF}>
          {generatingPDF
            ? <ActivityIndicator size="small" color="white" />
            : <><Ionicons name="document-text" size={16} color="white" /><Text style={styles.reportBtnText}>PDF Rapor</Text></>
          }
        </TouchableOpacity>
      </View>

      {/* Arama + Filtre */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Aksiyon ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.muted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.filterIconBtn, activeFilterCount > 0 && styles.filterIconBtnActive]} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options" size={20} color={activeFilterCount > 0 ? 'white' : colors.primary} />
          {activeFilterCount > 0 && <Text style={styles.filterBadge}>{activeFilterCount}</Text>}
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {filteredActions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Aksiyon bulunamadı</Text>
          <Text style={styles.emptyText}>Filtre veya arama kriterlerini değiştirin.</Text>
        </View>
      ) : (
        <SwipeListView
          data={filteredActions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActionCard item={item} />}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={200}
          rightOpenValue={-100}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filtre Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrele</Text>
              <TouchableOpacity onPress={() => { setFilterDept(''); setFilterLoc(''); setFilterStatus(''); }}>
                <Text style={styles.resetText}>Sıfırla</Text>
              </TouchableOpacity>
            </View>

            <ChipRow label="Departman" options={DEPARTMENTS} value={filterDept} onChange={setFilterDept} />
            <ChipRow label="Lokasyon" options={LOCATIONS} value={filterLoc} onChange={setFilterLoc} />
            <ChipRow label="Durum" options={STATUSES} value={filterStatus} onChange={setFilterStatus} />

            <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyBtnText}>Uygula ({filteredActions.length} Sonuç)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, elevation: 3,
  },
  reportBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },

  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  filterIconBtn: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.primary, elevation: 2,
  },
  filterIconBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.danger, color: 'white',
    fontSize: 10, fontWeight: '800',
    width: 16, height: 16, borderRadius: 8, textAlign: 'center', lineHeight: 16,
  },

  hiddenContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderRadius: 12 },
  leftHiddenContainer: { flexDirection: 'row', height: '100%' },
  hiddenButton: { width: 100, height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  startButton: { backgroundColor: colors.accentBlue, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  completeButton: { backgroundColor: colors.success, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  deleteButton: { backgroundColor: colors.danger },
  hiddenText: { color: 'white', fontWeight: '700', fontSize: 11, marginTop: 3 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 13, color: colors.muted, marginTop: 4 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  resetText: { fontSize: 14, color: colors.danger, fontWeight: '700' },
  filterGroup: { marginBottom: 18 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.secondary,
    marginRight: 8, backgroundColor: 'white',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  chipTextActive: { color: 'white' },
  applyBtn: {
    backgroundColor: colors.primary, borderRadius: 16,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  applyBtnText: { color: 'white', fontWeight: '800', fontSize: 15 },
});
