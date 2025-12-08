'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Wine, Sparkles } from 'lucide-react';

interface CrossSellBannerProps {
  variant?: 'spirits' | 'cards';
}

export function CrossSellBanner({ variant = 'spirits' }: CrossSellBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Show CravBarrels promotion on CravCards
  if (variant === 'spirits') {
    return (
      <div className="relative bg-gradient-to-r from-amber-900/90 to-amber-800/90 border border-amber-600/30 rounded-lg p-4 mb-6">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-amber-300 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-700/50 rounded-lg">
            <Wine className="w-8 h-8 text-amber-300" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-amber-100">Also try CravBarrels!</h3>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-amber-200/80 text-sm">
              Track your whiskey & spirits collection. Import from CSV, scan bottles, play trivia!
            </p>
          </div>
          
          <Link
            href="https://cravbarrels.com"
            target="_blank"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition whitespace-nowrap"
          >
            Explore Spirits →
          </Link>
        </div>
      </div>
    );
  }

  // Show CravCards promotion on CravBarrels
  return (
    <div className="relative bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-600/30 rounded-lg p-4 mb-6">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-purple-300 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-700/50 rounded-lg">
          <span className="text-3xl">🎴</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-purple-100">Also try CravCards!</h3>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-purple-200/80 text-sm">
            Collect premium digital cards. Trade with others, compete in trivia, earn achievements!
          </p>
        </div>
        
        <Link
          href="https://cravcards.com"
          target="_blank"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition whitespace-nowrap"
        >
          Start Collecting →
        </Link>
      </div>
    </div>
  );
}

export default CrossSellBanner;
