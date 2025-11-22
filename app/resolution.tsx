import React, { useEffect, Suspense } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useSessionStore } from '../src/store/sessionStore';
import { Title, Body, Subtitle, Quote } from '../src/components/Typography';
import { AnimatedLayout } from '../src/components/AnimatedLayout';

// Lazy loads
const ShimmerBackground = React.lazy(() => 
  import('../src/components/ShimmerBackground').then(module => ({ default: module.ShimmerBackground }))
);

const ResolutionFractal = React.lazy(() => 
  import('../src/components/ResolutionFractal').then(module => ({ default: module.ResolutionFractal }))
);

const { width, height } = Dimensions.get('window');

export default function Resolution() {
  const { getSortedDuoDimensions } = useSessionStore();
  
  const priorities = getSortedDuoDimensions().slice(0, 2);

  return (
    <View style={styles.container}>
      <Suspense fallback={<View />}>
        <ShimmerBackground />
      </Suspense>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.visualContainer}>
           <Suspense fallback={<ActivityIndicator color="#D4AF37" />}>
             <ResolutionFractal />
           </Suspense>
        </View>

        <AnimatedLayout>
          <View style={styles.textContent}>
            <Title>Resolution</Title>
            <Quote>
              “When these five dimensions align, purpose arises naturally. Meaning and direction aren’t imposed — they emerge as the field of coherence itself.”
            </Quote>

            <View style={styles.section}>
              <Subtitle>Your Focus for the Coming Week</Subtitle>
              {priorities.map((dim, i) => (
                <View key={dim.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{i + 1}. {dim.title}</Text>
                  <Body style={styles.cardBody}>{dim.actionIdea}</Body>
                </View>
              ))}
            </View>

            <Body style={styles.footer}>
              A flourishing system knows where it’s going because it is fully alive.
            </Body>
          </View>
        </AnimatedLayout>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  visualContainer: {
    height: height * 0.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    padding: 20,
    marginTop: -40,
  },
  section: {
    marginVertical: 30,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  cardTitle: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 16,
    textAlign: 'left',
  },
  footer: {
    marginTop: 20,
    fontStyle: 'italic',
    opacity: 0.7,
  }
});
