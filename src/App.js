import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, BarChart2, ChevronDown, ChevronUp, Loader2, Languages, Trash2, Download, X, CheckCircle2, MinusCircle, BookOpen, Sparkles, Globe } from 'lucide-react';

// --- CONFIGURAZIONE PWA ---
const setupPWA = () => {
  // Lasciamo che index.html gestisca le icone statiche
};

const LANGUAGES_MAP = {
  es: { name: 'Spagnolo', flag: '🇪🇸', code: 'es' },
  en: { name: 'Inglese', flag: '🇬🇧', code: 'en' },
  fr: { name: 'Francese', flag: '🇫🇷', code: 'fr' },
  tr: { name: 'Turco', flag: '🇹🇷', code: 'tr' }
};

const AppIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className={className}>
    <rect x="64" y="64" width="896" height="896" rx="220" fill="#0F172A"/>
    <rect x="232" y="320" width="560" height="120" rx="60" fill="#E5E7EB"/>
    <rect x="232" y="452" width="560" height="120" rx="60" fill="#3B82F6"/>
    <rect x="232" y="584" width="560" height="120" rx="60" fill="#E5E7EB"/>
  </svg>
);

export default function App() {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('vocab_pro_lang') || 'es';
  });

  const [words, setWords] = useState([]);
  const [inputPhrase, setInputPhrase] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLowFreq, setShowLowFreq] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activePopupWord, setActivePopupWord] = useState(null);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(`vocab_words_${selectedLang}`);
    setWords(saved ? JSON.parse(saved) : []);
    localStorage.setItem('vocab_pro_lang', selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem(`vocab_words_${selectedLang}`, JSON.stringify(words));
  }, [words, selectedLang]);

  useEffect(() => {
    setupPWA();
  }, []);

  useEffect(() => {
    const lastWord = inputPhrase.split(/[\s,.]+/).pop().toLowerCase();
    if (lastWord.length > 1) {
      const matches = words.filter(w => w.term.startsWith(lastWord)).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [inputPhrase, words]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const matches = words.filter(w => w.term.startsWith(searchQuery.toLowerCase())).slice(0, 3);
      setSearchSuggestions(matches);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, words]);

  const applySuggestion = (fullWord) => {
    const parts = inputPhrase.split(/\s+/);
    parts[parts.length - 1] = fullWord + " ";
    setInputPhrase(parts.join(" "));
    setSuggestions([]);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const translateWord = async (word) => {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${selectedLang}|it`);
      const data = await response.json();
      return data.responseData.translatedText || "Significato non trovato";
    } catch { return "Errore API"; }
  };

  const handleAnalysis = async () => {
    if (!inputPhrase.trim()) return;
    setIsAnalyzing(true);
    const cleanedWords = inputPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/).filter(w => w.length >= 3);
    const uniqueWords = [...new Set(cleanedWords)];
    let newWords = [...words];
    let lastToPop = null;

    for (const word of uniqueWords) {
      const existingIdx = newWords.findIndex(w => w.term === word);
      if (existingIdx > -1) {
        const updatedFreq = newWords[existingIdx].frequency + 1;
        newWords[existingIdx] = { ...newWords[existingIdx], frequency: updatedFreq, lastUpdated: new Date().toISOString() };
        if (updatedFreq <= 10) lastToPop = { term: word, meaning: newWords[existingIdx].meaning };
      } else {
        const meaning = await translateWord(word);
        const newEntry = { id: word, term: word, meaning: meaning, frequency: 1, lastUpdated: new Date().toISOString() };
        newWords.push(newEntry);
        lastToPop = { term: word, meaning: meaning };
      }
    }
    setWords(newWords);
    if (lastToPop) setActivePopupWord(lastToPop);
    setInputPhrase("");
    setIsAnalyzing(false);
  };

  const handleIncrement = (id) => {
    const wordObj = words.find(w => w.id === id);
    if (!wordObj) return;
    const newFreq = wordObj.frequency + 1;
    const newWords = words.map(w => w.id === id ? { ...w, frequency: newFreq, lastUpdated: new Date().toISOString() } : w);
    setWords(newWords);
    if (newFreq <= 10) setActivePopupWord({ term: wordObj.term, meaning: wordObj.meaning });
  };

  const handleDecrement = (id) => {
    const existing = words.find(w => w.id === id);
    if (!existing) return;
    if (existing.frequency > 1) {
      setWords(words.map(w => w.id === id ? { ...w, frequency: existing.frequency - 1 } : w));
    } else {
      setWords(words.filter(w => w.id !== id));
    }
  };

  const filteredList = useMemo(() => {
    return words.filter(w => w.term.toLowerCase().includes(searchQuery.toLowerCase()) || w.meaning.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => b.frequency - a.frequency);
  }, [words, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-44 font-sans overflow-x-hidden">
      <header className="bg-[#0F172A] pt-12 pb-6 px-6 text-white shadow-lg sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-800">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center drop-shadow-md">
              <AppIcon className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">Vocab Pro</h1>
              <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mt-1">Language Lab</p>
            </div>
          </div>
          <button onClick={() => setShowInstallGuide(true)} className="p-2.5 bg-slate-800 rounded-full active:scale-90 transition-all text-blue-400 border border-slate-700">
            <Download size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-2xl border border-slate-700">
          {Object.entries(LANGUAGES_MAP).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => setSelectedLang(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                selectedLang === key ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="hidden xs:inline">{lang.name}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 flex-1 max-w-lg mx-auto w-full space-y-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 pb-1">
            <textarea
              ref={textareaRef}
              placeholder={`Scrivi una frase in ${LANGUAGES_MAP[selectedLang]?.name?.toLowerCase()}...`}
              className="w-full bg-slate-50 rounded-2xl p-4 border-none focus:ring-0 text-lg resize-none outline-none h-32"
              value={inputPhrase}
              onChange={(e) => setInputPhrase(e.target.value)}
            />
          </div>

          <div className="h-12 bg-white border-t border-slate-100 flex items-center px-4 gap-2 overflow-x-auto no-scrollbar">
            {suggestions.length > 0 ? suggestions.map(s => (
              <button key={s.id} onClick={() => applySuggestion(s.term)} className="whitespace-nowrap bg-blue-50 text-blue-600 text-[11px] font-black uppercase px-4 py-2 rounded-full flex items-center gap-1.5 border border-blue-100">
                <Sparkles size={12} className="text-blue-400" /> {s.term}
              </button>
            )) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest ml-4">Suggerimenti attivi</span>}
          </div>

          <div className="p-3">
            <button onClick={handleAnalysis} disabled={isAnalyzing || !inputPhrase.trim()} className="w-full bg-[#3B82F6] text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-100">
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Plus size={20} />} Analizza Dizionario
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-slate-400">
              <BarChart2 size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Dizionario {LANGUAGES_MAP[selectedLang]?.name}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{words.length} Parole</span>
          </div>
          
          <div className="space-y-2">
            {filteredList.filter(w => w.frequency >= 3).map(w => (
              <SwipeableCard key={w.id} item={w} onDecrement={() => handleDecrement(w.id)} onIncrement={() => handleIncrement(w.id)} />
            ))}
          </div>

          {filteredList.filter(w => w.frequency < 3).length > 0 && (
            <div className="pt-2">
              <button onClick={() => setShowLowFreq(!showLowFreq)} className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Parole meno studiate ({filteredList.filter(w => w.frequency < 3).length})</span>
                {showLowFreq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showLowFreq && <div className="mt-2 space-y-2">{filteredList.filter(w => w.frequency < 3).map(w => (
                <SwipeableCard key={w.id} item={w} onDecrement={() => handleDecrement(w.id)} onIncrement={() => handleIncrement(w.id)} />
              ))}</div>}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-12 z-40">
        <div className="max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Filtra il tuo dizionario..." className="w-full bg-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 border-none focus:ring-2 focus:ring-blue-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </footer>

      {activePopupWord && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-200 border-t-[12px] border-blue-500">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-blue-600"><BookOpen size={48} /></div>
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Memoria Attiva</h2>
              <div className="text-4xl font-black text-slate-900 capitalize tracking-tight">{activePopupWord.term}</div>
              <p className="text-2xl text-slate-500 font-bold italic">"{activePopupWord.meaning}"</p>
            </div>
            <button onClick={() => setActivePopupWord(null)} className="w-full py-5 bg-[#0F172A] text-white rounded-[1.5rem] font-black uppercase text-sm">Ho capito</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeableCard({ item, onDecrement, onIncrement }) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const threshold = 80;

  const handleEnd = () => {
    isDragging.current = false;
    if (offset < -threshold) {
      if (item.frequency <= 1) { setOffset(-window.innerWidth); setTimeout(onDecrement, 200); }
      else { onDecrement(); setOffset(0); }
    } else if (offset > threshold) { onIncrement(); setOffset(0); }
    else { setOffset(0); }
  };

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-200">
      <div className="absolute inset-y-0 right-0 w-full bg-red-600 flex items-center justify-end px-8 text-white">
        <div className="flex flex-col items-center">
          {item.frequency <= 1 ? <Trash2 size={24} /> : <MinusCircle size={24} />}
          <span className="text-[10px] font-black uppercase mt-2 tracking-widest">{item.frequency <= 1 ? 'Elimina' : '-1'}</span>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-full bg-emerald-500 flex items-center justify-start px-8 text-white">
        <div className="flex flex-col items-center"><CheckCircle2 size={24} /><span className="text-[10px] font-black uppercase mt-2 tracking-widest">+1</span></div>
      </div>
      <div 
        className="relative bg-white p-5 flex justify-between items-center transition-transform duration-200 ease-out touch-pan-y cursor-grab"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; isDragging.current = true; }}
        onTouchMove={(e) => { if(isDragging.current) setOffset(e.touches[0].clientX - startX.current); }}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => { startX.current = e.clientX; isDragging.current = true; }}
        onMouseMove={(e) => { if(isDragging.current) setOffset(e.clientX - startX.current); }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div className="select-none flex-1 pr-4">
          <h3 className="font-black text-slate-800 text-lg capitalize tracking-tight leading-tight">{item.term}</h3>
          <p className="text-slate-400 text-sm font-medium italic mt-1">"{item.meaning}"</p>
        </div>
        <div className="bg-blue-50 text-[#3B82F6] w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border border-blue-100">{item.frequency}</div>
      </div>
    </div>
  );
}