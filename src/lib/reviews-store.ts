export interface Review {
  id: string; businessId: string; businessSlug: string;
  userId: string; userName: string; userAvatar: string;
  rating: number; title: string; text: string;
  date: string; helpful: number; verified: boolean;
  ownerReply?: string; ownerReplyDate?: string;
}

const KEY = 'bb_reviews';

export function getAllReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function getBusinessReviews(slug: string): Review[] {
  return getAllReviews().filter(r => r.businessSlug === slug);
}
export function getUserReviews(userId: string): Review[] {
  return getAllReviews().filter(r => r.userId === userId);
}
export function addReview(review: Omit<Review, 'id' | 'date' | 'helpful'>): Review {
  const all = getAllReviews();
  const newR: Review = { ...review, id: `rv_${Date.now()}`, date: new Date().toISOString(), helpful: 0 };
  localStorage.setItem(KEY, JSON.stringify([newR, ...all]));
  return newR;
}
export function markHelpful(reviewId: string) {
  const all = getAllReviews().map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r);
  localStorage.setItem(KEY, JSON.stringify(all));
}
export function addOwnerReply(reviewId: string, reply: string) {
  const all = getAllReviews().map(r =>
    r.id === reviewId ? { ...r, ownerReply: reply, ownerReplyDate: new Date().toISOString() } : r
  );
  localStorage.setItem(KEY, JSON.stringify(all));
}