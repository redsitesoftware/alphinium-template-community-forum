import React, { useEffect, useRef, useState } from 'react';
import {
 Alert,
 SafeAreaView,
 ScrollView,
 StyleSheet,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from 'react-native';
import { useForum } from '../store/forumStore';
import { colors, radius, spacing, typography } from '../theme';

export default function NewPostScreen() {
 const { categories, draft, goHome, postThread, saveDraft, clearDraft } = useForum();

 const [categoryId, setCategoryId] = useState(draft?.categoryId ?? categories[0].id);
 const [title, setTitle] = useState(draft?.title ?? '');
 const [content, setContent] = useState(draft?.content ?? '');
 const [tags, setTags] = useState(draft?.tags ?? '');

 const canPost = title.trim() && content.trim();

 // Track whether fields have been modified since last auto-save
 const hasDraftContent = title.trim() || content.trim() || tags.trim();

 // Keep a ref to the latest field values for use inside the interval callback
 const fieldsRef = useRef({ categoryId, title, content, tags });
 useEffect(() => {
  fieldsRef.current = { categoryId, title, content, tags };
 }, [categoryId, title, content, tags]);

 // Auto-save draft every 30 seconds while any field has content
 useEffect(() => {
  const interval = setInterval(() => {
   const { categoryId: cId, title: t, content: c, tags: tg } = fieldsRef.current;
   if (t.trim() || c.trim() || tg.trim()) {
    saveDraft({ categoryId: cId, title: t, content: c, tags: tg });
   }
  }, 30000);
  return () => clearInterval(interval);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 function handleCancel() {
  if (hasDraftContent) {
   Alert.alert(
    'Discard draft?',
    'You have unsaved content. Do you want to discard it?',
    [
     { text: 'Keep editing', style: 'cancel' },
     {
      text: 'Discard',
      style: 'destructive',
      onPress: () => {
       clearDraft();
       goHome();
      },
     },
    ],
   );
  } else {
   goHome();
  }
 }

 function handlePost() {
  if (!canPost) return;
  postThread({ categoryId, title, content, tags });
  clearDraft();
 }

 return (
 <SafeAreaView style={styles.safeArea}>
 <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
 <View style={styles.container}>
 <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
 <Text style={styles.backText}>← Cancel</Text>
 </TouchableOpacity>

 <View style={styles.card}>
 <Text style={styles.title}>Create a new thread</Text>
 <Text style={styles.subtitle}>Start a discussion, ask for help, or share what you're shipping with alphinium.</Text>

 <Text style={styles.label}>Category</Text>
 <View style={styles.categoryGrid}>
 {categories.map(category => {
 const active = category.id === categoryId;
 return (
 <TouchableOpacity
 key={category.id}
 style={[
 styles.categoryOption,
 { borderColor: active ? category.color : colors.border, backgroundColor: active ? `${category.color}12` : colors.surface },
 ]}
 onPress={() => setCategoryId(category.id)}
 >
 <Text style={styles.categoryOptionText}>{category.emoji} {category.label}</Text>
 </TouchableOpacity>
 );
 })}
 </View>

 <Text style={styles.label}>Title</Text>
 <TextInput
 style={styles.input}
 placeholder="What do you want to talk about?"
 placeholderTextColor={colors.textSoft}
 value={title}
 onChangeText={setTitle}
 />

 <Text style={styles.label}>Content</Text>
 <TextInput
 style={styles.contentInput}
 multiline
 placeholder="Add context, details, screenshots, or the exact blocker you're facing..."
 placeholderTextColor={colors.textSoft}
 value={content}
 onChangeText={setContent}
 />

 <Text style={styles.label}>Add Tags</Text>
 <TextInput
 style={styles.input}
 placeholder="auth, launch, support"
 placeholderTextColor={colors.textSoft}
 value={tags}
 onChangeText={setTags}
 />

 <TouchableOpacity
 style={[styles.postButton, !canPost && styles.postButtonDisabled]}
 onPress={handlePost}
 disabled={!canPost}
 >
 <Text style={styles.postButtonText}>{canPost ? 'Post Thread' : 'Add a title and content'}</Text>
 </TouchableOpacity>
 </View>
 </View>
 </ScrollView>
 </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: {
 flex: 1,
 backgroundColor: colors.background,
 },
 content: {
 padding: spacing.xl,
 },
 container: {
 width: '100%',
 maxWidth: 860,
 alignSelf: 'center',
 },
 backButton: {
 alignSelf: 'flex-start',
 marginBottom: spacing.lg,
 },
 backText: {
 color: colors.primary,
 fontWeight: '700',
 },
 card: {
 backgroundColor: colors.surface,
 borderRadius: radius.lg,
 borderWidth: 1,
 borderColor: colors.border,
 padding: spacing.xl,
 },
 title: {
 ...typography.title,
 color: colors.text,
 marginBottom: spacing.xs,
 },
 subtitle: {
 color: colors.textMuted,
 lineHeight: 22,
 marginBottom: spacing.xl,
 },
 label: {
 color: colors.text,
 fontWeight: '700',
 marginBottom: spacing.sm,
 },
 categoryGrid: {
 flexDirection: 'row',
 flexWrap: 'wrap',
 gap: spacing.sm,
 marginBottom: spacing.xl,
 },
 categoryOption: {
 borderWidth: 1,
 borderRadius: radius.md,
 paddingHorizontal: spacing.md,
 paddingVertical: spacing.md,
 },
 categoryOptionText: {
 color: colors.text,
 fontWeight: '600',
 },
 input: {
 borderWidth: 1,
 borderColor: colors.border,
 borderRadius: radius.md,
 padding: spacing.lg,
 fontSize: 15,
 color: colors.text,
 marginBottom: spacing.xl,
 backgroundColor: colors.background,
 },
 contentInput: {
 minHeight: 220,
 borderWidth: 1,
 borderColor: colors.border,
 borderRadius: radius.md,
 padding: spacing.lg,
 textAlignVertical: 'top',
 color: colors.text,
 marginBottom: spacing.xl,
 backgroundColor: colors.background,
 },
 postButton: {
 backgroundColor: colors.primary,
 borderRadius: radius.pill,
 paddingVertical: spacing.lg,
 alignItems: 'center',
 },
 postButtonDisabled: {
 opacity: 0.45,
 },
 postButtonText: {
 color: colors.surface,
 fontWeight: '800',
 fontSize: 15,
 },
});
