import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

const actions = [
  { label: 'Transfer', symbol: '↗' },
  { label: 'Add money', symbol: '+' },
  { label: 'Cards', symbol: '▤' },
];

const transactions = [
  { initials: 'WF', name: 'Whole Foods Market', category: 'Groceries', date: 'Today, 10:42 AM', amount: '-$84.26', color: '#DDF0E4' },
  { initials: 'N', name: 'Netflix', category: 'Entertainment', date: 'Yesterday', amount: '-$15.49', color: '#F9E4E1' },
  { initials: 'AC', name: 'Acme Corporation', category: 'Income', date: 'Sep 25', amount: '+$4,800.00', color: '#E3ECF6' },
  { initials: 'SP', name: 'Spotify', category: 'Entertainment', date: 'Sep 24', amount: '-$10.99', color: '#E2F0E8' },
  { initials: 'UB', name: 'Uber', category: 'Transport', date: 'Sep 23', amount: '-$18.75', color: '#E8E9EC' },
];

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}><Text style={styles.brandMarkText}>24</Text></View>
              <Text style={styles.brandName}>247 FINANCE</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => setActiveAction('Notifications')}
              style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}>
              <Text style={styles.notificationIcon}>!</Text>
              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          <View style={styles.greeting}>
            <Text style={styles.date}>MONDAY, SEPTEMBER 28</Text>
            <Text style={styles.greetingTitle}>Good morning, Maya</Text>
            <Text style={styles.greetingSubtitle}>Here is your financial snapshot.</Text>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceTopRow}>
              <View>
                <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
                <Text style={styles.balanceAmount}>{balanceVisible ? '$24,680.50' : '••••••••'}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={balanceVisible ? 'Hide balance' : 'Show balance'}
                onPress={() => setBalanceVisible((visible) => !visible)}
                hitSlop={10}
                style={styles.visibilityButton}>
                <Text style={styles.visibilityIcon}>{balanceVisible ? '◉' : '◎'}</Text>
              </Pressable>
            </View>
            <View style={styles.balanceMetaRow}>
              <View style={styles.trendPill}>
                <Text style={styles.trendArrow}>↗</Text>
                <Text style={styles.trendText}>8.4%</Text>
              </View>
              <Text style={styles.balanceMeta}>this month</Text>
              <View style={styles.balanceMetaSpacer} />
              <Text style={styles.accountNumber}>•• 4829</Text>
            </View>
            <View style={styles.balanceChart} accessibilityLabel="Balance trending upward">
              {[21, 31, 27, 44, 38, 52, 46, 62, 55, 78, 69, 92].map((height, index) => (
                <View
                  key={index}
                  style={[styles.chartBar, { height }, index > 8 && styles.chartBarAccent]}
                />
              ))}
            </View>
          </View>

          <View style={styles.actionRow}>
            {actions.map((action) => (
              <Pressable
                accessibilityRole="button"
                key={action.label}
                onPress={() => setActiveAction(action.label)}
                style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                <View style={styles.actionIcon}><Text style={styles.actionSymbol}>{action.symbol}</Text></View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          {activeAction ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss message"
              onPress={() => setActiveAction(null)}
              style={styles.notice}>
              <Text style={styles.noticeText}>
                {activeAction === 'Notifications'
                  ? 'You are all caught up.'
                  : `${activeAction} will be ready when your account is connected.`}
              </Text>
              <Text style={styles.noticeClose}>×</Text>
            </Pressable>
          ) : null}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Spending</Text>
              <Text style={styles.sectionCaption}>Your monthly overview</Text>
            </View>
            <Text style={styles.periodLabel}>SEPT 2026</Text>
          </View>

          <View style={styles.spendingCard}>
            <View style={styles.spendingTopRow}>
              <View>
                <Text style={styles.spendingLabel}>YOU HAVE SPENT</Text>
                <Text style={styles.spendingAmount}>$1,842.35</Text>
              </View>
              <View style={styles.budgetBadge}><Text style={styles.budgetBadgeText}>On track</Text></View>
            </View>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
            <View style={styles.budgetMetaRow}>
              <Text style={styles.budgetMeta}>61% of $3,000 monthly budget</Text>
              <Text style={styles.budgetPercent}>61%</Text>
            </View>
            <View style={styles.spendingFoot}>
              <View style={styles.spendingFootMark}><Text style={styles.spendingFootArrow}>↓</Text></View>
              <Text style={styles.spendingFootText}>12% less than this time last month</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <Text style={styles.sectionCaption}>Your latest transactions</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowAllActivity((showAll) => !showAll)}
              hitSlop={8}>
              <Text style={styles.seeAll}>{showAllActivity ? 'Show less' : 'See all'}</Text>
            </Pressable>
          </View>

          <View style={styles.activityList}>
            {transactions.slice(0, showAllActivity ? transactions.length : 3).map((transaction) => (
              <View key={transaction.name} style={styles.transactionRow}>
                <View style={[styles.transactionMark, { backgroundColor: transaction.color }]}>
                  <Text style={styles.transactionInitials}>{transaction.initials}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text numberOfLines={1} style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionMeta}>{transaction.category}  ·  {transaction.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, transaction.amount.startsWith('+') && styles.incomeAmount]}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalTopRow}>
              <View>
                <Text style={styles.goalEyebrow}>YOUR NEXT MILESTONE</Text>
                <Text style={styles.goalTitle}>Rainy day fund</Text>
              </View>
              <View style={styles.goalBadge}><Text style={styles.goalBadgeText}>64%</Text></View>
            </View>
            <View style={styles.goalProgressTrack}><View style={styles.goalProgressFill} /></View>
            <View style={styles.goalMetaRow}>
              <Text style={styles.goalMeta}>$3,200 saved</Text>
              <Text style={styles.goalMeta}>$1,800 to go</Text>
            </View>
          </View>

          <Text style={styles.footerNote}>Your money, in focus.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { paddingBottom: 28 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22 },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 35, height: 35, borderRadius: 10, backgroundColor: Palette.navy, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: Palette.lime, fontSize: 14, fontWeight: '900' },
  brandName: { color: Palette.navy, fontSize: 11, fontWeight: '800' },
  notificationButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center' },
  notificationIcon: { color: Palette.navy, fontSize: 17, fontWeight: '700' },
  notificationDot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, top: 8, right: 8, backgroundColor: Palette.success },
  greeting: { paddingTop: 18, paddingBottom: 20 },
  date: { color: Palette.muted, fontSize: 10, fontWeight: '800' },
  greetingTitle: { color: Palette.navy, fontSize: 26, lineHeight: 32, fontWeight: '700', marginTop: 7 },
  greetingSubtitle: { color: Palette.muted, fontSize: 13, marginTop: 4 },
  balanceCard: { minHeight: 194, borderRadius: 14, backgroundColor: Palette.navy, padding: 19, overflow: 'hidden' },
  balanceTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  balanceLabel: { color: Palette.navyTint, fontSize: 9, fontWeight: '800' },
  balanceAmount: { color: Palette.white, fontSize: 32, lineHeight: 40, fontWeight: '700', marginTop: 5 },
  visibilityButton: { width: 35, height: 35, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.navyMid },
  visibilityIcon: { color: Palette.white, fontSize: 16 },
  balanceMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#294B49', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 4 },
  trendArrow: { color: Palette.aqua, fontSize: 11, fontWeight: '800' },
  trendText: { color: Palette.aqua, fontSize: 10, fontWeight: '800' },
  balanceMeta: { color: Palette.navyTint, fontSize: 10, marginLeft: 7 },
  balanceMetaSpacer: { flex: 1 },
  accountNumber: { color: Palette.navyTint, fontSize: 10, fontWeight: '700' },
  balanceChart: { position: 'absolute', bottom: 0, left: 19, right: 19, height: 43, flexDirection: 'row', alignItems: 'flex-end', gap: 5, opacity: 0.55 },
  chartBar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#58718D' },
  chartBarAccent: { backgroundColor: Palette.lime },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 19 },
  actionButton: { flex: 1, alignItems: 'center', gap: 7 },
  actionIcon: { width: 45, height: 45, borderRadius: 13, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Palette.border },
  actionSymbol: { color: Palette.navy, fontSize: 20, fontWeight: '600' },
  actionLabel: { color: Palette.ink, fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  notice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Palette.navySoft, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 17 },
  noticeText: { flex: 1, color: Palette.navy, fontSize: 12, lineHeight: 17 },
  noticeClose: { color: Palette.navy, fontSize: 20, paddingLeft: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7, marginBottom: 11 },
  sectionTitle: { color: Palette.navy, fontSize: 17, fontWeight: '700' },
  sectionCaption: { color: Palette.muted, fontSize: 11, marginTop: 3 },
  periodLabel: { color: Palette.muted, fontSize: 9, fontWeight: '800' },
  spendingCard: { borderRadius: 12, backgroundColor: Palette.surface, padding: 16, borderWidth: 1, borderColor: Palette.border },
  spendingTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spendingLabel: { color: Palette.muted, fontSize: 9, fontWeight: '800' },
  spendingAmount: { color: Palette.navy, fontSize: 25, fontWeight: '700', marginTop: 5 },
  budgetBadge: { backgroundColor: Palette.successSurface, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 5 },
  budgetBadgeText: { color: Palette.success, fontSize: 10, fontWeight: '700' },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: Palette.navySoft, overflow: 'hidden', marginTop: 16 },
  progressFill: { width: '61%', height: '100%', borderRadius: 4, backgroundColor: Palette.aqua },
  budgetMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  budgetMeta: { color: Palette.muted, fontSize: 10 },
  budgetPercent: { color: Palette.navy, fontSize: 10, fontWeight: '700' },
  spendingFoot: { flexDirection: 'row', alignItems: 'center', gap: 7, borderTopWidth: 1, borderTopColor: Palette.border, marginTop: 13, paddingTop: 12 },
  spendingFootMark: { width: 18, height: 18, borderRadius: 9, backgroundColor: Palette.successSurface, alignItems: 'center', justifyContent: 'center' },
  spendingFootArrow: { color: Palette.success, fontSize: 12, fontWeight: '800' },
  spendingFootText: { color: Palette.success, fontSize: 10, fontWeight: '600' },
  seeAll: { color: Palette.navyMid, fontSize: 11, fontWeight: '700', padding: 4 },
  activityList: { backgroundColor: Palette.surface, borderRadius: 12, paddingHorizontal: 13, borderWidth: 1, borderColor: Palette.border },
  transactionRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Palette.border },
  transactionMark: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  transactionInitials: { color: Palette.navy, fontSize: 10, fontWeight: '800' },
  transactionDetails: { flex: 1, minWidth: 0, paddingHorizontal: 10 },
  transactionName: { color: Palette.ink, fontSize: 12, fontWeight: '700' },
  transactionMeta: { color: Palette.muted, fontSize: 9, marginTop: 4 },
  transactionAmount: { color: Palette.ink, fontSize: 11, fontWeight: '700' },
  incomeAmount: { color: Palette.success },
  goalCard: { backgroundColor: Palette.navyDeep, borderRadius: 12, padding: 16, marginTop: 19 },
  goalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalEyebrow: { color: Palette.navyTint, fontSize: 9, fontWeight: '800' },
  goalTitle: { color: Palette.white, fontSize: 16, fontWeight: '700', marginTop: 6 },
  goalBadge: { width: 39, height: 39, borderRadius: 20, borderWidth: 2, borderColor: Palette.lime, alignItems: 'center', justifyContent: 'center' },
  goalBadgeText: { color: Palette.lime, fontSize: 10, fontWeight: '800' },
  goalProgressTrack: { height: 6, borderRadius: 3, backgroundColor: Palette.navyMid, overflow: 'hidden', marginTop: 15 },
  goalProgressFill: { width: '64%', height: '100%', borderRadius: 3, backgroundColor: Palette.lime },
  goalMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  goalMeta: { color: Palette.navyTint, fontSize: 10 },
  footerNote: { color: Palette.muted, fontSize: 10, textAlign: 'center', marginTop: 20 },
});
