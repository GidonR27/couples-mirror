import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Title, Body, Subtitle } from './Typography';

interface InfoScreenProps {
  title?: string;
  subtitle?: string;
  body?: string;
  onContinue: () => void;
  buttonText?: string;
}

export const InfoScreen = ({ title, subtitle, body, onContinue, buttonText = 'Continue' }: InfoScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {title && <Title>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {body && <Body>{body}</Body>}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '600',
  }
});


