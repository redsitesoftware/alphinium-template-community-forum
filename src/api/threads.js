/**
 * Strapi thread API client.
 *
 * All exported functions return null when EXPO_PUBLIC_API_URL is not configured
 * so callers can fall back to local state without extra guard logic.
 *
 * All functions throw on non-2xx HTTP responses (status + body included in
 * the error message).
 *
 * No React or store imports — this module is pure and testable in isolation.
 */

function getBaseUrl() {
 if (process.env.EXPO_PUBLIC_API_URL) {
  return process.env.EXPO_PUBLIC_API_URL;
 }
 try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Constants = require('expo-constants').default;
  const url = Constants?.expoConfig?.extra?.apiUrl;
  if (url) return url;
 } catch {
  // expo-constants not available in all environments
 }
 return null;
}

async function assertOk(response) {
 if (!response.ok) {
  let body = '';
  try {
   body = await response.text();
  } catch {
   // ignore
  }
  throw new Error(`HTTP ${response.status} ${response.statusText}: ${body}`);
 }
}

function mapStrapiThread(item) {
 if (!item) return null;
 const attrs = item.attributes ?? item;
 return {
  id: String(item.id ?? attrs.id),
  title: attrs.title ?? '',
  content: attrs.content ?? '',
  author: attrs.author ?? 'Unknown',
  categoryId: attrs.categoryId ?? attrs.category?.data?.id ?? null,
  tags: attrs.tags ?? [],
  upvotes: attrs.upvotes ?? 0,
  hearts: attrs.hearts ?? 0,
  replyCount: attrs.replyCount ?? (attrs.replies?.data?.length ?? 0),
  replies: (attrs.replies?.data ?? []).map(r => {
   const ra = r.attributes ?? r;
   return {
    id: String(r.id ?? ra.id),
    author: ra.author ?? 'Unknown',
    content: ra.content ?? '',
    upvotes: ra.upvotes ?? 0,
    createdAt: ra.createdAt ?? null,
    editedAt: ra.editedAt ?? null,
    parentReplyId: ra.parentReplyId ?? null,
   };
  }),
  createdAt: attrs.createdAt ?? null,
  updatedAt: attrs.updatedAt ?? null,
 };
}

/**
 * Fetch a paginated list of threads.
 *
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ data: object[], meta: { pagination: object } } | null>}
 */
export async function fetchThreads({ page = 1, limit = 20 } = {}) {
 const base = getBaseUrl();
 if (!base) return null;

 const url = `${base}/api/threads?pagination[page]=${page}&pagination[pageSize]=${limit}`;
 const response = await fetch(url);
 await assertOk(response);
 const json = await response.json();

 return {
  data: (json.data ?? []).map(mapStrapiThread),
  meta: json.meta ?? { pagination: { page, pageSize: limit, total: 0, pageCount: 0 } },
 };
}

/**
 * Fetch a single thread by id, populating its replies.
 *
 * @param {string|number} id
 * @returns {Promise<object | null>}
 */
export async function fetchThread(id) {
 const base = getBaseUrl();
 if (!base) return null;

 const url = `${base}/api/threads/${id}?populate=replies`;
 const response = await fetch(url);
 await assertOk(response);
 const json = await response.json();

 return mapStrapiThread(json.data ?? json);
}

/**
 * Create a new thread, authenticated via JWT.
 *
 * @param {{ title: string, content: string, categoryId?: string|number, tags?: string[] }} payload
 * @param {string} jwtToken
 * @returns {Promise<object | null>}
 */
export async function createThread({ title, content, categoryId, tags = [] }, jwtToken) {
 const base = getBaseUrl();
 if (!base) return null;

 const response = await fetch(`${base}/api/threads`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${jwtToken}`,
  },
  body: JSON.stringify({
   data: { title, content, categoryId, tags },
  }),
 });
 await assertOk(response);
 const json = await response.json();

 return mapStrapiThread(json.data ?? json);
}
