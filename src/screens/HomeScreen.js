import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FORUM_IMAGES, getForumAvatar } from '../media';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { useForum } from '../store/forumStore';

const PAGE_SIZE = 20;

function Avatar({ name, accent = colors.primary, size = 42 }) {
 return <Image source={{ uri: getForumAvatar(name) }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderColor: `${accent}33` }]} />;
}

function CategoryBadge({ category }) {
 return <View style={[styles.categoryBadge, { backgroundColor: `${category.color}15`, borderColor: `${category.color}33` }]}><Text style={styles.categoryBadgeText}>{category.emoji} {category.label}</Text></View>;
}

export default function HomeScreen() {
 const { categories, currentUser, openNewPost, openProfile, openAdmin, openThread, getCategory, togglePin, getPagedThreads } = useForum();
 const [selectedCategory, setSelectedCategory] = useState('all');
 const [searchQuery, setSearchQuery] = useState('');
 const [cursor, setCursor] = useState(0);
 const [displayedThreads, setDisplayedThreads] = useState(() => {
 const { threads } = getPagedThreads('all', 0, PAGE_SIZE);
 return threads;
 });
 const [hasMore, setHasMore] = useState(() => {
 const { has_more } = getPagedThreads('all', 0, PAGE_SIZE);
 return has_more;
 });
 const [totalCount, setTotalCount] = useState(() => {
 const { total_count } = getPagedThreads('all', 0, PAGE_SIZE);
 return total_count;
 });
 const loadingMore = useRef(false);

 const selectCategory = useCallback((categoryId) => {
 setSelectedCategory(categoryId);
 setSearchQuery('');
 const { threads, has_more, total_count, next_cursor } = getPagedThreads(categoryId, 0, PAGE_SIZE);
 setDisplayedThreads(threads);
 setHasMore(has_more);
 setTotalCount(total_count);
 setCursor(next_cursor);
 loadingMore.current = false;
 }, [getPagedThreads]);

 const loadNextPage = useCallback(() => {
 if (!hasMore || loadingMore.current) return;
 loadingMore.current = true;
 const { threads, has_more, total_count, next_cursor } = getPagedThreads(selectedCategory, cursor, PAGE_SIZE);
 setDisplayedThreads(prev => [...prev, ...threads]);
 setHasMore(has_more);
 setTotalCount(total_count);
 setCursor(next_cursor);
 loadingMore.current = false;
 }, [hasMore, cursor, selectedCategory, getPagedThreads]);

 const visibleThreads = useMemo(() => {
 const query = searchQuery.trim().toLowerCase();
 if (!query) return displayedThreads;
 return displayedThreads.filter(thread => {
  const contentText = Array.isArray(thread.content) ? thread.content.join(' ') : (thread.content || '');
  return (
   thread.title.toLowerCase().includes(query) ||
   (thread.excerpt || '').toLowerCase().includes(query) ||
   contentText.toLowerCase().includes(query)
  );
 });
 }, [displayedThreads, searchQuery]);

 const handleLongPress = useCallback((thread) => {
 if (!currentUser.isAdmin) return;
 Alert.alert('Thread Options', thread.title, [
  { text: thread.pinned ? 'Unpin Thread' : 'Pin Thread', onPress: () => togglePin(thread.id) },
  { text: 'Cancel', style: 'cancel' },
 ]);
 }, [currentUser.isAdmin, togglePin]);

 const ListHeader = useMemo(() => (
 <View>
 <View style={styles.headerRow}>
 <View>
 <View style={styles.logoRow}><View style={styles.logoMark} /><Text style={styles.logoText}>Community</Text></View>
 <Text style={styles.headerSubtext}>The forum for alphinium builders</Text>
 </View>
 <View style={styles.headerActions}>
 <TouchableOpacity style={styles.newPostButton} onPress={openNewPost}><Text style={styles.newPostText}>＋ New Post</Text></TouchableOpacity>
 {currentUser.isAdmin && <TouchableOpacity style={styles.adminButton} onPress={openAdmin}><Text style={styles.adminButtonText}>⚑ Admin</Text></TouchableOpacity>}
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

 <View style={styles.searchContainer}>
 <Text style={styles.searchIcon}>🔍</Text>
 <TextInput
  style={styles.searchInput}
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search threads…"
  placeholderTextColor={colors.textSoft}
  returnKeyType="search"
  clearButtonMode="while-editing"
 />
 {searchQuery.length > 0 && <TouchableOpacity style={styles.searchClear} onPress={() => setSearchQuery('')}><Text style={styles.searchClearText}>✕</Text></TouchableOpacity>}
 </View>

 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
 <TouchableOpacity style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]} onPress={() => selectCategory('all')}><Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}> All threads</Text></TouchableOpacity>
 {categories.map(category => <TouchableOpacity key={category.id} style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]} onPress={() => selectCategory(category.id)}><Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>{category.emoji} {category.label} · {category.threadCount}</Text></TouchableOpacity>)}
 </ScrollView>

 <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Popular Threads</Text><Text style={styles.sectionMeta}>{totalCount} active discussions</Text></View>
 </View>
 ), [selectedCategory, categories, currentUser, openNewPost, openProfile, openAdmin, selectCategory, totalCount, searchQuery, setSearchQuery]);

 const ListFooter = useMemo(() => (
 <View>
 {hasMore && <ActivityIndicator style={styles.loadingIndicator} color={colors.primary} />}
 <View style={styles.calloutCard}><Text style={styles.calloutTitle}> alphinium-auth</Text><Text style={styles.calloutText}>Real user accounts with GitHub/Google OAuth. Thread ownership, moderation tools, and user profiles — add to any alphinium app with one addon.</Text></View>
 </View>
 ), [hasMore]);

 const renderThread = useCallback(({ item: thread }) => {
 const category = getCategory(thread.categoryId);
 return (
 <TouchableOpacity key={thread.id} style={styles.threadCard} onPress={() => openThread(thread.id)} onLongPress={() => handleLongPress(thread)}>
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
 }, [getCategory, openThread, handleLongPress]);

 return (
 <SafeAreaView style={styles.safeArea}>
 <FlatList
 data={visibleThreads}
 keyExtractor={item => item.id}
 renderItem={renderThread}
 ListHeaderComponent={ListHeader}
 ListFooterComponent={ListFooter}
 contentContainerStyle={styles.content}
 showsVerticalScrollIndicator={false}
 onEndReached={loadNextPage}
 onEndReachedThreshold={0.3}
 style={styles.list}
 />
 </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: colors.background },
 list: { flex: 1 },
 content: { padding: spacing.xl, maxWidth: 1040, alignSelf: 'center', width: '100%' },
 headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl, flexWrap: 'wrap' },
 logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
 logoMark: { width: 14, height: 14, borderRadius: radius.pill, backgroundColor: colors.primary },
 logoText: { ...typography.title, color: colors.text },
 headerSubtext: { marginTop: 4, color: colors.textMuted, fontSize: 14 },
 headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
 newPostButton: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
 newPostText: { color: colors.surface, fontWeight: '700', fontSize: 14 },
 adminButton: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
 adminButtonText: { color: colors.text, fontWeight: '700', fontSize: 14 },
 avatar: { borderWidth: 2, backgroundColor: colors.primarySoft },
 banner: { backgroundColor: '#FFF7ED', borderRadius: radius.lg, borderWidth: 1, borderColor: '#FED7AA', marginBottom: spacing.xl, overflow: 'hidden' },
 bannerImage: { width: '100%', height: 220 },
 bannerBody: { padding: spacing.xl },
 bannerLabel: { color: colors.primary, fontWeight: '700', marginBottom: spacing.xs },
 bannerTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
 bannerText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
 searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, marginBottom: spacing.md, height: 44 },
 searchIcon: { fontSize: 16, marginRight: spacing.sm, color: colors.textSoft },
 searchInput: { flex: 1, fontSize: 15, color: colors.text, height: '100%', outlineStyle: 'none' },
 searchClear: { padding: spacing.xs },
 searchClearText: { fontSize: 13, color: colors.textSoft },
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
 loadingIndicator: { marginVertical: spacing.lg },
 emptyState: { paddingVertical: spacing.xxxl, alignItems: 'center' },
 emptyStateText: { color: colors.textMuted, fontSize: 15 },
});
