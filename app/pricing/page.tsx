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
      window.location.href = '/auth/signup';
      return;
    }

    setLoading(plan.name);

    try {
      if (paymentMethod === 'stripe' && plan.stripePriceId) {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            mode: 'subscription',
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else if (paymentMethod === 'paypal' && plan.paypalPlanId) {
        const response = await fetch('/api/paypal/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.paypalPlanId,
          }),
        });
        const data = await response.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Plan</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free and upgrade as your collection grows. All plans include access to our community and trivia games.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Annual <span className="text-green-400 text-xs ml-1">Save 20%</span>
          </span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              paymentMethod === 'stripe'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              paymentMethod === 'paypal'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="font-bold text-sm">PayPal</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-900/50 to-pink-900/30 border-2 border-purple-500'
                    : 'bg-gray-900/50 border border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-purple-500/30' : 'bg-gray-800'}`}>
                    <Icon className={`w-6 h-6 ${plan.highlighted ? 'text-purple-400' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {isAnnual && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {isAnnual && plan.annualPrice ? '/year' : plan.period}
                  </span>
                </div>

                <p className="text-gray-400 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  } disabled:opacity-50`}
                >
                  {loading === plan.name ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-400 text-sm">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">We accept all major credit cards through Stripe, as well as PayPal for your convenience.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Is there a refund policy?</h3>
              <p className="text-gray-400 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Do credits expire?</h3>
              <p className="text-gray-400 text-sm">Never! Your credits never expire on paid plans. On free plans, unused credits roll over each month.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Have questions? We&apos;re here to help.</p>
          <Link
            href="/contact"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
