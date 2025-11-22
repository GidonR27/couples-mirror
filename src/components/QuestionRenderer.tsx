import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { VignetteView } from './VignetteView';
import { Title, Body } from './Typography';
import { MetaphorSlider } from './MetaphorSlider';
import { ChoiceVignette } from './ChoiceVignette';
import { ReflectionQuestion } from './ReflectionQuestion';
import { GuidingQuestion, LastQuestion } from '../data/content';
import Animated, { FadeIn } from 'react-native-reanimated';

interface QuestionRendererProps {
  mode: 'guiding' | 'last';
  data: GuidingQuestion | LastQuestion;
  onAnswer: (answer: any) => void;
}

export const QuestionRenderer = ({ mode, data, onAnswer }: QuestionRendererProps) => {
  const [selectedVal, setSelectedVal] = useState<any>(null);

  // Reset selection when data changes (if key prop isn't sufficient upstream)
  useEffect(() => {
    setSelectedVal(null);
  }, [data]);

  const handleContinue = () => {
    if (selectedVal) {
      onAnswer(selectedVal);
    }
  };
  
  if (mode === 'guiding') {
    const q = data as GuidingQuestion;
    return (
      <VignetteView key={q.question}>
        <View style={styles.content}>
          <Title>{q.question}</Title>
          <MetaphorSlider 
            options={q.rangeExamples} 
            onSelect={(val) => setSelectedVal(val)} 
            initialValue={undefined}
          />
          
          {/* Reserved space for button to prevent layout shift */}
          <View style={styles.buttonPlaceholder}>
            {selectedVal && (
              <Animated.View entering={FadeIn.duration(500)} style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </VignetteView>
    );
  }

  if (mode === 'last') {
    const q = data as LastQuestion;
    
    if (q.type === 'choice' && q.options) {
       return (
        <VignetteView key={q.question}>
          <View style={styles.content}>
            <Title>{q.question}</Title>
            <ChoiceVignette 
              options={q.options} 
              onSelect={onAnswer} 
            />
          </View>
        </VignetteView>
      );
    }

    // Text/Reflection Type -> Use Reflection Timer
    return (
      <ReflectionQuestion 
        key={q.question}
        question={q.question}
        onContinue={() => onAnswer('completed')}
        seconds={20}
        instructionText="Take a moment to recall and reflect."
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonPlaceholder: {
    marginTop: 30,
    height: 60, // Fixed height reserved for the button
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  }
});
