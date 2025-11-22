import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { VignetteView } from './VignetteView';
import { Title } from './Typography';

interface ChoiceVignetteProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const ChoiceVignette = ({ options, onSelect }: ChoiceVignetteProps) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.optionButton} 
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  optionButton: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  }
});

