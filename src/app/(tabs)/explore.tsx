import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

const accounts = [
  { name: 'Everyday Checking', detail: '•• 4829', balance: '$8,420.50', accent: Palette.aqua },
  { name: 'High-yield Savings', detail: '•• 1604', balance: '$12,060.00', accent: Palette.lime },
  { name: 'Investment Account', detail: '•• 7731', balance: '$4,200.00', accent: '#E5A89C' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>24</Text></View>
          <Text style={styles.brandName}>247 FINANCE</Text>
        </View>
        <Text style={styles.eyebrow}>YOUR MONEY, ORGANIZED</Text>
        <Text style={styles.title}>Accounts</Text>
        <Text style={styles.subtitle}>A clear view of everything you hold.</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL ACROSS ACCOUNTS</Text>
          <Text style={styles.totalAmount}>$24,680.50</Text>
        </View>

        <View style={styles.accountList}>
          {accounts.map((account) => (
            <View key={account.name} style={styles.accountRow}>
              <View style={[styles.accountAccent, { backgroundColor: account.accent }]} />
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountNumber}>{account.detail}</Text>
              </View>
              <Text style={styles.accountBalance}>{account.balance}</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>All in one place</Text>
          <Text style={styles.noteText}>Your accounts stay organized, so the next step is always easier to see.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 32 },
  brandRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 35, height: 35, borderRadius: 10, backgroundColor: Palette.navy, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: Palette.lime, fontSize: 14, fontWeight: '900' },
  brandName: { color: Palette.navy, fontSize: 11, fontWeight: '800' },
  eyebrow: { color: Palette.success, fontSize: 9, fontWeight: '800', marginTop: 29 },
  title: { color: Palette.navy, fontSize: 30, lineHeight: 37, fontWeight: '700', marginTop: 7 },
  subtitle: { color: Palette.muted, fontSize: 13, marginTop: 5 },
  totalRow: { backgroundColor: Palette.navy, borderRadius: 12, padding: 18, marginTop: 24 },
  totalLabel: { color: Palette.navyTint, fontSize: 9, fontWeight: '800' },
  totalAmount: { color: Palette.white, fontSize: 28, fontWeight: '700', marginTop: 8 },
  accountList: { backgroundColor: Palette.surface, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 14, marginTop: 16 },
  accountRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Palette.border },
  accountAccent: { width: 4, height: 38, borderRadius: 2 },
  accountDetails: { flex: 1, paddingHorizontal: 12 },
  accountName: { color: Palette.ink, fontSize: 13, fontWeight: '700' },
  accountNumber: { color: Palette.muted, fontSize: 10, marginTop: 5 },
  accountBalance: { color: Palette.navy, fontSize: 12, fontWeight: '700' },
  note: { backgroundColor: Palette.navySoft, borderRadius: 10, padding: 15, marginTop: 18 },
  noteTitle: { color: Palette.navy, fontSize: 13, fontWeight: '700' },
  noteText: { color: Palette.muted, fontSize: 11, lineHeight: 17, marginTop: 5 },
});
