import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

const MESSAGES = [
  'Finding trusted providers near you…',
  'Loading your local services…',
  'Connecting to ServeNaija…',
  'Almost ready…',
];

export default function LoadingScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(8)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar loop
    const runProgress = () => {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }).start();
    };
    runProgress();
    const progressInterval = setInterval(runProgress, 2500);

    // Sliding text loop
    const showText = () => {
      textOpacity.setValue(0);
      textTranslate.setValue(8);
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
    showText();

    const textInterval = setInterval(() => {
      // Fade out
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: -8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        showText();
      });
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A84FF" />

      {/* Logo block */}
      <Animated.View
        style={[
          styles.logoBlock,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>SN</Text>
        </View>
        <Text style={styles.appName}>ServeNaija</Text>
        <Text style={styles.tagline}>FIND · HIRE · TRUST</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>

      {/* Sliding message */}
      <Animated.Text
        style={[
          styles.message,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        {MESSAGES[msgIndex]}
      </Animated.Text>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 56,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2.5,
    fontWeight: '500',
  },
  barTrack: {
    width: width * 0.5,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  message: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    minHeight: 18,
  },
  version: {
    position: 'absolute',
    bottom: 48,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },
});