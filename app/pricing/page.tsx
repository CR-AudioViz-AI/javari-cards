'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic card collecting',
    priceId: null,
    features: [
      '10 free card packs',
      'Basic collection management',
      'Community access',
      'Daily trivia games',
      'Standard support',
    ],
    cta: 'Get Started',
    highlighted: false,
    icon: Star,
  },
  {
    name: 'Collector',
    price: '$9',
    period: '/month',
    annualPrice: '$86',
    description: 'For serious card collectors',
    priceId: 'price_1SVgPr7YeQ1dZTUvOvs6XnxE', // $9/mo Basic
    features: [
      'Unlimited card packs',
      'Advanced collection tools',
      'Trading marketplace access',
      'Exclusive card drops',
      'Priority support',
      'Collection analytics',
    ],
    cta: 'Start Collecting',
    highlighted: true,
    icon: Zap,
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    annualPrice: '$278',
    description: 'Ultimate collecting experience',
    priceId: 'price_1SVgPf7YeQ1dZTUvMqqmj8x4', // $29/mo Pro
    features: [
      'Everything in Collector',
      'First access to new cards',
      'VIP events & giveaways',
      'Custom card requests',
      'White glove support',
      'API access',
      'Bulk import/export',
    ],
    cta: 'Go Premium',
    highlighted: false,
    icon: Crown,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      // Free plan - redirect to signup
      window.location.href = '/signup';
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🎴</span>
              <span className="text-xl font-bold text-purple-400">CravCards</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/collection" className="text-gray-300 hover:text-white transition">Collection</Link>
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition">Marketplace</Link>
              <Link href="/trivia" className="text-gray-300 hover:text-white transition">Trivia</Link>
              <Link href="/pricing" className="text-purple-400 font-medium">Pricing</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-purple-400">Collection</span> Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Start collecting digital cards today. Upgrade anytime as your collection grows.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Annual <span className="text-green-400">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/50 border-2 border-purple-500 scale-105'
                    : 'bg-purple-900/20 border border-purple-700/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-purple-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-purple-500/30' : 'bg-purple-900/50'}`}>
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {isAnnual && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-gray-400">
                    {isAnnual && plan.annualPrice ? '/year' : plan.period}
                  </span>
                </div>

                <p className="text-gray-400 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-900/50 text-purple-300 hover:bg-purple-900/70 border border-purple-700/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.name ? 'Loading...' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe. PayPal support coming soon.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Our Free plan lets you try the platform with no time limit. Upgrade when you\'re ready for more features.',
              },
              {
                q: 'Do my cards transfer if I cancel?',
                a: 'Yes, you keep all cards you\'ve collected. You just lose access to premium features until you resubscribe.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
          <p className="mt-2">Powered by Javari AI</p>
        </div>
      </footer>
    </div>
  );
}
