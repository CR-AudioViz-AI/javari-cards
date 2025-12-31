/**
 * CR AudioViz AI - Central Services Client v2.0
 * =============================================
 * 
 * This file connects ALL apps to centralized services at craudiovizai.com
 * per the Henderson Standard. NO app should implement its own auth, payments,
 * credits, or other centralized services.
 * 
 * USAGE: Copy this file to your app's lib/ directory
 * 
 * @author CR AudioViz AI, LLC
 * @created December 31, 2025
 * @version 2.0 - Full API coverage
 * @standard Henderson Standard v1.1
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CENTRAL_API = process.env.NEXT_PUBLIC_CENTRAL_API || 'https://craudiovizai.com/api';
const JAVARI_API = process.env.NEXT_PUBLIC_JAVARI_API || 'https://javariai.com/api';
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'unknown-app';

// Helper for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T & { error?: string }> {
  try {
    const response = await fetch(`${CENTRAL_API}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    return response.json();
  } catch (error) {
    return { error: String(error) } as T & { error?: string };
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const auth = {
  signIn: (email: string, password: string) => 
    apiCall('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password, app_id: APP_ID }), credentials: 'include' }),
  
  signUp: (email: string, password: string, metadata?: any) =>
    apiCall('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, metadata, app_id: APP_ID }), credentials: 'include' }),
  
  signOut: () => apiCall('/auth/signout', { method: 'POST', credentials: 'include' }),
  
  getSession: () => apiCall('/auth/user', { credentials: 'include' }),
  
  signInWithOAuth: (provider: 'google' | 'github' | 'apple') => {
    const redirectUrl = typeof window !== 'undefined' ? window.location.href : '';
    window.location.href = `${CENTRAL_API}/auth/callback?provider=${provider}&app_id=${APP_ID}&redirect=${encodeURIComponent(redirectUrl)}`;
  },
};

// ============================================================================
// CREDITS SYSTEM
// ============================================================================

export const credits = {
  getBalance: (userId: string) => apiCall(`/credits/balance?user_id=${userId}`),
  
  spend: (userId: string, amount: number, description: string) =>
    apiCall('/credits/spend', { method: 'POST', body: JSON.stringify({ user_id: userId, amount, description, app_id: APP_ID }) }),
  
  hasEnough: async (userId: string, required: number): Promise<boolean> => {
    const { balance } = await credits.getBalance(userId) as any;
    return (balance || 0) >= required;
  },
};

// ============================================================================
// PAYMENTS
// ============================================================================

export const payments = {
  createStripeCheckout: (options: { priceId?: string; amount?: number; userId?: string; successUrl?: string; cancelUrl?: string }) =>
    apiCall('/stripe', { method: 'POST', body: JSON.stringify({ ...options, app_id: APP_ID }) }),
  
  createPayPalOrder: (options: { amount: number; currency?: string; description?: string; userId?: string }) =>
    apiCall('/paypal/orders', { method: 'POST', body: JSON.stringify({ ...options, app_id: APP_ID }) }),
  
  capturePayPalOrder: (orderId: string) =>
    apiCall(`/paypal/orders/${orderId}/capture`, { method: 'POST', body: JSON.stringify({ app_id: APP_ID }) }),
};

// ============================================================================
// SUPPORT & FEEDBACK
// ============================================================================

export const support = {
  createTicket: (ticket: { user_id?: string; subject: string; description: string; priority?: string }) =>
    apiCall('/tickets', { method: 'POST', body: JSON.stringify({ ...ticket, app_id: APP_ID }) }),
  
  getTickets: (userId: string) => apiCall(`/tickets?user_id=${userId}`),
  
  submitEnhancement: (enhancement: { user_id?: string; title: string; description: string }) =>
    apiCall('/enhancements', { method: 'POST', body: JSON.stringify({ ...enhancement, app_id: APP_ID }) }),
  
  voteEnhancement: (enhancementId: string, userId: string) =>
    apiCall(`/enhancements/${enhancementId}/vote`, { method: 'POST', body: JSON.stringify({ user_id: userId }) }),
};

// ============================================================================
// ACTIVITY & ANALYTICS
// ============================================================================

export const activity = {
  log: (data: { user_id?: string; action: string; details?: any; metadata?: any }) =>
    apiCall('/activity', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
  
  getForUser: (userId: string, limit = 50) => apiCall(`/activity?user_id=${userId}&limit=${limit}`),
};

export const analytics = {
  track: (event: string, properties?: any) =>
    apiCall('/analytics/track', { method: 'POST', body: JSON.stringify({ event, properties: { ...properties, app_id: APP_ID } }) }),
};

// ============================================================================
// CRM & RECOMMENDATIONS
// ============================================================================

export const crm = {
  trackCustomer: (data: { user_id?: string; email: string; name?: string; tags?: string[]; metadata?: any }) =>
    apiCall('/crm', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
  
  getCustomer: (customerId: string) => apiCall(`/crm?customer_id=${customerId}`),
};

export const recommendations = {
  get: (options?: { userId?: string; category?: string; limit?: number }) =>
    apiCall(`/recommendations?app_id=${APP_ID}${options?.userId ? `&user_id=${options.userId}` : ''}${options?.category ? `&category=${options.category}` : ''}`),
  
  trackClick: (recommendedAppId: string, userId?: string) =>
    apiCall('/recommendations', { method: 'POST', body: JSON.stringify({ source_app_id: APP_ID, recommended_app_id: recommendedAppId, user_id: userId }) }),
};

// ============================================================================
// COLLECTIBLES (NEW)
// ============================================================================

export const collectibles = {
  getCategories: () => apiCall('/collectibles'),
  
  getItems: (options: { category?: string; user_id?: string; search?: string; limit?: number; offset?: number }) =>
    apiCall(`/collectibles?${new URLSearchParams(options as any)}`),
  
  getItem: (itemId: string) => apiCall(`/collectibles?item_id=${itemId}`),
  
  addItem: (item: { user_id: string; category: string; name: string; description?: string; condition?: string; grade?: string; purchase_price?: number; current_value?: number; images?: any[] }) =>
    apiCall('/collectibles', { method: 'POST', body: JSON.stringify({ ...item, app_id: APP_ID }) }),
  
  updateItem: (id: string, updates: any) =>
    apiCall('/collectibles', { method: 'PATCH', body: JSON.stringify({ id, ...updates }) }),
  
  deleteItem: (id: string) => apiCall(`/collectibles?id=${id}`, { method: 'DELETE' }),
};

// ============================================================================
// VALUATION & GRADING (NEW)
// ============================================================================

export const valuation = {
  getForItem: (itemId: string) => apiCall(`/valuation?item_id=${itemId}`),
  
  marketLookup: (name: string, category?: string) =>
    apiCall(`/valuation?name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`),
  
  record: (data: { item_id: string; value: number; source?: string; condition?: string; grade?: string }) =>
    apiCall('/valuation', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
};

export const grading = {
  getCompanies: () => apiCall('/grading'),
  getCompany: (code: string) => apiCall(`/grading?company=${code}`),
  getForCategory: (category: string) => apiCall(`/grading?category=${category}`),
};

// ============================================================================
// TRADING & WISHLIST (NEW)
// ============================================================================

export const trading = {
  getTrades: (userId: string, status?: string) =>
    apiCall(`/trading?user_id=${userId}${status ? `&status=${status}` : ''}`),
  
  getTrade: (tradeId: string) => apiCall(`/trading?trade_id=${tradeId}`),
  
  findMatches: (itemId: string) => apiCall(`/trading?find_matches=true&item_id=${itemId}`),
  
  createOffer: (data: { initiator_id: string; recipient_id: string; offered_items: string[]; requested_items?: string[]; message?: string }) =>
    apiCall('/trading', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
  
  updateStatus: (tradeId: string, status: string, userId?: string, message?: string) =>
    apiCall('/trading', { method: 'PATCH', body: JSON.stringify({ trade_id: tradeId, status, user_id: userId, message }) }),
};

export const wishlist = {
  get: (userId: string, category?: string) =>
    apiCall(`/wishlist?user_id=${userId}${category ? `&category=${category}` : ''}`),
  
  add: (data: { user_id: string; item_name: string; category?: string; max_price?: number; priority?: number }) =>
    apiCall('/wishlist', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
  
  remove: (id: string) => apiCall(`/wishlist?id=${id}`, { method: 'DELETE' }),
};

// ============================================================================
// GAMIFICATION (NEW)
// ============================================================================

export const gamification = {
  getLeaderboard: (appId?: string, limit = 50) =>
    apiCall(`/gamification?type=leaderboard&app_id=${appId || APP_ID}&limit=${limit}`),
  
  getChallenges: (category?: string) =>
    apiCall(`/gamification?type=challenges&app_id=${APP_ID}${category ? `&category=${category}` : ''}`),
  
  getQuests: (userId: string) => apiCall(`/gamification?type=quests&user_id=${userId}`),
  
  getAchievements: (userId: string) => apiCall(`/gamification?type=achievements&user_id=${userId}`),
  
  getTrivia: (category?: string) => apiCall(`/gamification?type=trivia${category ? `&category=${category}` : ''}`),
  
  updateScore: (userId: string, score: number) =>
    apiCall('/gamification', { method: 'POST', body: JSON.stringify({ type: 'score', user_id: userId, score, app_id: APP_ID }) }),
  
  unlockAchievement: (userId: string, achievementId: string) =>
    apiCall('/gamification', { method: 'POST', body: JSON.stringify({ type: 'achievement', user_id: userId, achievement_id: achievementId }) }),
  
  submitTriviaAnswer: (userId: string, questionId: string, answer: string) =>
    apiCall('/gamification', { method: 'POST', body: JSON.stringify({ type: 'trivia_answer', user_id: userId, question_id: questionId, answer, app_id: APP_ID }) }),
};

// ============================================================================
// INVOICING (NEW)
// ============================================================================

export const invoicing = {
  getInvoices: (userId: string, status?: string) =>
    apiCall(`/invoicing?user_id=${userId}${status ? `&status=${status}` : ''}`),
  
  getInvoice: (invoiceId: string) => apiCall(`/invoicing?invoice_id=${invoiceId}`),
  
  getClients: (userId: string) => apiCall(`/invoicing?user_id=${userId}&type=clients`),
  
  createInvoice: (data: { user_id: string; client_id: string; items: any[]; due_date?: string }) =>
    apiCall('/invoicing', { method: 'POST', body: JSON.stringify({ ...data, type: 'invoice' }) }),
  
  createClient: (data: { user_id: string; name: string; email: string; address?: string }) =>
    apiCall('/invoicing', { method: 'POST', body: JSON.stringify({ ...data, type: 'client' }) }),
  
  updateStatus: (invoiceId: string, status: string) =>
    apiCall('/invoicing', { method: 'PATCH', body: JSON.stringify({ invoice_id: invoiceId, status }) }),
};

// ============================================================================
// PROPERTIES / REAL ESTATE (NEW)
// ============================================================================

export const properties = {
  getListings: (options?: { city?: string; min_price?: number; max_price?: number; limit?: number }) =>
    apiCall(`/properties?${new URLSearchParams(options as any)}`),
  
  getProperty: (propertyId: string) => apiCall(`/properties?property_id=${propertyId}`),
  
  getLeads: (userId: string) => apiCall(`/properties?type=leads&user_id=${userId}`),
  
  getSaved: (userId: string) => apiCall(`/properties?type=saved&user_id=${userId}`),
  
  createLead: (data: { user_id: string; name: string; email: string; phone?: string; property_id?: string }) =>
    apiCall('/properties', { method: 'POST', body: JSON.stringify({ ...data, type: 'lead' }) }),
  
  saveProperty: (userId: string, propertyId: string) =>
    apiCall('/properties', { method: 'POST', body: JSON.stringify({ user_id: userId, property_id: propertyId, type: 'save' }) }),
};

// ============================================================================
// STOCKS / MARKET DATA (NEW)
// ============================================================================

export const stocks = {
  getQuote: (symbol: string) => apiCall(`/stocks?type=quote&symbol=${symbol}`),
  
  getPortfolio: (userId: string) => apiCall(`/stocks?type=portfolio&user_id=${userId}`),
  
  getWatchlist: (userId: string) => apiCall(`/stocks?type=watchlist&user_id=${userId}`),
  
  getNews: (symbol?: string) => apiCall(`/stocks?type=news${symbol ? `&symbol=${symbol}` : ''}`),
  
  addToWatchlist: (userId: string, symbol: string) =>
    apiCall('/stocks', { method: 'POST', body: JSON.stringify({ type: 'watchlist_add', user_id: userId, symbol }) }),
  
  addPosition: (data: { user_id: string; symbol: string; shares: number; avg_cost: number }) =>
    apiCall('/stocks', { method: 'POST', body: JSON.stringify({ ...data, type: 'position' }) }),
};

// ============================================================================
// TEMPLATES & DESIGN ASSETS (NEW)
// ============================================================================

export const templates = {
  getCategories: () => apiCall('/templates'),
  
  get: (category: string, options?: { search?: string; style?: string; premium?: boolean; limit?: number }) =>
    apiCall(`/templates?category=${category}&${new URLSearchParams(options as any)}`),
  
  trackDownload: (assetId: string) =>
    apiCall('/templates', { method: 'PATCH', body: JSON.stringify({ asset_id: assetId }) }),
};

// ============================================================================
// STOCK PHOTOS (NEW)
// ============================================================================

export const stockPhotos = {
  search: (query: string, options?: { source?: 'unsplash' | 'pexels' | 'pixabay' | 'giphy' | 'all'; page?: number; per_page?: number }) =>
    apiCall(`/stock-photos?query=${encodeURIComponent(query)}&${new URLSearchParams(options as any)}`),
};

// ============================================================================
// SCANNING (NEW)
// ============================================================================

export const scanning = {
  barcode: (barcode: string) =>
    apiCall('/scanning', { method: 'POST', body: JSON.stringify({ type: 'barcode', barcode, app_id: APP_ID }) }),
  
  ocr: (imageUrl: string) =>
    apiCall('/scanning', { method: 'POST', body: JSON.stringify({ type: 'ocr', image_url: imageUrl, app_id: APP_ID }) }),
  
  card: (imageUrl: string) =>
    apiCall('/scanning', { method: 'POST', body: JSON.stringify({ type: 'card', image_url: imageUrl, app_id: APP_ID }) }),
};

// ============================================================================
// SPIRITS (NEW)
// ============================================================================

export const spirits = {
  getSpirits: (options?: { spirit_type?: string; search?: string; limit?: number }) =>
    apiCall(`/spirits?type=spirits&${new URLSearchParams(options as any)}`),
  
  getSpirit: (id: string) => apiCall(`/spirits?type=spirits&id=${id}`),
  
  getDistilleries: (search?: string) => apiCall(`/spirits?type=distilleries${search ? `&search=${search}` : ''}`),
  
  getCocktails: (search?: string) => apiCall(`/spirits?type=cocktails${search ? `&search=${search}` : ''}`),
  
  getBars: (options?: { search?: string; lat?: number; lng?: number }) =>
    apiCall(`/spirits?type=bars&${new URLSearchParams(options as any)}`),
  
  getCollection: (userId: string) => apiCall(`/spirits?type=collection&user_id=${userId}`),
  
  addTastingNote: (data: { user_id: string; spirit_id: string; rating: number; notes: string }) =>
    apiCall('/spirits', { method: 'POST', body: JSON.stringify({ ...data, type: 'tasting_note' }) }),
};

// ============================================================================
// PUBLISHING (NEW)
// ============================================================================

export const publishing = {
  getBooks: (userId: string) => apiCall(`/publishing?user_id=${userId}`),
  
  getBook: (bookId: string) => apiCall(`/publishing?book_id=${bookId}`),
  
  createBook: (data: { user_id: string; title: string; description?: string }) =>
    apiCall('/publishing', { method: 'POST', body: JSON.stringify({ ...data, type: 'book' }) }),
  
  createChapter: (data: { book_id: string; title: string; content?: string; order?: number }) =>
    apiCall('/publishing', { method: 'POST', body: JSON.stringify({ ...data, type: 'chapter' }) }),
  
  updateBook: (bookId: string, updates: any) =>
    apiCall('/publishing', { method: 'PATCH', body: JSON.stringify({ type: 'book', id: bookId, ...updates }) }),
  
  updateChapter: (chapterId: string, updates: any) =>
    apiCall('/publishing', { method: 'PATCH', body: JSON.stringify({ type: 'chapter', id: chapterId, ...updates }) }),
};

// ============================================================================
// EXPORT (NEW)
// ============================================================================

export const dataExport = {
  toCSV: (data: any[], filename?: string) =>
    apiCall('/export', { method: 'POST', body: JSON.stringify({ format: 'csv', data, filename }) }),
  
  toJSON: (data: any[], filename?: string) =>
    apiCall('/export', { method: 'POST', body: JSON.stringify({ format: 'json', data, filename }) }),
};

// ============================================================================
// JAVARI AI
// ============================================================================

export const javari = {
  ask: (message: string, options?: { userId?: string; conversationId?: string; context?: any }) =>
    fetch(`${JAVARI_API}/javari`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id: options?.userId, conversation_id: options?.conversationId, context: { ...options?.context, app_id: APP_ID } }),
    }).then(r => r.json()),
};

// ============================================================================
// NOTIFICATIONS & EMAIL
// ============================================================================

export const notifications = {
  send: (data: { userId: string; title: string; message: string; type?: string; actionUrl?: string }) =>
    apiCall('/notifications', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
};

export const email = {
  send: (data: { to: string; subject: string; html?: string; text?: string; template?: string; templateData?: any }) =>
    apiCall('/email/send', { method: 'POST', body: JSON.stringify({ ...data, app_id: APP_ID }) }),
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  auth, credits, payments, support, activity, analytics, crm, recommendations,
  collectibles, valuation, grading, trading, wishlist, gamification,
  invoicing, properties, stocks, templates, stockPhotos, scanning,
  spirits, publishing, dataExport, javari, notifications, email,
};
