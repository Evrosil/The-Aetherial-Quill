
import React, { useState, useEffect } from 'react';
import { MemoryItem, TextbookItem, AppLanguage } from './types';
import { LibraryView } from './components/LibraryView';
import { GeneratorView } from './components/GeneratorView';
import { TextbookView } from './components/TextbookView';
import { LanguageSelector } from './components/UIComponents';
import { BookOpen, PenTool, LibraryBig } from 'lucide-react';
import { translations } from './utils/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState<'library' | 'generator' | 'textbook'>('library');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [textbookItems, setTextbookItems] = useState<TextbookItem[]>([]);
  const [language, setLanguage] = useState<AppLanguage>('en');

  const t = translations[language];

  // Load items from local storage on mount
  useEffect(() => {
    const savedMem = localStorage.getItem('aetherial_quill_memory');
    const savedTextbook = localStorage.getItem('aetherial_quill_textbook');
    const savedLang = localStorage.getItem('aetherial_quill_lang');
    
    if (savedMem) {
      try { setMemoryItems(JSON.parse(savedMem)); } catch (e) {}
    }
    if (savedTextbook) {
      try { setTextbookItems(JSON.parse(savedTextbook)); } catch (e) {}
    }
    if (savedLang) {
      setLanguage(savedLang as AppLanguage);
    }
  }, []);

  // Save items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('aetherial_quill_memory', JSON.stringify(memoryItems));
  }, [memoryItems]);

  useEffect(() => {
    localStorage.setItem('aetherial_quill_textbook', JSON.stringify(textbookItems));
  }, [textbookItems]);

  useEffect(() => {
    localStorage.setItem('aetherial_quill_lang', language);
  }, [language]);

  const addMemoryItem = (item: MemoryItem) => {
    setMemoryItems(prev => [item, ...prev]);
  };

  const deleteMemoryItem = (id: string) => {
    setMemoryItems(prev => prev.filter(item => item.id !== id));
  };

  const addToTextbook = (item: TextbookItem) => {
    // Avoid duplicates
    if (!textbookItems.find(i => i.word === item.word)) {
      setTextbookItems(prev => [item, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans">
      {/* Overlay for texture effect */}
      <div className="fixed inset-0 pointer-events-none z-50 shadow-inner-glow"></div>
      
      {/* Header */}
      <header className="bg-[#1a1510] text-parchment border-b-4 border-gold py-6 px-4 shadow-xl relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-header text-4xl md:text-5xl tracking-widest text-parchment">
              {t.appTitle}
            </h1>
            <p className="font-script text-2xl text-gold mt-1 opacity-80">
              {t.appSubtitle}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <LanguageSelector current={language} onChange={setLanguage} className="mb-2" />
            
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-header uppercase tracking-wider border border-parchment/20 transition-all duration-300 text-sm md:text-base
                  ${activeTab === 'library' 
                    ? 'bg-parchment text-ink shadow-[0_0_15px_rgba(218,165,32,0.3)]' 
                    : 'bg-transparent text-parchment/60 hover:text-parchment hover:border-parchment/50'
                  }`}
              >
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> {t.tabArchives}
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-header uppercase tracking-wider border border-parchment/20 transition-all duration-300 text-sm md:text-base
                  ${activeTab === 'generator' 
                    ? 'bg-parchment text-ink shadow-[0_0_15px_rgba(218,165,32,0.3)]' 
                    : 'bg-transparent text-parchment/60 hover:text-parchment hover:border-parchment/50'
                  }`}
              >
                <PenTool className="w-4 h-4 md:w-5 md:h-5" /> {t.tabScriptorium}
              </button>
              <button
                onClick={() => setActiveTab('textbook')}
                className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-header uppercase tracking-wider border border-parchment/20 transition-all duration-300 text-sm md:text-base
                  ${activeTab === 'textbook' 
                    ? 'bg-parchment text-ink shadow-[0_0_15px_rgba(218,165,32,0.3)]' 
                    : 'bg-transparent text-parchment/60 hover:text-parchment hover:border-parchment/50'
                  }`}
              >
                <LibraryBig className="w-4 h-4 md:w-5 md:h-5" /> {t.tabLexicon}
              </button>
            </nav>
          </div>
          
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-parchment relative">
         {/* Paper Texture Overlay */}
         <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
         
         <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 min-h-[80vh]">
            {activeTab === 'library' ? (
              <LibraryView 
                items={memoryItems} 
                onAddItem={addMemoryItem} 
                onDeleteItem={deleteMemoryItem}
                language={language}
              />
            ) : activeTab === 'generator' ? (
              <GeneratorView 
                memoryItems={memoryItems} 
                appLanguage={language}
                onAddToTextbook={addToTextbook}
              />
            ) : (
              <TextbookView 
                items={textbookItems}
                language={language}
              />
            )}
         </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1510] text-parchment/40 py-8 text-center font-header text-sm border-t border-gold/30 relative z-20">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
