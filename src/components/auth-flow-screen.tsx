import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthFlow, type ContactMethod } from '@/components/auth-flow-context';
import { Palette } from '@/constants/theme';

export type AuthStep =
  | 'splash'
  | 'welcome'
  | 'verify-contact'
  | 'otp'
  | 'create-password'
  | 'forgot-password'
  | 'reset-password'
  | 'create-pin'
  | 'confirm-pin'
  | 'biometric-setup';

const stepCopy: Record<Exclude<AuthStep, 'splash' | 'welcome'>, { eyebrow: string; title: string; description: string }> = {
  'verify-contact': {
    eyebrow: 'ACCOUNT SECURITY',
    title: 'Verify your details',
    description: 'Choose where we should send your one-time verification code.',
  },
  otp: {
    eyebrow: 'ONE-TIME CODE',
    title: 'Check your messages',
    description: 'Enter the 6-digit code we sent to your contact method.',
  },
  'create-password': {
    eyebrow: 'ACCOUNT SECURITY',
    title: 'Create a password',
    description: 'Use at least 8 characters to keep your account protected.',
  },
  'forgot-password': {
    eyebrow: 'ACCOUNT RECOVERY',
    title: 'Forgot password?',
    description: 'We will send a verification code so you can choose a new password.',
  },
  'reset-password': {
    eyebrow: 'ACCOUNT RECOVERY',
    title: 'Reset your password',
    description: 'Choose a new password you have not used before.',
  },
  'create-pin': {
    eyebrow: 'PAYMENT SECURITY',
    title: 'Create your transaction PIN',
    description: 'Choose a 4-digit PIN to approve important transactions.',
  },
  'confirm-pin': {
    eyebrow: 'PAYMENT SECURITY',
    title: 'Confirm your PIN',
    description: 'Enter the same 4-digit PIN once more.',
  },
  'biometric-setup': {
    eyebrow: 'QUICK & SECURE',
    title: 'Use biometrics',
    description: 'Sign in securely with Face ID or your device fingerprint.',
  },
};

export function AuthFlowScreen({ step }: { step: AuthStep }) {
  const { method, setMethod, contact, setContact, password, setPassword, pin, setPin } = useAuthFlow();
  const { purpose } = useLocalSearchParams<{ purpose?: string }>();
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const submit = () => {
    setMessage('');
    if (step === 'splash') {
      router.replace('/welcome');
      return;
    }
    if (step === 'welcome') {
      router.push('/verify-contact');
      return;
    }
    if (step === 'verify-contact' || step === 'forgot-password') {
      const valid = method === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())
        : contact.replace(/\D/g, '').length >= 7;
      if (!valid) {
        setMessage(method === 'email' ? 'Enter a valid email address.' : 'Enter a valid phone number.');
        return;
      }
      router.push(step === 'forgot-password' ? { pathname: '/otp', params: { purpose: 'reset' } } : '/otp');
      return;
    }
    if (step === 'otp') {
      if (code.length !== 6) {
        setMessage('Enter the 6-digit code to continue.');
        return;
      }
      router.push(purpose === 'reset' ? '/reset-password' : '/create-password');
      return;
    }
    if (step === 'create-password' || step === 'reset-password') {
      if (password.length < 8) {
        setMessage('Use at least 8 characters for your password.');
        return;
      }
      if (password !== confirmation) {
        setMessage('Your passwords do not match.');
        return;
      }
      if (step === 'reset-password') {
        setPassword('');
        router.replace('/login');
        return;
      }
      setPassword('');
      setPin('');
      router.push('/create-pin');
      return;
    }
    if (step === 'create-pin') {
      if (confirmation.length !== 4) {
        setMessage('Enter a 4-digit PIN.');
        return;
      }
      setPin(confirmation);
      router.push('/confirm-pin');
      return;
    }
    if (step === 'confirm-pin') {
      if (confirmation.length !== 4 || confirmation !== pin) {
        setMessage('Those PINs do not match. Try again.');
        return;
      }
      setPin('');
      router.push('/biometric-setup');
      return;
    }
    if (step === 'biometric-setup') {
      router.replace('/complete-profile');
    }
  };

  const title = stepCopy[step as keyof typeof stepCopy];

  if (step === 'splash') {
    return (
      <SafeAreaView style={styles.splashSafeArea}>
        <View style={styles.splashContent}>
          <View style={styles.splashMark}><Text style={styles.splashMarkText}>24</Text></View>
          <Text style={styles.splashBrand}>247 FINANCE</Text>
          <View style={styles.splashRule} />
          <Text style={styles.splashTagline}>A little more clarity, every day.</Text>
          <Pressable onPress={submit} accessibilityRole="button" style={({ pressed }) => [styles.splashButton, pressed && styles.pressed]}>
            <Text style={styles.splashButtonText}>Continue</Text>
            <Text style={styles.splashButtonArrow}>→</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.welcomeContent}>
          <Brand />
          <View style={styles.welcomeArt}>
            <View style={styles.artOrbit} />
            <View style={styles.artCard}>
              <Text style={styles.artLabel}>YOUR MONEY, IN FOCUS</Text>
              <Text style={styles.artAmount}>$24,680</Text>
              <View style={styles.artBars}>{[27, 41, 34, 54, 48, 70, 62, 86].map((height, index) => <View key={index} style={[styles.artBar, { height }, index > 5 && styles.artBarAccent]} />)}</View>
              <Text style={styles.artTrend}>↗  8.4% this month</Text>
            </View>
          </View>
          <Text style={styles.welcomeEyebrow}>WELCOME TO 247</Text>
          <Text style={styles.welcomeTitle}>Make your next move with confidence.</Text>
          <Text style={styles.welcomeDescription}>A clearer view of your money, and more room for what comes next.</Text>
          <View style={styles.welcomeActions}>
            <PrimaryButton label="Get started" onPress={submit} />
            <Pressable onPress={() => router.push('/login')} accessibilityRole="button" style={styles.signInButton}>
              <Text style={styles.signInText}>I already have an account</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!title) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.topBar}>
              <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backArrow}>‹</Text>
              </Pressable>
              <Brand />
              <View style={styles.topBarSpacer} />
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progressForStep(step)}%` }]} /></View>
            <Text style={styles.eyebrow}>{title.eyebrow}</Text>
            <Text style={styles.title}>{title.title}</Text>
            <Text style={styles.description}>{title.description}</Text>

            {(step === 'verify-contact' || step === 'forgot-password') && (
              <>
                <View style={styles.segmentedControl}>
                  {(['email', 'phone'] as ContactMethod[]).map((item) => (
                    <Pressable
                      key={item}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: method === item }}
                      onPress={() => setMethod(item)}
                      style={[styles.segment, method === item && styles.segmentActive]}>
                      <Text style={[styles.segmentText, method === item && styles.segmentTextActive]}>{item === 'email' ? 'Email' : 'Phone'}</Text>
                    </Pressable>
                  ))}
                </View>
                <Field
                  label={method === 'email' ? 'Email address' : 'Phone number'}
                  value={contact}
                  onChangeText={setContact}
                  placeholder={method === 'email' ? 'name@example.com' : '+1 (555) 000-0000'}
                  keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                  autoComplete={method === 'email' ? 'email' : 'tel'}
                />
              </>
            )}

            {step === 'otp' && (
              <>
                <Text style={styles.fieldLabel}>6-digit verification code</Text>
                <TextInput
                  accessibilityLabel="6-digit verification code"
                  autoComplete="one-time-code"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
                  placeholder="      -      -      -      -      -      -"
                  placeholderTextColor={Palette.placeholder}
                  style={[styles.input, styles.codeInput]}
                  value={code}
                />
                <Pressable onPress={() => setMessage('A new verification code has been sent.')} style={styles.inlineButton}>
                  <Text style={styles.inlineText}>Resend code</Text>
                </Pressable>
              </>
            )}

            {(step === 'create-password' || step === 'reset-password') && (
              <>
                <Field
                  label="New password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  secureTextEntry={!passwordVisible}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  trailing={<Pressable onPress={() => setPasswordVisible((visible) => !visible)} hitSlop={8}><Text style={styles.inlineText}>{passwordVisible ? 'Hide' : 'Show'}</Text></Pressable>}
                />
                <Field
                  label="Confirm password"
                  value={confirmation}
                  onChangeText={setConfirmation}
                  placeholder="Enter your password again"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <Text style={styles.helperText}>Use a mix of letters, numbers, and symbols.</Text>
              </>
            )}

            {(step === 'create-pin' || step === 'confirm-pin') && (
              <>
                <Field
                  label="4-digit transaction PIN"
                  value={confirmation}
                  onChangeText={(value) => setConfirmation(value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  returnKeyType="done"
                />
                <View style={styles.pinDots} accessibilityLabel={`${confirmation.length} of 4 PIN digits entered`}>
                  {[0, 1, 2, 3].map((index) => <View key={index} style={[styles.pinDot, index < confirmation.length && styles.pinDotFilled]} />)}
                </View>
              </>
            )}

            {step === 'biometric-setup' && (
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: biometricsEnabled }}
                onPress={() => setBiometricsEnabled((enabled) => !enabled)}
                style={styles.biometricOption}>
                <View style={styles.biometricIcon}><Text style={styles.biometricIconText}>⌁</Text></View>
                <View style={styles.biometricCopy}>
                  <Text style={styles.biometricTitle}>Enable biometrics</Text>
                  <Text style={styles.biometricDescription}>Use your device’s built-in authentication.</Text>
                </View>
                <View style={[styles.switchTrack, biometricsEnabled && styles.switchTrackActive]}>
                  <View style={[styles.switchThumb, biometricsEnabled && styles.switchThumbActive]} />
                </View>
              </Pressable>
            )}

            {message ? <Text accessibilityLiveRegion="polite" style={styles.feedback}>{message}</Text> : null}
            <PrimaryButton label={step === 'biometric-setup' ? 'Finish setup' : step === 'forgot-password' ? 'Send code' : step === 'reset-password' ? 'Update password' : step === 'create-pin' ? 'Continue' : step === 'confirm-pin' ? 'Confirm PIN' : 'Continue'} onPress={submit} />
            {step === 'biometric-setup' && (
              <Pressable onPress={() => router.replace('/complete-profile')} accessibilityRole="button" style={styles.skipButton}>
                <Text style={styles.signInText}>Not now</Text>
              </Pressable>
            )}
            {step === 'forgot-password' && (
              <Pressable onPress={() => router.replace('/login')} accessibilityRole="button" style={styles.skipButton}>
                <Text style={styles.signInText}>Back to sign in</Text>
              </Pressable>
            )}
            {step === 'create-password' && (
              <Text style={styles.bottomNote}>You can change this later in your account settings.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function progressForStep(step: AuthStep) {
  const progress: Record<AuthStep, number> = {
    splash: 0,
    welcome: 0,
    'verify-contact': 16,
    otp: 32,
    'create-password': 50,
    'forgot-password': 25,
    'reset-password': 60,
    'create-pin': 72,
    'confirm-pin': 84,
    'biometric-setup': 96,
  };
  return progress[step];
}

function Brand() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>24</Text></View>
      <Text style={styles.brandName}>247 FINANCE</Text>
    </View>
  );
}

function Field({
  label,
  trailing,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string; trailing?: React.ReactNode }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          {...props}
          placeholderTextColor={Palette.placeholder}
          style={[styles.input, trailing ? styles.inputWithTrailing : undefined, props.style]}
        />
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Text style={styles.primaryButtonArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 26, flex: 1 },
  topBar: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  backArrow: { color: Palette.navy, fontSize: 30, lineHeight: 34, marginTop: -4 },
  topBarSpacer: { width: 38 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 32, height: 32, borderRadius: 9, backgroundColor: Palette.navy, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: Palette.lime, fontSize: 13, fontWeight: '900' },
  brandName: { color: Palette.navy, fontSize: 10, fontWeight: '800' },
  progressTrack: { height: 3, borderRadius: 2, backgroundColor: Palette.border, marginTop: 10, marginBottom: 34, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: Palette.aqua },
  eyebrow: { color: Palette.success, fontSize: 9, fontWeight: '800', marginBottom: 9 },
  title: { color: Palette.navy, fontSize: 27, lineHeight: 33, fontWeight: '700' },
  description: { color: Palette.muted, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 26, maxWidth: 390 },
  segmentedControl: { flexDirection: 'row', backgroundColor: Palette.navySoft, borderRadius: 9, padding: 4, marginBottom: 22 },
  segment: { flex: 1, minHeight: 39, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: Palette.surface },
  segmentText: { color: Palette.muted, fontSize: 12, fontWeight: '700' },
  segmentTextActive: { color: Palette.navy },
  fieldGroup: { gap: 8, marginBottom: 18 },
  fieldLabel: { color: Palette.navy, fontSize: 12, fontWeight: '700' },
  inputRow: { position: 'relative', justifyContent: 'center' },
  input: { minHeight: 54, borderWidth: 1, borderColor: Palette.border, borderRadius: 9, backgroundColor: Palette.surface, paddingHorizontal: 14, color: Palette.ink, fontSize: 14 },
  inputWithTrailing: { paddingRight: 65 },
  trailing: { position: 'absolute', right: 14 },
  codeInput: { textAlign: 'center', fontSize: 19, letterSpacing: 6, fontWeight: '700' },
  inlineButton: { alignSelf: 'flex-end', marginTop: 2, paddingVertical: 8 },
  inlineText: { color: Palette.navyMid, fontSize: 12, fontWeight: '700' },
  helperText: { color: Palette.muted, fontSize: 11, marginTop: -6 },
  pinDots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 7, marginBottom: 19 },
  pinDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: Palette.navyTint },
  pinDotFilled: { backgroundColor: Palette.navy, borderColor: Palette.navy },
  biometricOption: { minHeight: 78, flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 10, padding: 13, marginBottom: 18 },
  biometricIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: Palette.navySoft, alignItems: 'center', justifyContent: 'center' },
  biometricIconText: { color: Palette.navy, fontSize: 23 },
  biometricCopy: { flex: 1, paddingHorizontal: 11 },
  biometricTitle: { color: Palette.navy, fontSize: 12, fontWeight: '700' },
  biometricDescription: { color: Palette.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  switchTrack: { width: 40, height: 23, borderRadius: 12, backgroundColor: Palette.border, padding: 3, justifyContent: 'center' },
  switchTrackActive: { backgroundColor: Palette.success },
  switchThumb: { width: 17, height: 17, borderRadius: 9, backgroundColor: Palette.white },
  switchThumbActive: { alignSelf: 'flex-end' },
  feedback: { color: Palette.danger, fontSize: 12, lineHeight: 17, marginBottom: 9 },
  primaryButton: { minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Palette.navy, borderRadius: 9, paddingHorizontal: 17, marginTop: 12 },
  primaryButtonText: { color: Palette.white, fontSize: 14, fontWeight: '800' },
  primaryButtonArrow: { color: Palette.lime, fontSize: 21 },
  pressed: { opacity: 0.78 },
  skipButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  signInButton: { minHeight: 49, alignItems: 'center', justifyContent: 'center' },
  signInText: { color: Palette.navyMid, fontSize: 12, fontWeight: '700' },
  bottomNote: { color: Palette.muted, fontSize: 10, textAlign: 'center', marginTop: 19 },
  splashSafeArea: { flex: 1, backgroundColor: Palette.navyDeep },
  splashContent: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  splashMark: { width: 74, height: 74, borderRadius: 22, backgroundColor: Palette.lime, alignItems: 'center', justifyContent: 'center' },
  splashMarkText: { color: Palette.navy, fontSize: 30, fontWeight: '900' },
  splashBrand: { color: Palette.white, fontSize: 14, fontWeight: '800', marginTop: 19 },
  splashRule: { width: 46, height: 2, backgroundColor: Palette.aqua, marginTop: 39 },
  splashTagline: { color: Palette.navyTint, fontSize: 12, marginTop: 12 },
  splashButton: { position: 'absolute', left: 28, right: 28, bottom: 26, minHeight: 54, borderRadius: 9, backgroundColor: Palette.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 17 },
  splashButtonText: { color: Palette.navy, fontSize: 14, fontWeight: '800' },
  splashButtonArrow: { color: Palette.navy, fontSize: 21 },
  welcomeContent: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 26, paddingTop: 12, paddingBottom: 14 },
  welcomeArt: { height: 270, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  artOrbit: { position: 'absolute', width: 238, height: 238, borderRadius: 119, backgroundColor: Palette.navySoft, borderWidth: 1, borderColor: Palette.border },
  artCard: { width: '88%', maxWidth: 340, borderRadius: 14, backgroundColor: Palette.navy, padding: 18 },
  artLabel: { color: Palette.navyTint, fontSize: 9, fontWeight: '800' },
  artAmount: { color: Palette.white, fontSize: 29, fontWeight: '700', marginTop: 8 },
  artBars: { height: 73, flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginTop: 10 },
  artBar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: Palette.navyMid },
  artBarAccent: { backgroundColor: Palette.lime },
  artTrend: { color: Palette.aqua, fontSize: 10, fontWeight: '700', marginTop: 9 },
  welcomeEyebrow: { color: Palette.success, fontSize: 9, fontWeight: '800', marginTop: 6 },
  welcomeTitle: { color: Palette.navy, fontSize: 28, lineHeight: 34, fontWeight: '700', marginTop: 8, maxWidth: 390 },
  welcomeDescription: { color: Palette.muted, fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 390 },
  welcomeActions: { marginTop: 'auto' },
});
