import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Title, Body } from './Typography';
import { VignetteView } from './VignetteView';

interface ReflectionQuestionProps {
  question: string;
  onContinue: () => void;
  seconds?: number;
  instructionText?: string;
  buttonText?: string;
}

export const ReflectionQuestion = ({ 
  question, 
  onContinue, 
  seconds = 20, 
  instructionText = "Reflect on this...",
  buttonText = "Continue"
}: ReflectionQuestionProps) => {
  const [canContinue, setCanContinue] = useState(false);
  const progress = useSharedValue(0);
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    // Start progress bar animation
    progress.value = withTiming(1, { 
      duration: seconds * 1000, 
      easing: Easing.linear 
    });

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`
  }));

  return (
    <VignetteView>
      <View style={styles.content}>
        <Title>{question}</Title>
        <Body style={styles.instruction}>{instructionText}</Body>

        {/* Timer / Progress Bar */}
        <View style={styles.timerContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, progressStyle]} />
          </View>
          <Text style={styles.timerText}>
             {timeLeft > 0 ? `Wait ${timeLeft}s` : 'Ready'}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, !canContinue && styles.buttonDisabled]} 
          onPress={canContinue ? onContinue : undefined}
          activeOpacity={canContinue ? 0.7 : 1}
        >
          <Text style={[styles.buttonText, !canContinue && styles.buttonTextDisabled]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </VignetteView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instruction: {
    opacity: 0.7,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  timerContainer: {
    width: '80%',
    marginBottom: 40,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
  timerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    minWidth: 180,
    alignItems: 'center',
  },
  buttonDisabled: {
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.2)',
  }
});
