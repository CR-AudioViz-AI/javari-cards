'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Loader2, AlertCircle, Bell, Eye, Shield, Palette, Check } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    trades: true,
    trivia: true,
    clubs: true,
  })
  
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showCollection: true,
    showValue: false,
  })
  
  const [theme, setTheme] = useState('dark')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center pt-20">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to access settings.</p>
          <Link href="/auth/login?redirect=/settings" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account preferences</p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
            <Check className="w-5 h-5" />
            Settings saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    type="button"
                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                    className={`relative w-12 h-6 rounded-full transition ${value ? 'bg-purple-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${value ? 'left-7' : 'left-1'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Privacy</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Public Profile</span>
                <button
                  type="button"
                  onClick={() => setPrivacy({ ...privacy, publicProfile: !privacy.publicProfile })}
                  className={`relative w-12 h-6 rounded-full transition ${privacy.publicProfile ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${privacy.publicProfile ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Show Collection</span>
                <button
                  type="button"
                  onClick={() => setPrivacy({ ...privacy, showCollection: !privacy.showCollection })}
                  className={`relative w-12 h-6 rounded-full transition ${privacy.showCollection ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${privacy.showCollection ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Show Collection Value</span>
                <button
                  type="button"
                  onClick={() => setPrivacy({ ...privacy, showValue: !privacy.showValue })}
                  className={`relative w-12 h-6 rounded-full transition ${privacy.showValue ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${privacy.showValue ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Appearance</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['dark', 'light', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-3 rounded-lg border capitalize transition ${
                    theme === t
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Account</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
