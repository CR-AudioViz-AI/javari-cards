// ============================================================================
// ADD CARD PAGE - MOBILE-FIRST COLLECTION MANAGEMENT
// Search 156,000+ cards, scan with camera, add with your photo
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, 
  Camera, 
  X, 
  Plus, 
  Loader2, 
  ChevronDown,
  Upload,
  Star,
  DollarSign,
  Calendar,
  Hash,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import CardScanner from '@/components/CardScanner';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
}

interface CollectionCard {
  card_id: string;
  card_name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  user_image_url?: string;
  condition: string;
  grade?: string;
  grading_company?: string;
  purchase_price?: number;
  purchase_date?: string;
  notes?: string;
}

export default function AddCardPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  
  // Selected card state
  const [selectedCard, setSelectedCard] = useState<SearchResult | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [condition, setCondition] = useState('near_mint');
  const [isGraded, setIsGraded] = useState(false);
  const [grade, setGrade] = useState('');
  const [gradingCompany, setGradingCompany] = useState('PSA');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  // Perform search
  const performSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        category: categoryFilter,
        limit: '30',
      });

      const response = await fetch(`/api/cards/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
      } else {
        setSearchError(data.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle card selection
  const handleSelectCard = (card: SearchResult) => {
    setSelectedCard(card);
    setUserImage(null);
    setCondition('near_mint');
    setIsGraded(false);
    setGrade('');
    setPurchasePrice('');
    setPurchaseDate('');
    setNotes('');
    setSaveSuccess(false);
  };

  // Handle user image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUserImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle scanner result
  const handleScanComplete = (result: any) => {
    setShowScanner(false);
    if (result.success && result.card) {
      handleSelectCard(result.card);
    }
  };

  // Save card to collection
  const handleSaveCard = async () => {
    if (!selectedCard) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const cardData: CollectionCard = {
        card_id: selectedCard.id,
        card_name: selectedCard.name,
        category: selectedCard.category,
        set_name: selectedCard.set_name,
        card_number: selectedCard.card_number,
        rarity: selectedCard.rarity,
        image_url: selectedCard.image_url,
        user_image_url: userImage || undefined,
        condition,
        grade: isGraded ? grade : undefined,
        grading_company: isGraded ? gradingCompany : undefined,
        purchase_price: purchasePrice ? parseFloat(purchasePrice) : undefined,
        purchase_date: purchaseDate || undefined,
        notes: notes || undefined,
      };

      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        // Reset form after short delay
        setTimeout(() => {
          setSelectedCard(null);
          setSaveSuccess(false);
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to save card');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : 'Failed to save card');
    } finally {
      setIsSaving(false);
    }
  };

  // Category badge color
  const getCategoryColor = (category: string) => {
    if (category.includes('pokemon')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (category.includes('mtg')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (category.includes('yugioh')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (category.includes('lorcana')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (category.includes('sports')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Condition options
  const CONDITIONS = [
    { value: 'mint', label: 'Mint (M)' },
    { value: 'near_mint', label: 'Near Mint (NM)' },
    { value: 'excellent', label: 'Excellent (EX)' },
    { value: 'very_good', label: 'Very Good (VG)' },
    { value: 'good', label: 'Good (G)' },
    { value: 'fair', label: 'Fair (F)' },
    { value: 'poor', label: 'Poor (P)' },
  ];

  const GRADING_COMPANIES = ['PSA', 'BGS', 'CGC', 'SGC', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Scanner Modal */}
      {showScanner && (
        <CardScanner 
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Add Card</h1>
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Scan</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!selectedCard ? (
          // Search View
          <>
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 156,000+ cards..."
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-lg"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
                  showFilters 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              
              {['all', 'pokemon', 'mtg', 'yugioh', 'lorcana', 'sports'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap capitalize ${
                    categoryFilter === cat
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All Cards' : cat === 'mtg' ? 'Magic' : cat === 'yugioh' ? 'Yu-Gi-Oh' : cat === 'lorcana' ? 'Lorcana' : cat}
                </button>
              ))}
            </div>

            {/* Search Results */}
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Searching...</p>
              </div>
            ) : searchError ? (
              <div className="text-center py-16 text-red-400">
                <p>{searchError}</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {searchResults.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(card)}
                    className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left"
                  >
                    {/* Card Image */}
                    <div className="aspect-[3/4] relative bg-black/50">
                      {card.image_url ? (
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-4xl">🎴</span>
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      {card.market_price && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/90 rounded-md text-xs font-medium">
                          ${card.market_price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {card.set_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(card.category)}`}>
                          {card.category.replace('sports_', '').replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-16 text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cards found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term or scan your card</p>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Search for a card to add to your collection</p>
                <p className="text-sm mt-2">Or tap "Scan" to identify a card with your camera</p>
              </div>
            )}
          </>
        ) : (
          // Card Details / Add Form
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Back button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to search
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Preview */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/10">
                  <img
                    src={userImage || selectedCard.image_url}
                    alt={selectedCard.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Upload overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload your photo</span>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Card Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h2 className="text-xl font-bold">{selectedCard.name}</h2>
                  <p className="text-gray-400 mt-1">{selectedCard.set_name}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(selectedCard.category)}`}>
                      {selectedCard.category.replace('sports_', '').replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">#{selectedCard.card_number}</span>
                    <span className="text-xs text-gray-400">{selectedCard.rarity}</span>
                  </div>
                  {selectedCard.market_price && (
                    <div className="mt-3 flex items-center gap-2 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Market: ${selectedCard.market_price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Collection Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add to Collection</h3>

                {/* Condition */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {CONDITIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-gray-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Graded Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <span>Professionally Graded?</span>
                  <button
                    onClick={() => setIsGraded(!isGraded)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isGraded ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isGraded ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Grade Fields */}
                {isGraded && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Company</label>
                      <select
                        value={gradingCompany}
                        onChange={(e) => setGradingCompany(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {GRADING_COMPANIES.map((company) => (
                          <option key={company} value={company} className="bg-gray-900">
                            {company}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Grade</label>
                      <input
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="e.g., 10, 9.5"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                )}

                {/* Purchase Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes about this card..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveCard}
                  disabled={isSaving || saveSuccess}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    saveSuccess
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'bg-blue-600 hover:bg-blue-500'
                  } disabled:opacity-70`}
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Added to Collection!
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Collection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
