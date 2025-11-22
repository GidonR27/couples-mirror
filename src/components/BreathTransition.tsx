import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSequence,
  withRepeat,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { Quote } from './Typography';
import { DIMENSIONS } from '../data/content';

const { width } = Dimensions.get('window');
const ORB_SIZE = 16;
const CIRCLE_RADIUS = width * 0.28; 

// Poetic texts for each dimension
const DIMENSION_TEXTS = [
  "Your truth takes shape when seen.",
  "Real growth begins where we are held — and where we learn to hold.",
  "You learn through rhythm — giving, receiving, changing.",
  "Wholeness repeats across every scale of love.",
  "Time does not erase — it integrates."
];

const ORB_COLORS = [
  '#4A90E2', // Blue (Truth)
  '#50C878', // Green (Flourishing)
  '#E67E22', // Orange (Feedback)
  '#9B59B6', // Violet (Distributed)
  '#D4AF37', // Gold (Temporal)
];

interface BreathTransitionProps {
  onComplete: () => void;
  text?: string;
  completedIndex: number; // 0 to 4
  duoMode?: boolean; // New prop to trigger Duo logic
  completedDimensions?: string[]; // Array of dimension IDs completed in Duo
}

const Orb = ({ index, completedIndex, total, duoMode, completedDimensions }: { index: number, completedIndex: number, total: number, duoMode?: boolean, completedDimensions?: string[] }) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start at top (-90deg)
  const x = Math.cos(angle) * CIRCLE_RADIUS;
  const y = Math.sin(angle) * CIRCLE_RADIUS;

  // Determine if active/completed based on mode
  let isActive = false;
  let isCompleted = false;
  const dimId = DIMENSIONS[index].id;

  if (duoMode && completedDimensions) {
    // In Duo mode:
    // Active if it matches the current completedIndex (which is the original ID index)
    isActive = index === completedIndex;
    // Completed if its ID is in the list AND it's not the active one
    // We only want to show previously completed ones, but NOT future ones even if their index is lower
    isCompleted = completedDimensions.includes(dimId) && !isActive;
  } else {
    // Solo mode (sequential 0-4)
    isActive = index === completedIndex;
    isCompleted = index < completedIndex;
  }

  const scale = useSharedValue(isCompleted ? 1 : 0);
  const opacity = useSharedValue(isCompleted ? 1 : 0);
  const pulse = useSharedValue(1);
  const textOpacity = useSharedValue(isCompleted ? 0.7 : 0);

  useEffect(() => {
    if (isActive) {
      // Bloom animation for current item
      scale.value = withDelay(500, withTiming(1.5, { duration: 1000 }));
      opacity.value = withDelay(500, withTiming(1, { duration: 800 }));
      textOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
      
      pulse.value = withDelay(1500, withRepeat(withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1.0, { duration: 1000 })
      ), -1, true));
    } else if (isCompleted) {
       scale.value = 1;
       opacity.value = 1;
       textOpacity.value = 0.7;
    }
  }, [isActive, isCompleted]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x }, 
        { translateY: y },
        { scale: isActive ? scale.value * pulse.value : scale.value }
      ],
      opacity: opacity.value,
      backgroundColor: ORB_COLORS[index],
      shadowColor: ORB_COLORS[index],
      shadowRadius: isActive ? 20 : 10,
      shadowOpacity: isActive ? 0.8 : 0.5,
    };
  });

  // --- CUSTOM LABEL POSITIONING ---
  // Default push outward
  let textRadius = CIRCLE_RADIUS + 45;
  let textOffsetX = 0;
  let textOffsetY = 0;

  // Fine-tune specific indices
  if (index === 0) { // Truth Alignment (Top)
     textRadius = CIRCLE_RADIUS + 35; // "Lower" = closer to center
  }
  if (index === 1) { // Flourishing (Right)
     textOffsetX = -20; // "Left"
     textOffsetY = -20; // "Up a bit"
  }
  if (index === 2) { // Feedback (Bottom Right)
     textRadius = CIRCLE_RADIUS + 35; // "Closer"
     textOffsetY = 0; // "Higher"
  }

  const textX = Math.cos(angle) * textRadius + textOffsetX;
  const textY = Math.sin(angle) * textRadius + textOffsetY;

  const textStyle = useAnimatedStyle(() => ({
     opacity: textOpacity.value,
     transform: [
        { translateX: textX }, 
        { translateY: textY }
     ]
  }));

  const title = DIMENSIONS[index].title;

  return (
    <>
      <Animated.View style={[styles.orb, animatedStyle]} />
      <Animated.View style={[styles.labelContainer, textStyle]}>
         <Text style={[styles.labelText, { color: ORB_COLORS[index] }]}>
            {title}
         </Text>
      </Animated.View>
    </>
  );
};

export const BreathTransition = ({ onComplete, completedIndex, duoMode, completedDimensions }: BreathTransitionProps) => {
  const containerOpacity = useSharedValue(0);
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 1000 });

    breatheScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 3. Complete - Increased Duration
    const timeout = setTimeout(() => {
      runOnJS(onComplete)();
    }, 8000); // Increased from 5000 to 8000

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const systemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }]
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <Animated.View style={[styles.systemContainer, systemStyle]}>
          {/* Center Light/Flare */}
          <View style={styles.centerLight} />
          
          {/* Orbs and Labels */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Orb 
              key={i} 
              index={i} 
              completedIndex={completedIndex} 
              total={5} 
              duoMode={duoMode}
              completedDimensions={completedDimensions}
            />
          ))}
        </Animated.View>

        {/* Quote at bottom */}
        <View style={styles.textContainer}>
          <Quote style={[styles.subText, { color: ORB_COLORS[completedIndex] }]}>
            {DIMENSION_TEXTS[completedIndex]}
          </Quote>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000', 
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 0, 
  },
  systemContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, 
  },
  centerLight: {
    width: 2,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
    shadowColor: 'white',
    shadowRadius: 50,
    shadowOpacity: 0.2,
    position: 'absolute',
  },
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    shadowOffset: { width: 0, height: 0 },
  },
  labelContainer: {
    position: 'absolute',
    width: 100, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textContainer: {
    position: 'absolute',
    bottom: 60, 
    width: '90%',
    alignItems: 'center',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  }
});
