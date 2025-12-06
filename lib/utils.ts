import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function getGradeColor(grade: number): string {
  if (grade === 10) return 'grade-10'
  if (grade >= 9) return 'grade-9'
  if (grade >= 8) return 'grade-8'
  return 'bg-gray-600'
}

export function getRarityColor(rarity: string): string {
  const rarityMap: Record<string, string> = {
    common: 'card-common',
    uncommon: 'card-uncommon',
    rare: 'card-rare',
    epic: 'card-epic',
    legendary: 'card-legendary',
    mythic: 'card-mythic',
  }
  return rarityMap[rarity.toLowerCase()] || 'card-common'
}

export function calculateROI(currentValue: number, purchasePrice: number): number {
  if (purchasePrice === 0) return 0
  return ((currentValue - purchasePrice) / purchasePrice) * 100
}

export function getTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(date)
}
