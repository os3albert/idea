import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, BarChart2, ChevronDown, ChevronUp, Loader2, Languages, Trash2, Download, X, CheckCircle2, MinusCircle, BookOpen, Sparkles, Globe, Moon, Sun, Edit2, GraduationCap, RotateCcw, HelpCircle, Settings, Upload, Type, AlignLeft } from 'lucide-react';

// --- CONFIGURAZIONE PWA ---
const setupPWA = () => {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
};

// Mappa delle traduzioni dell'interfaccia (I18n)
const UI_STRINGS = {
  es: {
    subtitle: "Laboratorio de Idiomas",
    placeholderWord: "Escribe para extraer palabras...",
    placeholderPhrase: "Escribe una frase completa...",
    btnAnalyzeWord: "Extraer Palabras",
    btnAnalyzePhrase: "Traducir Frase",
    dictLabel: "Diccionario",
    words: "Elementos",
    lessUsed: "Menos estudiados",
    searchPlaceholder: "Filtrar diccionario...",
    popupTitle: "Memoria Activa",
    popupButton: "Entendido",
    install: "Instalar",
    autoType: "Sugerencias",
    learned: "Aprendidas",
    markLearned: "Marcar como aprendida",
    noLearned: "Aún no hay palabras aprendidas",
    unmarkLearned: "Devolver a estudio",
    tut1Title: "¡Bienvenido!",
    tut1Desc: "Escribe una frase y extraeremos o traduciremos las palabras automáticamente.",
    tut2Title: "Desliza a la Derecha",
    tut2Desc: "Aumenta la frecuencia de estudio (+1).",
    tut3Title: "Desliza a la Izquierda",
    tut3Desc: "Reduce la frecuencia o elimina la palabra.",
    tut4Title: "Edita y Aprende",
    tut4Desc: "Toca el significado para editarlo manualmente. ¡Llega a 70 vistas para aprenderla!",
    tutNext: "Siguiente",
    tutPrev: "Anterior",
    tutFinish: "¡Empezar!",
    settings: "Ajustes",
    export: "Exportar Datos",
    import: "Importar Datos",
    importSuccess: "¡Datos importados con éxito!",
    importError: "Error al importar el archivo.",
    wordMode: "Palabras",
    phraseMode: "Frase",
    targetLang: "Idioma de Traducción",
    synonyms: "Sinónimos"
  },
  en: {
    subtitle: "Language Lab",
    placeholderWord: "Type to extract words...",
    placeholderPhrase: "Type a complete phrase...",
    btnAnalyzeWord: "Extract Words",
    btnAnalyzePhrase: "Translate Phrase",
    dictLabel: "Dictionary",
    words: "Items",
    lessUsed: "Less studied",
    searchPlaceholder: "Filter dictionary...",
    popupTitle: "Active Memory",
    popupButton: "Got it",
    install: "Install",
    autoType: "Suggestions",
    learned: "Learned",
    markLearned: "Mark as learned",
    noLearned: "No learned items yet",
    unmarkLearned: "Return to study",
    tut1Title: "Welcome!",
    tut1Desc: "Type a sentence and we will automatically extract and translate the words.",
    tut2Title: "Swipe Right",
    tut2Desc: "Increase study frequency (+1).",
    tut3Title: "Swipe Left",
    tut3Desc: "Decrease frequency or delete the word.",
    tut4Title: "Edit & Learn",
    tut4Desc: "Tap the meaning to edit it. Reach 70 views to mark it as learned!",
    tutNext: "Next",
    tutPrev: "Back",
    tutFinish: "Start!",
    settings: "Settings",
    export: "Export Data",
    import: "Import Data",
    importSuccess: "Data imported successfully!",
    importError: "Error importing file.",
    wordMode: "Words",
    phraseMode: "Phrase",
    targetLang: "Translation Language",
    synonyms: "Synonyms"
  },
  fr: {
    subtitle: "Labo de Langues",
    placeholderWord: "Écrivez pour extraire des mots...",
    placeholderPhrase: "Écrivez une phrase complète...",
    btnAnalyzeWord: "Extraire les Mots",
    btnAnalyzePhrase: "Traduire la Phrase",
    dictLabel: "Dictionnaire",
    words: "Éléments",
    lessUsed: "Moins étudiés",
    searchPlaceholder: "Filtrer...",
    popupTitle: "Mémoire Active",
    popupButton: "J'ai compris",
    install: "Installer",
    autoType: "Suggestions",
    learned: "Appris",
    markLearned: "Marquer comme appris",
    noLearned: "Pas encore d'éléments appris",
    unmarkLearned: "Retourner à l'étude",
    tut1Title: "Bienvenue !",
    tut1Desc: "Écrivez une phrase et nous extrairons et traduirons automatiquement.",
    tut2Title: "Glissez à Droite",
    tut2Desc: "Augmentez la fréquence d'étude (+1).",
    tut3Title: "Glissez à Gauche",
    tut3Desc: "Réduisez la fréquence ou supprimez le mot.",
    tut4Title: "Éditer et Apprendre",
    tut4Desc: "Appuyez sur la traduction pour modifier. Atteignez 70 vues pour apprendre !",
    tutNext: "Suivant",
    tutPrev: "Retour",
    tutFinish: "Commencer !",
    settings: "Paramètres",
    export: "Exporter",
    import: "Importer",
    importSuccess: "Importé avec succès !",
    importError: "Erreur lors de l'importation.",
    wordMode: "Mots",
    phraseMode: "Phrase",
    targetLang: "Langue de Traduction",
    synonyms: "Synonymes"
  },
  it: {
    subtitle: "Laboratorio Linguistico",
    placeholderWord: "Scrivi per estrarre parole...",
    placeholderPhrase: "Scrivi una frase intera...",
    btnAnalyzeWord: "Estrai Parole",
    btnAnalyzePhrase: "Traduci Frase",
    dictLabel: "Dizionario",
    words: "Elementi",
    lessUsed: "Meno studiati",
    searchPlaceholder: "Filtra dizionario...",
    popupTitle: "Memoria Attiva",
    popupButton: "Ho capito",
    install: "Installa",
    autoType: "Suggerimenti",
    learned: "Imparate",
    markLearned: "Segna come imparata",
    noLearned: "Nessun elemento imparato",
    unmarkLearned: "Riporta allo studio",
    tut1Title: "Benvenuto!",
    tut1Desc: "Scrivi una frase e noi estrarremo o tradurremo le parole per te.",
    tut2Title: "Scorri a Destra",
    tut2Desc: "Aumenta la frequenza di studio (+1).",
    tut3Title: "Scorri a Sinistra",
    tut3Desc: "Riduci la frequenza o elimina la parola.",
    tut4Title: "Modifica e Impara",
    tut4Desc: "Tocca il significato per modificarlo. Raggiungi 70 visualizzazioni per impararla!",
    tutNext: "Avanti",
    tutPrev: "Indietro",
    tutFinish: "Inizia!",
    settings: "Impostazioni",
    export: "Esporta Dati",
    import: "Importa Dati",
    importSuccess: "Dati importati con successo!",
    importError: "Errore durante l'importazione.",
    wordMode: "Parole",
    phraseMode: "Frase",
    targetLang: "Lingua di Traduzione",
    synonyms: "Sinonimi"
  },
  tr: {
    subtitle: "Dil Laboratuvarı",
    placeholderWord: "Kelime çıkarmak için yazın...",
    placeholderPhrase: "Tam bir cümle yazın...",
    btnAnalyzeWord: "Kelimeleri Çıkar",
    btnAnalyzePhrase: "Cümleyi Çevir",
    dictLabel: "Sözlük",
    words: "Öğeler",
    lessUsed: "Daha az çalışılanlar",
    searchPlaceholder: "Filtrele...",
    popupTitle: "Aktif Bellek",
    popupButton: "Anladım",
    install: "Yükle",
    autoType: "Öneriler",
    learned: "Öğrenilenler",
    markLearned: "Öğrenildi işaretle",
    noLearned: "Henüz öğrenilen yok",
    unmarkLearned: "Çalışmaya dön",
    tut1Title: "Hoş Geldiniz!",
    tut1Desc: "Yazın, kelimeleri otomatik çıkarıp çevirelim.",
    tut2Title: "Sağa Kaydır",
    tut2Desc: "Çalışma sıklığını artırın (+1).",
    tut3Title: "Sola Kaydır",
    tut3Desc: "Sıklığı azaltın veya silin.",
    tut4Title: "Düzenle ve Öğren",
    tut4Desc: "Düzenlemek için dokunun. Öğrenmek için 70'e ulaşın!",
    tutNext: "İleri",
    tutPrev: "Geri",
    tutFinish: "Başla!",
    settings: "Ayarlar",
    export: "Dışa Aktar",
    import: "İçe Aktar",
    importSuccess: "Başarıyla içe aktarıldı!",
    importError: "İçe aktarma hatası.",
    wordMode: "Kelimeler",
    phraseMode: "Cümle",
    targetLang: "Çeviri Dili",
    synonyms: "Eş Anlamlılar"
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

// Fetch Sinonimi via Datamuse API (Supporta EN, ES, FR, IT)
const fetchSynonyms = async (word, lang) => {
  if(!['en', 'es', 'fr', 'it'].includes(lang)) return [];
  try {
      const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&v=${lang}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data
        .map(d => d.word)
        .filter(w => w.toLowerCase() !== word.toLowerCase() && !w.includes(' '))
        .slice(0, 3);
  } catch {
      return [];
  }
};

export default function App() {
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('vocab_pro_lang') || null);
  const [targetLang, setTargetLang] = useState(() => localStorage.getItem('vocab_pro_target_lang') || 'it');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('vocab_pro_theme') === 'dark');
  const [isPhraseMode, setIsPhraseMode] = useState(false);
  
  const [words, setWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [inputPhrase, setInputPhrase] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLowFreq, setShowLowFreq] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showLearnedModal, setShowLearnedModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activePopupWord, setActivePopupWord] = useState(null);
  const [locationData, setLocationData] = useState(null);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const t = UI_STRINGS[selectedLang] || UI_STRINGS.es;

  // Blocco gesture di zoom per esperienza nativa
  useEffect(() => {
    const preventTouchZoom = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
    const preventGesture = (e) => e.preventDefault();

    document.addEventListener('touchmove', preventTouchZoom, { passive: false });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);

    return () => {
      document.removeEventListener('touchmove', preventTouchZoom);
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
    };
  }, []);

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
          
          const defaultTarget = defaultLang === 'it' ? 'en' : 'it';
          setTargetLang(defaultTarget);
          localStorage.setItem('vocab_pro_target_lang', defaultTarget);
        }
        
        const hour = new Date().getHours();
        if ((hour >= 20 || hour <= 7) && !localStorage.getItem('vocab_pro_theme')) {
          setIsDarkMode(true);
        }
      } catch (err) {
        if (!selectedLang) {
             setSelectedLang('es');
             setTargetLang('it');
             localStorage.setItem('vocab_pro_lang', 'es');
             localStorage.setItem('vocab_pro_target_lang', 'it');
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
    localStorage.setItem('vocab_pro_target_lang', targetLang);
  }, [targetLang]);

  useEffect(() => {
    localStorage.setItem('vocab_pro_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Suggerimenti Dinamici (Frase o Parola)
  useEffect(() => {
    if (!inputPhrase.trim()) {
      setSuggestions([]);
      return;
    }
    if (isPhraseMode) {
       const matches = words.filter(w => w.type === 'phrase' && w.term.toLowerCase().includes(inputPhrase.toLowerCase())).slice(0,3);
       setSuggestions(matches);
    } else {
      const lastWord = inputPhrase.split(/[\s,.]+/).pop().toLowerCase();
      if (lastWord.length > 1) {
        const matches = words.filter(w => w.type !== 'phrase' && w.term.startsWith(lastWord)).slice(0, 5);
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }
  }, [inputPhrase, words, isPhraseMode]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const matches = words.filter(w => w.term.startsWith(searchQuery.toLowerCase())).slice(0, 3);
      setSearchSuggestions(matches);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, words]);

  const applySuggestion = (fullWord) => {
    if (isPhraseMode) {
      setInputPhrase(fullWord);
    } else {
      const parts = inputPhrase.split(/\s+/);
      parts[parts.length - 1] = fullWord + " ";
      setInputPhrase(parts.join(" "));
    }
    setSuggestions([]);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const translateWord = async (text) => {
    if (selectedLang === targetLang) return text;
    try {
      const pair = `${selectedLang}|${targetLang}`;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`);
      const data = await response.json();
      return data.responseData.translatedText || "???";
    } catch { return "Error"; }
  };

  const handleAnalysis = async () => {
    if (!inputPhrase.trim()) return;
    setIsAnalyzing(true);
    let newWords = [...words];
    let lastToPop = null;

    if (isPhraseMode) {
       const phrase = inputPhrase.trim();
       if (learnedWords.some(w => w.term.toLowerCase() === phrase.toLowerCase())) {
           setInputPhrase(""); setIsAnalyzing(false); return;
       }
       const existingIdx = newWords.findIndex(w => w.term.toLowerCase() === phrase.toLowerCase());
       if (existingIdx > -1) {
          newWords[existingIdx] = { ...newWords[existingIdx], frequency: newWords[existingIdx].frequency + 1, lastUpdated: new Date().toISOString() };
          lastToPop = newWords[existingIdx];
       } else {
          const meaning = await translateWord(phrase);
          const newEntry = { id: Date.now().toString(), term: phrase, meaning, frequency: 1, type: 'phrase', isManuallyEdited: false, lastUpdated: new Date().toISOString() };
          newWords.push(newEntry);
          lastToPop = newEntry;
       }
    } else {
       const cleanedWords = inputPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/).filter(w => w.length >= 2);
       const uniqueWords = [...new Set(cleanedWords)];

       for (const word of uniqueWords) {
         if (learnedWords.some(w => w.term === word)) continue;

         const existingIdx = newWords.findIndex(w => w.term === word);
         if (existingIdx > -1) {
           const updatedFreq = newWords[existingIdx].frequency + 1;
           newWords[existingIdx] = { ...newWords[existingIdx], frequency: updatedFreq, lastUpdated: new Date().toISOString() };
           if (updatedFreq <= 10) lastToPop = newWords[existingIdx];
         } else {
           const meaning = await translateWord(word);
           const synonyms = await fetchSynonyms(word, selectedLang);
           const newEntry = { id: word, term: word, meaning, synonyms, type: 'word', frequency: 1, isManuallyEdited: false, lastUpdated: new Date().toISOString() };
           newWords.push(newEntry);
           lastToPop = newEntry;
         }
       }
    }

    setWords(newWords);
    if (lastToPop && lastToPop.frequency <= 10) setActivePopupWord(lastToPop);
    setInputPhrase("");
    setIsAnalyzing(false);
  };

  const handleEditMeaning = (id, newMeaning) => {
    setWords(words.map(w => w.id === id ? { ...w, meaning: newMeaning, isManuallyEdited: true, lastUpdated: new Date().toISOString() } : w));
  };

  const handleMarkLearned = (item) => {
    setWords(words.filter(w => w.id !== item.id));
    setLearnedWords([item, ...learnedWords]);
  };

  const handleUnmarkLearned = (item) => {
    setLearnedWords(learnedWords.filter(w => w.id !== item.id));
    setWords([{ ...item, lastUpdated: new Date().toISOString() }, ...words]);
  };

  const handleIncrement = (id) => {
    const wordObj = words.find(w => w.id === id);
    if (!wordObj) return;
    const newFreq = wordObj.frequency + 1;
    const newWords = words.map(w => w.id === id ? { ...w, frequency: newFreq, lastUpdated: new Date().toISOString() } : w);
    setWords(newWords);
    if (newFreq <= 10) setActivePopupWord(wordObj);
  };

  const handleDecrement = (id) => {
    const existing = words.find(w => w.id === id);
    if (!existing) return;
    if (existing.frequency > 1) {
      setWords(words.map(w => w.id === id ? { ...w, frequency: existing.frequency - 1, lastUpdated: new Date().toISOString() } : w));
    } else {
      setWords(words.filter(w => w.id !== id));
    }
  };

  const handleExportData = () => {
    const dataToExport = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('vocab_')) {
        dataToExport[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocab_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        let hasValidData = false;
        for (const key in importedData) {
          if (key.startsWith('vocab_')) {
            localStorage.setItem(key, importedData[key]);
            hasValidData = true;
          }
        }
        if (hasValidData) {
          alert(t.importSuccess);
          window.location.reload(); 
        } else throw new Error();
      } catch (err) { alert(t.importError); }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const filteredList = useMemo(() => {
    return words
      .filter(w => w.term.toLowerCase().includes(searchQuery.toLowerCase()) || w.meaning.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (b.frequency !== a.frequency) return b.frequency - a.frequency;
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      });
  }, [words, searchQuery]);

  const tutorialData = [
    { title: t.tut1Title, desc: t.tut1Desc, icon: <Languages size={48} className="text-[#3B82F6]" /> },
    { title: t.tut2Title, desc: t.tut2Desc, icon: <CheckCircle2 size={48} className="text-emerald-500" /> },
    { title: t.tut3Title, desc: t.tut3Desc, icon: <MinusCircle size={48} className="text-red-500" /> },
    { title: t.tut4Title, desc: t.tut4Desc, icon: <Edit2 size={48} className="text-yellow-500" /> }
  ];

  return (
    <div className={`flex flex-col h-screen h-[100dvh] w-full overflow-hidden transition-colors duration-300 touch-manipulation ${isDarkMode ? 'bg-[#0b101b] text-slate-200' : 'bg-slate-50 text-slate-900'} font-sans`}>
      <header className="shrink-0 z-30 bg-[#0F172A] pt-8 sm:pt-12 pb-6 px-4 text-white shadow-lg flex flex-col gap-4 border-b border-slate-800">
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

      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full relative">
        <div className="p-4 max-w-lg mx-auto space-y-6 pb-16">
          <div className={`rounded-[2rem] shadow-xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* Toggle Modalità: Parola vs Frase */}
            <div className={`flex p-1 border-b ${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <button 
                onClick={() => setIsPhraseMode(false)} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isPhraseMode ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Type size={14} /> {t.wordMode}
              </button>
              <button 
                onClick={() => setIsPhraseMode(true)} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPhraseMode ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700'}`}
              >
                <AlignLeft size={14} /> {t.phraseMode}
              </button>
            </div>

            <div className="p-6 pb-2">
              <textarea
                ref={textareaRef}
                placeholder={isPhraseMode ? t.placeholderPhrase : t.placeholderWord}
                className={`w-full rounded-2xl p-4 border-none focus:ring-0 text-lg resize-none outline-none h-28 transition-colors ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100/50 text-slate-900'}`}
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
              />
            </div>

            <div className={`h-12 border-t flex items-center px-4 gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              {suggestions.length > 0 ? suggestions.map((s, i) => (
                <button key={i} onClick={() => applySuggestion(s.term)} className="whitespace-nowrap bg-blue-500/10 text-blue-400 text-[11px] font-black uppercase px-4 py-2 rounded-full flex items-center gap-1.5 border border-blue-500/20">
                  <Sparkles size={12} /> {s.term}
                </button>
              )) : <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-2">{t.autoType}</span>}
            </div>

            <div className="p-4">
              <button onClick={handleAnalysis} disabled={isAnalyzing || !inputPhrase.trim() || !selectedLang} className="w-full bg-[#3B82F6] text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Plus size={20} />} {isPhraseMode ? t.btnAnalyzePhrase : t.btnAnalyzeWord}
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
              <div className="pt-2 relative">
                <button onClick={() => setShowLowFreq(!showLowFreq)} className={`flex items-center justify-between w-full p-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <span>{t.lessUsed} ({filteredList.filter(w => w.frequency < 3).length})</span>
                  {showLowFreq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showLowFreq && (
                  <div className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-2">
                    {filteredList.filter(w => w.frequency < 3).map(w => (
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
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={`relative shrink-0 border-t p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors flex flex-col justify-end ${isDarkMode ? 'bg-[#0b101b] border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* FRECCIA IN SU PER CHIUDERE LE PAROLE ESPANSE */}
        {showLowFreq && (
          <button 
            onClick={() => setShowLowFreq(false)}
            className={`absolute left-1/2 -translate-x-1/2 -top-10 flex items-center justify-center w-20 h-10 rounded-t-2xl border-t border-l border-r transition-colors active:scale-95 z-50 ${isDarkMode ? 'bg-[#0b101b] border-slate-800 text-blue-400' : 'bg-white border-slate-200 text-blue-500'}`}
            aria-label="Chiudi visualizzazione parole"
          >
            <ChevronUp size={28} strokeWidth={3} />
          </button>
        )}
        
        <div className="max-w-lg w-full mx-auto space-y-2">
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
              className={`p-4 rounded-[1.5rem] shrink-0 transition-colors flex items-center justify-center ${learnedWords.length > 0 ? 'bg-yellow-400 text-yellow-950 shadow-lg shadow-yellow-400/20' : isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}
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

            <button 
              onClick={() => setShowSettings(true)} 
              className={`p-4 rounded-[1.5rem] shrink-0 transition-colors flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-300' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}
            >
               <Settings size={20} />
            </button>
          </div>
        </div>
      </footer>

      {/* POPUP SETTINGS (Target Lang + Import/Export) */}
      {showSettings && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[70] flex items-center justify-center p-6">
          <div className={`rounded-[3rem] w-full max-w-sm p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-90 transition-all">
              <X size={20} />
            </button>

            <div className="flex justify-center mb-2">
              <div className={`p-5 rounded-full shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                 <Settings size={40} className="text-slate-400" />
              </div>
            </div>

            <h2 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.settings}
            </h2>

            {/* Selezione Lingua Target */}
            <div className={`p-4 rounded-[1.5rem] border text-left space-y-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
               <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">{t.targetLang}</label>
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {Object.entries(LANGUAGES_MAP).map(([key, lang]) => (
                   <button 
                     key={key} 
                     onClick={() => setTargetLang(key)} 
                     className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${targetLang === key ? 'bg-[#3B82F6] text-white shadow-md' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border'}`}
                   >
                     <span>{lang.flag}</span> <span>{lang.name}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button onClick={handleExportData} className="w-full py-4 bg-[#3B82F6] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-500/40 flex items-center justify-center gap-2">
                <Download size={18} /> {t.export}
              </button>

              <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportData} className="hidden" />

              <button onClick={() => fileInputRef.current.click()} className={`w-full py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                <Upload size={18} /> {t.import}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP TUTORIAL */}
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

            <div className="flex justify-center gap-2 py-2">
              {tutorialData.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${tutorialStep === idx ? 'w-6 bg-[#3B82F6]' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} />
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              {tutorialStep > 0 && (
                <button onClick={() => setTutorialStep(prev => prev - 1)} className={`py-4 px-6 rounded-[1.5rem] font-bold uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t.tutPrev}
                </button>
              )}
              <button 
                onClick={() => {
                  if (tutorialStep < tutorialData.length - 1) setTutorialStep(prev => prev + 1);
                  else setShowTutorial(false);
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

      {/* POPUP TRADUZIONE / SIGNIFICATO ATTIVO */}
      {activePopupWord && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className={`rounded-[3rem] w-full max-w-sm p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 border-t-[12px] border-blue-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="bg-blue-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-blue-500 shadow-inner"><BookOpen size={48} /></div>
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{t.popupTitle}</h2>
              <div className={`text-4xl font-black capitalize tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activePopupWord.term}</div>
              <p className="text-xl text-slate-500 font-bold italic leading-tight">"{activePopupWord.meaning}"</p>
              
              {/* Mostra Sinonimi nel Popup se ci sono */}
              {activePopupWord.synonyms && activePopupWord.synonyms.length > 0 && (
                <div className="pt-4 flex flex-wrap justify-center gap-1.5">
                  <span className="text-[10px] w-full block font-black uppercase text-slate-400 mb-1">{t.synonyms}</span>
                  {activePopupWord.synonyms.map((s, i) => (
                     <span key={i} className={`text-xs px-3 py-1.5 rounded-lg font-bold ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-500'}`}>{s}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setActivePopupWord(null)} className="w-full mt-4 py-5 bg-[#3B82F6] text-white rounded-[1.5rem] font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-500/40">{t.popupButton}</button>
          </div>
        </div>
      )}

      {/* INSTALLAZIONE */}
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
        <div className="flex justify-between items-start w-full">
          <div className="select-none flex-1 pr-4">
            <h3 className="font-black text-xl tracking-tight leading-tight flex items-center gap-2">
               <span className={item.type === 'phrase' ? 'normal-case' : 'capitalize'}>{item.term}</span>
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
              <div onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="cursor-text group">
                <p className="text-slate-500 text-sm font-medium italic mt-1 leading-tight flex items-center gap-1.5">
                  "{item.meaning}"
                  <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            )}

            {/* Area Sinonimi per le parole (non visibile per le frasi) */}
            {item.synonyms && item.synonyms.length > 0 && (
               <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 mr-1 mt-0.5">{t.synonyms}:</span>
                  {item.synonyms.map((s, i) => (
                    <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-500'}`}>{s}</span>
                  ))}
               </div>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border shadow-inner shrink-0 transition-all ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#3B82F6] border-blue-100'}`}>
            {item.frequency}
          </div>
        </div>

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


