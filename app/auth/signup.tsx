import { View, TextInput, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap Oluştur</Text>

      <TextInput
        placeholder="Ad Soyad"
        style={styles.input}
      />

      <TextInput
        placeholder="E-posta"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Şifre"
        secureTextEntry
        style={styles.input}
      />

      <PrimaryButton
        title="Kayıt Ol"
        onPress={() => router.replace('/(tabs)/dashboard')}
      />

      <Text
        style={styles.link}
        onPress={() => router.back()}
      >
        Zaten hesabınız var mı? Giriş Yap
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0F766E',
    fontWeight: '600',
  },
});
