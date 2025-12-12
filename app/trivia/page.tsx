'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import {
  Gamepad2,
  Trophy,
  Zap,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Flame,
  Target,
  Award,
  Brain,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Types
interface TriviaQuestion {
  id: string
  category: string
  difficulty: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  explanation: string
  points: number
  time_limit?: number
}

interface ShuffledQuestion {
  id: string
  category: string
  difficulty: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  xp: number
  timeLimit: number
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🎯', color: 'from-purple-500 to-pink-500' },
  { id: 'pokemon', name: 'Pokémon', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: 'mtg', name: 'Magic: The Gathering', icon: '🌀', color: 'from-blue-500 to-purple-500' },
  { id: 'sports', name: 'Sports Cards', icon: '⚾', color: 'from-green-500 to-emerald-500' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', icon: '🐉', color: 'from-indigo-500 to-purple-500' },
  { id: 'grading', name: 'Grading', icon: '📊', color: 'from-red-500 to-orange-500' },
  { id: 'general', name: 'General', icon: '📜', color: 'from-amber-500 to-yellow-500' },
]

const DIFFICULTIES = [
  { id: 'all', name: 'All Levels', multiplier: 1 },
  { id: 'easy', name: 'Easy', multiplier: 1 },
  { id: 'medium', name: 'Medium', multiplier: 1.5 },
  { id: 'hard', name: 'Hard', multiplier: 2 },
]

type GameState = 'menu' | 'loading' | 'playing' | 'result' | 'answer'

export default function TriviaPage() {
  const supabase = createClientComponentClient()
  const { user } = useAuth()
  
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [totalXP, setTotalXP] = useState(0)
  const [error, setError] = useState('')
  
  // Stats
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    totalCorrect: 0,
    bestScore: 0,
    totalXP: 0,
  })

  // Load user stats on mount
  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!user) return
    
    const { data } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (data && data.length > 0) {
      setUserStats({
        totalGames: data.length,
        totalCorrect: data.reduce((sum, g) => sum + (g.correct_answers || 0), 0),
        bestScore: Math.max(...data.map(g => g.score || 0)),
        totalXP: data.reduce((sum, g) => sum + (g.xp_earned || 0), 0),
      })
    }
  }

  // Fetch questions from database
  const fetchQuestions = async () => {
    setGameState('loading')
    setError('')
    
    try {
      let query = supabase
        .from('trivia_questions')
        .select('*')
        .limit(10)
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }
      
      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty', selectedDifficulty)
      }
      
      const { data, error: fetchError } = await query
      
      if (fetchError) throw fetchError
      
      if (!data || data.length === 0) {
        setError('No questions found for this category. Try a different selection.')
        setGameState('menu')
        return
      }
      
      // Shuffle questions and prepare them
      const shuffled = shuffleArray(data).slice(0, 10).map((q: TriviaQuestion) => {
        // Combine correct and wrong answers, then shuffle
        const allAnswers = [q.correct_answer, ...q.wrong_answers]
        const shuffledAnswers = shuffleArray(allAnswers)
        const correctIndex = shuffledAnswers.indexOf(q.correct_answer)
        
        return {
          id: q.id,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          options: shuffledAnswers,
          correctIndex,
          explanation: q.explanation,
          xp: q.points,
          timeLimit: q.time_limit || 30,
        }
      })
      
      setQuestions(shuffled)
      setCurrentQuestion(0)
      setScore(0)
      setStreak(0)
      setTotalXP(0)
      setSelectedAnswer(null)
      setTimeLeft(shuffled[0]?.timeLimit || 30)
      setGameState('playing')
    } catch (err: any) {
      console.error('Error fetching questions:', err)
      setError('Failed to load questions. Please try again.')
      setGameState('menu')
    }
  }

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - mark as incorrect
          handleAnswer(-1) // -1 indicates no answer
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState, selectedAnswer, currentQuestion])

  // Handle answer selection
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    const question = questions[currentQuestion]
    const isCorrect = index === question.correctIndex
    
    if (isCorrect) {
      // Calculate XP with streak bonus
      const streakBonus = Math.min(streak * 5, 50) // Max 50 bonus XP
      const timeBonus = Math.floor(timeLeft / 3) // Bonus for fast answers
      const earnedXP = question.xp + streakBonus + timeBonus
      
      setScore((prev) => prev + 1)
      setStreak((prev) => prev + 1)
      setTotalXP((prev) => prev + earnedXP)
      
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }
    
    setGameState('answer')
  }

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 30)
      setGameState('playing')
    } else {
      // Game over - save score
      saveScore()
      setGameState('result')
    }
  }

  // Save score to database
  const saveScore = async () => {
    if (!user) return
    
    try {
      await supabase.from('trivia_scores').insert({
        user_id: user.id,
        score,
        total_questions: questions.length,
        correct_answers: score,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        xp_earned: totalXP,
        best_streak: bestStreak,
      })
      
      // Update user stats
      loadUserStats()
    } catch (err) {
      console.error('Error saving score:', err)
    }
  }

  // Restart game
  const restartGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalXP(0)
    setSelectedAnswer(null)
    setError('')
  }

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0]
  }

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Card Trivia Challenge</h1>
            <p className="text-gray-400">Test your knowledge and earn XP!</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Stats Cards */}
          {user && userStats.totalGames > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.bestScore}</p>
                  <p className="text-xs text-gray-400">Best Score</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.totalCorrect}</p>
                  <p className="text-xs text-gray-400">Total Correct</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Gamepad2 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.totalGames}</p>
                  <p className="text-xs text-gray-400">Games Played</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.totalXP.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Total XP</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Select Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} border-transparent text-white`
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl mr-2">{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Select Difficulty</h3>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`flex-1 py-3 rounded-lg border font-medium transition ${
                    selectedDifficulty === diff.id
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={fetchQuestions}
            size="lg"
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Gamepad2 className="w-6 h-6 mr-2" />
            Start Game
          </Button>

          {/* Info */}
          <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-2">How to Play</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Answer 10 questions before time runs out</li>
              <li>• Build streaks for bonus XP</li>
              <li>• Faster answers earn more points</li>
              <li>• Compete for the highest score!</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Render loading
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  // Render game
  if (gameState === 'playing' || gameState === 'answer') {
    const question = questions[currentQuestion]
    const category = getCategoryInfo(question.category)
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge className={`bg-gradient-to-r ${category.color}`}>
                {category.icon} {category.name}
              </Badge>
              <Badge variant="outline" className="border-gray-600">
                {question.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              {streak > 0 && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold">{streak}</span>
                </div>
              )}
              <div className="text-white font-bold">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>

          {/* Progress */}
          <Progress
            value={(currentQuestion / questions.length) * 100}
            className="h-2 mb-6"
          />

          {/* Timer */}
          {gameState === 'playing' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          )}

          {/* Question Card */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  let buttonClass = 'w-full p-4 rounded-lg border text-left transition '
                  
                  if (gameState === 'answer') {
                    if (index === question.correctIndex) {
                      buttonClass += 'bg-green-500/20 border-green-500 text-green-400'
                    } else if (index === selectedAnswer) {
                      buttonClass += 'bg-red-500/20 border-red-500 text-red-400'
                    } else {
                      buttonClass += 'bg-gray-800 border-gray-700 text-gray-500'
                    }
                  } else {
                    buttonClass += 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={gameState === 'answer'}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {gameState === 'answer' && index === question.correctIndex && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {gameState === 'answer' && index === selectedAnswer && index !== question.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Answer Explanation */}
          {gameState === 'answer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {selectedAnswer === question.correctIndex ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${selectedAnswer === question.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedAnswer === question.correctIndex ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={nextQuestion} className="w-full" size="lg">
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    See Results
                    <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Score Display */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-gray-400">Score:</span>
              <span className="text-white font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-gray-400">XP:</span>
              <span className="text-white font-bold">{totalXP}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render results
  if (gameState === 'result') {
    const percentage = Math.round((score / questions.length) * 100)
    const rating = percentage >= 90 ? 'S' : percentage >= 70 ? 'A' : percentage >= 50 ? 'B' : percentage >= 30 ? 'C' : 'D'
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Game Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Rating */}
              <div>
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold ${
                  rating === 'S' ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-white' :
                  rating === 'A' ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' :
                  rating === 'B' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' :
                  rating === 'C' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' :
                  'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
                }`}>
                  {rating}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{score}/{questions.length}</p>
                  <p className="text-xs text-gray-400">Correct</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{totalXP}</p>
                  <p className="text-xs text-gray-400">XP Earned</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{bestStreak}</p>
                  <p className="text-xs text-gray-400">Best Streak</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{percentage}%</p>
                  <p className="text-xs text-gray-400">Accuracy</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button onClick={fetchQuestions} className="w-full" size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={restartGame} variant="outline" className="w-full" size="lg">
                  Change Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
