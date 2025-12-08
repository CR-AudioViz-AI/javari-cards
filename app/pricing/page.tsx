'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown, Star, CreditCard } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with card collecting',
    stripePriceId: null,
    paypalPlanId: null,
    maxCards: 50,
    features: [
      '50 cards maximum',
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
    stripePriceId: 'price_1SVgPr7YeQ1dZTUvOvs6XnxE',
    paypalPlanId: 'collector_monthly',
    maxCards: 500,
    features: [
      '500 cards maximum',
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
    stripePriceId: 'price_1SVgPf7YeQ1dZTUvMqqmj8x4',
    paypalPlanId: 'premium_monthly',
    maxCards: Infinity,
    features: [
      'Unlimited cards',
      'Everything in Collector',
      'First access to new cards',
      'VIP events & giveaways',
      'Custom card requests',
      'White glove support',
      'API access',
    ],
    cta: 'Go Premium',
    highlighted: false,
    icon: Crown,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.stripePriceId && !plan.paypalPlanId) {
      window.location.href = '/signup';
      return;
    }

    setLoading(plan.name);

    try {
      if (paymentMethod === 'stripe' && plan.stripePriceId) {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: plan.stripePriceId }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || 'Failed to start checkout');
        }
      } else if (paymentMethod === 'paypal' && plan.paypalPlanId) {
        const response = await fetch('/api/paypal/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: plan.paypalPlanId }),
        });
        const data = await response.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        } else {
          alert(data.error || 'Failed to start PayPal checkout');
        }
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-purple-400">Collection</span> Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Start collecting digital cards today. Upgrade anytime as your collection grows.
          </p>

          {/* Payment Method Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-gray-400 text-sm">Pay with:</span>
            <div className="flex bg-purple-900/30 rounded-lg p-1">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                  paymentMethod === 'stripe' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  paymentMethod === 'paypal' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                PayPal
              </button>
            </div>
          </div>

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

                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">
                    {isAnnual && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-gray-400">
                    {isAnnual && plan.annualPrice ? '/year' : plan.period}
                  </span>
                </div>

                <p className="text-purple-300 text-sm mb-4">
                  {plan.maxCards === Infinity ? 'Unlimited' : `Up to ${plan.maxCards}`} cards
                </p>

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
                  onClick={() => handleSubscribe(plan)}
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

        {/* No Refunds Policy */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6 text-center">
            <h3 className="text-white font-semibold mb-2">Our Fair Policy</h3>
            <p className="text-gray-400 text-sm">
              Try CravCards free before you subscribe. Paid plans can be cancelled anytime - 
              your access continues until the end of your billing period. No refunds on subscriptions, 
              but you keep everything you've collected.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe, as well as PayPal.',
              },
              {
                q: 'What happens if I reach my card limit?',
                a: 'You\'ll be prompted to upgrade to continue adding cards. Your existing collection stays safe.',
              },
              {
                q: 'Do I keep my cards if I downgrade?',
                a: 'Yes, you keep all your cards. You just can\'t add more until you\'re under your new plan\'s limit.',
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
          <p className="mt-2">Part of the CRAV ecosystem | <Link href="https://cravbarrels.com" className="text-purple-400 hover:text-purple-300">CravBarrels</Link></p>
        </div>
      </footer>
    </div>
  );
}
