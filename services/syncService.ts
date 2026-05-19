import { supabase } from './supabase';
import { useObservationStore, ObservationItem } from '../store/observationStore';
import { useActionStore } from '../store/actionStore';

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
