'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

export default function ScanCardPage() {
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async () => {
    setScanning(true)
    
    // Simulate AI card recognition
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setResult({
      name: 'Charizard',
      set: 'Base Set',
      number: '4/102',
      year: 1999,
      rarity: 'Rare Holo',
      estimatedValue: '$2,500 - $15,000',
      confidence: 94,
    })
    setScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link 
          href="/collection"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Scan Card</h1>
        <p className="text-gray-400 mb-8">Use AI to identify and value your cards</p>

        {/* Beta Notice */}
        <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30 mb-6 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-purple-300 font-medium">AI-Powered Recognition (Beta)</p>
            <p className="text-purple-400/70 text-sm">Take a clear photo for best results</p>
          </div>
        </div>

        {/* Upload/Camera Area */}
        {!image ? (
          <div className="bg-gray-900/50 rounded-xl p-8 border border-purple-900/30">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-purple-500 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <span className="text-white font-medium">Upload Photo</span>
                <span className="text-gray-500 text-sm mt-1">JPG, PNG, HEIC</span>
              </label>

              <label className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-purple-500 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Camera className="w-10 h-10 text-gray-400 mb-3" />
                <span className="text-white font-medium">Take Photo</span>
                <span className="text-gray-500 text-sm mt-1">Use camera</span>
              </label>
            </div>

            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong className="text-gray-300">Tips for best results:</strong>
              </p>
              <ul className="text-gray-500 text-sm mt-2 space-y-1">
                <li>• Use good lighting, avoid shadows</li>
                <li>• Keep the card flat and in focus</li>
                <li>• Include the entire card in the frame</li>
                <li>• Avoid glare on sleeved/graded cards</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-900/30">
              <img
                src={image}
                alt="Card preview"
                className="w-full max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Results */}
            {result ? (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Card Identified!</h3>
                    <p className="text-green-400 text-sm">{result.confidence}% confidence</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="text-white font-medium">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Set</p>
                    <p className="text-white font-medium">{result.set}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Number</p>
                    <p className="text-white font-medium">{result.number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Year</p>
                    <p className="text-white font-medium">{result.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Rarity</p>
                    <p className="text-white font-medium">{result.rarity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Est. Value</p>
                    <p className="text-green-400 font-medium">{result.estimatedValue}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/collection/add?prefill=${encodeURIComponent(JSON.stringify(result))}`}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg text-center"
                  >
                    Add to Collection
                  </Link>
                  <button
                    onClick={() => { setImage(null); setResult(null); }}
                    className="px-4 py-3 bg-gray-800 text-gray-300 rounded-lg"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition"
                >
                  {scanning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Identify Card
                    </>
                  )}
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="px-4 py-4 bg-gray-800 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
