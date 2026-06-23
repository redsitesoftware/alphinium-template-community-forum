import React, { useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FORUM_IMAGES, getForumAvatar } from '../media';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { useForum } from '../store/forumStore';

function Avatar({ name, accent = colors.primary, size = 42 }) {
 return <Image source={{ uri: getForumAvatar(name) }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderColor: `${accent}33` }]} />;
}

function CategoryBadge({ category }) {
 return <View style={[styles.categoryBadge, { backgroundColor: `${category.color}15`, borderColor: `${category.color}33` }]}><Text style={styles.categoryBadgeText}>{category.emoji} {category.label}</Text></View>;
}

export default function HomeScreen() {
 const { categories, currentUser, threads, openNewPost, openProfile, openThread, getCategory, togglePin } = useForum();
 const [selectedCategory, setSelectedCategory] = useState('all');
 const visibleThreads = useMemo(() => {
   const filtered = threads.filter(thread => selectedCategory === 'all' || thread.categoryId === selectedCategory);
   const pinned = filtered.filter(t => t.pinned);
   const unpinned = filtered.filter(t => !t.pinned);
   return [...pinned, ...unpinned];
 }, [selectedCategory, threads]);

 return (
 <SafeAreaView style={styles.safeArea}>
 <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
 <View style={styles.container}>
 <View style={styles.headerRow}>
 <View>
 <View style={styles.logoRow}><View style={styles.logoMark} /><Text style={styles.logoText}>Community</Text></View>
 <Text style={styles.headerSubtext}>The forum for alphinium builders</Text>
 </View>
 <View style={styles.headerActions}>
 <TouchableOpacity style={styles.newPostButton} onPress={openNewPost}><Text style={styles.newPostText}>＋ New Post</Text></TouchableOpacity>
 <TouchableOpacity onPress={openProfile}><Avatar name={currentUser.name} /></TouchableOpacity>
 </View>
 </View>

 <View style={styles.banner}>
 <Image source={{ uri: FORUM_IMAGES.hero }} style={styles.bannerImage} />
 <View style={styles.bannerBody}>
 <Text style={styles.bannerLabel}> Announcement</Text>
 <Text style={styles.bannerTitle}> alphinium v2.0 — New addons live!</Text>
 <Text style={styles.bannerText}>Fresh auth, payments, and workflow addons are now ready to plug into your next build.</Text>
 </View>
 </View>

 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
 <TouchableOpacity style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]} onPress={() => setSelectedCategory('all')}><Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}> All threads</Text></TouchableOpacity>
 {categories.map(category => <TouchableOpacity key={category.id} style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]} onPress={() => setSelectedCategory(category.id)}><Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>{category.emoji} {category.label} · {category.threadCount}</Text></TouchableOpacity>)}
 </ScrollView>

 <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Popular Threads</Text><Text style={styles.sectionMeta}>{visibleThreads.length} active discussions</Text></View>
 {visibleThreads.map(thread => {
 const category = getCategory(thread.categoryId);
 const handleLongPress = () => {
 if (!thread.pinned && threads.filter(t => t.pinned).length >= 3) {
   Alert.alert('Pin limit reached', 'Only 3 threads can be pinned at once. Unpin a thread first.');
   return;
 }
 togglePin(thread.id);
 };
 return (
 <TouchableOpacity key={thread.id} style={styles.threadCard} onPress={() => openThread(thread.id)} onLongPress={handleLongPress}>
 <View style={styles.threadHeader}>
 <Avatar name={thread.author} accent={category.color} size={52} />
 <View style={styles.threadTitleWrap}>
 <View style={styles.threadMetaRow}>{thread.pinned ? <Text style={styles.pinned}> Pinned</Text> : null}{thread.resolved ? <Text style={styles.resolved}>RESOLVED</Text> : null}</View>
 <Text style={styles.threadTitle}>{thread.title}</Text>
 <Text style={styles.threadAuthor}>{thread.author}</Text>
 <Text style={styles.threadExcerpt}>{thread.excerpt}</Text>
 </View>
 </View>
 <View style={styles.threadFooterTop}><CategoryBadge category={category} /><Text style={styles.threadTime}>{thread.timeAgo}</Text></View>
 <View style={styles.threadFooterBottom}><Text style={styles.threadStats}>▲ {thread.upvotes}</Text><Text style={styles.threadStats}> {thread.replyCount}</Text><Text style={styles.threadStats}> {thread.views}</Text></View>
 {thread.tags ? <View style={styles.tagRow}>{thread.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => <View key={`${tag}-${i}`} style={styles.tagPill}><Text style={styles.tagText}>{tag}</Text></View>)}</View> : null}
 </TouchableOpacity>
 );
 })}
 <View style={styles.calloutCard}><Text style={styles.calloutTitle}> alphinium-auth</Text><Text style={styles.calloutText}>Real user accounts with GitHub/Google OAuth. Thread ownership, moderation tools, and user profiles — add to any alphinium app with one addon.</Text></View>
 </View>
 </ScrollView>
 </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: colors.background },
 content: { padding: spacing.xl },
 container: { width: '100%', maxWidth: 1040, alignSelf: 'center' },
 headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl, flexWrap: 'wrap' },
 logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
 logoMark: { width: 14, height: 14, borderRadius: radius.pill, backgroundColor: colors.primary },
 logoText: { ...typography.title, color: colors.text },
 headerSubtext: { marginTop: 4, color: colors.textMuted, fontSize: 14 },
 headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
 newPostButton: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
 newPostText: { color: colors.surface, fontWeight: '700', fontSize: 14 },
 avatar: { borderWidth: 2, backgroundColor: colors.primarySoft },
 banner: { backgroundColor: '#FFF7ED', borderRadius: radius.lg, borderWidth: 1, borderColor: '#FED7AA', marginBottom: spacing.xl, overflow: 'hidden' },
 bannerImage: { width: '100%', height: 220 },
 bannerBody: { padding: spacing.xl },
 bannerLabel: { color: colors.primary, fontWeight: '700', marginBottom: spacing.xs },
 bannerTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
 bannerText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
 categoryScroll: { gap: spacing.sm, paddingBottom: spacing.sm, marginBottom: spacing.xl },
 categoryChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
 categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
 categoryChipText: { color: colors.textMuted, fontWeight: '600' },
 categoryChipTextActive: { color: colors.surface },
 sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.md, gap: spacing.sm, flexWrap: 'wrap' },
 sectionTitle: { ...typography.heading, color: colors.text },
 sectionMeta: { color: colors.textMuted, fontSize: 13 },
 threadCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.md, ...shadows.card },
 threadHeader: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
 threadTitleWrap: { flex: 1 },
 threadMetaRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs, flexWrap: 'wrap' },
 pinned: { color: colors.primary, fontSize: 12, fontWeight: '700' },
 resolved: { color: colors.green, backgroundColor: colors.successSoft, overflow: 'hidden', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill, fontSize: 11, fontWeight: '800' },
 threadTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.xs },
 threadAuthor: { color: colors.primary, fontWeight: '700', marginBottom: spacing.xs },
 threadExcerpt: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
 threadFooterTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
 threadFooterBottom: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap' },
 categoryBadge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 1 },
 categoryBadgeText: { fontSize: 12, fontWeight: '700', color: colors.text },
 threadTime: { color: colors.textSoft, fontSize: 12 },
 threadStats: { color: colors.textMuted, fontWeight: '600' },
 tagRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginTop: spacing.sm },
 tagPill: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
 tagText: { color: colors.textSoft, fontSize: 11, fontWeight: '600' },
 calloutCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: '#FED7AA', padding: spacing.xl, marginTop: spacing.sm, marginBottom: spacing.xl },
 calloutTitle: { color: colors.primary, fontSize: 18, fontWeight: '800', marginBottom: spacing.sm },
 calloutText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});
