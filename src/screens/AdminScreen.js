import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { useForum } from '../store/forumStore';

function formatDate(timestamp) {
 return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getContentExcerpt(report, threads) {
 const thread = threads.find(t => t.id === report.threadId);
 if (!thread) return '(content removed)';
 if (report.type === 'thread') {
  return thread.title || thread.excerpt || '(no excerpt)';
 }
 const reply = thread.replies.find(r => r.id === report.targetId);
 return reply ? reply.content.slice(0, 80) + (reply.content.length > 80 ? '…' : '') : '(reply removed)';
}

export default function AdminScreen() {
 const { reports, threads, goHome, dismissReport, removeContent } = useForum();
 const pendingReports = reports.filter(r => r.status === 'pending');

 const handleDismiss = reportId => {
  dismissReport(reportId);
 };

 const handleRemove = (reportId, report) => {
  Alert.alert(
   'Remove Content',
   `Are you sure you want to permanently remove this ${report.type}?`,
   [
    { text: 'Cancel', style: 'cancel' },
    {
     text: 'Remove',
     style: 'destructive',
     onPress: () => removeContent(reportId),
    },
   ]
  );
 };

 return (
  <SafeAreaView style={styles.safeArea}>
   <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={goHome}>
      <Text style={styles.backButtonText}>← Back to Community</Text>
     </TouchableOpacity>

     <View style={styles.headerRow}>
      <Text style={styles.heading}>⚑ Moderation Queue</Text>
      <View style={styles.countBadge}>
       <Text style={styles.countBadgeText}>{pendingReports.length} pending</Text>
      </View>
     </View>

     {pendingReports.length === 0 ? (
      <View style={styles.emptyState}>
       <Text style={styles.emptyEmoji}>🎉</Text>
       <Text style={styles.emptyText}>No pending reports</Text>
      </View>
     ) : (
      pendingReports.map(report => (
       <View key={report.id} style={styles.reportCard}>
        <View style={styles.reportMeta}>
         <View style={[styles.typeBadge, report.type === 'thread' ? styles.typeBadgeThread : styles.typeBadgeReply]}>
          <Text style={styles.typeBadgeText}>{report.type}</Text>
         </View>
         <Text style={styles.reason}>{report.reason}</Text>
         <Text style={styles.reportDate}>{formatDate(report.reportedAt)}</Text>
        </View>
        <Text style={styles.reportedBy}>Reported by {report.reportedBy}</Text>
        <Text style={styles.excerpt} numberOfLines={3}>{getContentExcerpt(report, threads)}</Text>
        <View style={styles.actionRow}>
         <TouchableOpacity style={styles.dismissButton} onPress={() => handleDismiss(report.id)}>
          <Text style={styles.dismissButtonText}>Dismiss</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(report.id, report)}>
          <Text style={styles.removeButtonText}>Remove Content</Text>
         </TouchableOpacity>
        </View>
       </View>
      ))
     )}
    </View>
   </ScrollView>
  </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: colors.background },
 content: { padding: spacing.xl },
 container: { width: '100%', maxWidth: 920, alignSelf: 'center' },
 backButton: { alignSelf: 'flex-start', marginBottom: spacing.lg },
 backButtonText: { color: colors.primary, fontWeight: '700' },
 headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl, flexWrap: 'wrap' },
 heading: { ...typography.heading, color: colors.text },
 countBadge: { backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
 countBadgeText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
 emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
 emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
 emptyText: { ...typography.subheading, color: colors.textMuted },
 reportCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.md, ...shadows.card },
 reportMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
 typeBadge: { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
 typeBadgeThread: { backgroundColor: '#EDE9FE' },
 typeBadgeReply: { backgroundColor: '#DBEAFE' },
 typeBadgeText: { fontSize: 11, fontWeight: '800', color: colors.text },
 reason: { fontWeight: '700', color: colors.text, fontSize: 13 },
 reportDate: { color: colors.textSoft, fontSize: 12, marginLeft: 'auto' },
 reportedBy: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
 excerpt: { color: colors.textMuted, fontSize: 14, lineHeight: 21, backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.md },
 actionRow: { flexDirection: 'row', gap: spacing.md },
 dismissButton: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 dismissButtonText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
 removeButton: { backgroundColor: '#FEE2E2', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 removeButtonText: { color: colors.red, fontWeight: '700', fontSize: 13 },
});
