import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FORUM_IMAGES } from '../media';
import { useForum } from '../store/forumStore';
import { colors, radius, spacing, typography } from '../theme';

export default function ProfileScreen() {
 const { profile, goHome, updateProfile } = useForum();
 const [isEditing, setIsEditing] = useState(false);
 const [draftName, setDraftName] = useState(profile.name);
 const [draftBio, setDraftBio] = useState(profile.bio || '');

 const handleEdit = () => {
  setDraftName(profile.name);
  setDraftBio(profile.bio || '');
  setIsEditing(true);
 };

 const handleSave = () => {
  updateProfile({ name: draftName.trim() || profile.name, bio: draftBio.trim() });
  setIsEditing(false);
 };

 const handleCancel = () => {
  setIsEditing(false);
 };

 return (
 <SafeAreaView style={styles.safeArea}>
 <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
 <View style={styles.container}>
 <TouchableOpacity style={styles.backButton} onPress={goHome}><Text style={styles.backText}>← Back to Community</Text></TouchableOpacity>
 <View style={styles.heroCard}>
  <Image source={{ uri: FORUM_IMAGES.profile }} style={styles.profileImage} />
  {isEditing ? (
   <View style={styles.editForm}>
    <Text style={styles.editLabel}>Name</Text>
    <TextInput
     style={styles.editInput}
     value={draftName}
     onChangeText={setDraftName}
     placeholder="Your name"
     placeholderTextColor={colors.textSoft}
    />
    <Text style={styles.editLabel}>Bio</Text>
    <TextInput
     style={[styles.editInput, styles.editInputMultiline]}
     value={draftBio}
     onChangeText={setDraftBio}
     placeholder="Tell the community about yourself..."
     placeholderTextColor={colors.textSoft}
     multiline
    />
    <View style={styles.editButtonRow}>
     <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
      <Text style={styles.saveButtonText}>Save</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
      <Text style={styles.cancelButtonText}>Cancel</Text>
     </TouchableOpacity>
    </View>
   </View>
  ) : (
   <>
    <Text style={styles.name}>{profile.name}</Text>
    <Text style={styles.joinedDate}>{profile.joinedDate}</Text>
    {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
    <TouchableOpacity style={styles.editProfileButton} onPress={handleEdit}>
     <Text style={styles.editProfileButtonText}>Edit Profile</Text>
    </TouchableOpacity>
   </>
  )}
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
 bio: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, fontSize: 15, lineHeight: 22, paddingHorizontal: spacing.md },
 editProfileButton: { marginTop: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 editProfileButtonText: { color: colors.textMuted, fontWeight: '700', fontSize: 14 },
 editForm: { width: '100%', paddingTop: spacing.sm },
 editLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: spacing.xs, alignSelf: 'flex-start' },
 editInput: { width: '100%', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, backgroundColor: colors.background, marginBottom: spacing.md, fontSize: 15 },
 editInputMultiline: { minHeight: 96, textAlignVertical: 'top' },
 editButtonRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end', width: '100%' },
 saveButton: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 saveButtonText: { color: colors.surface, fontWeight: '800', fontSize: 14 },
 cancelButton: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
 cancelButtonText: { color: colors.textMuted, fontWeight: '700', fontSize: 14 },
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
