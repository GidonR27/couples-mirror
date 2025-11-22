import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Body } from './Typography';

interface RangeQuestionProps {
  question: string;
  options: { label: string; description: string; value: number }[];
  onSelect: (value: number) => void;
}

export const RangeQuestion = ({ question, options, onSelect }: RangeQuestionProps) => {
  return (
    <View style={styles.container}>
      <Body style={styles.questionText}>{question}</Body>
      
      <View style={styles.optionsContainer}>
        {options.map((opt, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.optionButton} 
            onPress={() => onSelect(opt.value)}
          >
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <Text style={styles.optionDesc}>{opt.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  questionText: {
    marginBottom: 40,
    fontSize: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionLabel: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDesc: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 22,
  }
});


