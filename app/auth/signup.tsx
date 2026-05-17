import { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    await signUp(email, password, name);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap Oluştur</Text>

      <TextInput
        placeholder="Ad Soyad"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0F766E" />
      ) : (
        <PrimaryButton
          title="Kayıt Ol"
          onPress={handleSignUp}
        />
      )}

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
