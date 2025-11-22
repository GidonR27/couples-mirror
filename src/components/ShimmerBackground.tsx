import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window');

export const ShimmerBackground = () => {
  const { theme, themeColors } = useTheme();
  
  const progress = useSharedValue(0);
  const previousColor = useSharedValue(themeColors.default[0]);
  const currentColor = useSharedValue(themeColors.default[0]);
  
  const previousSecondary = useSharedValue(themeColors.default[1]);
  const currentSecondary = useSharedValue(themeColors.default[1]);

  useEffect(() => {
    // When theme changes:
    // 1. Set previous colors to current animated value (conceptually) 
    //    (Simpler: just shift current target to previous)
    previousColor.value = currentColor.value;
    previousSecondary.value = currentSecondary.value;
    
    // 2. Set new target
    currentColor.value = themeColors[theme][0];
    currentSecondary.value = themeColors[theme][1];
    
    // 3. Reset progress and animate to 1
    progress.value = 0;
    progress.value = withTiming(1, { duration: 2000 });
  }, [theme, themeColors]);

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      [previousColor.value, currentColor.value]
    );
    return { backgroundColor: bg };
  });

  const animatedSecondaryStyle = useAnimatedStyle(() => {
     const bg = interpolateColor(
      progress.value,
      [0, 1],
      [previousSecondary.value, currentSecondary.value]
    );
    return { 
      backgroundColor: bg,
      opacity: 0.4
    };
  });

  // We'll use a simple layered approach for the "Shimmer" or Gradient effect
  // A base layer + a radial-like overlay
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
      
      {/* Pseudo-Radial Gradient effect using a large rounded view or similar */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          { 
             top: '20%',
             left: '-20%',
             width: '140%',
             height: '100%',
             borderRadius: width,
             transform: [{ scale: 1.2 }],
             filter: Platform.OS === 'web' ? 'blur(100px)' : undefined
          },
          animatedSecondaryStyle
        ]} 
      />
      
      {/* Ambient Texture / Noise could go here */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
    </View>
  );
};
