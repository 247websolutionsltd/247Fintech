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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleRegister = () => {
    if (!name.trim()) {
      setFeedback('Enter your name to continue.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFeedback('Enter a valid email address to continue.');
      return;
    }
    if (password.length < 8) {
      setFeedback('Choose a password with at least 8 characters.');
      return;
    }
    if (password !== confirmation) {
      setFeedback('Your passwords do not match.');
      return;
    }
    setFeedback('Your details are ready. Account creation needs an authentication provider.');
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
              <Text style={styles.eyebrow}>A BETTER FINANCIAL START</Text>
              <Text style={styles.headline}>Make room for what&apos;s next.</Text>
              <Text style={styles.heroSubcopy}>Create your account and bring it all into focus.</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Create your account</Text>
              <Text style={styles.formCaption}>A few details, then you&apos;re on your way.</Text>

              <View style={styles.fields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full name</Text>
                  <TextInput
                    accessibilityLabel="Full name"
                    autoComplete="name"
                    autoCapitalize="words"
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={Palette.placeholder}
                    returnKeyType="next"
                    style={styles.input}
                    textContentType="name"
                    value={name}
                  />
                </View>

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
                  <TextInput
                    accessibilityLabel="Password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    onChangeText={setPassword}
                    placeholder="At least 8 characters"
                    placeholderTextColor={Palette.placeholder}
                    returnKeyType="next"
                    secureTextEntry
                    style={styles.input}
                    textContentType="newPassword"
                    value={password}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput
                    accessibilityLabel="Confirm password"
                    autoCapitalize="none"
                    onChangeText={setConfirmation}
                    onSubmitEditing={handleRegister}
                    placeholder="Enter your password again"
                    placeholderTextColor={Palette.placeholder}
                    returnKeyType="done"
                    secureTextEntry
                    style={styles.input}
                    value={confirmation}
                  />
                </View>
              </View>

              {feedback ? (
                <Text accessibilityLiveRegion="polite" style={styles.feedback}>
                  {feedback}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={handleRegister}
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                <Text style={styles.submitText}>Create account</Text>
                <Text style={styles.submitArrow}>→</Text>
              </Pressable>

              <View style={styles.loginPrompt}>
                <Text style={styles.promptText}>Already have an account?</Text>
                <Link href="/login" replace asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text style={styles.loginLink}>Sign in</Text>
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
    minHeight: 220,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: Palette.navy,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 29 },
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
  eyebrow: { color: Palette.lime, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  headline: { color: Palette.white, fontSize: 32, lineHeight: 37, fontWeight: '700', marginTop: 10 },
  heroSubcopy: { color: Palette.navySoft, fontSize: 14, lineHeight: 20, marginTop: 8 },
  formSection: { paddingHorizontal: 28, paddingTop: 26 },
  formTitle: { color: Palette.navy, fontSize: 24, lineHeight: 30, fontWeight: '700' },
  formCaption: { color: Palette.muted, fontSize: 14, marginTop: 5 },
  fields: { gap: 15, marginTop: 22 },
  fieldGroup: { gap: 7 },
  label: { color: Palette.navy, fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 9,
    backgroundColor: Palette.surface,
    paddingHorizontal: 15,
    color: Palette.ink,
    fontSize: 15,
  },
  feedback: { color: Palette.danger, fontSize: 13, lineHeight: 19, marginTop: 14 },
  submitButton: {
    minHeight: 56,
    borderRadius: 9,
    backgroundColor: Palette.navy,
    paddingHorizontal: 18,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitText: { color: Palette.white, fontSize: 15, fontWeight: '800' },
  submitArrow: { color: Palette.white, fontSize: 22, lineHeight: 25 },
  pressed: { opacity: 0.78 },
  loginPrompt: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 21 },
  promptText: { color: Palette.muted, fontSize: 13 },
  loginLink: { color: Palette.navy, fontSize: 13, fontWeight: '800' },
  footer: { paddingHorizontal: 28, marginTop: 'auto', paddingTop: 28, paddingBottom: 22 },
  footerRule: { height: 1, backgroundColor: Palette.border },
  footerText: { color: Palette.muted, fontSize: 11, marginTop: 13, textAlign: 'center' },
});