import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export const Title = (props: TextProps) => (
  <Text {...props} style={[styles.title, props.style]} />
);

export const Subtitle = (props: TextProps) => (
  <Text {...props} style={[styles.subtitle, props.style]} />
);

export const Body = (props: TextProps) => (
  <Text {...props} style={[styles.body, props.style]} />
);

export const Quote = (props: TextProps) => (
  <Text {...props} style={[styles.quote, props.style]} />
);

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: '200', // Lighter, more cinematic
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1.2,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#D4AF37', // Gold
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.9,
  },
  body: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '300',
  },
  quote: {
    fontSize: 24,
    fontWeight: '300',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginVertical: 40,
    paddingHorizontal: 24,
    lineHeight: 36,
  }
});
