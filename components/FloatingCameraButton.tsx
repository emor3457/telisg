import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FloatingCameraButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/camera')}
    >
      <Ionicons
        name="camera"
        size={28}
        color="white"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 50,
    right: 24,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
