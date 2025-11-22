import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming
} from 'react-native-reanimated';
import { RangeExample } from '../data/content';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.85;
const THUMB_WIDTH = 60;

interface MetaphorSliderProps {
  options: [RangeExample, RangeExample, RangeExample];
  onSelect: (value: number) => void;
  initialValue?: number; // 1, 2, or 3
}

export const MetaphorSlider = ({ options, onSelect, initialValue }: MetaphorSliderProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialValue ? initialValue - 1 : null);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    if (initialValue) {
        const sectionWidth = SLIDER_WIDTH / 3;
        translateX.value = withSpring((initialValue - 1) * sectionWidth + sectionWidth / 2 - THUMB_WIDTH / 2);
    }
  }, []);

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    const sectionWidth = SLIDER_WIDTH / 3;
    // Center thumb in section
    const targetX = index * sectionWidth + sectionWidth / 2 - THUMB_WIDTH / 2;
    translateX.value = withSpring(targetX, { damping: 15, stiffness: 120 });
    
    // Convert 0,1,2 to 1,2,3
    onSelect(index + 1);
  };

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: selectedIndex !== null ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Description Text Area - Dynamic based on selection */}
      <View style={styles.descriptionContainer}>
        {selectedIndex !== null ? (
          <Animated.View key={selectedIndex} entering={withTiming({ opacity: 0 })} style={styles.textWrapper}>
             <Text style={styles.descriptionLabel}>{options[selectedIndex].label}</Text>
             <Text style={styles.descriptionText}>
               "{options[selectedIndex].description}"
             </Text>
          </Animated.View>
        ) : (
          <Text style={styles.placeholderText}>Tap to reflect...</Text>
        )}
      </View>

      {/* Slider Track */}
      <View style={styles.trackContainer}>
        <View style={styles.trackBar} />
        
        {/* Thumb */}
        <Animated.View style={[styles.thumb, thumbStyle]} />

        {/* Touch Areas */}
        <View style={styles.touchLayer}>
          {options.map((_, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.touchArea} 
              onPress={() => handlePress(index)}
              activeOpacity={1}
            >
              <View style={[
                  styles.tick, 
                  selectedIndex === index && styles.activeTick
                ]} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  descriptionContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  textWrapper: {
    alignItems: 'center',
  },
  descriptionLabel: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  descriptionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  trackContainer: {
    width: SLIDER_WIDTH,
    height: 60,
    justifyContent: 'center',
  },
  trackBar: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 1,
  },
  touchLayer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_WIDTH,
    height: THUMB_WIDTH,
    borderRadius: THUMB_WIDTH / 2,
    backgroundColor: 'rgba(212, 175, 55, 0.3)', // Gold glow
    borderWidth: 1,
    borderColor: '#D4AF37',
    top: 30 - THUMB_WIDTH / 2, // Center vertically
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  tick: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeTick: {
    backgroundColor: '#D4AF37',
    transform: [{ scale: 1.2 }]
  }
});

