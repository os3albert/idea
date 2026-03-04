import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, BarChart2, ChevronDown, ChevronUp, Loader2, Languages, Trash2, Download, X, CheckCircle2, MinusCircle, BookOpen, Sparkles } from 'lucide-react';

// --- PWA DYNAMIC SETUP ---
const setupPWA = () => {
  const meta = [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'VocabES' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#4f46e5' }
  ];
  meta.forEach(({ name, content }) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  });
};

export default function App() {
  // Caricamento iniziale dal LocalStorage
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem('vocab_words_local');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputPhrase, setInputPhrase] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLowFreq, setShowLowFreq] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activePopupWord, setActivePopupWord] = useState(null);
  
  const textareaRef = useRef(null);

  // Effetto per il salvataggio automatico ogni volta che 'words' cambia
  useEffect(() => {
    localStorage.setItem('vocab_words_local', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    setupPWA();
  }, []);

  // Gestione Autocompletamento
  useEffect(() => {
    const lastWord = inputPhrase.split(/[\s,.]+/).pop().toLowerCase();
    if (lastWord.length > 1) {
      const matches = words
        .filter(w => w.term.startsWith(lastWord))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [inputPhrase, words]);

  const applySuggestion = (fullWord) => {
    const parts = inputPhrase.split(/\s+/);
    parts[parts.length - 1] = fullWord + " ";
    setInputPhrase(parts.join(" "));
    setSuggestions([]);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const translateWord = async (word) => {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=es|it`);
      const data = await response.json();
      return data.responseData.translatedText || "Significato non trovato";
    } catch { return "Errore di connessione"; }
  };

  const handleAnalysis = async () => {
    if (!inputPhrase.trim()) return;
    setIsAnalyzing(true);
    
    const cleanedWords = inputPhrase.toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(w => w.length >= 3);
    
    const uniqueWords = [...new Set(cleanedWords)];
    let newWords = [...words];
    let lastFound = null;

    for (const word of uniqueWords) {
      const existingIdx = newWords.findIndex(w => w.term === word);
      
      if (existingIdx > -1) {
        newWords[existingIdx] = {
          ...newWords[existingIdx],
          frequency: newWords[existingIdx].frequency + 1,
          lastUpdated: new Date().toISOString()
        };
        lastFound = { term: word, meaning: newWords[existingIdx].meaning };
      } else {
        const meaning = await translateWord(word);
        const newEntry = {
          id: word,
          term: word,
          meaning: meaning,
          frequency: 1,
          lastUpdated: new Date().toISOString()
        };
        newWords.push(newEntry);
        lastFound = { term: word, meaning: meaning };
      }
    }

    setWords(newWords);
    if (lastFound) setActivePopupWord(lastFound);
    setInputPhrase("");
    setIsAnalyzing(false);
  };

  const handleIncrement = (id) => {
    const newWords = words.map(w => {
      if (w.id === id) {
        const updated = { ...w, frequency: w.frequency + 1, lastUpdated: new Date().toISOString() };
        setActivePopupWord({ term: w.term, meaning: w.meaning });
        return updated;
      }
      return w;
    });
    setWords(newWords);
  };

  const handleDecrement = (id) => {
    const existing = words.find(w => w.id === id);
    if (!existing) return;

    if (existing.frequency > 1) {
      setWords(words.map(w => w.id === id ? { ...w, frequency: w.frequency - 1 } : w));
    } else {
      setWords(words.filter(w => w.id !== id));
    }
  };

  const filteredList = useMemo(() => {
    return words
      .filter(w => w.term.toLowerCase().includes(searchQuery.toLowerCase()) || w.meaning.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.frequency - a.frequency);
  }, [words, searchQuery]);

  const highFreq = filteredList.filter(w => w.frequency >= 3);
  const lowFreq = filteredList.filter(w => w.frequency < 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-36 font-sans overflow-x-hidden">
      <header className="bg-emerald-600 pt-10 pb-6 px-6 text-white shadow-lg sticky top-0 z-30 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Languages className="w-6 h-6" /> VocabES Offline
          </h1>
          <p className="text-emerald-100 text-[10px] uppercase tracking-widest font-semibold">Salvataggio Locale nel Browser</p>
        </div>
        <button onClick={() => setShowInstallGuide(true)} className="p-2 bg-emerald-500 rounded-full active:scale-90 transition-all">
          <Download size={18} />
        </button>
      </header>

      <main className="p-4 flex-1 max-w-lg mx-auto w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 pb-1">
            <textarea
              ref={textareaRef}
              placeholder="Escribe una frase..."
              className="w-full bg-slate-50 rounded-xl p-3 border-none focus:ring-0 text-lg resize-none outline-none h-28"
              value={inputPhrase}
              onChange={(e) => setInputPhrase(e.target.value)}
            />
          </div>

          <div className="h-12 bg-white border-t border-slate-100 flex items-center px-2 gap-2 overflow-x-auto no-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => applySuggestion(s.term)}
                  className="whitespace-nowrap bg-emerald-50 text-emerald-600 text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100 active:bg-emerald-200"
                >
                  <Sparkles size={14} />
                  {s.term}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-300 ml-2 italic">Scrivi per suggerimenti...</span>
            )}
          </div>

          <div className="p-2">
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing || !inputPhrase.trim()}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-100"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
              Analizza e Mostra Significati
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-slate-400">
            <BarChart2 size={16} />
            <span className="text-xs font-bold uppercase">Il Tuo Vocabolario</span>
          </div>
          
          <div className="space-y-2">
            {highFreq.map(w => (
              <SwipeableCard key={w.id} item={w} onDecrement={() => handleDecrement(w.id)} onIncrement={() => handleIncrement(w.id)} />
            ))}
          </div>

          {lowFreq.length > 0 && (
            <div className="pt-2">
              <button onClick={() => setShowLowFreq(!showLowFreq)} className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-500 text-sm font-medium">
                <span>Altre parole ({lowFreq.length})</span>
                {showLowFreq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showLowFreq && (
                <div className="mt-2 space-y-2">
                  {lowFreq.map(w => (
                    <SwipeableCard key={w.id} item={w} onDecrement={() => handleDecrement(w.id)} onIncrement={() => handleIncrement(w.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-10 z-40">
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filtra il tuo dizionario..."
            className="w-full bg-slate-100 rounded-2xl py-3 pl-12 pr-4 border-none focus:ring-2 focus:ring-emerald-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </footer>

      {activePopupWord && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <BookOpen size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Significato Trovato</h2>
              <div className="text-4xl font-black text-slate-800 capitalize leading-tight">{activePopupWord.term}</div>
              <p className="text-2xl text-slate-600 font-medium italic">"{activePopupWord.meaning}"</p>
            </div>
            <button 
              onClick={() => setActivePopupWord(null)}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg active:scale-95 transition-all"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}

      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Installa l'App</h2>
              <button onClick={() => setShowInstallGuide(false)}><X /></button>
            </div>
            <p className="text-sm text-slate-500 italic">I tuoi dati vengono salvati localmente su questo browser.</p>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl text-xs"><strong>iOS:</strong> Condividi &rarr; Aggiungi a Home</div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs"><strong>Android:</strong> Menu &rarr; Installa</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeableCard({ item, onDecrement, onIncrement }) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const threshold = 80;

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-200">
      <div className={`absolute inset-y-0 right-0 w-full flex items-center justify-end px-6 text-white transition-colors ${item.frequency <= 1 ? 'bg-red-600' : 'bg-orange-500'}`}>
        <div className="flex flex-col items-center">
          {item.frequency <= 1 ? <Trash2 size={20} /> : <MinusCircle size={20} />}
          <span className="text-[9px] font-bold uppercase mt-1">
            {item.frequency <= 1 ? 'Elimina' : '-1 Freq'}
          </span>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-full bg-emerald-500 flex items-center justify-start px-6 text-white">
        <div className="flex flex-col items-center">
          <CheckCircle2 size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">+1 Freq</span>
        </div>
      </div>
      <div 
        className="relative bg-white border border-slate-200 p-4 flex justify-between items-center shadow-sm transition-transform duration-200 ease-out touch-pan-y"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => {
          const diff = e.touches[0].clientX - startX.current;
          setOffset(diff);
        }}
        onTouchEnd={() => {
          if (offset < -threshold) {
            if (item.frequency <= 1) {
              setOffset(-500);
              setTimeout(onDecrement, 200);
            } else {
              onDecrement();
              setOffset(0);
            }
          } else if (offset > threshold) {
            onIncrement();
            setOffset(0);
          } else {
            setOffset(0);
          }
        }}
      >
        <div className="select-none flex-1">
          <h3 className="font-bold text-slate-800 text-lg capitalize">{item.term}</h3>
          <p className="text-slate-500 text-sm italic">{item.meaning}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border border-emerald-100 shadow-inner">
          {item.frequency}
        </div>
      </div>
    </div>
  );
}