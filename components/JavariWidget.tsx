'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

// Brand colors
const COLORS = {
  navy: '#002B5B',
  red: '#FD201D',
  cyan: '#00BCD4',
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'good' | 'bad';
}

interface JavariWidgetProps {
  sourceApp?: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  enableTickets?: boolean;
  enableEnhancements?: boolean;
  context?: string; // Additional context for Javari
}

// Simple responses based on keywords - Javari learns from these
const getJavariResponse = (message: string, context?: string): string => {
  const lower = message.toLowerCase();
  
  // Stock/Crypto related
  if (lower.includes('stock') || lower.includes('invest') || lower.includes('buy')) {
    return "I'm tracking market patterns and learning from each prediction! While I can share what I'm learning about stocks and crypto, remember I'm still developing my analysis skills. What specific ticker or sector interests you? I'll log this conversation to improve my knowledge.";
  }
  
  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum')) {
    return "Crypto markets are fascinating! I'm building my knowledge base on digital assets. I track my predictions to learn what works and what doesn't. What would you like to know? Every conversation helps me get smarter.";
  }
  
  if (lower.includes('penny stock')) {
    return "Penny stocks are high-risk, high-reward territory. I'm learning to identify patterns in this volatile space. What penny stocks are you watching? I'll add this to my learning database.";
  }
  
  // Support related
  if (lower.includes('help') || lower.includes('support') || lower.includes('problem') || lower.includes('issue')) {
    return "I'm here to help! I can answer questions, create a support ticket, or suggest features. What's on your mind? I learn from every interaction to serve you better.";
  }
  
  if (lower.includes('ticket') || lower.includes('bug') || lower.includes('broken')) {
    return "I can help you create a support ticket. Just describe the issue in detail - what were you trying to do, what happened, and what did you expect? I'll make sure it gets to the right team.";
  }
  
  if (lower.includes('feature') || lower.includes('suggestion') || lower.includes('idea') || lower.includes('enhance')) {
    return "I love hearing new ideas! You can submit a feature request and the community can vote on it. What feature would make your experience better?";
  }
  
  // Platform related
  if (lower.includes('credit') || lower.includes('price') || lower.includes('cost') || lower.includes('subscription')) {
    return "Credits never expire on paid plans - that's our promise! We have flexible pricing at craudiovizai.com/pricing. Is there something specific about credits or billing I can clarify?";
  }
  
  if (lower.includes('cardverse') || lower.includes('card') || lower.includes('trading')) {
    return "CardVerse is our trading card platform! You can create, collect, and trade digital cards. What would you like to know about it?";
  }
  
  // Greetings
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower === 'yo') {
    return "Hey there! 👋 I'm Javari, your AI assistant. I'm always learning - from conversations, documents, market data, and more. How can I help you today?";
  }
  
  if (lower.includes('thank')) {
    return "You're welcome! Every conversation helps me learn and improve. Is there anything else I can help with?";
  }
  
  // Default - encourage engagement
  return "I'm Javari, and I'm constantly learning! I track my conversations, analyze documents, and even learn from my stock predictions (both wins and losses). Ask me about CR AudioViz AI, stocks, crypto, or submit a support ticket. What interests you?";
};

export default function JavariWidget({
  sourceApp = 'craudiovizai.com',
  position = 'bottom-right',
  primaryColor = COLORS.cyan,
  enableTickets = true,
  enableEnhancements = true,
  context,
}: JavariWidgetProps) {
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save conversation to database for learning
  const saveConversation = async (role: 'user' | 'assistant', content: string) => {
    try {
      // Extract topics and entities from message
      const extractedTopics = extractTopics(content);
      const extractedEntities = extractEntities(content);
      
      await supabase.from('javari_conversations').insert({
        session_id: sessionId,
        user_id: user?.id || null,
        source_app: sourceApp,
        role,
        content,
        extracted_topics: extractedTopics,
        extracted_entities: extractedEntities,
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Simple topic extraction
  const extractTopics = (text: string): string[] => {
    const topics: string[] = [];
    const lower = text.toLowerCase();
    
    if (lower.includes('stock') || lower.includes('invest')) topics.push('stocks');
    if (lower.includes('crypto') || lower.includes('bitcoin')) topics.push('crypto');
    if (lower.includes('penny')) topics.push('penny_stocks');
    if (lower.includes('support') || lower.includes('help')) topics.push('support');
    if (lower.includes('feature') || lower.includes('enhance')) topics.push('enhancements');
    if (lower.includes('credit') || lower.includes('billing')) topics.push('billing');
    
    return topics;
  };

  // Simple entity extraction (tickers)
  const extractEntities = (text: string): string[] => {
    const entities: string[] = [];
    
    // Match common ticker patterns ($XXX or just XXX in context)
    const tickerMatch = text.match(/\$[A-Z]{1,5}/g);
    if (tickerMatch) {
      entities.push(...tickerMatch.map(t => t.replace('$', '')));
    }
    
    // Common cryptos
    if (text.toLowerCase().includes('bitcoin') || text.includes('BTC')) entities.push('BTC');
    if (text.toLowerCase().includes('ethereum') || text.includes('ETH')) entities.push('ETH');
    
    return [...new Set(entities)];
  };

  // Log activity for learning
  const logActivity = async (activityType: string, description: string, relatedTicker?: string) => {
    try {
      await supabase.from('javari_activity_log').insert({
        activity_type: activityType,
        description,
        related_ticker: relatedTicker,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Save user message for learning
    await saveConversation('user', input);
    
    // Log the interaction
    const entities = extractEntities(input);
    await logActivity('answered', `User asked: ${input.substring(0, 100)}...`, entities[0]);

    // Simulate response delay
    setTimeout(async () => {
      const response = getJavariResponse(input, context);
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Save assistant response for learning
      await saveConversation('assistant', response);
    }, 1000 + Math.random() * 1000);
  };

  const handleFeedback = async (messageId: string, feedback: 'good' | 'bad') => {
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, feedback } : m)
    );
    
    // Log feedback for learning
    await logActivity(
      'learned',
      `User rated response as ${feedback}`,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6';

  // Widget button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110`}
        style={{ backgroundColor: primaryColor }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div
        className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50`}
      >
        <Card 
          className="w-64 p-3 cursor-pointer hover:shadow-lg transition-shadow"
          style={{ backgroundColor: COLORS.navy }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
              <span className="text-white font-medium">Javari AI</span>
            </div>
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </div>
        </Card>
      </div>
    );
  }

  // Full chat widget
  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 w-[95vw] sm:w-96 max-w-md`}
    >
      <Card className="shadow-2xl overflow-hidden" style={{ backgroundColor: '#111' }}>
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.navy }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}30` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Javari AI</h3>
              <p className="text-xs text-gray-400">Always learning • Here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white p-1"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-2 border-b border-gray-800 flex gap-2 overflow-x-auto">
          {enableTickets && (
            <button 
              onClick={() => setInput('I need help with an issue')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <HelpCircle className="w-3 h-3" />
              Get Help
            </button>
          )}
          {enableEnhancements && (
            <button 
              onClick={() => setInput('I have a feature idea')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <Lightbulb className="w-3 h-3" />
              Suggest Feature
            </button>
          )}
          <button 
            onClick={() => setInput('Tell me about stocks')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            <TrendingUp className="w-3 h-3" />
            Stocks & Crypto
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: primaryColor }} />
              <h4 className="text-white font-medium mb-2">Hi, I'm Javari!</h4>
              <p className="text-gray-400 text-sm">
                I learn from every conversation. Ask me about stocks, crypto, 
                or anything about CR AudioViz AI!
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {/* Feedback buttons for assistant messages */}
                {message.role === 'assistant' && !message.feedback && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs text-gray-500">Helpful?</span>
                    <button
                      onClick={() => handleFeedback(message.id, 'good')}
                      className="text-gray-500 hover:text-green-400 p-1"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'bad')}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {message.feedback && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs text-gray-500">
                      {message.feedback === 'good' ? '✓ Thanks for the feedback!' : '✓ I\'ll learn from this!'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Javari anything..."
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{ backgroundColor: primaryColor }}
              className="text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Javari AI • Learning from {sourceApp}
          </p>
        </div>
      </Card>
    </div>
  );
}
