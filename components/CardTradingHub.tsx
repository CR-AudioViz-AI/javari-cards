'use client'

import { useState } from 'react'
import {
  RefreshCw, Search, Filter, Star, Shield, Clock, MapPin,
  MessageSquare, Heart, Share2, Eye, TrendingUp, TrendingDown,
  CheckCircle, XCircle, AlertCircle, DollarSign, Truck, Users
} from 'lucide-react'

interface TradeOffer {
  id: string
  type: 'buy' | 'sell' | 'trade'
  user: { name: string; rating: number; trades: number; avatar: string }
  card: { name: string; set: string; condition: string; game: string; image: string }
  price?: number
  wantCards?: string[]
  location: string
  shipping: boolean
  local: boolean
  postedAt: string
  views: number
  offers: number
}

interface MarketPrice {
  card: string
  game: string
  low: number
  mid: number
  high: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  lastSale: number
  volume: number
}

const TRADE_OFFERS: TradeOffer[] = [
  {
    id: '1', type: 'sell',
    user: { name: 'CardMaster99', rating: 4.9, trades: 234, avatar: '🧙' },
    card: { name: 'Charizard Base Set', set: 'Base Set', condition: 'PSA 8', game: 'pokemon', image: '🔥' },
    price: 850, location: 'Miami, FL', shipping: true, local: true,
    postedAt: '2 hours ago', views: 156, offers: 3
  },
  {
    id: '2', type: 'trade',
    user: { name: 'MTGCollector', rating: 4.7, trades: 89, avatar: '🎴' },
    card: { name: 'Force of Will', set: 'Alliances', condition: 'LP', game: 'mtg', image: '💫' },
    wantCards: ['Mox Diamond', 'City of Brass', 'Wasteland'],
    location: 'Austin, TX', shipping: true, local: false,
    postedAt: '5 hours ago', views: 89, offers: 2
  },
  {
    id: '3', type: 'buy',
    user: { name: 'OnePieceFan', rating: 5.0, trades: 45, avatar: '🏴‍☠️' },
    card: { name: 'Luffy Gear 5 Alt Art', set: 'Romance Dawn', condition: 'NM+', game: 'onepiece', image: '👒' },
    price: 500, location: 'Seattle, WA', shipping: true, local: false,
    postedAt: '1 day ago', views: 234, offers: 0
  },
  {
    id: '4', type: 'sell',
    user: { name: 'LorcanaLover', rating: 4.8, trades: 67, avatar: '✨' },
    card: { name: 'Elsa - Spirit of Winter', set: 'The First Chapter', condition: 'Gem Mint', game: 'lorcana', image: '❄️' },
    price: 120, location: 'Denver, CO', shipping: true, local: true,
    postedAt: '30 minutes ago', views: 45, offers: 1
  },
]

const MARKET_PRICES: MarketPrice[] = [
  { card: 'Charizard VMAX Rainbow', game: 'pokemon', low: 280, mid: 320, high: 380, trend: 'up', trendPercent: 8.5, lastSale: 315, volume: 45 },
  { card: 'Black Lotus (Unlimited)', game: 'mtg', low: 42000, mid: 48000, high: 55000, trend: 'up', trendPercent: 12.3, lastSale: 47500, volume: 3 },
  { card: 'Luffy Gear 5 Secret', game: 'onepiece', low: 180, mid: 220, high: 280, trend: 'up', trendPercent: 25.0, lastSale: 225, volume: 89 },
  { card: 'Mickey Mouse Enchanted', game: 'lorcana', low: 450, mid: 520, high: 600, trend: 'down', trendPercent: -5.2, lastSale: 495, volume: 23 },
]

export default function CardTradingHub() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'prices' | 'my-trades'>('marketplace')
  const [typeFilter, setTypeFilter] = useState<'all' | 'buy' | 'sell' | 'trade'>('all')
  const [gameFilter, setGameFilter] = useState<string>('all')

  const filteredOffers = TRADE_OFFERS.filter(offer => 
    (typeFilter === 'all' || offer.type === typeFilter) &&
    (gameFilter === 'all' || offer.card.game === gameFilter)
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'sell': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'trade': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getGameIcon = (game: string) => {
    switch (game) {
      case 'pokemon': return '⚡'
      case 'mtg': return '🎴'
      case 'onepiece': return '🏴‍☠️'
      case 'lorcana': return '✨'
      case 'sports': return '🏆'
      default: return '🃏'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Trading Hub</h1>
              <p className="text-purple-200">Buy, sell, and trade cards with collectors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium">
              + List a Card
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'marketplace', label: 'Marketplace' },
          { id: 'prices', label: 'Price Guide' },
          { id: 'my-trades', label: 'My Trades' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Marketplace */}
      {activeTab === 'marketplace' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {['all', 'buy', 'sell', 'trade'].map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as any)}
                  className={`px-3 py-1.5 rounded text-sm capitalize ${
                    typeFilter === type ? 'bg-purple-600 text-white' : 'text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {['all', 'pokemon', 'mtg', 'onepiece', 'lorcana'].map(game => (
                <button
                  key={game}
                  onClick={() => setGameFilter(game)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    gameFilter === game ? 'bg-purple-600 text-white' : 'text-gray-400'
                  }`}
                >
                  {game === 'all' ? 'All' : getGameIcon(game)}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
            </div>
          </div>

          {/* Listings */}
          <div className="space-y-4">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="bg-gray-900 rounded-xl border border-gray-700 p-4 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-4xl">
                    {offer.card.image}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs rounded border uppercase ${getTypeColor(offer.type)}`}>
                            {offer.type === 'buy' ? 'WTB' : offer.type === 'sell' ? 'WTS' : 'WTT'}
                          </span>
                          <span className="text-lg">{getGameIcon(offer.card.game)}</span>
                          <h3 className="font-semibold">{offer.card.name}</h3>
                        </div>
                        <p className="text-sm text-gray-400">{offer.card.set} • {offer.card.condition}</p>
                      </div>
                      
                      {offer.price && (
                        <p className="text-xl font-bold text-green-400">${offer.price.toLocaleString()}</p>
                      )}
                    </div>

                    {offer.wantCards && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Looking for:</p>
                        <div className="flex flex-wrap gap-1">
                          {offer.wantCards.map(card => (
                            <span key={card} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                              {card}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {offer.location}
                      </span>
                      {offer.shipping && <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Ships</span>}
                      {offer.local && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Local</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {offer.postedAt}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{offer.user.avatar}</span>
                          <div>
                            <p className="font-medium text-sm">{offer.user.name}</p>
                            <p className="text-xs text-gray-400">
                              ⭐ {offer.user.rating} • {offer.user.trades} trades
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{offer.views} views • {offer.offers} offers</span>
                        <button className="p-2 text-gray-400 hover:text-white"><Heart className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-white"><MessageSquare className="w-4 h-4" /></button>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm">
                          {offer.type === 'buy' ? 'I Have This' : offer.type === 'sell' ? 'Make Offer' : 'Propose Trade'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Price Guide */}
      {activeTab === 'prices' && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold">Market Prices</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4 text-sm text-gray-400">Card</th>
                <th className="text-right p-4 text-sm text-gray-400">Low</th>
                <th className="text-right p-4 text-sm text-gray-400">Mid</th>
                <th className="text-right p-4 text-sm text-gray-400">High</th>
                <th className="text-right p-4 text-sm text-gray-400">Last Sale</th>
                <th className="text-right p-4 text-sm text-gray-400">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MARKET_PRICES.map(price => (
                <tr key={price.card} className="hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span>{getGameIcon(price.game)}</span>
                      <span className="font-medium">{price.card}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-400">${price.low.toLocaleString()}</td>
                  <td className="p-4 text-right font-medium">${price.mid.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-400">${price.high.toLocaleString()}</td>
                  <td className="p-4 text-right">${price.lastSale.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`flex items-center justify-end gap-1 ${
                      price.trend === 'up' ? 'text-green-400' : price.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {price.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                      {price.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                      {price.trendPercent >= 0 ? '+' : ''}{price.trendPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
