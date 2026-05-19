import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';
import BrandLogo from '../components/BrandLogo';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const pulse = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(-20)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Staggered entry animations
    const createFadeIn = (opacity: Animated.Value, translateY: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 800, delay, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, delay, useNativeDriver: true }),
      ]);

    Animated.parallel([
      createFadeIn(badgeOpacity, badgeTranslateY, 200),
      Animated.timing(logoOpacity, { toValue: 1, duration: 1000, delay: 400, useNativeDriver: true }),
      createFadeIn(brandOpacity, brandTranslateY, 600),
      createFadeIn(titleOpacity, titleTranslateY, 800),
      createFadeIn(subtitleOpacity, subtitleTranslateY, 1000),
      createFadeIn(buttonOpacity, buttonTranslateY, 1200),
    ]).start();
  }, []);

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
          style={[styles.aiBadge, { opacity: badgeOpacity, transform: [{ translateY: badgeTranslateY }] }]}
        >
          <Ionicons name="sparkles" size={14} color={colors.accentOrange} />
          <Text style={styles.aiBadgeText}>YAPAY ZEKA DESTEKLİ</Text>
        </Animated.View>

        {/* Orta Kısım: Logo ve Başlık */}
        <Animated.View 
          style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: pulse }] }]}
        >
          <BrandLogo size={180} />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text 
            style={[styles.brandName, { opacity: brandOpacity, transform: [{ translateY: brandTranslateY }] }]}
          >
            TELISG<Text style={{ color: colors.accentOrange }}>PRO</Text>
          </Animated.Text>
          
          <Animated.Text 
            style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}
          >
            İSG Yönetiminin Geleceği
          </Animated.Text>

          <Animated.Text 
            style={[styles.subtitle, { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] }]}
          >
            Saha gözlemlerini yapay zeka ile analiz edin, riskleri önceden tespit edin ve iş güvenliğini bir adım öteye taşıyın.
          </Animated.Text>
        </View>

        {/* Alt Kısım: Buton */}
        <Animated.View 
          style={[styles.buttonContainer, { opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }]}
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
