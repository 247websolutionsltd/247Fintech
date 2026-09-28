import { Link } from 'expo-router';
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

import { Palette } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !email.includes('@')) {
      setFeedback('Enter a valid email address to continue.');
      return;
    }
    if (!password) {
      setFeedback('Enter your password to continue.');
      return;
    }
    setFeedback('Sign-in is ready for your authentication provider.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.hero}>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>24</Text>
                </View>
                <Text style={styles.brandName}>247 FINANCE</Text>
                <View style={styles.brandDot} />
              </View>
              <View style={styles.heroCopy}>
                <Text style={styles.eyebrow}>YOUR MONEY, IN FOCUS</Text>
                <Text style={styles.headline}>A clearer way to move forward.</Text>
                <Text style={styles.heroSubcopy}>
                  Your financial life, thoughtfully brought together.
                </Text>
              </View>
              <View style={styles.signal} accessibilityElementsHidden>
                <View style={[styles.signalBar, styles.signalBarShort]} />
                <View style={[styles.signalBar, styles.signalBarMedium]} />
                <View style={[styles.signalBar, styles.signalBarLong]} />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formCaption}>Sign in to your 247 account.</Text>

              <View style={styles.fields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                    accessibilityLabel="Email address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor={Palette.placeholder}
                    returnKeyType="next"
                    style={styles.input}
                    textContentType="emailAddress"
                    value={email}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordField}>
                    <TextInput
                      accessibilityLabel="Password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      onChangeText={setPassword}
                      onSubmitEditing={handleLogin}
                      placeholder="Enter your password"
                      placeholderTextColor={Palette.placeholder}
                      returnKeyType="done"
                      secureTextEntry={!passwordVisible}
                      style={styles.passwordInput}
                      textContentType="password"
                      value={password}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                      onPress={() => setPasswordVisible((visible) => !visible)}
                      style={styles.visibilityButton}>
                      <Text style={styles.visibilityText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {feedback ? (
                <Text accessibilityLiveRegion="polite" style={styles.feedback}>
                  {feedback}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                <Text style={styles.submitText}>Sign in</Text>
                <Text style={styles.submitArrow}>→</Text>
              </Pressable>

              <View style={styles.registerPrompt}>
                <Link href="/forgot-password" asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text style={styles.registerLink}>Forgot password?</Text>
                  </Pressable>
                </Link>
              </View>

              <View style={styles.registerPrompt}>
                <Text style={styles.promptText}>New to 247?</Text>
                <Link href="/verify-contact" asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text style={styles.registerLink}>Create an account</Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerRule} />
              <Text style={styles.footerText}>A little more clarity, every day.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', flex: 1 },
  hero: {
    minHeight: 270,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: Palette.navy,
    overflow: 'hidden',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Palette.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: { color: Palette.navy, fontSize: 16, fontWeight: '900' },
  brandName: { color: Palette.white, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  brandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.lime, marginLeft: -7 },
  heroCopy: { marginTop: 38, maxWidth: 360 },
  eyebrow: { color: Palette.lime, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  headline: {
    color: Palette.white,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: '700',
    marginTop: 11,
    maxWidth: 330,
  },
  heroSubcopy: { color: Palette.navySoft, fontSize: 14, lineHeight: 20, marginTop: 10 },
  signal: { position: 'absolute', top: 53, right: 28, gap: 5, opacity: 0.5 },
  signalBar: { height: 3, backgroundColor: Palette.lime, borderRadius: 2 },
  signalBarShort: { width: 16 },
  signalBarMedium: { width: 25 },
  signalBarLong: { width: 35 },
  formSection: { paddingHorizontal: 28, paddingTop: 30 },
  formTitle: { color: Palette.navy, fontSize: 25, lineHeight: 31, fontWeight: '700' },
  formCaption: { color: Palette.muted, fontSize: 14, marginTop: 5 },
  fields: { gap: 18, marginTop: 26 },
  fieldGroup: { gap: 8 },
  label: { color: Palette.navy, fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 9,
    backgroundColor: Palette.surface,
    paddingHorizontal: 15,
    color: Palette.ink,
    fontSize: 15,
  },
  passwordField: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 9,
    backgroundColor: Palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  passwordInput: { flex: 1, minHeight: 52, color: Palette.ink, fontSize: 15 },
  visibilityButton: { paddingHorizontal: 15, paddingVertical: 14 },
  visibilityText: { color: Palette.navy, fontSize: 12, fontWeight: '700' },
  feedback: { color: Palette.danger, fontSize: 13, lineHeight: 19, marginTop: 15 },
  submitButton: {
    minHeight: 56,
    borderRadius: 9,
    backgroundColor: Palette.navy,
    paddingHorizontal: 18,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitText: { color: Palette.white, fontSize: 15, fontWeight: '800' },
  submitArrow: { color: Palette.white, fontSize: 22, lineHeight: 25 },
  pressed: { opacity: 0.78 },
  registerPrompt: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 23 },
  promptText: { color: Palette.muted, fontSize: 13 },
  registerLink: { color: Palette.navy, fontSize: 13, fontWeight: '800' },
  footer: { paddingHorizontal: 28, marginTop: 'auto', paddingTop: 30, paddingBottom: 22 },
  footerRule: { height: 1, backgroundColor: Palette.border },
  footerText: { color: Palette.muted, fontSize: 11, marginTop: 13, textAlign: 'center' },
});