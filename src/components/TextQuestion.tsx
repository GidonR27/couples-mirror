import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Body } from './Typography';

interface TextQuestionProps {
  question: string;
  onSubmit: (text: string) => void;
}

export const TextQuestion = ({ question, onSubmit }: TextQuestionProps) => {
  const [text, setText] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Body style={styles.questionText}>{question}</Body>
      
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type your answer..."
        placeholderTextColor="#666"
        multiline
        textAlignVertical="top"
      />
      
      <TouchableOpacity 
        style={[styles.button, !text.trim() && styles.buttonDisabled]} 
        onPress={() => onSubmit(text)}
        disabled={!text.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    marginBottom: 30,
    fontSize: 24,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#FFF',
    padding: 20,
    borderRadius: 12,
    fontSize: 18,
    minHeight: 150,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  }
});


