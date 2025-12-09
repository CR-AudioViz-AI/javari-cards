'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Trash2,
  Save,
  LogOut,
} from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [settings, setSettings] = useState({
    displayName: '',
    email: '',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      publicProfile: true,
      showCollection: true,
      showValue: false,
    },
    theme: 'dark',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      setSettings(prev => ({
        ...prev,
        displayName: user.user_metadata?.full_name || '',
        email: user.email || '',
      }))
    }
    getUser()
  }, [supabase, router])

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account and preferences</p>

        {saved && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400">
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push notifications', desc: 'Browser notifications' },
              { key: 'marketing', label: 'Marketing emails', desc: 'News and promotions' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications]
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition ${
                    settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                    settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Privacy</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'publicProfile', label: 'Public profile', desc: 'Allow others to view your profile' },
              { key: 'showCollection', label: 'Show collection', desc: 'Display your cards publicly' },
              { key: 'showValue', label: 'Show collection value', desc: 'Display your total value' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    privacy: {
                      ...settings.privacy,
                      [item.key]: !settings.privacy[item.key as keyof typeof settings.privacy]
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition ${
                    settings.privacy[item.key as keyof typeof settings.privacy] ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                    settings.privacy[item.key as keyof typeof settings.privacy] ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition border border-red-600/50"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
