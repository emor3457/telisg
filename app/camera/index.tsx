import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useImageStore } from '../../store/imageStore';
import { getCurrentLocation } from '../../services/locationService';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const photos = useImageStore((state) => state.photos);
  const addPhoto = useImageStore((state) => state.addPhoto);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kamera izni gerekiyor.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (photos.length >= 5) {
      alert('En fazla 5 fotoğraf çekebilirsiniz.');
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      
      if (photo) {
        // Capture location
        let location = null;
        try {
          location = await getCurrentLocation();
        } catch (e) {
          console.warn('Location capture failed', e);
        }

        addPhoto({
          id: Date.now().toString(),
          uri: photo.uri,
          status: 'pending',
          location: location || undefined,
        });
      }
    }
  };

  const handleDone = () => {
    if (photos.length === 0) {
      alert('Lütfen en az bir fotoğraf çekin.');
      return;
    }

    // Pass latest location via router params for observation's main location
    const latestLocation = photos[photos.length - 1]?.location;
    
    router.replace({
      pathname: '/observations/[id]',
      params: { 
        id: '1',
        lat: latestLocation?.latitude,
        lon: latestLocation?.longitude,
        alt: latestLocation?.altitude
      }
    });
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <View style={styles.buttonContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          {photos.length > 0 && (
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneText}>Tamam ({photos.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{photos.length} / 5</Text>
          </View>
          <TouchableOpacity 
            style={[styles.captureButton, photos.length >= 5 && { opacity: 0.5 }]} 
            onPress={takePicture}
            disabled={photos.length >= 5}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  closeButton: {
    padding: 10,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  doneText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  counterContainer: {
    width: 60,
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
