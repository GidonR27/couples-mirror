import React, { useState, useEffect, Suspense } from 'react';
import { View, StyleSheet, BackHandler, TouchableOpacity, Text, Dimensions as RNDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../src/store/sessionStore';
import { DIMENSIONS, ONBOARDING_CONTENT, Dimension, ThemeColor } from '../src/data/content';
import { QuestionRenderer } from '../src/components/QuestionRenderer';
import { BreathTransition } from '../src/components/BreathTransition';
import { VignetteView } from '../src/components/VignetteView';
import { Title, Subtitle, Body, Quote } from '../src/components/Typography';
import { useTheme } from '../src/components/ThemeContext';
import { AdminMenu } from '../src/components/AdminMenu';

const { width, height } = RNDimensions.get('window');

const ShimmerBackground = React.lazy(() => 
  import('../src/components/ShimmerBackground').then(module => ({ default: module.ShimmerBackground }))
);

type SubStep = 'intro' | 'guiding' | 'last' | 'breath';

export default function Index() {
  const router = useRouter();
  const { 
    phase, setPhase, 
    currentDimensionIndex, nextDimension, resetDimension,
    setAnswer
  } = useSessionStore();
  const { setTheme } = useTheme();

  const [subStep, setSubStep] = useState<SubStep>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Update theme based on current dimension
  useEffect(() => {
    if (phase === 'solo_p1' || phase === 'solo_p2') {
      const dim = DIMENSIONS[currentDimensionIndex];
      setTheme(dim.themeColor as ThemeColor);
    } else {
      setTheme('default');
    }
  }, [phase, currentDimensionIndex]);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // --- ONBOARDING LOGIC ---
  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setPhase('solo_p1');
      resetDimension();
      setSubStep('intro');
    }
  };

  // --- SOLO LOGIC ---
  const handleAnswer = (val: any) => {
    const partner = phase === 'solo_p1' ? 1 : 2;
    const dim = DIMENSIONS[currentDimensionIndex];
    
    if (subStep === 'guiding') {
      setAnswer(partner, dim.id, questionIndex, val);
      // Wait a moment for effect? or immediate
      if (questionIndex < dim.guidingQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        setSubStep('last');
      }
    } else if (subStep === 'last') {
      setAnswer(partner, dim.id, 'last', val);
      setSubStep('breath');
    }
  };

  // Generalized Skip Function
  const handleSkip = () => {
    if (phase === 'onboarding') {
      handleOnboardingNext();
    } else if (phase === 'solo_p1' || phase === 'solo_p2') {
        if (subStep === 'guiding') {
            // Skip current question with default answer
            handleAnswer(2); // 2 = Medium
        } else if (subStep === 'last') {
            handleAnswer('Skipped');
        } else if (subStep === 'intro') {
            // Skip intro
            setSubStep('guiding');
            setQuestionIndex(0);
        } else if (subStep === 'breath') {
            // Skip animation
            handleBreathComplete();
        }
    } else if (phase === 'intermission') {
        handleIntermissionNext();
    }
  };

  const handleBreathComplete = () => {
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      nextDimension();
      setSubStep('intro');
      setQuestionIndex(0);
    } else {
      // End of phase
      if (phase === 'solo_p1') {
        setPhase('intermission');
      } else {
        setPhase('duo'); // Or transition logic in store
        nextDimension(); // Trigger store phase change
        router.replace('/duo');
      }
    }
  };

  const handleIntermissionNext = () => {
    setPhase('solo_p2');
    resetDimension();
    setSubStep('intro');
    setQuestionIndex(0);
  };

  const handleDebugAction = (action: string) => {
      if (action === 'skipToDuo') {
          router.replace('/duo');
      } else if (action === 'testAnimation') {
          setSubStep('breath');
      } else if (action === 'skipStep') {
          handleSkip();
      } else if (action === 'jumpToDimension') {
          // The store has already been updated, just reset local state
          setSubStep('intro');
          setQuestionIndex(0);
      }
  };

  // --- RENDERERS ---

  const renderOnboarding = () => {
    const content = [
      <View key="1" style={styles.centerContent}>
         <Subtitle>Couples Flourishing</Subtitle>
         <Title>{ONBOARDING_CONTENT.subtitle}</Title>
      </View>,
      <View key="2" style={styles.centerContent}>
         <Quote>"{ONBOARDING_CONTENT.body.split('\n\n')[0]}"</Quote>
      </View>,
      <View key="3" style={styles.centerContent}>
         <Body>{ONBOARDING_CONTENT.body.split('\n\n')[1]}</Body>
         <Body>{ONBOARDING_CONTENT.body.split('\n\n')[2]}</Body>
         <TouchableOpacity style={styles.button} onPress={handleOnboardingNext}>
           <Text style={styles.buttonText}>Begin Reflection</Text>
         </TouchableOpacity>
         
         <Body style={{ fontSize: 14, marginTop: 20, opacity: 0.7, textAlign: 'center' }}>
            When you finish, we’ll let you know when to hand the device to your partner so they can answer the same questions.
         </Body>
         <Body style={{ fontSize: 14, marginTop: 10, opacity: 0.5, fontStyle: 'italic' }}>
            (This is not a test)
         </Body>
      </View>
    ];

    return (
      <TouchableOpacity 
        style={styles.fullScreenTouch} 
        onPress={handleOnboardingNext}
        activeOpacity={1}
      >
        <VignetteView key={onboardingStep}>
          {content[onboardingStep]}
        </VignetteView>
      </TouchableOpacity>
    );
  };

  const renderIntermission = () => {
    return (
      <VignetteView>
        <View style={styles.centerContent}>
          <Title>Phase Complete</Title>
          <Body>Please pass the device to your partner.</Body>
          <TouchableOpacity style={styles.button} onPress={handleIntermissionNext}>
            <Text style={styles.buttonText}>Begin Partner 2</Text>
          </TouchableOpacity>
        </View>
      </VignetteView>
    );
  };

  const renderSolo = () => {
    const dim = DIMENSIONS[currentDimensionIndex];
    
    if (subStep === 'intro') {
      return (
        <VignetteView key={`intro-${dim.id}`}>
          <View style={styles.centerContent}>
            <Subtitle>Dimension {currentDimensionIndex + 1}</Subtitle>
            <Title>{dim.title}</Title>
            
            {/* Use the descriptive theme for the Intro screen */}
            <Quote>"{dim.description}"</Quote>
            <Body style={{ marginTop: 20 }}>{dim.goal}</Body>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                setSubStep('guiding');
                setQuestionIndex(0);
              }}
            >
              <Text style={styles.buttonText}>Begin</Text>
            </TouchableOpacity>
          </View>
        </VignetteView>
      );
    }

    if (subStep === 'guiding') {
      return (
        <QuestionRenderer 
          key={`guiding-${dim.id}-${questionIndex}`}
          mode="guiding"
          data={dim.guidingQuestions[questionIndex]}
          onAnswer={handleAnswer}
        />
      );
    }

    if (subStep === 'last') {
      return (
        <QuestionRenderer 
          mode="last"
          data={dim.lastQuestion}
          onAnswer={handleAnswer}
        />
      );
    }

    if (subStep === 'breath') {
      // The BreathTransition component handles the poetic text (dim.theme/DIMENSION_TEXTS) internally
      return (
        <BreathTransition 
          onComplete={handleBreathComplete} 
          text="Breathe & Integrate" 
          completedIndex={currentDimensionIndex} 
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Suspense fallback={null}>
        <ShimmerBackground />
      </Suspense>

      <View style={styles.safeArea}>
        {phase === 'onboarding' && renderOnboarding()}
        {phase === 'intermission' && renderIntermission()}
        {(phase === 'solo_p1' || phase === 'solo_p2') && renderSolo()}
      </View>

      <AdminMenu onDebugAction={handleDebugAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  fullScreenTouch: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  button: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 30,
  },
  buttonText: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  adminContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 9999,
    alignItems: 'flex-end',
  },
  adminIcon: {
    padding: 10,
  },
  adminMenu: {
     alignItems: 'flex-end',
  },
  adminButton: {
    backgroundColor: 'rgba(200, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  closeAdminButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.8)',
    padding: 8,
    borderRadius: 8,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  skipOverlayButton: {
      position: 'absolute',
      bottom: 40,
      right: 20,
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      padding: 15,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 9998,
  },
  skipText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 5,
  }
});
