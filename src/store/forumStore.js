import React, { createContext, useContext, useMemo, useReducer } from 'react';

const ForumContext = createContext(null);

export const categories = [
 { id: 'general', label: 'General', emoji: '', color: '#F97316', threadCount: 342 },
 { id: 'ideas', label: 'Ideas & Feedback', emoji: '', color: '#8B5CF6', threadCount: 128 },
 { id: 'support', label: 'Help & Support', emoji: '', color: '#EF4444', threadCount: 89 },
 { id: 'showcase', label: 'Show & Tell', emoji: '', color: '#22C55E', threadCount: 67 },
 { id: 'announcements', label: 'Announcements', emoji: '', color: '#0EA5E9', threadCount: 23 },
 { id: 'introductions', label: 'Introductions', emoji: '', color: '#EC4899', threadCount: 156 },
];

const profile = {
 name: 'Jordan Lee',
 avatar: '‍',
 joinedDate: 'Joined Mar 2024',
 stats: [
 { label: 'Threads', value: '12' },
 { label: 'Replies', value: '47' },
 { label: 'Upvotes received', value: '234' },
 ],
 badges: ['Early Adopter', 'Helper', 'Contributor'],
 recentPosts: [
 { id: 'rp1', title: 'Template ideas for local service businesses', meta: 'Ideas & Feedback • 2d ago' },
 { id: 'rp2', title: 'Best auth flow for a members-only dashboard?', meta: 'Help & Support • 5d ago' },
 { id: 'rp3', title: 'Launched my community referral portal today ', meta: 'Show & Tell • 1w ago' },
 ],
};

const welcomeReplies = [
 {
 id: 'reply-1',
 author: 'Sophie M.',
 avatar: '‍',
 timeAgo: '2h ago',
 upvotes: 18,
 content: 'Super excited to be here! Just shipped my first alphinium app last week.',
 },
 {
 id: 'reply-2',
 author: 'Marcus T.',
 avatar: '‍',
 timeAgo: '2h ago',
 upvotes: 14,
 content: 'Love the community already! The docs are incredible.',
 },
 {
 id: 'reply-3',
 author: 'AI Moderator',
 avatar: '',
 timeAgo: '1h ago',
 upvotes: 26,
 content: 'Welcome everyone! Feel free to share what you\'re building.',
 },
 {
 id: 'reply-4',
 author: 'Priya K.',
 avatar: '‍',
 timeAgo: '58m ago',
 upvotes: 11,
 content: 'Hi team! Working on a booking app for my salon using salon-site.',
 },
 {
 id: 'reply-5',
 author: 'James L.',
 avatar: '‍',
 timeAgo: '32m ago',
 upvotes: 9,
 content: 'Just discovered alphinium through ChatInstance — blown away by the speed.',
 },
 {
 id: 'reply-6',
 author: 'Alex R.',
 avatar: '‍',
 timeAgo: '12m ago',
 upvotes: 7,
 content: 'Building the next big app marketplace on alphinium ',
 },
];

const initialThreads = [
 {
 id: 'welcome-thread',
 title: 'Welcome to the alphinium community! ',
 categoryId: 'announcements',
 author: 'Community Team',
 avatar: '',
 authorJoined: 'Joined Jan 2023',
 timeAgo: '2h ago',
 upvotes: 234,
 hearts: 81,
 replyCount: 423,
 views: '2.1k',
 pinned: true,
 resolved: false,
 tags: 'welcome, community, getting-started',
 excerpt: 'Say hello, share your build, and meet other makers shipping fast with alphinium.',
 content: [
 'Welcome to the official alphinium community forum — a place for builders, founders, and creators to swap ideas, ask questions, and celebrate launches together.',
 'Whether you are experimenting with your first template or stitching together multiple addons into a full product, this space is here to help you move faster with real feedback from other people building right now.',
 'Share screenshots, ask for implementation tips, post feature requests, or introduce yourself and what you are building. The more context you share, the easier it is for the community to jump in with helpful answers.',
 'We are thrilled you are here. Drop a reply below and tell everyone what kind of app you are launching next.',
 ],
 replies: welcomeReplies,
 },
 {
 id: 'ecommerce-storecase',
 title: 'Showcase: I built a full e-commerce store in 2 hours with alphinium',
 categoryId: 'showcase',
 author: 'Nina C.',
 avatar: '️',
 authorJoined: 'Joined Nov 2023',
 timeAgo: '5h ago',
 upvotes: 146,
 hearts: 54,
 replyCount: 89,
 views: '980',
 pinned: false,
 resolved: false,
 tags: 'ecommerce, store-template, launch',
 excerpt: 'A step-by-step breakdown of templates, addons, and launch tweaks that got this store live before lunch.',
 content: [
 'Yesterday I challenged myself to see how far I could get with alphinium in one morning, and I ended up launching a complete storefront with payments, product pages, and customer confirmations before lunch.',
 'The biggest win was combining the store template with a lightweight marketing homepage and then layering in the checkout addon after I had the catalog dialed in.',
 'Happy to share the stack, the rough timeline, and the small things I would polish before pushing this into a paid beta if anyone wants the details.',
 ],
 replies: [],
 },
 {
 id: 'dark-mode-request',
 title: 'Feature request: dark mode for alphinium-auth',
 categoryId: 'ideas',
 author: 'Taylor J.',
 avatar: '',
 authorJoined: 'Joined Feb 2024',
 timeAgo: 'yesterday',
 upvotes: 234,
 hearts: 63,
 replyCount: 67,
 views: '1.4k',
 pinned: false,
 resolved: false,
 tags: 'dark-mode, alphinium-auth, theming',
 excerpt: 'Would love a native dark theme for the hosted auth widgets and profile settings flows.',
 content: [
 'I am using alphinium-auth inside a customer portal that defaults to a dark theme, and the white auth cards stand out more than I would like on mobile.',
 'It would be amazing if the addon exposed a dark preset plus a few token overrides so the sign-in, signup, and password reset views could match the rest of the app without a lot of custom CSS.',
 'Curious whether anyone has workarounds today or if this is already on the roadmap.',
 ],
 replies: [],
 },
 {
 id: 'stripe-test-mode',
 title: 'How do I integrate alphinium-payments with Stripe test mode?',
 categoryId: 'support',
 author: 'Rahul P.',
 avatar: '',
 authorJoined: 'Joined Dec 2023',
 timeAgo: '2d ago',
 upvotes: 72,
 hearts: 19,
 replyCount: 45,
 views: '860',
 pinned: false,
 resolved: false,
 tags: 'payments, stripe, environment-config',
 excerpt: 'Looking for the cleanest way to keep checkout flows in test mode across staging and local previews.',
 content: [
 'I have the addon wired up and the checkout flow works, but I want to make sure every preview environment stays locked to Stripe test mode until the client signs off.',
 'Right now I am manually swapping keys during deployment, which feels brittle and a little too easy to mess up.',
 'If anyone has a good environment-variable pattern for alphinium-payments and Stripe, I would love to copy it.',
 ],
 replies: [],
 },
 {
 id: 'restaurant-live',
 title: 'My restaurant just went live using restaurant-site template!',
 categoryId: 'showcase',
 author: 'Bianca F.',
 avatar: '',
 authorJoined: 'Joined Jun 2024',
 timeAgo: '3d ago',
 upvotes: 68,
 hearts: 22,
 replyCount: 38,
 views: '720',
 pinned: false,
 resolved: false,
 tags: 'restaurant-site, launch, templates',
 excerpt: 'Menus, reservations, and a polished launch page all shipped in under a week.',
 content: [
 'We flipped our old site to a new restaurant-site build this weekend and it already feels dramatically easier for staff to update.',
 'The menu editor plus integrated reservation links saved us from maintaining three separate tools, and the responsive layout looks great on phones.',
 'Posting this mostly to say thanks — and to encourage anyone on the fence to ship a scrappy first version fast.',
 ],
 replies: [],
 },
 {
 id: 'maps-mobile-tips',
 title: 'alphinium-maps performance on mobile - tips?',
 categoryId: 'support',
 author: 'Owen S.',
 avatar: '️',
 authorJoined: 'Joined Apr 2024',
 timeAgo: '4d ago',
 upvotes: 41,
 hearts: 12,
 replyCount: 29,
 views: '640',
 pinned: false,
 resolved: false,
 tags: 'alphinium-maps, mobile, performance',
 excerpt: 'Markers are smooth on desktop, but I am looking for tricks to keep pans and clustering quick on mobile.',
 content: [
 'I am building a local discovery app and the map experience feels snappy on desktop, but lower-end phones start to stutter once the marker density goes up.',
 'I have already reduced custom marker complexity and trimmed the initial query bounds, but I am sure there are a few obvious wins I am missing.',
 'Would love tips from anyone who has shipped alphinium-maps into production on mobile-heavy traffic.',
 ],
 replies: [],
 },
 {
 id: 'fitness-intro',
 title: 'Introducing myself - building a fitness app for my gym',
 categoryId: 'introductions',
 author: 'Jordan Lee',
 avatar: '‍',
 authorJoined: 'Joined Mar 2024',
 timeAgo: '5d ago',
 upvotes: 37,
 hearts: 16,
 replyCount: 24,
 views: '510',
 pinned: false,
 resolved: false,
 tags: 'fitness, mobile-app, intro',
 excerpt: 'Hey everyone! I am turning our class schedule and membership onboarding into a proper mobile experience.',
 content: [
 'Hi everyone — I run a small gym and I am using alphinium to build a member-facing app for classes, onboarding, and trainer updates.',
 'The speed of going from idea to usable screens has been wild, especially with the auth and profile pieces handled by addons instead of custom work.',
 'Excited to learn from everyone here and share progress as I start connecting bookings, reminders, and community features.',
 ],
 replies: [],
 },
 {
 id: 'chatinstance-safari-bug',
 title: 'Bug: ChatInstance widget not showing on mobile Safari',
 categoryId: 'support',
 author: 'Elena V.',
 avatar: '',
 authorJoined: 'Joined Oct 2023',
 timeAgo: '1w ago',
 upvotes: 29,
 hearts: 8,
 replyCount: 19,
 views: '430',
 pinned: false,
 resolved: true,
 tags: 'chatinstance, safari, bug',
 excerpt: 'Resolved by deferring widget mount until after the first paint and removing a stale viewport override.',
 content: [
 'I hit an issue where ChatInstance showed perfectly on desktop and Chrome mobile emulation, but would not appear at all in real mobile Safari.',
 'The fix ended up being a combination of delaying the widget initialization until after the first render and removing an old viewport helper that was fighting with layout sizing.',
 'Leaving the notes here in case anyone else runs into the same thing — the thread is marked resolved, but I am happy to answer follow-up questions.',
 ],
 replies: [],
 },
];

const initialState = {
 phase: 'home',
 selectedThread: null,
 categories,
 threads: initialThreads,
 profile,
 currentUser: {
 name: 'Jordan Lee',
 avatar: '‍',
 joinedDate: 'Joined Mar 2024',
 isAdmin: true,
 },
 upvotedThreadIds: [],
 heartedThreadIds: [],
 reports: [],
 upvotedReplyIds: [],
};

function forumReducer(state, action) {
 switch (action.type) {
 case 'GO_HOME':
 return { ...state, phase: 'home', selectedThread: null };
 case 'OPEN_THREAD':
 return { ...state, phase: 'thread', selectedThread: action.threadId };
 case 'OPEN_NEW_POST':
 return { ...state, phase: 'new-post', selectedThread: null };
 case 'OPEN_PROFILE':
 return { ...state, phase: 'profile', selectedThread: null };
 case 'OPEN_ADMIN':
 return { ...state, phase: 'admin', selectedThread: null };
 case 'POST_THREAD': {
 const threadId = `thread-${Date.now()}`;
 const content = action.payload.content
 .split(/\n+/)
 .map(part => part.trim())
 .filter(Boolean);
 const nextThread = {
 id: threadId,
 title: action.payload.title.trim(),
 categoryId: action.payload.categoryId,
 author: state.currentUser.name,
 avatar: state.currentUser.avatar,
 authorJoined: state.currentUser.joinedDate,
 timeAgo: 'just now',
 upvotes: 1,
 hearts: 1,
 replyCount: 0,
 views: '1',
 pinned: false,
 resolved: false,
 excerpt: content[0] || action.payload.title.trim(),
 content,
 replies: [],
 tags: action.payload.tags,
 };
 return {
 ...state,
 threads: [nextThread, ...state.threads],
 phase: 'thread',
 selectedThread: threadId,
 upvotedThreadIds: [...state.upvotedThreadIds, threadId],
 heartedThreadIds: [...state.heartedThreadIds, threadId],
 };
 }
 case 'ADD_REPLY': {
 const text = action.content.trim();
 if (!text) {
 return state;
 }
 return {
 ...state,
 threads: state.threads.map(thread => {
 if (thread.id !== action.threadId) {
 return thread;
 }
 let parentReplyId = action.parentReplyId ?? null;
 if (parentReplyId !== null) {
 const parentReply = thread.replies.find(r => r.id === parentReplyId);
 // Flatten to max depth 2: if parent is already nested, don't nest further
 if (parentReply && parentReply.parentReplyId != null) {
   parentReplyId = null;
 }
 }
 const reply = {
 id: `reply-${Date.now()}`,
 author: 'You',
 avatar: state.currentUser.avatar,
 timeAgo: 'just now',
 upvotes: 0,
 content: text,
 parentReplyId,
 };
 return {
 ...thread,
 replyCount: thread.replyCount + 1,
 replies: [...thread.replies, reply],
 };
 }),
 };
 }
 case 'EDIT_REPLY': {
 return {
 ...state,
 threads: state.threads.map(thread => {
 if (thread.id !== action.threadId) {
 return thread;
 }
 return {
 ...thread,
 replies: thread.replies.map(reply =>
   reply.id === action.replyId
     ? { ...reply, content: action.newContent, editedAt: Date.now() }
     : reply
 ),
 };
 }),
 };
 }
 case 'DELETE_REPLY': {
 return {
 ...state,
 threads: state.threads.map(thread => {
 if (thread.id !== action.threadId) {
 return thread;
 }
 const remaining = thread.replies.filter(
 reply => reply.id !== action.replyId && reply.parentReplyId !== action.replyId
 );
 return {
 ...thread,
 replyCount: thread.replyCount - (thread.replies.length - remaining.length),
 replies: remaining,
 };
 }),
 };
 }
 case 'REPORT_CONTENT': {
 const alreadyReported = state.reports.some(
   r => r.targetId === action.targetId && r.reportedBy === state.currentUser.name
 );
 if (alreadyReported) {
   return state;
 }
 const report = {
   id: Date.now().toString(),
   type: action.reportType,
   targetId: action.targetId,
   threadId: action.threadId,
   reason: action.reason,
   reportedBy: state.currentUser.name,
   reportedAt: Date.now(),
   status: 'pending',
 };
 return { ...state, reports: [...state.reports, report] };
 }
 case 'DISMISS_REPORT': {
 return {
   ...state,
   reports: state.reports.map(r =>
   r.id === action.reportId ? { ...r, status: 'dismissed' } : r
   ),
 };
 }
 case 'REMOVE_CONTENT': {
 const report = state.reports.find(r => r.id === action.reportId);
 if (!report) {
   return state;
 }
 let threads = state.threads;
 if (report.type === 'thread') {
   threads = state.threads.filter(t => t.id !== report.targetId);
 } else if (report.type === 'reply') {
   threads = state.threads.map(t => {
   if (t.id !== report.threadId) {
     return t;
   }
   const remaining = t.replies.filter(r => r.id !== report.targetId);
   return { ...t, replyCount: t.replyCount - (t.replies.length - remaining.length), replies: remaining };
   });
 }
 return {
   ...state,
   threads,
   reports: state.reports.map(r =>
   r.id === action.reportId ? { ...r, status: 'removed' } : r
  case 'TOGGLE_REPLY_UPVOTE': {
  const alreadyUpvoted = state.upvotedReplyIds.includes(action.replyId);
  return {
    ...state,
    upvotedReplyIds: alreadyUpvoted
    ? state.upvotedReplyIds.filter(id => id !== action.replyId)
    : [...state.upvotedReplyIds, action.replyId],
    threads: state.threads.map(thread =>
    thread.id === action.threadId
      ? {
        ...thread,
        replies: thread.replies.map(reply =>
          reply.id === action.replyId
          ? { ...reply, upvotes: reply.upvotes + (alreadyUpvoted ? -1 : 1) }
          : reply
        ),
      }
      : thread
    ),
  };
  }
   ),
 };
 }
 case 'TOGGLE_UPVOTE': {
 const alreadyUpvoted = state.upvotedThreadIds.includes(action.threadId);
 return {
 ...state,
 upvotedThreadIds: alreadyUpvoted
 ? state.upvotedThreadIds.filter(id => id !== action.threadId)
 : [...state.upvotedThreadIds, action.threadId],
 threads: state.threads.map(thread =>
 thread.id === action.threadId
 ? { ...thread, upvotes: thread.upvotes + (alreadyUpvoted ? -1 : 1) }
 : thread
 ),
 };
 }
 case 'TOGGLE_HEART': {
 const alreadyHearted = state.heartedThreadIds.includes(action.threadId);
 return {
 ...state,
 heartedThreadIds: alreadyHearted
 ? state.heartedThreadIds.filter(id => id !== action.threadId)
 : [...state.heartedThreadIds, action.threadId],
 threads: state.threads.map(thread =>
 thread.id === action.threadId
 ? { ...thread, hearts: thread.hearts + (alreadyHearted ? -1 : 1) }
 : thread
 ),
 };
 }
 case 'TOGGLE_PIN': {
 const target = state.threads.find(t => t.id === action.threadId);
 if (!target) return state;
 if (!target.pinned) {
 const pinnedCount = state.threads.filter(t => t.pinned).length;
 if (pinnedCount >= 3) return state;
 }
 return {
 ...state,
 threads: state.threads.map(t =>
 t.id === action.threadId ? { ...t, pinned: !t.pinned } : t
 ),
 };
 }
 default:
 return state;
 }
}

export function ForumProvider({ children }) {
 const [state, dispatch] = useReducer(forumReducer, initialState);

 const value = useMemo(
 () => ({
 ...state,
 goHome: () => dispatch({ type: 'GO_HOME' }),
 openThread: threadId => dispatch({ type: 'OPEN_THREAD', threadId }),
 openNewPost: () => dispatch({ type: 'OPEN_NEW_POST' }),
 openProfile: () => dispatch({ type: 'OPEN_PROFILE' }),
 openAdmin: () => dispatch({ type: 'OPEN_ADMIN' }),
 postThread: payload => dispatch({ type: 'POST_THREAD', payload }),
 addReply: (threadId, content, parentReplyId) => dispatch({ type: 'ADD_REPLY', threadId, content, parentReplyId }),
 editReply: (threadId, replyId, newContent) => dispatch({ type: 'EDIT_REPLY', threadId, replyId, newContent }),
 deleteReply: (threadId, replyId) => dispatch({ type: 'DELETE_REPLY', threadId, replyId }),
 reportContent: (reportType, targetId, threadId, reason) =>
 dispatch({ type: 'REPORT_CONTENT', reportType, targetId, threadId, reason }),
 dismissReport: reportId => dispatch({ type: 'DISMISS_REPORT', reportId }),
 removeContent: reportId => dispatch({ type: 'REMOVE_CONTENT', reportId }),
 toggleUpvote: threadId => dispatch({ type: 'TOGGLE_UPVOTE', threadId }),
 toggleReplyUpvote: (threadId, replyId) => dispatch({ type: 'TOGGLE_REPLY_UPVOTE', threadId, replyId }),
 toggleHeart: threadId => dispatch({ type: 'TOGGLE_HEART', threadId }),
 togglePin: threadId => dispatch({ type: 'TOGGLE_PIN', threadId }),
 getCategory: categoryId => state.categories.find(category => category.id === categoryId),
 getThread: threadId => state.threads.find(thread => thread.id === threadId),
 }),
 [state]
 );

 return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
 const context = useContext(ForumContext);
 if (!context) {
 throw new Error('useForum must be used inside ForumProvider');
 }
 return context;
}
