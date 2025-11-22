import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface AnimatedLayoutProps {
  children: React.ReactNode;
  key?: string; // To trigger animations on change
}

export const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(800).easing(require('react-native-reanimated').Easing.out(require('react-native-reanimated').Easing.exp))}
      exiting={FadeOut.duration(500)}
      layout={Layout.springify()}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  }
});


