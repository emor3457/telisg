import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useImageStore } from '../../store/imageStore';
import * as FileSystem from 'expo-file-system/legacy';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Canvas,
  Image as SkImage,
  useImage,
  Path,
  Skia,
  SkPath,
  ImageFormat,
} from '@shopify/react-native-skia';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

interface DrawingPath {
  path: SkPath;
  color: string;
}

export default function AnnotateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const photo = useImageStore((state) => state.photos.find((p) => p.id === id));
  const updatePhotoUri = useImageStore((state) => state.updatePhotoUri);
  
  const skImage = useImage(photo?.uri);
  const canvasRef = useRef<any>(null);
  
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const [color, setColor] = useState<string>('red');

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Fotoğraf bulunamadı.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart((g) => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(g.x, g.y);
      setCurrentPath(newPath);
    })
    .onUpdate((g) => {
      setCurrentPath((prevPath) => {
        if (prevPath) {
          prevPath.lineTo(g.x, g.y);
          return prevPath.copy();
        }
        return prevPath;
      });
    })
    .onEnd(() => {
      setCurrentPath((prevPath) => {
        if (prevPath) {
          setPaths((prevPaths) => [...prevPaths, { path: prevPath, color }]);
        }
        return null;
      });
    });

  const undo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const save = async () => {
    try {
      const snapshot = canvasRef.current?.makeImageSnapshot();
      if (snapshot) {
        const base64 = snapshot.encodeToBase64(ImageFormat.JPEG, 100);
        const filename = `annotated_${Date.now()}.jpg`;
        const fileUri = FileSystem.cacheDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        updatePhotoUri(id, fileUri);
        router.back();
      }
    } catch (e) {
      console.error(e);
      alert('Fotoğraf kaydedilirken hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View style={styles.canvasContainer}>
          <Canvas style={{ width, height: height - 100 }} ref={canvasRef}>
            {skImage && (
              <SkImage
                image={skImage}
                fit="contain"
                x={0}
                y={0}
                width={width}
                height={height - 100}
              />
            )}
            {paths.map((p, index) => (
              <Path
                key={index}
                path={p.path}
                color={p.color}
                style="stroke"
                strokeWidth={5}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath && (
              <Path
                path={currentPath}
                color={color}
                style="stroke"
                strokeWidth={5}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </View>
      </GestureDetector>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        
        <View style={styles.colors}>
          <TouchableOpacity 
            style={[styles.colorCircle, { backgroundColor: 'red', borderWidth: color === 'red' ? 3 : 0, borderColor: 'white' }]} 
            onPress={() => setColor('red')}
          />
          <TouchableOpacity 
            style={[styles.colorCircle, { backgroundColor: 'yellow', borderWidth: color === 'yellow' ? 3 : 0, borderColor: 'white' }]} 
            onPress={() => setColor('yellow')}
          />
        </View>

        <TouchableOpacity style={styles.toolBtn} onPress={undo}>
          <Ionicons name="arrow-undo" size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolBtn} onPress={clear}>
          <Ionicons name="trash" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  canvasContainer: {
    flex: 1,
  },
  toolbar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  toolBtn: {
    padding: 10,
  },
  colors: {
    flexDirection: 'row',
    gap: 15,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
