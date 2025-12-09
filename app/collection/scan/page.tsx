'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Camera, Loader2, AlertCircle, Sparkles } from 'lucide-react'

export default function ScanPage() {
  const { user, loading: authLoading } = useAuth()
  const [scanning, setScanning] = useState(false)

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
          <p className="text-gray-400 mb-6">You need to be signed in to scan cards.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login?redirect=/collection/scan" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition">
              Sign In
            </Link>
            <Link href="/collection" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition">
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/collection" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Scan Card</h1>
            <p className="text-gray-400">Use AI to identify and add cards</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Card Scanner</h3>
            <p className="text-gray-400 mb-6">Take a photo of your card and our AI will identify it automatically</p>
            
            <div className="aspect-video bg-gray-800 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-700">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500">Camera preview will appear here</p>
              </div>
            </div>

            <button
              onClick={() => setScanning(true)}
              disabled={scanning}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Start Scanning
                </>
              )}
            </button>

            <p className="mt-6 text-sm text-gray-500">
              Powered by Javari AI - Coming soon with full card recognition
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
