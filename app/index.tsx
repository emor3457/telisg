import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import PrimaryButton from '../components/PrimaryButton';
import BrandLogo from '../components/BrandLogo';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Arka Plan Dekoratif Şekiller */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      <View style={styles.content}>
        {/* Üst Kısım: AI Badge */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.aiBadge}
        >
          <Ionicons name="sparkles" size={14} color={colors.accentOrange} />
          <Text style={styles.aiBadgeText}>YAPAY ZEKA DESTEKLİ</Text>
        </Animated.View>

        {/* Orta Kısım: Logo ve Başlık */}
        <Animated.View 
          entering={FadeIn.delay(400).duration(1000)}
          style={[styles.logoContainer, animatedLogoStyle]}
        >
          <BrandLogo size={180} />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInUp.delay(600).duration(800)}
            style={styles.brandName}
          >
            TELISG<Text style={{ color: colors.accentOrange }}>PRO</Text>
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(800).duration(800)}
            style={styles.title}
          >
            İSG Yönetiminin Geleceği
          </Animated.Text>

          <Animated.Text 
            entering={FadeInUp.delay(1000).duration(800)}
            style={styles.subtitle}
          >
            Saha gözlemlerini yapay zeka ile analiz edin, riskleri önceden tespit edin ve iş güvenliğini bir adım öteye taşıyın.
          </Animated.Text>
        </View>

        {/* Alt Kısım: Buton */}
        <Animated.View 
          entering={FadeInUp.delay(1200).duration(800)}
          style={styles.buttonContainer}
        >
          <PrimaryButton
            title="Sisteme Giriş Yap"
            onPress={() => router.push('/auth/signin')}
          />
          <Text style={styles.footerText}>ISO 45001 Standardına Uyumludur</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  backgroundShapes: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  shape: {
    position: 'absolute',
    borderRadius: 1000,
  },
  shape1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: colors.surface,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  shape2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(217, 119, 87, 0.05)',
    bottom: height * 0.1,
    left: -width * 0.2,
  },
  shape3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: colors.surface,
    bottom: -width * 0.1,
    right: width * 0.1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: height * 0.08,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1.2,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: height * 0.05,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 16,
    fontWeight: '600',
  },
});

