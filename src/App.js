import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, BarChart2, ChevronDown, ChevronUp, Loader2, Languages, Trash2, Download, X, CheckCircle2, MinusCircle, BookOpen, Sparkles, Globe, Moon, Sun, Edit2, GraduationCap, RotateCcw, HelpCircle } from 'lucide-react';

// --- CONFIGURAZIONE PWA ---
const setupPWA = () => {
  // Lasciamo che index.html gestisca le icone statiche
};

// Mappa delle traduzioni dell'interfaccia (I18n)
const UI_STRINGS = {
  es: {
    subtitle: "Laboratorio de Idiomas",
    placeholder: "Escribe una frase en español...",
    btnAnalyze: "Analizar Diccionario",
    dictLabel: "Diccionario",
    words: "Palabras",
    lessUsed: "Menos estudiadas",
    searchPlaceholder: "Filtrar diccionario...",
    popupTitle: "Memoria Activa",
    popupButton: "Entendido",
    install: "Instalar",
    autoType: "Escritura asistida",
    learned: "Palabras aprendidas",
    markLearned: "Marcar como aprendida",
    noLearned: "Aún no hay palabras aprendidas",
    unmarkLearned: "Devolver a estudio",
    tut1Title: "¡Bienvenido a Vocab Pro!",
    tut1Desc: "Escribe una frase y extraeremos y traduciremos las palabras automáticamente para ti.",
    tut2Title: "Desliza a la Derecha",
    tut2Desc: "Desliza una tarjeta hacia la derecha para aumentar su frecuencia de estudio (+1).",
    tut3Title: "Desliza a la Izquierda",
    tut3Desc: "Desliza hacia la izquierda para restar frecuencia o eliminar la palabra si ya no la necesitas.",
    tut4Title: "Edita y Aprende",
    tut4Desc: "Toca el significado para editarlo manualmente. ¡Llega a 70 vistas para marcar la palabra como aprendida!",
    tutNext: "Siguiente",
    tutPrev: "Anterior",
    tutFinish: "¡Empezar!"
  },
  en: {
    subtitle: "Language Lab",
    placeholder: "Write a sentence in English...",
    btnAnalyze: "Analyze Dictionary",
    dictLabel: "Dictionary",
    words: "Words",
    lessUsed: "Less studied",
    searchPlaceholder: "Filter dictionary...",
    popupTitle: "Active Memory",
    popupButton: "Got it",
    install: "Install",
    autoType: "Smart typing",
    learned: "Learned Words",
    markLearned: "Mark as learned",
    noLearned: "No learned words yet",
    unmarkLearned: "Return to study",
    tut1Title: "Welcome to Vocab Pro!",
    tut1Desc: "Write a sentence and we will automatically extract and translate the words for you.",
    tut2Title: "Swipe Right",
    tut2Desc: "Swipe a card to the right to increase its study frequency (+1).",
    tut3Title: "Swipe Left",
    tut3Desc: "Swipe left to decrease the frequency or delete the word if you no longer need it.",
    tut4Title: "Edit & Learn",
    tut4Desc: "Tap the meaning to edit it manually. Reach 70 views to mark the word as learned!",
    tutNext: "Next",
    tutPrev: "Back",
    tutFinish: "Start!"
  },
  fr: {
    subtitle: "Labo de Langues",
    placeholder: "Écrivez une phrase en français...",
    btnAnalyze: "Analyser le dictionnaire",
    dictLabel: "Dictionnaire",
    words: "Mots",
    lessUsed: "Moins étudiés",
    searchPlaceholder: "Filtrer le dictionnaire...",
    popupTitle: "Mémoire Active",
    popupButton: "J'ai compris",
    install: "Installer",
    autoType: "Saisie assistée",
    learned: "Mots appris",
    markLearned: "Marquer comme appris",
    noLearned: "Pas encore de mots appris",
    unmarkLearned: "Retourner à l'étude",
    tut1Title: "Bienvenue sur Vocab Pro !",
    tut1Desc: "Écrivez une phrase et nous extrairons et traduirons automatiquement les mots pour vous.",
    tut2Title: "Glissez à Droite",
    tut2Desc: "Glissez une carte vers la droite pour augmenter sa fréquence d'étude (+1).",
    tut3Title: "Glissez à Gauche",
    tut3Desc: "Glissez vers la gauche pour réduire la fréquence ou supprimer le mot.",
    tut4Title: "Éditer et Apprendre",
    tut4Desc: "Appuyez sur la traduction pour la modifier. Atteignez 70 vues pour marquer le mot comme appris !",
    tutNext: "Suivant",
    tutPrev: "Retour",
    tutFinish: "Commencer !"
  },
  it: {
    subtitle: "Laboratorio Linguistico",
    placeholder: "Scrivi una frase in italiano...",
    btnAnalyze: "Analizza Dizionario",
    dictLabel: "Dizionario",
    words: "Parole",
    lessUsed: "Meno studiate",
    searchPlaceholder: "Filtra il dizionario...",
    popupTitle: "Memoria Attiva",
    popupButton: "Ho capito",
    install: "Installa",
    autoType: "Scrittura assistita",
    learned: "Parole imparate",
    markLearned: "Segna come imparata",
    noLearned: "Nessuna parola imparata",
    unmarkLearned: "Riporta allo studio",
    tut1Title: "Benvenuto in Vocab Pro!",
    tut1Desc: "Scrivi una frase e noi estrarremo e tradurremo automaticamente le parole per te.",
    tut2Title: "Scorri a Destra",
    tut2Desc: "Scorri una card verso destra per aumentare la sua frequenza di studio (+1).",
    tut3Title: "Scorri a Sinistra",
    tut3Desc: "Scorri verso sinistra per ridurre la frequenza o eliminare la parola se non ti serve più.",
    tut4Title: "Modifica e Impara",
    tut4Desc: "Tocca il significato per modificarlo manualmente. Raggiungi 70 visualizzazioni per segnare la parola come imparata!",
    tutNext: "Avanti",
    tutPrev: "Indietro",
    tutFinish: "Inizia!"
  },
  tr: {
    subtitle: "Dil Laboratuvarı",
    placeholder: "Türkçe bir cümle yazın...",
    btnAnalyze: "Sözlüğü Analiz Et",
    dictLabel: "Sözlük",
    words: "Kelime",
    lessUsed: "Daha az çalışılanlar",
    searchPlaceholder: "Sözlükte filtrele...",
    popupTitle: "Aktif Bellek",
    popupButton: "Anladım",
    install: "Yükle",
    autoType: "Destekli yazım",
    learned: "Öğrenilen Kelimeler",
    markLearned: "Öğrenildi olarak işaretle",
    noLearned: "Henüz öğrenilen kelime yok",
    unmarkLearned: "Çalışmaya geri dön",
    tut1Title: "Vocab Pro'ya Hoş Geldiniz!",
    tut1Desc: "Bir cümle yazın, kelimeleri sizin için otomatik olarak çıkarıp çevirelim.",
    tut2Title: "Sağa Kaydır",
    tut2Desc: "Çalışma sıklığını artırmak için bir kartı sağa kaydırın (+1).",
    tut3Title: "Sola Kaydır",
    tut3Desc: "Sıklığı azaltmak veya kelimeyi silmek için sola kaydırın.",
    tut4Title: "Düzenle ve Öğren",
    tut4Desc: "Manuel düzenlemek için anlama dokunun. Kelimeyi öğrenildi işaretlemek için 70 görüntülemeye ulaşın!",
    tutNext: "İleri",
    tutPrev: "Geri",
    tutFinish: "Başla!"
  }
};

const LANGUAGES_MAP = {
  es: { name: 'Español', flag: '🇪🇸', code: 'es' },
  en: { name: 'English', flag: '🇬🇧', code: 'en' },
  fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
  it: { name: 'Italiano', flag: '🇮🇹', code: 'it' },
  tr: { name: 'Türkçe', flag: '🇹🇷', code: 'tr' }
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
    return localStorage.getItem('vocab_pro_lang') || null; 
  });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('vocab_pro_theme') === 'dark');
  const [words, setWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [inputPhrase, setInputPhrase] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLowFreq, setShowLowFreq] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showLearnedModal, setShowLearnedModal] = useState(false);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activePopupWord, setActivePopupWord] = useState(null);
  const [locationData, setLocationData] = useState(null);
  
  const textareaRef = useRef(null);
  
  const t = UI_STRINGS[selectedLang] || UI_STRINGS.es;

  useEffect(() => {
    setupPWA();
    
    const initApp = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setLocationData(data);

        if (!selectedLang) {
          const mapping = { 'ES': 'es', 'GB': 'en', 'US': 'en', 'FR': 'fr', 'IT': 'it', 'TR': 'tr' };
          const defaultLang = mapping[data.country_code] || 'en'; 
          setSelectedLang(defaultLang);
          localStorage.setItem('vocab_pro_lang', defaultLang);
        }
        
        const hour = new Date().getHours();
        if ((hour >= 20 || hour <= 7) && !localStorage.getItem('vocab_pro_theme')) {
          setIsDarkMode(true);
        }
      } catch (err) {
        console.warn("Location API unavailable.");
        if (!selectedLang) {
             setSelectedLang('es');
             localStorage.setItem('vocab_pro_lang', 'es');
        }
      }
    };
    initApp();
  }, [selectedLang]);

  useEffect(() => {
    if (selectedLang) {
      const saved = localStorage.getItem(`vocab_words_${selectedLang}`);
      setWords(saved ? JSON.parse(saved) : []);
      
      const savedLearned = localStorage.getItem(`vocab_learned_${selectedLang}`);
      setLearnedWords(savedLearned ? JSON.parse(savedLearned) : []);

      localStorage.setItem('vocab_pro_lang', selectedLang);
    }
  }, [selectedLang]);

  useEffect(() => {
    if (selectedLang) {
      localStorage.setItem(`vocab_words_${selectedLang}`, JSON.stringify(words));
      localStorage.setItem(`vocab_learned_${selectedLang}`, JSON.stringify(learnedWords));
    }
  }, [words, learnedWords, selectedLang]);

  useEffect(() => {
    localStorage.setItem('vocab_pro_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
      const target = selectedLang === 'it' ? 'en' : 'it';
      const pair = `${selectedLang}|${target}`;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${pair}`);
      const data = await response.json();
      return data.responseData.translatedText || "???";
    } catch { return "Error"; }
  };

  const handleAnalysis = async () => {
    if (!inputPhrase.trim()) return;
    setIsAnalyzing(true);
    const cleanedWords = inputPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/).filter(w => w.length >= 3);
    const uniqueWords = [...new Set(cleanedWords)];
    let newWords = [...words];
    let lastToPop = null;

    for (const word of uniqueWords) {
      if (learnedWords.some(w => w.term === word)) {
          continue;
      }

      const existingIdx = newWords.findIndex(w => w.term === word);
      if (existingIdx > -1) {
        const updatedFreq = newWords[existingIdx].frequency + 1;
        newWords[existingIdx] = { ...newWords[existingIdx], frequency: updatedFreq, lastUpdated: new Date().toISOString() };
        if (updatedFreq <= 10) lastToPop = { term: word, meaning: newWords[existingIdx].meaning };
      } else {
        const meaning = await translateWord(word);
        const newEntry = { id: word, term: word, meaning: meaning, frequency: 1, isManuallyEdited: false, lastUpdated: new Date().toISOString() };
        newWords.push(newEntry);
        lastToPop = { term: word, meaning: meaning };
      }
    }
    setWords(newWords);
    if (lastToPop) setActivePopupWord(lastToPop);
    setInputPhrase("");
    setIsAnalyzing(false);
  };

  const handleEditMeaning = (id, newMeaning) => {
    setWords(words.map(w => w.id === id ? { ...w, meaning: newMeaning, isManuallyEdited: true } : w));
  };

  const handleMarkLearned = (item) => {
    setWords(words.filter(w => w.id !== item.id));
    setLearnedWords([item, ...learnedWords]);
  };

  const handleUnmarkLearned = (item) => {
    setLearnedWords(learnedWords.filter(w => w.id !== item.id));
    setWords([item, ...words]);
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

  // Array dei contenuti del Tutorial
  const tutorialData = [
    { title: t.tut1Title, desc: t.tut1Desc, icon: <Languages size={48} className="text-[#3B82F6]" /> },
    { title: t.tut2Title, desc: t.tut2Desc, icon: <CheckCircle2 size={48} className="text-emerald-500" /> },
    { title: t.tut3Title, desc: t.tut3Desc, icon: <MinusCircle size={48} className="text-red-500" /> },
    { title: t.tut4Title, desc: t.tut4Desc, icon: <Edit2 size={48} className="text-yellow-500" /> }
  ];

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0b101b] text-slate-200' : 'bg-slate-50 text-slate-900'} pb-44 font-sans overflow-x-hidden`}>
      <header className="bg-[#0F172A] pt-12 pb-6 px-4 text-white shadow-lg sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-800">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center drop-shadow-lg shrink-0">
              <AppIcon className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight leading-none uppercase italic truncate">Vocab Pro</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest shrink-0">{t.subtitle}</p>
                {locationData && <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 truncate">{locationData.city}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => { setTutorialStep(0); setShowTutorial(true); }} className="p-2.5 bg-slate-800 rounded-full text-slate-300 hover:text-white border border-slate-700 active:scale-90 transition-all">
              <HelpCircle size={18} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 bg-slate-800 rounded-full text-yellow-400 border border-slate-700 active:scale-90 transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setShowInstallGuide(true)} className="p-2.5 bg-slate-800 rounded-full text-blue-400 border border-slate-700 active:scale-90 transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto no-scrollbar">
          {Object.entries(LANGUAGES_MAP).map(([key, lang]) => (
            <button 
              key={key} 
              onClick={() => setSelectedLang(key)} 
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl transition-all ${selectedLang === key ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter text-center">{lang.name}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 flex-1 max-w-lg mx-auto w-full space-y-6">
        <div className={`rounded-[2rem] shadow-xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-6 pb-2">
            <textarea
              ref={textareaRef}
              placeholder={t.placeholder}
              className={`w-full rounded-2xl p-5 border-none focus:ring-0 text-lg resize-none outline-none h-32 transition-colors ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
              value={inputPhrase}
              onChange={(e) => setInputPhrase(e.target.value)}
            />
          </div>

          <div className={`h-12 border-t flex items-center px-4 gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            {suggestions.length > 0 ? suggestions.map(s => (
              <button key={s.id} onClick={() => applySuggestion(s.term)} className="whitespace-nowrap bg-blue-500/10 text-blue-400 text-[11px] font-black uppercase px-4 py-2 rounded-full flex items-center gap-1.5 border border-blue-500/20">
                <Sparkles size={12} /> {s.term}
              </button>
            )) : <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-2">{t.autoType}</span>}
          </div>

          <div className="p-4">
            <button onClick={handleAnalysis} disabled={isAnalyzing || !inputPhrase.trim() || !selectedLang} className="w-full bg-[#3B82F6] text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Plus size={20} />} {t.btnAnalyze}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-slate-500">
              <BarChart2 size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.dictLabel} {selectedLang ? LANGUAGES_MAP[selectedLang].name : ''}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full uppercase">{words.length} {t.words}</span>
          </div>
          
          <div className="space-y-3">
            {filteredList.filter(w => w.frequency >= 3).map(w => (
              <SwipeableCard 
                key={w.id} 
                item={w} 
                isDarkMode={isDarkMode} 
                onDecrement={() => handleDecrement(w.id)} 
                onIncrement={() => handleIncrement(w.id)} 
                onEdit={handleEditMeaning}
                onMarkLearned={handleMarkLearned}
                t={t}
              />
            ))}
          </div>

          {filteredList.filter(w => w.frequency < 3).length > 0 && (
            <div className="pt-2">
              <button onClick={() => setShowLowFreq(!showLowFreq)} className={`flex items-center justify-between w-full p-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                <span>{t.lessUsed} ({filteredList.filter(w => w.frequency < 3).length})</span>
                {showLowFreq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showLowFreq && <div className="mt-2 space-y-3">{filteredList.filter(w => w.frequency < 3).map(w => (
                <SwipeableCard 
                   key={w.id} 
                   item={w} 
                   isDarkMode={isDarkMode} 
                   onDecrement={() => handleDecrement(w.id)} 
                   onIncrement={() => handleIncrement(w.id)} 
                   onEdit={handleEditMeaning}
                   onMarkLearned={handleMarkLearned}
                   t={t}
                />
              ))}</div>}
            </div>
          )}
        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 border-t p-4 pb-12 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors ${isDarkMode ? 'bg-[#0b101b]/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-lg mx-auto space-y-2">
          {searchSuggestions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
              {searchSuggestions.map(s => (
                <button key={s.id} onClick={() => {setSearchQuery(s.term); setSearchSuggestions([]);}} className="whitespace-nowrap bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-blue-500/20">{s.term}</button>
              ))}
            </div>
          )}
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => setShowLearnedModal(true)} 
              className={`p-4 rounded-[1.5rem] shrink-0 transition-colors flex items-center justify-center ${learnedWords.length > 0 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20' : isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}
            >
               <div className="relative">
                 <GraduationCap size={20} />
                 {learnedWords.length > 0 && (
                   <span className="absolute -top-2.5 -right-2.5 bg-[#3B82F6] text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-[2px] border-yellow-400">
                     {learnedWords.length}
                   </span>
                 )}
               </div>
            </button>

            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-5 text-slate-500 pointer-events-none" size={18} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                className={`w-full rounded-[1.5rem] py-4 pl-14 pr-12 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchSuggestions([]); }}
                  className="absolute right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 bg-slate-200 dark:bg-slate-700 transition-colors"
                  aria-label="Cancella ricerca"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* POPUP TUTORIAL A STEP */}
      {showTutorial && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[70] flex items-center justify-center p-6">
          <div className={`rounded-[3rem] w-full max-w-sm p-10 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-200 relative ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <button onClick={() => setShowTutorial(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-90 transition-all">
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <div className={`p-6 rounded-full shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                 {tutorialData[tutorialStep].icon}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {tutorialData[tutorialStep].title}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                {tutorialData[tutorialStep].desc}
              </p>
            </div>

            {/* Indicatori Step */}
            <div className="flex justify-center gap-2 py-2">
              {tutorialData.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${tutorialStep === idx ? 'w-6 bg-[#3B82F6]' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} />
              ))}
            </div>

            {/* Navigazione */}
            <div className="flex gap-3 pt-2">
              {tutorialStep > 0 && (
                <button onClick={() => setTutorialStep(prev => prev - 1)} className={`py-4 px-6 rounded-[1.5rem] font-bold uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t.tutPrev}
                </button>
              )}
              <button 
                onClick={() => {
                  if (tutorialStep < tutorialData.length - 1) {
                    setTutorialStep(prev => prev + 1);
                  } else {
                    setShowTutorial(false);
                  }
                }} 
                className="flex-1 py-4 bg-[#3B82F6] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-500/40"
              >
                {tutorialStep < tutorialData.length - 1 ? t.tutNext : t.tutFinish}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP PAROLE IMPARATE */}
      {showLearnedModal && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[60] flex flex-col p-4 pb-20 overflow-y-auto">
          <div className="max-w-lg w-full mx-auto space-y-6">
            <div className="flex justify-between items-center bg-yellow-400 p-6 rounded-[2rem] shadow-xl text-yellow-950 mt-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/30 p-3 rounded-2xl"><GraduationCap size={28} /></div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">{t.learned}</h2>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{learnedWords.length} {t.words}</p>
                </div>
              </div>
              <button onClick={() => setShowLearnedModal(false)} className="bg-yellow-900/10 p-3 rounded-full hover:bg-yellow-900/20 active:scale-90 transition-all"><X size={20} /></button>
            </div>

            {learnedWords.length === 0 ? (
               <div className="text-center py-20 text-slate-500 font-bold italic">{t.noLearned}</div>
            ) : (
              <div className="space-y-3 pb-10">
                {learnedWords.map(w => (
                  <div key={w.id} className={`flex justify-between items-center p-5 rounded-[1.5rem] shadow-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                     <div>
                        <h3 className={`font-black text-lg capitalize tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{w.term}</h3>
                        <p className="text-slate-500 text-sm font-medium italic mt-1">"{w.meaning}"</p>
                     </div>
                     <button onClick={() => handleUnmarkLearned(w)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-blue-500 active:scale-90 transition-all">
                       <RotateCcw size={18} />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activePopupWord && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className={`rounded-[3rem] w-full max-w-sm p-10 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-200 border-t-[12px] border-blue-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="bg-blue-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-blue-500 shadow-inner"><BookOpen size={48} /></div>
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{t.popupTitle}</h2>
              <div className={`text-4xl font-black capitalize tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activePopupWord.term}</div>
              <p className="text-2xl text-slate-500 font-bold italic leading-tight">"{activePopupWord.meaning}"</p>
            </div>
            <button onClick={() => setActivePopupWord(null)} className="w-full py-5 bg-[#3B82F6] text-white rounded-[1.5rem] font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-500/40">{t.popupButton}</button>
          </div>
        </div>
      )}

      {showInstallGuide && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className={`rounded-[2.5rem] w-full max-w-sm p-8 space-y-6 animate-in slide-in-from-bottom duration-300 shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center border-b border-slate-100/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center shadow-lg"><Plus size={20} className="text-white" /></div>
                <h2 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{t.install}</h2>
              </div>
              <button onClick={() => setShowInstallGuide(false)} className="text-slate-500 p-2 hover:text-slate-600 active:scale-90 transition-all"><X /></button>
            </div>
            <div className="space-y-4">
              <div className={`p-5 rounded-[1.5rem] border text-xs flex items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black shrink-0">iOS</div>
                <p className="font-bold tracking-tight leading-relaxed">Safari &rarr; <Globe size={14} className="inline mx-1"/> Condividi &rarr; <strong>Aggiungi a Home</strong></p>
              </div>
              <div className={`p-5 rounded-[1.5rem] border text-xs flex items-center gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black shrink-0">AND</div>
                <p className="font-bold tracking-tight leading-relaxed">Chrome &rarr; Menu &rarr; <strong>Installa App</strong></p>
              </div>
            </div>
            <button onClick={() => setShowInstallGuide(false)} className="w-full py-5 bg-[#3B82F6] text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">{t.popupButton}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeableCard({ item, isDarkMode, onDecrement, onIncrement, onEdit, onMarkLearned, t }) {
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.meaning);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const threshold = 80;

  const handleStart = (clientX) => {
    startX.current = clientX;
    isDragging.current = true;
    setIsSwiping(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;
    setOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsSwiping(false);
    if (offset < -threshold) {
      if (item.frequency <= 1) { setOffset(-window.innerWidth); setTimeout(onDecrement, 200); }
      else { onDecrement(); setOffset(0); }
    } else if (offset > threshold) { onIncrement(); setOffset(0); }
    else { setOffset(0); }
  };

  const saveEdit = () => {
    setIsEditing(false);
    if (editValue.trim() !== "" && editValue !== item.meaning) {
      onEdit(item.id, editValue);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-[1.8rem] shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-100'}`}>
      
      {/* Sfondo Dinamico in base alla direzione dello swipe (appare solo se l'offset non è 0) */}
      <div className={`absolute inset-0 flex items-center px-8 text-white ${offset > 0 ? 'bg-emerald-500 justify-start' : offset < 0 ? 'bg-red-600 justify-end' : 'opacity-0'}`}>
        {offset > 0 ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 size={24} />
            <span className="text-[10px] font-black uppercase mt-2 tracking-widest">+1</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {item.frequency <= 1 ? <Trash2 size={24} /> : <MinusCircle size={24} />}
            <span className="text-[10px] font-black uppercase mt-2 tracking-widest">
              {item.frequency <= 1 ? 'Elimina' : '-1'}
            </span>
          </div>
        )}
      </div>

      <div 
        className={`relative p-6 flex flex-col justify-between ease-out touch-pan-y cursor-grab ${!isSwiping ? 'transition-transform duration-200' : ''} ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div className="flex justify-between items-center w-full">
          <div className="select-none flex-1 pr-4">
            <h3 className="font-black text-xl capitalize tracking-tight leading-tight flex items-center gap-2">
               {item.term}
               {item.isManuallyEdited && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" title="Modificata manualmente"></span>}
            </h3>
            
            {isEditing ? (
              <input 
                 autoFocus
                 type="text" 
                 value={editValue} 
                 onChange={(e) => setEditValue(e.target.value)}
                 onBlur={saveEdit}
                 onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                 onMouseDown={(e) => e.stopPropagation()}
                 onTouchStart={(e) => e.stopPropagation()}
                 className={`mt-1 w-full text-sm font-medium italic border-b-2 outline-none bg-transparent ${isDarkMode ? 'border-blue-500 text-slate-300' : 'border-blue-500 text-slate-600'}`}
              />
            ) : (
              <p 
                 onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                 className="text-slate-500 text-sm font-medium italic mt-1 leading-tight cursor-text flex items-center gap-1.5 group"
              >
                "{item.meaning}"
                <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border shadow-inner shrink-0 transition-all ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#3B82F6] border-blue-100'}`}>
            {item.frequency}
          </div>
        </div>

        {/* Pulsante "Segna come imparata" visibile dopo 70 visualizzazioni */}
        {item.frequency > 70 && (
           <button 
             onMouseDown={(e) => e.stopPropagation()}
             onTouchStart={(e) => e.stopPropagation()}
             onClick={() => onMarkLearned(item)}
             className="mt-4 w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
           >
              <GraduationCap size={18} /> {t.markLearned}
           </button>
        )}
      </div>
    </div>
  );
}