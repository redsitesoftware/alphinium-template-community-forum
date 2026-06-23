import React, { useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FORUM_IMAGES, getForumAvatar } from '../media';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { useForum } from '../store/forumStore';

const REPORT_REASONS = ['Spam', 'Harassment', 'Misinformation', 'Off-topic', 'Other'];

function Avatar({ name, accent, size = 44 }) {
 return <Image source={{ uri: getForumAvatar(name) }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderColor: `${accent}33` }]} />;
}

const REPORT_REASONS = ['Spam', 'Harassment', 'Misinformation', 'Off-topic', 'Other'];

function showReportAlert(onSelect) {
 Alert.alert(
  'Report Content',
  'Why are you reporting this?',
  [
   ...REPORT_REASONS.map(reason => ({
    text: reason,
    onPress: () => onSelect(reason),
   })),
   { text: 'Cancel', style: 'cancel' },
  ]

function ReplyCard({ reply, category, isNested, currentUser, onReplyPress, onEditSave, onDelete, replyingToId, editingId }) {
 const [editText, setEditText] = useState(reply.content);
 const isOwn = reply.author === currentUser.name;
 const isReplyingHere = replyingToId === reply.id;
 const isEditingHere = editingId === reply.id;
 const [inlineReplyText, setInlineReplyText] = useState('');

 return (
  <View style={[styles.replyCard, isNested && styles.replyCardNested]}>
   <View style={styles.replyHeader}>
    <View style={styles.replyIdentity}>
     <Avatar name={reply.author} accent={category.color} size={isNested ? 36 : 44} />
     <View>
      <Text style={styles.replyAuthor}>{reply.author}</Text>
      <Text style={styles.replyTime}>
       {reply.timeAgo}{reply.editedAt ? ' • edited' : ''}
      </Text>
     </View>
    </View>
    <View style={styles.replyActions}>
     <Text style={styles.replyUpvotes}>▲ {reply.upvotes}</Text>
     {isOwn && !isEditingHere && (
      <>
       <TouchableOpacity onPress={() => onEditSave(reply.id, null)} style={styles.actionLink}>
        <Text style={styles.actionLinkText}>Edit</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => onDelete(reply.id)} style={styles.actionLink}>
        <Text style={[styles.actionLinkText, styles.actionLinkDelete]}>Delete</Text>
       </TouchableOpacity>
      </>
     )}
    </View>
   </View>

   {isEditingHere ? (
    <View>
     <TextInput
      style={styles.inlineInput}
      multiline
      value={editText}
      onChangeText={setEditText}
     />
     <View style={styles.inlineButtonRow}>
      <TouchableOpacity style={styles.inlineSaveButton} onPress={() => { if (editText.trim()) onEditSave(reply.id, editText.trim()); }}>
       <Text style={styles.inlineSaveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onEditSave(reply.id, null)}>
       <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
     </View>
    </View>
   ) : (
    <Text style={styles.replyContent}>{reply.content}</Text>
   )}

   {!isNested && (
    <TouchableOpacity onPress={() => onReplyPress(reply.id)} style={styles.replyLink}>
     <Text style={styles.replyLinkText}>{isReplyingHere ? 'Cancel' : 'Reply'}</Text>
    </TouchableOpacity>
   )}

   {isReplyingHere && (
    <View style={styles.inlineComposer}>
     <TextInput
      style={styles.inlineInput}
      multiline
      placeholder="Write a reply..."
      placeholderTextColor={colors.textSoft}
      value={inlineReplyText}
      onChangeText={setInlineReplyText}
      autoFocus
     />
     <View style={styles.inlineButtonRow}>
      <TouchableOpacity
       style={styles.inlineSaveButton}
       onPress={() => {
        if (inlineReplyText.trim()) {
         onReplyPress(reply.id, inlineReplyText.trim());
         setInlineReplyText('');
        }
       }}
      >
       <Text style={styles.inlineSaveText}>Post</Text>
      </TouchableOpacity>
     </View>
    </View>
   )}
  </View>
 );
}

export default function ThreadScreen() {
 const { selectedThread, getThread, getCategory, goHome, addReply, editReply, deleteReply, toggleUpvote, toggleHeart, reportContent, upvotedThreadIds, heartedThreadIds, currentUser } = useForum();
 const [replyText, setReplyText] = useState('');
 const [activeReplyId, setActiveReplyId] = useState(null);
 const [editingReplyId, setEditingReplyId] = useState(null);

 const thread = getThread(selectedThread);
 const category = thread ? getCategory(thread.categoryId) : null;
 const isUpvoted = useMemo(() => upvotedThreadIds.includes(selectedThread), [selectedThread, upvotedThreadIds]);
 const isHearted = useMemo(() => heartedThreadIds.includes(selectedThread), [heartedThreadIds, selectedThread]);

 const { topLevelReplies, childRepliesByParentId } = useMemo(() => {
  if (!thread) return { topLevelReplies: [], childRepliesByParentId: {} };
  const top = [];
  const byParent = {};
  for (const reply of thread.replies) {
   if (!reply.parentReplyId) {
    top.push(reply);
   } else {
    if (!byParent[reply.parentReplyId]) byParent[reply.parentReplyId] = [];
    byParent[reply.parentReplyId].push(reply);
   }
  }
  return { topLevelReplies: top, childRepliesByParentId: byParent };
 }, [thread]);

 if (!thread || !category) return null;

 const submitReply = () => {
  if (!replyText.trim()) return;
  addReply(thread.id, replyText);
  setReplyText('');
 };

 const handleReplyPress = (replyId, content) => {
  if (content) {
   addReply(thread.id, content, replyId);
   setActiveReplyId(null);
  } else {
   setActiveReplyId(prev => (prev === replyId ? null : replyId));
  }
 };

 const handleEditSave = (replyId, newContent) => {
  if (newContent === null) {
   setEditingReplyId(prev => (prev === replyId ? null : replyId));
  } else {
   editReply(thread.id, replyId, newContent);
   setEditingReplyId(null);
  }
 };

 const handleDelete = replyId => {
  Alert.alert('Delete Reply', 'Are you sure you want to delete this reply?', [
   { text: 'Cancel', style: 'cancel' },
   { text: 'Delete', style: 'destructive', onPress: () => deleteReply(thread.id, replyId) },
  ]);
 };

 const handleReportThread = () => {
  showReportAlert(reason => {
   reportContent('thread', thread.id, thread.id, reason);
   Alert.alert('Report submitted', 'Thank you for helping keep the community safe.');
  });
 };

 const handleReportReply = replyId => {
  showReportAlert(reason => {
   reportContent('reply', replyId, thread.id, reason);
   Alert.alert('Report submitted', 'Thank you for helping keep the community safe.');
  });
 };

 return (
  <SafeAreaView style={styles.safeArea}>
   <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={goHome}><Text style={styles.backButtonText}>← Back to Community</Text></TouchableOpacity>
     <View style={styles.threadCard}>
      <Image source={{ uri: FORUM_IMAGES.hero }} style={styles.heroImage} />
      <View style={styles.badgeRow}><View style={[styles.categoryBadge, { backgroundColor: `${category.color}15`, borderColor: `${category.color}33` }]}><Text style={styles.categoryBadgeText}>{category.emoji} {category.label}</Text></View>{thread.pinned ? <Text style={styles.pinBadge}> Pinned</Text> : null}{thread.resolved ? <Text style={styles.resolvedBadge}>RESOLVED</Text> : null}</View>
      <Text style={styles.title}>{thread.title}</Text>
      <View style={styles.authorRow}><Avatar name={thread.author} accent={category.color} size={56} /><View style={styles.authorMeta}><Text style={styles.authorName}>{thread.author}</Text><Text style={styles.authorJoined}>{thread.authorJoined} • {thread.timeAgo}</Text></View></View>
      {thread.content.map((paragraph, index) => <Text key={`${thread.id}-paragraph-${index}`} style={styles.paragraph}>{paragraph}</Text>)}
      {thread.tags ? <View style={styles.tagRow}>{thread.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => <View key={`${tag}-${i}`} style={styles.tagPill}><Text style={styles.tagText}># {tag}</Text></View>)}</View> : null}
      <View style={styles.engagementRow}><TouchableOpacity style={[styles.engagementButton, isUpvoted && styles.engagementButtonActive]} onPress={() => toggleUpvote(thread.id)}><Text style={[styles.engagementText, isUpvoted && styles.engagementTextActive]}>▲ {thread.upvotes} Upvotes</Text></TouchableOpacity><TouchableOpacity style={[styles.engagementButton, isHearted && styles.heartButtonActive]} onPress={() => toggleHeart(thread.id)}><Text style={[styles.engagementText, isHearted && styles.heartTextActive]}>️ {thread.hearts}</Text></TouchableOpacity><View style={styles.replyCountPill}><Text style={styles.replyCountText}> {thread.replyCount} replies</Text></View>{!currentUser.isAdmin && <TouchableOpacity style={styles.reportButton} onPress={handleReportThread}><Text style={styles.reportButtonText}>⚑ Report</Text></TouchableOpacity>}</View>
     </View>
     <View style={styles.repliesHeader}><Text style={styles.repliesTitle}>Recent Replies</Text><Text style={styles.repliesSubtitle}>A lively mix of new builders and longtime alphinium makers.</Text></View>

     {topLevelReplies.map(reply => (
      <View key={reply.id}>
       <ReplyCard
        reply={reply}
        category={category}
        isNested={false}
        currentUser={currentUser}
        onReplyPress={handleReplyPress}
        onEditSave={handleEditSave}
        onDelete={handleDelete}
        replyingToId={activeReplyId}
        editingId={editingReplyId}
       />
       {(childRepliesByParentId[reply.id] || []).map(child => (
        <ReplyCard
         key={child.id}
         reply={child}
         category={category}
         isNested
         currentUser={currentUser}
         onReplyPress={handleReplyPress}
         onEditSave={handleEditSave}
         onDelete={handleDelete}
         replyingToId={null}
         editingId={editingReplyId}
        />
       ))}
      </View>
     ))}

     <View style={styles.replyComposer}><Text style={styles.replyComposerTitle}>Reply</Text><TextInput style={styles.replyInput} multiline placeholder="Share what you're building or add your advice..." placeholderTextColor={colors.textSoft} value={replyText} onChangeText={setReplyText} /><TouchableOpacity style={styles.postReplyButton} onPress={submitReply}><Text style={styles.postReplyText}>Post Reply</Text></TouchableOpacity></View>
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
 threadCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.card, overflow: 'hidden' },
 heroImage: { width: '100%', height: 220, borderRadius: radius.md, marginBottom: spacing.lg },
 badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
 categoryBadge: { borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: 6 },
 categoryBadgeText: { fontSize: 12, fontWeight: '800', color: colors.text },
 pinBadge: { color: colors.primary, fontWeight: '700', alignSelf: 'center' },
 resolvedBadge: { backgroundColor: colors.successSoft, color: colors.green, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, fontWeight: '800', fontSize: 12, overflow: 'hidden' },
 title: { ...typography.title, color: colors.text, marginBottom: spacing.lg },
 authorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
 authorMeta: { flex: 1 },
 authorName: { color: colors.text, fontSize: 16, fontWeight: '700' },
 authorJoined: { color: colors.textMuted, marginTop: 2 },
 avatar: { borderWidth: 2 },
 paragraph: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
 engagementRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm, alignItems: 'center' },
 tagRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.lg },
 tagPill: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5 },
 tagText: { color: colors.textSoft, fontSize: 12, fontWeight: '600' },
 engagementButton: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.background },
 engagementButtonActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
 heartButtonActive: { borderColor: '#F9A8D4', backgroundColor: '#FDF2F8' },
 engagementText: { color: colors.textMuted, fontWeight: '700' },
 engagementTextActive: { color: colors.primary },
 heartTextActive: { color: colors.pink },
 replyCountPill: { borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
 replyCountText: { color: colors.textMuted, fontWeight: '700' },
 reportButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
 reportButtonText: { color: colors.textSoft, fontSize: 13, fontWeight: '600' },
 repliesHeader: { marginBottom: spacing.md },
 repliesTitle: { ...typography.heading, color: colors.text, marginBottom: 4 },
 repliesSubtitle: { color: colors.textMuted },
 replyCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.md },
 replyCardNested: { marginLeft: spacing.xl, borderLeftWidth: 3, borderLeftColor: colors.border, borderRadius: radius.sm },
 replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
 replyIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
 replyAuthor: { color: colors.text, fontWeight: '700', fontSize: 15 },
 replyTime: { color: colors.textSoft, fontSize: 12, marginTop: 2 },
 replyActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
 replyUpvotes: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
 replyContent: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
 actionLink: { paddingHorizontal: spacing.sm },
 actionLinkText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
 actionLinkDelete: { color: colors.red },
 replyLink: { alignSelf: 'flex-start', marginTop: spacing.sm },
 replyLinkText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
 inlineComposer: { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
 inlineInput: { minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, textAlignVertical: 'top', color: colors.text, marginBottom: spacing.sm, backgroundColor: colors.background },
 inlineButtonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
 inlineSaveButton: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 inlineSaveText: { color: colors.surface, fontWeight: '800', fontSize: 13 },
 cancelText: { color: colors.textMuted, fontSize: 13 },
 replyComposer: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginTop: spacing.sm },
 replyComposerTitle: { ...typography.subheading, color: colors.text, marginBottom: spacing.md },
 replyInput: { minHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, textAlignVertical: 'top', color: colors.text, marginBottom: spacing.md, backgroundColor: colors.background },
 postReplyButton: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
 postReplyText: { color: colors.surface, fontWeight: '800' },
});
