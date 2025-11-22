import React, { useEffect, useMemo } from 'react';
import { View, Dimensions, Platform, StyleSheet } from 'react-native';
import { useSharedValue, withTiming, useDerivedValue, Easing, withRepeat } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const ResolutionFractal = () => {
  // Web Fallback
  if (Platform.OS === 'web') {
     return (
       <View style={{ width, height: height * 0.6, justifyContent: 'center', alignItems: 'center' }}>
         <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
       </View>
     );
  }

  // Native Implementation
  const { Canvas, Path, Group, BlurMask, Skia } = require('@shopify/react-native-skia');

  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 3000, easing: Easing.out(Easing.exp) });
    rotation.value = withRepeat(withTiming(Math.PI * 2, { duration: 20000, easing: Easing.linear }), -1);
  }, []);

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    const cx = width / 2;
    const cy = height / 3;
    const radius = 80;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      p.addCircle(x, y, radius / 2);
      p.addCircle(cx, cy, radius / 4);
    }
    return p;
  }, []);

  const derivedTransform = useDerivedValue(() => {
    return [{ rotate: rotation.value }, { scale: scale.value }];
  });

  return (
    <Canvas style={{ width: width, height: height * 0.6 }}>
      <Group origin={{ x: width/2, y: height/3 }} transform={derivedTransform}>
        <Path path={path} color="rgba(212, 175, 55, 0.3)" style="stroke" strokeWidth={2}>
          <BlurMask blur={4} style="normal" />
        </Path>
        <Path path={path} color="rgba(255, 255, 255, 0.5)" style="stroke" strokeWidth={1} />
        <Path path={Skia.Path.Make().addCircle(width/2, height/3, 20)} color="white">
          <BlurMask blur={10} style="normal" />
        </Path>
      </Group>
    </Canvas>
  );
};
