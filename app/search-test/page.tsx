'use client';

import { useState } from 'react';

interface Card {
  id: string;
  name: string;
  image_url: string;
  category: string;
  source: string;
}

export default function SearchTestPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setDebugInfo('Starting search for: ' + query);
    
    try {
      const url = `/api/cards/search?q=${encodeURIComponent(query)}&limit=20`;
      setDebugInfo(prev => prev + '\nFetching: ' + url);
      
      const response = await fetch(url);
      setDebugInfo(prev => prev + '\nResponse status: ' + response.status);
      
      const data = await response.json();
      setDebugInfo(prev => prev + '\nData received: ' + JSON.stringify(data).substring(0, 200));
      
      if (data.success && data.results) {
        setResults(data.results);
        setDebugInfo(prev => prev + '\nFound ' + data.results.length + ' results');
      } else {
        setError(data.error || 'No results');
        setResults([]);
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
      setDebugInfo(prev => prev + '\nError: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ marginBottom: '20px' }}>🔍 Search Test Page</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Type Pete Rose, Johnny Bench, Charizard..."
          style={{ 
            flex: 1, 
            padding: '15px', 
            fontSize: '18px',
            background: '#2d2d44',
            border: '2px solid #444',
            borderRadius: '8px',
            color: 'white'
          }}
        />
        <button 
          onClick={search}
          disabled={loading}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px',
            background: loading ? '#666' : '#4a90d9',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? '⏳ Searching...' : '🔎 Search'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '15px', background: '#5c2020', borderRadius: '8px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        {results.map((card) => (
          <div 
            key={card.id}
            style={{ 
              background: '#2d2d44', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '1px solid #444'
            }}
          >
            <div style={{ aspectRatio: '3/4', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.image_url ? (
                <img 
                  src={card.image_url} 
                  alt={card.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎴</text></svg>'; }}
                />
              ) : (
                <span style={{ fontSize: '60px' }}>🎴</span>
              )}
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{card.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{card.source}</div>
              <div style={{ 
                display: 'inline-block',
                marginTop: '8px',
                padding: '4px 8px', 
                background: '#3a3a5a', 
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                {card.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
          <div>Type a name and click Search</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>Try: Pete Rose, Johnny Bench, Charizard, Black Lotus</div>
        </div>
      )}

      {/* Debug Info */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#1e1e3f', 
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>Debug Log:</strong>
        {debugInfo || '\nNo activity yet'}
      </div>
    </div>
  );
}
