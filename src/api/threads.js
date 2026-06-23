const API_URL = process.env.EXPO_PUBLIC_API_URL;

function isAvailable() {
 return Boolean(API_URL);
}

function headers(jwtToken) {
 const h = { 'Content-Type': 'application/json' };
 if (jwtToken) h['Authorization'] = `Bearer ${jwtToken}`;
 return h;
}

function mapStrapiThread(item) {
 const a = item.attributes ?? item;
 const authorData = a.author?.data?.attributes ?? {};
 return {
  id: String(item.id),
  title: a.title ?? '',
  categoryId: a.categoryId ?? a.category ?? 'general',
  author: authorData.username ?? a.authorName ?? 'Unknown',
  avatar: authorData.avatar ?? '',
  authorJoined: authorData.joinedDate ?? '',
  timeAgo: a.timeAgo ?? '',
  upvotes: a.upvotes ?? 0,
  hearts: a.hearts ?? 0,
  replyCount: a.replyCount ?? 0,
  views: String(a.views ?? '0'),
  pinned: a.pinned ?? false,
  resolved: a.resolved ?? false,
  tags: a.tags ?? '',
  excerpt: a.excerpt ?? '',
  content: Array.isArray(a.content) ? a.content : [a.content ?? ''],
  replies: [],
 };
}

export async function fetchThreads({ page = 1, limit = 20 } = {}) {
 if (!isAvailable()) throw new Error('API not configured');
 const res = await fetch(
  `${API_URL}/api/threads?pagination[page]=${page}&pagination[pageSize]=${limit}&populate=author`,
  { headers: headers() }
 );
 if (!res.ok) throw new Error(`fetchThreads: HTTP ${res.status}`);
 const json = await res.json();
 const items = json.data ?? json;
 return items.map(mapStrapiThread);
}

export async function fetchThread(id) {
 if (!isAvailable()) throw new Error('API not configured');
 const res = await fetch(`${API_URL}/api/threads/${id}?populate=author,replies`, {
  headers: headers(),
 });
 if (!res.ok) throw new Error(`fetchThread: HTTP ${res.status}`);
 const json = await res.json();
 return mapStrapiThread(json.data ?? json);
}

export async function createThread(payload, jwtToken) {
 if (!isAvailable()) throw new Error('API not configured');
 const res = await fetch(`${API_URL}/api/threads`, {
  method: 'POST',
  headers: headers(jwtToken),
  body: JSON.stringify({
   data: {
    title: payload.title,
    content: payload.content,
    categoryId: payload.categoryId,
    tags: payload.tags,
   },
  }),
 });
 if (!res.ok) throw new Error(`createThread: HTTP ${res.status}`);
 const json = await res.json();
 return mapStrapiThread(json.data ?? json);
}
