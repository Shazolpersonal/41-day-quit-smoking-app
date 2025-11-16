import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {useSecurity} from '../context/SecurityContext';
import {theme} from '../constants/theme';

interface PinLockScreenProps {
  mode: 'setup' | 'verify' | 'change';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PinLockScreen: React.FC<PinLockScreenProps> = ({
  mode,
  onSuccess,
  onCancel,
}) => {
  const {verifyPin, setupPin, changePin, authenticateWithBiometric, securitySettings} =
    useSecurity();
  
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [oldPin, setOldPin] = useState<string>('');
  const [step, setStep] = useState<'enter' | 'confirm' | 'old'>(
    mode === 'change' ? 'old' : 'enter'
  );
  const [error, setError] = useState<string>('');
  
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show biometric prompt for verify mode
    if (mode === 'verify' && securitySettings?.biometricEnabled) {
      handleBiometricAuth();
    }
  }, [mode, securitySettings]);

  /**
   * Handle biometric authentication
   */
  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
    }
  };

  /**
   * Handle number press
   */
  const handleNumberPress = (num: string) => {
    setError('');
    
    if (step === 'old') {
      if (oldPin.length < 6) {
        const newOldPin = oldPin + num;
        setOldPin(newOldPin);
        
        if (newOldPin.length === 6) {
          setStep('enter');
        }
      }
    } else if (step === 'enter') {
      if (pin.length < 6) {
        const newPin = pin + num;
        setPin(newPin);
        
        if (newPin.length === 6) {
          if (mode === 'verify') {
            handleVerifyPin(newPin);
          } else {
            setStep('confirm');
          }
        }
      }
    } else if (step === 'confirm') {
      if (confirmPin.length < 6) {
        const newConfirmPin = confirmPin + num;
        setConfirmPin(newConfirmPin);
        
        if (newConfirmPin.length === 6) {
          handleConfirmPin(newConfirmPin);
        }
      }
    }
  };

  /**
   * Handle backspace
   */
  const handleBackspace = () => {
    setError('');
    
    if (step === 'old') {
      setOldPin(oldPin.slice(0, -1));
    } else if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else if (step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  /**
   * Verify PIN
   */
  const handleVerifyPin = async (enteredPin: string) => {
    const isValid = await verifyPin(enteredPin);
    
    if (isValid) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError('ভুল পিন');
      setPin('');
      shake();
    }
  };

  /**
   * Confirm PIN
   */
  const handleConfirmPin = async (enteredConfirmPin: string) => {
    if (pin !== enteredConfirmPin) {
      setError('পিন মিলছে না');
      setConfirmPin('');
      shake();
      return;
    }

    let success = false;

    if (mode === 'setup') {
      success = await setupPin(pin);
    } else if (mode === 'change') {
      success = await changePin(oldPin, pin);
    }

    if (success) {
      Alert.alert('সফল', 'পিন সেট করা হয়েছে');
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError('পিন সেট করতে ব্যর্থ');
      setPin('');
      setConfirmPin('');
      setOldPin('');
      setStep(mode === 'change' ? 'old' : 'enter');
      shake();
    }
  };

  /**
   * Shake animation for error
   */
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Get current PIN for display
   */
  const getCurrentPin = () => {
    if (step === 'old') return oldPin;
    if (step === 'enter') return pin;
    return confirmPin;
  };

  /**
   * Get title text
   */
  const getTitleText = () => {
    if (mode === 'verify') return 'পিন দিয়ে প্রবেশ করুন';
    if (mode === 'change') {
      if (step === 'old') return 'পুরাতন পিন দিন';
      if (step === 'enter') return 'নতুন পিন দিন';
      return 'নতুন পিন নিশ্চিত করুন';
    }
    if (step === 'enter') return 'পিন সেট করুন';
    return 'পিন নিশ্চিত করুন';
  };

  /**
   * Render PIN dots
   */
  const renderPinDots = () => {
    const currentPin = getCurrentPin();
    const dots = [];
    
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            i < currentPin.length && styles.pinDotFilled,
          ]}
        />
      );
    }
    
    return dots;
  };

  /**
   * Render number pad
   */
  const renderNumberPad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
    
    return (
      <View style={styles.numberPad}>
        {numbers.map((num, index) => {
          if (num === '') {
            return <View key={index} style={styles.numberButton} />;
          }
          
          if (num === '⌫') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.numberButton}
                onPress={handleBackspace}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            );
          }
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitleText()}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <Animated.View
        style={[
          styles.pinDotsContainer,
          {transform: [{translateX: shakeAnimation}]},
        ]}
      >
        {renderPinDots()}
      </Animated.View>

      {renderNumberPad()}

      {mode === 'verify' && securitySettings?.biometricEnabled && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricAuth}
        >
          <Text style={styles.biometricText}>
            বায়োমেট্রিক দিয়ে প্রবেশ করুন
          </Text>
        </TouchableOpacity>
      )}

      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>বাতিল</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: 10,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: theme.colors.primary,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 300,
  },
  numberButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
  },
  numberText: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text,
  },
  biometricButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  biometricText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 16,
    color: theme.colors.text,
  },
});

export default PinLockScreen;
