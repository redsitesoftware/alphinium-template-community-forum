import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FORUM_IMAGES } from '../media';
import { useForum } from '../store/forumStore';
import { colors, radius, spacing, typography } from '../theme';

export default function ProfileScreen() {
 const { profile, goHome } = useForum();
 return (
 <SafeAreaView style={styles.safeArea}>
 <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
 <View style={styles.container}>
 <TouchableOpacity style={styles.backButton} onPress={goHome}><Text style={styles.backText}>← Back to Community</Text></TouchableOpacity>
 <View style={styles.heroCard}>
 <Image source={{ uri: FORUM_IMAGES.profile }} style={styles.profileImage} />
 <Text style={styles.name}>{profile.name}</Text>
 <Text style={styles.joinedDate}>{profile.joinedDate}</Text>
 </View>
 <View style={styles.statsRow}>{profile.stats.map(stat => <View key={stat.label} style={styles.statCard}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}</View>
 <View style={styles.section}><Text style={styles.sectionTitle}>Badges</Text><View style={styles.badgesRow}>{profile.badges.map(badge => <View key={badge} style={styles.badgePill}><Text style={styles.badgeText}>{badge}</Text></View>)}</View></View>
 <View style={styles.section}><Text style={styles.sectionTitle}>Recent Posts</Text>{profile.recentPosts.map(post => <View key={post.id} style={styles.postCard}><Text style={styles.postTitle}>{post.title}</Text><Text style={styles.postMeta}>{post.meta}</Text></View>)}</View>
 </View>
 </ScrollView>
 </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: colors.background },
 content: { padding: spacing.xl },
 container: { width: '100%', maxWidth: 860, alignSelf: 'center' },
 backButton: { alignSelf: 'flex-start', marginBottom: spacing.lg },
 backText: { color: colors.primary, fontWeight: '700' },
 heroCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.xxl, alignItems: 'center', marginBottom: spacing.xl, overflow: 'hidden' },
 profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: spacing.md },
 name: { ...typography.title, color: colors.text },
 joinedDate: { color: colors.textMuted, marginTop: spacing.xs },
 statsRow: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap', marginBottom: spacing.xl },
 statCard: { flexGrow: 1, minWidth: 180, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.xl },
 statValue: { color: colors.primary, fontSize: 28, fontWeight: '800', marginBottom: spacing.xs },
 statLabel: { color: colors.textMuted, fontWeight: '600' },
 section: { marginBottom: spacing.xl },
 sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.md },
 badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
 badgePill: { borderRadius: radius.pill, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
 badgeText: { color: colors.primary, fontWeight: '800' },
 postCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.md },
 postTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.xs },
 postMeta: { color: colors.textMuted },
});
