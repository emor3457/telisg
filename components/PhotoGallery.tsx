import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useImageStore, PhotoAsset } from '../store/imageStore';
import { colors } from '../theme/colors';

export default function PhotoGallery() {
  const photos = useImageStore((state) => state.photos);
  const removePhoto = useImageStore((state) => state.removePhoto);
  const reorderPhotos = useImageStore((state) => state.reorderPhotos);
  const router = useRouter();

  if (photos.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotoğraf Galerisi ({photos.length} / 5)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {photos.map((photo, index) => (
          <View key={photo.id} style={styles.photoContainer}>
            <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
            
            {/* Index Badge */}
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => removePhoto(photo.id)}
              testID={`remove-photo-${index}`}
            >
              <Ionicons name="close-circle" size={24} color={colors.danger} />
            </TouchableOpacity>

            {/* Edit Button */}
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => router.push(`/annotate/${photo.id}`)}
              testID={`edit-photo-${index}`}
            >
              <Ionicons name="color-wand" size={22} color="white" />
            </TouchableOpacity>

            {/* Reorder Controls */}
            <View style={styles.controls}>
              <TouchableOpacity 
                style={[styles.controlButton, index === 0 && styles.disabled]} 
                onPress={() => index > 0 && reorderPhotos(index, index - 1)}
                disabled={index === 0}
                testID={`move-left-${index}`}
              >
                <Ionicons name="arrow-back" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.controlButton, index === photos.length - 1 && styles.disabled]} 
                onPress={() => index < photos.length - 1 && reorderPhotos(index, index + 1)}
                disabled={index === photos.length - 1}
                testID={`move-right-${index}`}
              >
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  photoContainer: {
    width: 120,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 35,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    padding: 5,
  },
  disabled: {
    opacity: 0.3,
  },
});
