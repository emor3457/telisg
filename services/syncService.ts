import { supabase } from './supabase';
import { useObservationStore, ObservationItem } from '../store/observationStore';
import { useActionStore } from '../store/actionStore';
import { useImageStore } from '../store/imageStore';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_OBSERVATION_SYNC = 'BACKGROUND_OBSERVATION_SYNC';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadFileWithSignedUrl = async (id: string, uri: string, remotePath: string, attempt = 0): Promise<void> => {
  const { updatePhotoStatus } = useImageStore.getState();
  
  try {
    updatePhotoStatus(id, 'uploading');
    
    const { data, error: signedUrlError } = await supabase.storage
      .from('observations')
      .createSignedUploadUrl(remotePath);
    
    if (signedUrlError || !data) {
      throw new Error(signedUrlError?.message || 'Failed to create signed URL');
    }
    
    const { signedUrl } = data;
    
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const { error: uploadError } = await supabase.storage
      .from('observations')
      .uploadToSignedUrl(signedUrl, blob);
    
    if (uploadError) {
      throw uploadError;
    }
    
    updatePhotoStatus(id, 'completed');
  } catch (error) {
    if (attempt < 3) {
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Retrying upload for ${id} in ${waitTime}ms (Attempt ${attempt + 1})`);
      await delay(waitTime);
      return uploadFileWithSignedUrl(id, uri, remotePath, attempt + 1);
    }
    updatePhotoStatus(id, 'failed');
    console.error('Upload failed after retries:', error);
    throw error;
  }
};

TaskManager.defineTask(BACKGROUND_OBSERVATION_SYNC, async () => {
  try {
    const photos = useImageStore.getState().photos;
    const pendingPhotos = photos.filter(p => p.status === 'pending' || p.status === 'failed');
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (pendingPhotos.length > 0 && session) {
      for (const photo of pendingPhotos) {
        const remotePath = `observations/${session.user.id}/${photo.id}.jpg`;
        try {
          await uploadFileWithSignedUrl(photo.id, photo.uri, remotePath);
        } catch (err) {
          console.error(`Failed to sync photo ${photo.id}:`, err);
        }
      }
    }
    
    await syncData();
    
    return pendingPhotos.length > 0 
      ? BackgroundFetch.BackgroundFetchResult.NewData 
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundSync = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_OBSERVATION_SYNC);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_OBSERVATION_SYNC, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background sync task registered');
    }
  } catch (err) {
    console.error('Background sync registration failed:', err);
  }
};

export const syncData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Observations Sync
    const localObservations = useObservationStore.getState().observations;
    if (localObservations.length > 0) {
      const { error: obsError } = await supabase
        .from('observations')
        .upsert(
          localObservations.map(obs => ({
            ...obs,
            user_id: session.user.id,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'id' }
        );
      
      if (obsError) console.error('Observations sync error:', obsError);
    }

    // Actions Sync
    const localActions = useActionStore.getState().actions;
    if (localActions.length > 0) {
      const { error: actionError } = await supabase
        .from('actions')
        .upsert(
          localActions.map(action => ({
            ...action,
            user_id: session.user.id,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'id' }
        );

      if (actionError) console.error('Actions sync error:', actionError);
    }

    console.log('Sync completed successfully');
  } catch (error) {
    console.error('General sync error:', error);
  }
};

export const fetchRemoteData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch Observations
    const { data: obsData, error: obsError } = await supabase
      .from('observations')
      .select('*')
      .eq('user_id', session.user.id);

    if (!obsError && obsData) {
      useObservationStore.setState({ observations: obsData });
    }

    // Fetch Actions
    const { data: actionData, error: actionError } = await supabase
      .from('actions')
      .select('*')
      .eq('user_id', session.user.id);

    if (!actionError && actionData) {
      useActionStore.setState({ actions: actionData });
    }
  } catch (error) {
    console.error('Fetch remote data error:', error);
  }
};
