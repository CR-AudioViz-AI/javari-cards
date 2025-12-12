// ============================================================================
// CARD SCANNER COMPONENT - MOBILE-FIRST CAMERA SCANNING
// Uses device camera to identify cards via image recognition
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, FlipHorizontal, Zap, Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface CardScannerProps {
  onScanComplete: (result: ScanResult) => void;
  onClose: () => void;
}

interface ScanResult {
  success: boolean;
  card?: {
    id: string;
    name: string;
    set_name: string;
    category: string;
    image_url: string;
    confidence: number;
  };
  error?: string;
}

export function CardScanner({ onScanComplete, onClose }: CardScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions or upload an image instead.');
    }
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  // Switch between front and back camera
  const flipCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, [stopCamera]);

  // Capture image from video stream
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Stop camera after capture
    stopCamera();
    
    // Process the image
    processImage(imageData);
  }, [stopCamera]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  // Process captured/uploaded image
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Send to our card identification API
      const response = await fetch('/api/cards/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const result = await response.json();

      if (result.success) {
        onScanComplete(result);
      } else {
        setError(result.error || 'Could not identify card. Try a clearer image.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Retry with new image
  const retryCapture = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          aria-label="Close scanner"
        >
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-medium">Scan Card</span>
        <button
          onClick={flipCamera}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          disabled={!isStreaming}
          aria-label="Flip camera"
        >
          <FlipHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View / Captured Image */}
      <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured card" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            className="max-w-full max-h-full object-contain"
            playsInline
            muted
            autoPlay
          />
        )}

        {/* Scanning overlay */}
        {isStreaming && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Card frame guide */}
              <div className="w-64 h-88 sm:w-80 sm:h-[440px] border-2 border-white/50 rounded-lg">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
              </div>
              <p className="text-white text-center mt-4 text-sm">
                Position card within frame
              </p>
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Identifying card...</p>
              <p className="text-white/60 text-sm mt-1">Searching 45,000+ cards</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute bottom-24 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-6">
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Upload image"
          >
            <Upload className="w-6 h-6" />
          </button>

          {/* Capture/Retry button */}
          {capturedImage ? (
            <button
              onClick={retryCapture}
              className="p-6 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              aria-label="Retry"
            >
              <Camera className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={captureImage}
              disabled={!isStreaming}
              className="p-6 rounded-full bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
              aria-label="Capture"
            >
              <Zap className="w-8 h-8" />
            </button>
          )}

          {/* Placeholder for symmetry */}
          <div className="w-14 h-14" />
        </div>

        <p className="text-white/60 text-center text-xs mt-4">
          Tap the lightning bolt to scan • Works with Pokemon, MTG & Sports cards
        </p>
      </div>
    </div>
  );
}

export default CardScanner;
