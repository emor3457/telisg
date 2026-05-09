import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/favicon.png')} // Changed to use default favicon.png to avoid missing asset error
        style={styles.logo}
      />

      <Text style={styles.title}>İSG Yönetim Sistemi</Text>

      <Text style={styles.subtitle}>
        Aksiyon Takibi ve Yapay Zeka Destekli Güvenlik
      </Text>

      <PrimaryButton
        title="Başla"
        onPress={() => router.push('/auth/signin')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F3F4F6',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 40,
    textAlign: 'center',
  },
});
