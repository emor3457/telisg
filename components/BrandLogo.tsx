import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

interface LogoProps {
  size?: number;
  color?: string;
}

export default function BrandLogo({ size = 40, color = colors.primary }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.accentOrange} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Dış Kalkan (Güvenlik ve Koruma) */}
        <Path 
          d="M50 5 L10 25 V50 C10 75 25 90 50 95 C75 90 90 75 90 50 V25 L50 5 Z" 
          fill="url(#grad)" 
          stroke={color} 
          strokeWidth="2" 
        />
        
        {/* İç Katman (Sağlamlık) */}
        <Path 
          d="M50 15 L20 30 V50 C20 70 32 82 50 85 C68 82 80 70 80 50 V30 L50 15 Z" 
          fill={colors.background} 
          opacity="0.9" 
        />

        {/* Artı İşareti (Sağlık ve İlk Yardım) */}
        <Rect x="42" y="30" width="16" height="40" fill={colors.primary} rx="2" />
        <Rect x="30" y="42" width="40" height="16" fill={colors.primary} rx="2" />

        {/* Merkezdeki Gözlem Dairesi (Denetim ve İnceleme) */}
        <Circle cx="50" cy="50" r="4" fill={colors.accentOrange} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
