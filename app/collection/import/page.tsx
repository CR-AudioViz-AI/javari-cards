'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Upload, FileText, Loader2, AlertCircle } from 'lucide-react'

export default function ImportPage() {
  const { user, loading: authLoading } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

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
          <p className="text-gray-400 mb-6">You need to be signed in to import cards.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login?redirect=/collection/import" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition">
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
            <h1 className="text-2xl font-bold text-white">Import Cards</h1>
            <p className="text-gray-400">Import your collection from a CSV file</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
          <div className="text-center">
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Upload CSV File</h3>
            <p className="text-gray-400 mb-6">Drag and drop or click to select a CSV file</p>
            
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg cursor-pointer transition"
            >
              <FileText className="w-5 h-5" />
              Select CSV File
            </label>

            {file && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-white">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            )}

            <div className="mt-8 text-left">
              <h4 className="text-white font-medium mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• First row should be headers</li>
                <li>• Required column: name</li>
                <li>• Optional: category, set_name, card_number, year, rarity, condition, current_value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
