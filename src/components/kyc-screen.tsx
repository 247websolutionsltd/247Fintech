import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
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

import { type IdentityDocumentType, useAuthFlow } from '@/components/auth-flow-context';
import { Palette } from '@/constants/theme';

export type KycStep =
  | 'complete-profile'
  | 'personal-information'
  | 'date-of-birth-gender'
  | 'address-information'
  | 'identity-verification'
  | 'select-id-type'
  | 'upload-id'
  | 'selfie-verification'
  | 'verification-processing'
  | 'verification-successful'
  | 'verification-failed'
  | 'kyc-status';

const steps: Record<KycStep, { eyebrow: string; title: string; description: string; progress: number }> = {
  'complete-profile': { eyebrow: 'ACCOUNT SETUP', title: 'Complete your profile', description: 'A few details help us protect your account and meet financial regulations.', progress: 8 },
  'personal-information': { eyebrow: 'YOUR DETAILS', title: 'Personal information', description: 'Enter your legal name as it appears on your identity document.', progress: 17 },
  'date-of-birth-gender': { eyebrow: 'YOUR DETAILS', title: 'A little more about you', description: 'We use these details to confirm your identity.', progress: 26 },
  'address-information': { eyebrow: 'RESIDENTIAL ADDRESS', title: 'Where do you live?', description: 'Use your current residential address. A P.O. box cannot be accepted.', progress: 35 },
  'identity-verification': { eyebrow: 'IDENTITY CHECK', title: 'Verify your identity', description: 'Have a current government-issued photo ID ready. The review is private and secure.', progress: 44 },
  'select-id-type': { eyebrow: 'IDENTITY CHECK', title: 'Choose an ID type', description: 'Select the document you will use for verification.', progress: 53 },
  'upload-id': { eyebrow: 'IDENTITY CHECK', title: 'Add your ID photos', description: 'Capture clear, full-frame photos. Avoid glare and make sure all text is readable.', progress: 65 },
  'selfie-verification': { eyebrow: 'FACE CHECK', title: 'Take a quick selfie', description: 'Use a well-lit space and keep your face centered in the frame.', progress: 78 },
  'verification-processing': { eyebrow: 'REVIEW', title: 'Verification processing', description: 'Your information is prepared. Connect a KYC provider to submit it for a real review.', progress: 90 },
  'verification-successful': { eyebrow: 'IDENTITY CONFIRMED', title: 'Verification successful', description: 'Your identity check is complete. Your account profile is now verified.', progress: 100 },
  'verification-failed': { eyebrow: 'ACTION REQUIRED', title: 'We could not verify you', description: 'A document may be unclear or some details may not match. Review the items below and try again.', progress: 78 },
  'kyc-status': { eyebrow: 'VERIFICATION', title: 'Verification status', description: 'Your identity review and profile completion status.', progress: 100 },
};

const idTypes: { key: IdentityDocumentType; label: string; detail: string; symbol: string }[] = [
  { key: 'passport', label: 'Passport', detail: 'Photo page', symbol: 'P' },
  { key: 'national-id', label: 'National ID', detail: 'Front and back', symbol: 'ID' },
  { key: 'drivers-license', label: "Driver's license", detail: 'Front and back', symbol: 'DL' },
];

export function KycScreen({ step }: { step: KycStep }) {
  const {
    fullName, setFullName, dateOfBirth, setDateOfBirth, gender, setGender,
    address, setAddress, city, setCity, region, setRegion, postalCode, setPostalCode,
    country, setCountry, identityType, setIdentityType, idFrontUri, setIdFrontUri,
    idBackUri, setIdBackUri, selfieUri, setSelfieUri, kycStatus, setKycStatus, contact,
  } = useAuthFlow();
  const [message, setMessage] = useState('');

  const go = (route: string) => router.push(route as never);

  const chooseImage = async (target: 'front' | 'back' | 'selfie', camera = false) => {
    setMessage('');
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setMessage('Camera access is needed to take a photo. You can allow access in device settings.');
          return;
        }
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            cameraType: target === 'selfie' ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
            allowsEditing: target === 'selfie',
            ...(target === 'selfie' ? { aspect: [1, 1] as [number, number], shape: 'oval' as const } : {}),
            quality: 0.85,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.85,
          });
      if (result.canceled) return;
      const uri = result.assets[0]?.uri;
      if (!uri) return;
      if (target === 'front') setIdFrontUri(uri);
      else if (target === 'back') setIdBackUri(uri);
      else setSelfieUri(uri);
    } catch {
      setMessage('We could not open the image picker. Please try again.');
    }
  };

  const submit = () => {
    setMessage('');
    if (step === 'complete-profile') go('/personal-information');
    else if (step === 'personal-information') {
      if (fullName.trim().split(/\s+/).length < 2) {
        setMessage('Enter your first and last name as shown on your ID.');
        return;
      }
      go('/date-of-birth-gender');
    } else if (step === 'date-of-birth-gender') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || !gender) {
        setMessage('Enter your date as YYYY-MM-DD and select a gender option.');
        return;
      }
      const birthDate = new Date(`${dateOfBirth}T00:00:00`);
      const age = (Date.now() - birthDate.getTime()) / 31_557_600_000;
      if (Number.isNaN(birthDate.getTime()) || age < 18 || age > 120) {
        setMessage('Enter a valid date of birth. You must be at least 18.');
        return;
      }
      go('/address-information');
    } else if (step === 'address-information') {
      if (!address.trim() || !city.trim() || !region.trim() || !postalCode.trim() || !country.trim()) {
        setMessage('Complete all address fields to continue.');
        return;
      }
      go('/identity-verification');
    } else if (step === 'identity-verification') go('/select-id-type');
    else if (step === 'select-id-type') {
      if (!identityType) {
        setMessage('Select the document you want to use.');
        return;
      }
      go('/upload-id');
    } else if (step === 'upload-id') {
      if (!idFrontUri || (identityType !== 'passport' && !idBackUri)) {
        setMessage(identityType === 'passport' ? 'Add a photo of your passport photo page.' : 'Add photos of both sides of your ID.');
        return;
      }
      go('/selfie-verification');
    } else if (step === 'selfie-verification') {
      if (!selfieUri) {
        setMessage('Take or choose a selfie to continue.');
        return;
      }
      setKycStatus('pending');
      go('/verification-processing');
    } else if (step === 'verification-successful') go('/kyc-status');
    else if (step === 'verification-failed') go('/upload-id');
    else if (step === 'kyc-status') router.replace('/(tabs)' as never);
  };

  const setDemoResult = (result: 'verified' | 'failed') => {
    setKycStatus(result);
    go(result === 'verified' ? '/verification-successful' : '/verification-failed');
  };

  const current = steps[step];
  const idRequiresBack = identityType !== 'passport';
  const primaryLabel: Record<Exclude<KycStep, 'verification-processing'>, string> = {
    'complete-profile': 'Start verification',
    'personal-information': 'Continue',
    'date-of-birth-gender': 'Continue',
    'address-information': 'Continue',
    'identity-verification': 'Choose an ID',
    'select-id-type': 'Continue',
    'upload-id': 'Continue',
    'selfie-verification': 'Continue to review',
    'verification-successful': 'View KYC status',
    'verification-failed': 'Replace ID photos',
    'kyc-status': 'Go to home',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.topBar}>
              <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backArrow}>‹</Text>
              </Pressable>
              <Brand />
              <Pressable accessibilityRole="button" onPress={() => go('/kyc-status')} hitSlop={8}>
                <Text style={styles.statusLink}>Status</Text>
              </Pressable>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${current.progress}%` }]} /></View>
            <Text style={styles.eyebrow}>{current.eyebrow}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.description}>{current.description}</Text>

            {step === 'complete-profile' && (
              <ProfileOverview
                personalComplete={Boolean(fullName.trim())}
                demographicsComplete={Boolean(dateOfBirth && gender)}
                addressComplete={Boolean(address && city && region && postalCode && country)}
                identityComplete={Boolean(idFrontUri && selfieUri && (identityType === 'passport' || idBackUri))}
                status={kycStatus}
              />
            )}
            {step === 'personal-information' && (
              <>
                <Field label="Legal first and last name" value={fullName} onChangeText={setFullName} placeholder="As shown on your ID" autoCapitalize="words" autoComplete="name" />
                <View style={styles.readOnlyRow}>
                  <Text style={styles.readOnlyLabel}>Verified contact</Text>
                  <Text style={styles.readOnlyValue}>{contact || 'Add contact in account settings'}</Text>
                </View>
              </>
            )}
            {step === 'date-of-birth-gender' && (
              <>
                <Field label="Date of birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} />
                <Text style={styles.sectionLabel}>Gender</Text>
                <View style={styles.choiceList}>
                  {['Woman', 'Man', 'Non-binary', 'Prefer not to say'].map((option) => (
                    <ChoiceRow key={option} label={option} selected={gender === option} onPress={() => setGender(option)} />
                  ))}
                </View>
              </>
            )}
            {step === 'address-information' && (
              <>
                <Field label="Street address" value={address} onChangeText={setAddress} placeholder="Street and number" autoComplete="street-address" />
                <Field label="City" value={city} onChangeText={setCity} placeholder="City" />
                <View style={styles.fieldRow}>
                  <Field label="State / province" value={region} onChangeText={setRegion} placeholder="State" containerStyle={styles.fieldHalf} />
                  <Field label="Postal code" value={postalCode} onChangeText={setPostalCode} placeholder="Postal code" containerStyle={styles.fieldHalf} autoComplete="postal-code" />
                </View>
                <Field label="Country" value={country} onChangeText={setCountry} placeholder="Country" autoCapitalize="words" autoComplete="country" />
              </>
            )}
            {step === 'identity-verification' && <IdentityChecklist />}
            {step === 'select-id-type' && (
              <View style={styles.choiceList}>
                {idTypes.map((item) => (
                  <ChoiceRow
                    key={item.key}
                    label={item.label}
                    detail={item.detail}
                    marker={item.symbol}
                    selected={identityType === item.key}
                    onPress={() => setIdentityType(item.key)}
                  />
                ))}
              </View>
            )}
            {step === 'upload-id' && (
              <>
                <UploadTile label="Front of ID" imageUri={idFrontUri} onCamera={() => chooseImage('front', true)} onLibrary={() => chooseImage('front')} />
                {idRequiresBack && <UploadTile label="Back of ID" imageUri={idBackUri} onCamera={() => chooseImage('back', true)} onLibrary={() => chooseImage('back')} />}
                <View style={styles.privacyNote}><Text style={styles.privacyIcon}>✓</Text><Text style={styles.privacyText}>Photos stay on this device in this demo. Connect a secure KYC provider before collecting real customer documents.</Text></View>
              </>
            )}
            {step === 'selfie-verification' && (
              <>
                <View style={styles.selfieFrame}>
                  {selfieUri ? <Image source={{ uri: selfieUri }} style={styles.selfieImage} /> : <View style={styles.faceGuide}><View style={styles.faceOval}><Text style={styles.faceGlyph}>●</Text></View><Text style={styles.faceHint}>Center your face in the frame</Text></View>}
                </View>
                <View style={styles.photoActions}>
                  <ActionButton label={selfieUri ? 'Retake selfie' : 'Take selfie'} symbol="◉" onPress={() => chooseImage('selfie', true)} />
                  <ActionButton label="Choose photo" symbol="▧" onPress={() => chooseImage('selfie')} />
                </View>
              </>
            )}
            {step === 'verification-processing' && (
              <>
                <View style={styles.processingVisual}><View style={styles.processingRing}><Text style={styles.processingGlyph}>✓</Text></View></View>
                <View style={styles.summaryList}>
                  <SummaryRow label="Profile details" value="Ready" />
                  <SummaryRow label="Identity document" value={idFrontUri ? 'Added' : 'Missing'} />
                  <SummaryRow label="Face photo" value={selfieUri ? 'Added' : 'Missing'} last />
                </View>
                <View style={styles.privacyNote}><Text style={styles.privacyIcon}>i</Text><Text style={styles.privacyText}>Demo mode: no automated or human identity review is connected. Use the options below to preview each result screen.</Text></View>
              </>
            )}
            {step === 'verification-successful' && <ResultPanel status="success" fullName={fullName} />}
            {step === 'verification-failed' && <ResultPanel status="failed" />}
            {step === 'kyc-status' && <KycStatusPanel status={kycStatus} fullName={fullName} />}

            {message ? <Text accessibilityLiveRegion="polite" style={styles.feedback}>{message}</Text> : null}
            {step === 'verification-processing' ? (
              <View style={styles.demoActions}>
                <PrimaryButton label="Demo: preview approved" onPress={() => setDemoResult('verified')} />
                <Pressable accessibilityRole="button" onPress={() => setDemoResult('failed')} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Demo: preview needs changes</Text>
                </Pressable>
                <Text style={styles.bottomNote}>These previews do not send documents or determine a real KYC result.</Text>
              </View>
            ) : (
              <PrimaryButton label={primaryLabel[step]} onPress={submit} />
            )}
            {step === 'verification-failed' && <Text style={styles.bottomNote}>Your submitted documents are not retained by this demo.</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileOverview({
  personalComplete,
  demographicsComplete,
  addressComplete,
  identityComplete,
  status,
}: {
  personalComplete: boolean;
  demographicsComplete: boolean;
  addressComplete: boolean;
  identityComplete: boolean;
  status: string;
}) {
  const rows = [
    ['Personal information', personalComplete ? 'Complete' : 'To do'],
    ['Date of birth and gender', demographicsComplete ? 'Complete' : 'To do'],
    ['Residential address', addressComplete ? 'Complete' : 'To do'],
    ['Identity document and selfie', status === 'verified' ? 'Verified' : identityComplete ? 'Ready' : 'To do'],
  ];
  return (
    <View style={styles.overviewList}>
      {rows.map(([label, value], index) => (
        <View key={label} style={[styles.overviewRow, index === rows.length - 1 && styles.rowLast]}>
          <View style={[styles.overviewDot, value === 'Complete' || value === 'Verified' ? styles.overviewDotDone : undefined]} />
          <Text style={styles.overviewLabel}>{label}</Text>
          <Text style={styles.overviewValue}>{value}</Text>
        </View>
      ))}
      <Text style={styles.overviewFoot}>Usually takes about 5 minutes</Text>
    </View>
  );
}

function IdentityChecklist() {
  return (
    <View style={styles.summaryList}>
      <SummaryRow label="Government-issued photo ID" value="Required" />
      <SummaryRow label="Current residential address" value="Required" />
      <SummaryRow label="A clear selfie" value="Required" last />
    </View>
  );
}

function KycStatusPanel({ status, fullName }: { status: string; fullName: string }) {
  const verified = status === 'verified';
  const failed = status === 'failed';
  return (
    <View style={styles.statusPanel}>
      <View style={[styles.statusIcon, verified && styles.statusIconSuccess, failed && styles.statusIconFailed]}>
        <Text style={styles.statusIconText}>{verified ? '✓' : failed ? '!' : '…'}</Text>
      </View>
      <Text style={styles.statusHeading}>{verified ? 'Verified' : failed ? 'Action required' : 'In progress'}</Text>
      <Text style={styles.statusBody}>
        {verified
          ? `${fullName || 'Your profile'} has completed identity verification.`
          : failed
            ? 'We need updated information or clearer images to continue.'
            : 'Your profile is saved. Identity checks will show here once submitted to a verification provider.'}
      </Text>
      <View style={styles.statusDetails}>
        <SummaryRow label="Profile" value={fullName ? 'Complete' : 'Incomplete'} />
        <SummaryRow label="Identity review" value={verified ? 'Verified' : failed ? 'Needs update' : 'Not submitted'} last />
      </View>
    </View>
  );
}

function ResultPanel({ status, fullName }: { status: 'success' | 'failed'; fullName?: string }) {
  const success = status === 'success';
  return (
    <View style={styles.resultPanel}>
      <View style={[styles.resultIcon, success ? styles.resultIconSuccess : styles.resultIconFailed]}>
        <Text style={styles.resultIconText}>{success ? '✓' : '!'}</Text>
      </View>
      <Text style={styles.resultHeading}>{success ? 'You’re all set' : 'A clearer photo may help'}</Text>
      <Text style={styles.resultBody}>
        {success
          ? `Identity verification is complete${fullName ? ` for ${fullName}` : ''}.`
          : 'Check that the document is current, all corners are visible, and the details match your profile.'}
      </Text>
      {!success && <Text style={styles.resultFoot}>You can replace your ID photos and submit again.</Text>}
    </View>
  );
}

function UploadTile({ label, imageUri, onCamera, onLibrary }: { label: string; imageUri: string | null; onCamera: () => void; onLibrary: () => void }) {
  return (
    <View style={styles.uploadTile}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.uploadPreview} /> : <View style={styles.uploadIcon}><Text style={styles.uploadIconText}>▧</Text></View>}
      <View style={styles.uploadCopy}>
        <Text style={styles.uploadTitle}>{label}</Text>
        <Text style={styles.uploadCaption}>{imageUri ? 'Photo added. Tap an action to replace it.' : 'JPEG or PNG image'}</Text>
        <View style={styles.uploadActions}>
          <Pressable onPress={onCamera} hitSlop={6}><Text style={styles.inlineAction}>Take photo</Text></Pressable>
          <Pressable onPress={onLibrary} hitSlop={6}><Text style={styles.inlineAction}>Choose file</Text></Pressable>
        </View>
      </View>
      {imageUri ? <Text style={styles.uploadCheck}>✓</Text> : null}
    </View>
  );
}

function Field({
  label,
  containerStyle,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string; containerStyle?: object }) {
  return (
    <View style={[styles.fieldGroup, containerStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={Palette.placeholder}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

function ChoiceRow({ label, detail, marker, selected, onPress }: { label: string; detail?: string; marker?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.choiceRow, selected && styles.choiceRowSelected]}>
      {marker ? <View style={styles.choiceMarker}><Text style={styles.choiceMarkerText}>{marker}</Text></View> : <View style={[styles.radio, selected && styles.radioSelected]} />}
      <View style={styles.choiceCopy}><Text style={styles.choiceLabel}>{label}</Text>{detail ? <Text style={styles.choiceDetail}>{detail}</Text> : null}</View>
      {selected ? <Text style={styles.choiceCheck}>✓</Text> : null}
    </Pressable>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.summaryRow, last && styles.rowLast]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function ActionButton({ label, symbol, onPress }: { label: string; symbol: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionButton}>
      <Text style={styles.actionSymbol}>{symbol}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function Brand() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>24</Text></View>
      <Text style={styles.brandName}>247 FINANCE</Text>
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Text style={styles.primaryButtonArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  content: { width: '100%', maxWidth: 540, alignSelf: 'center', paddingHorizontal: 24, flex: 1 },
  topBar: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 37, height: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 19, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  backArrow: { color: Palette.navy, fontSize: 29, lineHeight: 33, marginTop: -4 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 31, height: 31, borderRadius: 9, backgroundColor: Palette.navy, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: Palette.lime, fontSize: 12, fontWeight: '900' },
  brandName: { color: Palette.navy, fontSize: 10, fontWeight: '800' },
  statusLink: { color: Palette.navyMid, fontSize: 11, fontWeight: '700', paddingVertical: 8 },
  progressTrack: { height: 3, borderRadius: 2, backgroundColor: Palette.border, marginTop: 9, marginBottom: 29, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: Palette.aqua },
  eyebrow: { color: Palette.success, fontSize: 9, fontWeight: '800', marginBottom: 8 },
  title: { color: Palette.navy, fontSize: 26, lineHeight: 32, fontWeight: '700' },
  description: { color: Palette.muted, fontSize: 12, lineHeight: 19, marginTop: 7, marginBottom: 23, maxWidth: 410 },
  fieldGroup: { gap: 7, marginBottom: 17 },
  fieldLabel: { color: Palette.navy, fontSize: 11, fontWeight: '700' },
  input: { minHeight: 51, borderWidth: 1, borderColor: Palette.border, borderRadius: 8, backgroundColor: Palette.surface, paddingHorizontal: 13, color: Palette.ink, fontSize: 13 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldHalf: { flex: 1 },
  readOnlyRow: { backgroundColor: Palette.navySoft, borderRadius: 8, padding: 12, marginTop: 2 },
  readOnlyLabel: { color: Palette.muted, fontSize: 9, fontWeight: '700' },
  readOnlyValue: { color: Palette.navy, fontSize: 12, fontWeight: '600', marginTop: 5 },
  sectionLabel: { color: Palette.navy, fontSize: 11, fontWeight: '700', marginBottom: 9, marginTop: 4 },
  choiceList: { gap: 8 },
  choiceRow: { minHeight: 63, flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 9, paddingHorizontal: 13 },
  choiceRowSelected: { borderColor: Palette.navyMid, backgroundColor: Palette.navySoft },
  radio: { width: 17, height: 17, borderRadius: 9, borderWidth: 1, borderColor: Palette.navyTint, marginRight: 12 },
  radioSelected: { borderWidth: 5, borderColor: Palette.navyMid },
  choiceMarker: { width: 35, height: 35, borderRadius: 10, backgroundColor: Palette.navySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  choiceMarkerText: { color: Palette.navy, fontSize: 9, fontWeight: '800' },
  choiceCopy: { flex: 1 },
  choiceLabel: { color: Palette.ink, fontSize: 12, fontWeight: '700' },
  choiceDetail: { color: Palette.muted, fontSize: 10, marginTop: 4 },
  choiceCheck: { color: Palette.success, fontSize: 16, fontWeight: '800', paddingLeft: 8 },
  overviewList: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 10, paddingHorizontal: 13 },
  overviewRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderBottomColor: Palette.border },
  overviewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.pagination },
  overviewDotDone: { backgroundColor: Palette.success },
  overviewLabel: { flex: 1, color: Palette.ink, fontSize: 11, fontWeight: '600' },
  overviewValue: { color: Palette.muted, fontSize: 9, fontWeight: '700' },
  overviewFoot: { color: Palette.muted, fontSize: 10, paddingVertical: 12 },
  rowLast: { borderBottomWidth: 0 },
  summaryList: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 10, paddingHorizontal: 14 },
  summaryRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Palette.border },
  summaryLabel: { color: Palette.ink, fontSize: 11, fontWeight: '600' },
  summaryValue: { color: Palette.muted, fontSize: 10, fontWeight: '700' },
  uploadTile: { minHeight: 102, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Palette.border, borderRadius: 10, backgroundColor: Palette.surface, padding: 12, marginBottom: 10 },
  uploadIcon: { width: 52, height: 52, borderRadius: 9, backgroundColor: Palette.navySoft, alignItems: 'center', justifyContent: 'center' },
  uploadIconText: { color: Palette.navyMid, fontSize: 24 },
  uploadPreview: { width: 64, height: 64, borderRadius: 7, backgroundColor: Palette.navySoft },
  uploadCopy: { flex: 1, paddingHorizontal: 12 },
  uploadTitle: { color: Palette.navy, fontSize: 12, fontWeight: '700' },
  uploadCaption: { color: Palette.muted, fontSize: 9, marginTop: 4 },
  uploadActions: { flexDirection: 'row', gap: 14, marginTop: 9 },
  inlineAction: { color: Palette.navyMid, fontSize: 10, fontWeight: '700' },
  uploadCheck: { color: Palette.success, fontSize: 16, fontWeight: '800' },
  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Palette.navySoft, borderRadius: 8, padding: 11, marginTop: 10 },
  privacyIcon: { color: Palette.success, fontSize: 12, fontWeight: '800' },
  privacyText: { flex: 1, color: Palette.navyMid, fontSize: 9, lineHeight: 14 },
  selfieFrame: { aspectRatio: 1, width: '78%', maxWidth: 300, alignSelf: 'center', borderWidth: 1, borderColor: Palette.border, borderRadius: 150, backgroundColor: Palette.navySoft, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  selfieImage: { width: '100%', height: '100%' },
  faceGuide: { alignItems: 'center' },
  faceOval: { width: 152, height: 190, borderWidth: 2, borderStyle: 'dashed', borderColor: Palette.navyTint, borderRadius: 90, alignItems: 'center', justifyContent: 'center' },
  faceGlyph: { color: Palette.navyTint, fontSize: 34 },
  faceHint: { color: Palette.muted, fontSize: 10, marginTop: 16 },
  photoActions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 18 },
  actionButton: { minWidth: 132, minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: 8, paddingHorizontal: 12 },
  actionSymbol: { color: Palette.navy, fontSize: 15 },
  actionLabel: { color: Palette.navy, fontSize: 10, fontWeight: '700' },
  processingVisual: { alignItems: 'center', paddingVertical: 3, marginBottom: 20 },
  processingRing: { width: 68, height: 68, borderRadius: 34, backgroundColor: Palette.successSurface, alignItems: 'center', justifyContent: 'center' },
  processingGlyph: { color: Palette.success, fontSize: 27, fontWeight: '700' },
  resultPanel: { alignItems: 'center', backgroundColor: Palette.surface, borderRadius: 11, borderWidth: 1, borderColor: Palette.border, padding: 20 },
  resultIcon: { width: 59, height: 59, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  resultIconSuccess: { backgroundColor: Palette.successSurface },
  resultIconFailed: { backgroundColor: '#F9E4E1' },
  resultIconText: { color: Palette.success, fontSize: 25, fontWeight: '800' },
  resultHeading: { color: Palette.navy, fontSize: 16, fontWeight: '700', marginTop: 12 },
  resultBody: { color: Palette.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 7 },
  resultFoot: { color: Palette.navyMid, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 11 },
  statusPanel: { alignItems: 'center', backgroundColor: Palette.surface, borderRadius: 11, borderWidth: 1, borderColor: Palette.border, padding: 17 },
  statusIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Palette.navySoft, alignItems: 'center', justifyContent: 'center' },
  statusIconSuccess: { backgroundColor: Palette.successSurface },
  statusIconFailed: { backgroundColor: '#F9E4E1' },
  statusIconText: { color: Palette.navyMid, fontSize: 21, fontWeight: '800' },
  statusHeading: { color: Palette.navy, fontSize: 15, fontWeight: '700', marginTop: 10 },
  statusBody: { color: Palette.muted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 5, marginBottom: 14 },
  statusDetails: { width: '100%', borderTopWidth: 1, borderTopColor: Palette.border },
  demoActions: { gap: 4 },
  secondaryButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: 7 },
  secondaryButtonText: { color: Palette.navyMid, fontSize: 11, fontWeight: '700' },
  feedback: { color: Palette.danger, fontSize: 11, lineHeight: 16, marginTop: 8 },
  primaryButton: { minHeight: 53, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Palette.navy, borderRadius: 9, paddingHorizontal: 16, marginTop: 20 },
  primaryButtonText: { color: Palette.white, fontSize: 13, fontWeight: '800' },
  primaryButtonArrow: { color: Palette.lime, fontSize: 20 },
  pressed: { opacity: 0.78 },
  bottomNote: { color: Palette.muted, fontSize: 9, textAlign: 'center', marginTop: 12 },
});
