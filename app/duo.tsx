import React, { useState, useEffect, Suspense } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../src/store/sessionStore';
import { DIMENSIONS, RESOLUTION_CONTENT, Dimension, ThemeColor } from '../src/data/content';
import { VignetteView } from '../src/components/VignetteView';
import { BreathTransition } from '../src/components/BreathTransition';
import { Title, Subtitle, Body, Quote } from '../src/components/Typography';
import { useTheme } from '../src/components/ThemeContext';
import { AdminMenu } from '../src/components/AdminMenu';

const ShimmerBackground = React.lazy(() => 
  import('../src/components/ShimmerBackground').then(module => ({ default: module.ShimmerBackground }))
);

type DuoSubStep = 'phase_title' | 'phase_disclaimer' | 'intro' | 'questions' | 'sentence' | 'breath' | 'resolution';

const DUO_DISCLAIMER = [
  "Be aware — this experience may shine a spotlight on your differences and gaps.",
  "At times, it may ‘paint a dark picture’ and stir strong or tense feelings.",
  "Please remember: this does not reflect your whole relationship.",
  "It’s simply a starting point for exploration.",
  "You don’t need to fix or explain anything right now — just talk, share, and listen."
];

export default function Duo() {
  const router = useRouter();
  const { getSortedDuoDimensions } = useSessionStore();
  const { setTheme } = useTheme();

  const [sortedDimensions, setSortedDimensions] = useState<Dimension[]>([]);
  const [currentDimIndex, setCurrentDimIndex] = useState(0);
  const [subStep, setSubStep] = useState<DuoSubStep>('phase_title');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedDimensions, setCompletedDimensions] = useState<string[]>([]);

  useEffect(() => {
    const dims = getSortedDuoDimensions();
    setSortedDimensions(dims);
  }, []);

  useEffect(() => {
    // Set theme for phase intro screens
    if (subStep === 'phase_title' || subStep === 'phase_disclaimer') {
      setTheme('default');
      return;
    }

    if (sortedDimensions.length > 0 && currentDimIndex < sortedDimensions.length && subStep !== 'resolution') {
      const dim = sortedDimensions[currentDimIndex];
      setTheme(dim.themeColor as ThemeColor);
    } else if (subStep === 'resolution') {
      setTheme('gold'); // Resolution theme
    }
  }, [currentDimIndex, sortedDimensions, subStep]);

  const getOriginalDimensionIndex = (dimId: string) => {
      return DIMENSIONS.findIndex(d => d.id === dimId);
  };

  const handleNext = () => {
    if (subStep === 'phase_title') {
      setSubStep('phase_disclaimer');
      return;
    }

    if (subStep === 'phase_disclaimer') {
      setSubStep('intro');
      return;
    }

    if (subStep === 'resolution') {
        // End of experience
        router.replace('/'); 
        return;
    }

    const currentDim = sortedDimensions[currentDimIndex];

    if (subStep === 'intro') {
      setSubStep('questions');
      setQuestionIndex(0);
    } else if (subStep === 'questions') {
      if (questionIndex < currentDim.duoQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        setSubStep('sentence');
      }
    } else     if (subStep === 'sentence') {
        // Add current dimension ID to completed list
        if (!completedDimensions.includes(currentDim.id)) {
          setCompletedDimensions(prev => [...prev, currentDim.id]);
        }
        setSubStep('breath');
    } else if (subStep === 'breath') {
       if (currentDimIndex < sortedDimensions.length - 1) {
         setCurrentDimIndex(prev => prev + 1);
         setSubStep('intro');
       } else {
         setSubStep('resolution');
       }
    }
  };

  const handleBreathComplete = () => {
       if (currentDimIndex < sortedDimensions.length - 1) {
         setCurrentDimIndex(prev => prev + 1);
         setSubStep('intro');
       } else {
         setSubStep('resolution');
       }
  };

  const handleSkipToSentence = () => {
    setSubStep('sentence');
  };

  const handleDebugAction = (action: string) => {
      if (action === 'skipStep') {
          handleNext();
      } else if (action.startsWith('jumpToDimension:')) {
          const index = parseInt(action.split(':')[1], 10);
          // In Duo, we are iterating over *sorted* dimensions
          // But the admin menu lists them in canonical order (1-5)
          // So we need to find where that canonical ID exists in our sorted list
          const targetId = DIMENSIONS[index].id;
          const sortedIndex = sortedDimensions.findIndex(d => d.id === targetId);
          
          if (sortedIndex !== -1) {
              setCurrentDimIndex(sortedIndex);
              setSubStep('intro');
              setQuestionIndex(0);
          }
      }
  };

  if (sortedDimensions.length === 0) return null;

  // RENDERERS

  const renderPhaseTitle = () => (
    <VignetteView key="phase-title">
      <View style={styles.centerContent}>
        <Subtitle>Phase 2</Subtitle>
        <Title>Joint Reflection</Title>
        <Body>Please place the device between you.</Body>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Begin</Text>
        </TouchableOpacity>
      </View>
    </VignetteView>
  );

  const renderPhaseDisclaimer = () => (
    <VignetteView key="phase-disclaimer">
      <View style={[styles.centerContent, { justifyContent: 'space-between', flex: 1 }]}>
        <ScrollView 
           style={{ maxHeight: '70%', width: '100%' }}
           contentContainerStyle={{ paddingVertical: 20, alignItems: 'center' }} 
           showsVerticalScrollIndicator={false}
        >
           <Body style={styles.disclaimerText}>{DUO_DISCLAIMER[0]}</Body>
           <Body style={styles.disclaimerText}>{DUO_DISCLAIMER[1]}</Body>
           
           <Subtitle style={{ marginTop: 20, color: '#D4AF37' }}>{DUO_DISCLAIMER[2]}</Subtitle>
           <Body style={styles.disclaimerText}>{DUO_DISCLAIMER[3]}</Body>
           
           <Quote style={{ fontSize: 22, marginTop: 20 }}>"{DUO_DISCLAIMER[4]}"</Quote>
        </ScrollView>

        <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={handleNext}>
          <Text style={styles.buttonText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </VignetteView>
  );

  const renderIntro = () => {
    const dim = sortedDimensions[currentDimIndex];
    return (
        <VignetteView key={`intro-${dim.id}`}>
            <View style={styles.centerContent}>
                <Subtitle>Joint Phase</Subtitle>
                <Title>{dim.title}</Title>
                <Quote style={{ marginVertical: 20 }}>"{dim.description}"</Quote>
                <Body>Turn to each other. Read the questions aloud and discuss them honestly.</Body>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>Begin Discussion</Text>
                </TouchableOpacity>
            </View>
        </VignetteView>
    );
  };

  const renderQuestions = () => {
    const dim = sortedDimensions[currentDimIndex];
    const question = dim.duoQuestions[questionIndex];
    const canSkip = questionIndex >= 2; // Allow skipping after 3 questions (index 0, 1, 2)

    return (
        <VignetteView key={`q-${dim.id}-${questionIndex}`}>
            <View style={styles.centerContent}>
                <Subtitle>Discuss</Subtitle>
                <Title style={styles.questionText}>{question}</Title>
                
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>Next Question</Text>
                </TouchableOpacity>

                {canSkip && (
                    <TouchableOpacity style={styles.textButton} onPress={handleSkipToSentence}>
                        <Text style={styles.textButtonText}>Move to Reflection</Text>
                    </TouchableOpacity>
                )}
            </View>
        </VignetteView>
    );
  };

  const renderSentence = () => {
    const dim = sortedDimensions[currentDimIndex];
    return (
        <VignetteView key={`s-${dim.id}`}>
             <View style={styles.centerContent}>
                <Subtitle>Describe it to one another</Subtitle>
                <Body>What do you make of this sentence?</Body>
                <Quote>"{dim.duoSentence}"</Quote>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        Complete Dimension
                    </Text>
                </TouchableOpacity>
            </View>
        </VignetteView>
    );
  };

  const renderBreath = () => {
    const dim = sortedDimensions[currentDimIndex];
    const originalIndex = getOriginalDimensionIndex(dim.id);

    return (
        <BreathTransition 
          onComplete={handleBreathComplete} 
          completedIndex={originalIndex}
          duoMode={true}
          completedDimensions={completedDimensions}
        />
    );
  };

  const renderResolution = () => {
    // Top 2 priority dimensions are the first 2 in the sorted list
    const topDimensions = sortedDimensions.slice(0, 2);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
             <VignetteView>
                <View style={styles.centerContent}>
                    <Title>{RESOLUTION_CONTENT.title}</Title>
                    <Quote>"{RESOLUTION_CONTENT.body.split('\n')[0]}"</Quote>
                    <Body>{RESOLUTION_CONTENT.body.split('\n').slice(1).join('\n')}</Body>
                    
                    <View style={styles.divider} />
                    
                    <Subtitle>Your Growth Areas</Subtitle>
                    {topDimensions.map(dim => (
                        <View key={dim.id} style={styles.actionCard}>
                            <Text style={styles.actionTitle}>{dim.title}</Text>
                            <Text style={styles.actionBody}>{dim.actionIdea}</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
                         <Text style={styles.buttonText}>Complete</Text>
                    </TouchableOpacity>
                </View>
            </VignetteView>
        </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator />}>
        <ShimmerBackground />
      </Suspense>
      <View style={styles.safeArea}>
        {subStep === 'phase_title' && renderPhaseTitle()}
        {subStep === 'phase_disclaimer' && renderPhaseDisclaimer()}
        {subStep === 'intro' && renderIntro()}
        {subStep === 'questions' && renderQuestions()}
        {subStep === 'sentence' && renderSentence()}
        {subStep === 'breath' && renderBreath()}
        {subStep === 'resolution' && renderResolution()}
      </View>
      <AdminMenu onDebugAction={handleDebugAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 40,
  },
  questionText: {
    fontSize: 28,
    marginBottom: 40,
  },
  button: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonText: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  textButton: {
    marginTop: 20,
    padding: 10,
  },
  textButtonText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 30,
  },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  actionTitle: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionBody: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
  }
});
