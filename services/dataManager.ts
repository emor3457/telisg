import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useObservationStore } from '../store/observationStore';
import { useActionStore } from '../store/actionStore';

export const exportData = async () => {
  try {
    const observations = useObservationStore.getState().observations;
    const actions = useActionStore.getState().actions;

    const data = {
      observations,
      actions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `isg_yedek_${new Date().getTime()}.json`;
    const file = new FileSystem.File(FileSystem.Paths.document, fileName);

    file.write(jsonString);

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'İSG Verilerini Yedekle',
    });

    return true;
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

export const importData = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return false;
    }

    const file = new FileSystem.File(result.assets[0].uri);
    const fileContent = await file.text();

    const parsedData = JSON.parse(fileContent);

    if (parsedData.observations) {
      // Basic merge strategy: overwrite or append. We'll append missing IDs.
      const currentObs = useObservationStore.getState().observations;
      const currentObsIds = new Set(currentObs.map(o => o.id));
      
      parsedData.observations.forEach((obs: any) => {
        if (!currentObsIds.has(obs.id)) {
           useObservationStore.getState().addObservation(obs);
        }
      });
    }

    if (parsedData.actions) {
      const currentActions = useActionStore.getState().actions;
      const currentActionIds = new Set(currentActions.map(a => a.id));

      parsedData.actions.forEach((action: any) => {
        if (!currentActionIds.has(action.id)) {
           useActionStore.getState().addAction(action);
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Supabase'den sil
      const { error: obsError } = await supabase
        .from('observations')
        .delete()
        .eq('user_id', session.user.id);
      
      const { error: actionError } = await supabase
        .from('actions')
        .delete()
        .eq('user_id', session.user.id);

      if (obsError || actionError) {
        console.error('Remote clear error:', obsError || actionError);
      }
    }

    // Yerel store'ları temizle
    useObservationStore.setState({ observations: [] });
    useActionStore.setState({ actions: [] });
    return true;
  } catch (error) {
    console.error('Clear error:', error);
    throw error;
  }
};
