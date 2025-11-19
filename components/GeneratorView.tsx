
import React, { useState } from 'react';
import { MemoryItem, LoadingState, AppLanguage, VocabItem, TextbookItem } from '../types';
import { QuillButton, ParchmentTextArea, SectionHeader, LanguageSelector } from './UIComponents';
import { generateFictionStory, analyzeStoryForLearning } from '../services/geminiService';
import { Send, Loader2, Feather, BookOpen, Info, GraduationCap, Download, Share2 } from 'lucide-react';
import { translations } from '../utils/translations';

interface GeneratorViewProps {
  memoryItems: MemoryItem[];
  appLanguage: AppLanguage;
  onAddToTextbook: (item: TextbookItem) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ memoryItems, appLanguage, onAddToTextbook }) => {
  const [prompt, setPrompt] = useState('');
  const [targetLang, setTargetLang] = useState<AppLanguage>(appLanguage);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [learningMode, setLearningMode] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string; language: AppLanguage } | null>(null);
  const [learningData, setLearningData] = useState<{ vocabulary: VocabItem[], grammar: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<any | null>(null);

  const t = translations[appLanguage];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus('loading');
    setError(null);
    setResult(null);
    setLearningData(null);
    setSelectedVocab(null);
    setSelectedGrammar(null);

    try {
      // 1. Generate Story
      const storyResponse = await generateFictionStory(prompt, memoryItems, targetLang);
      setResult({ ...storyResponse, language: targetLang });

      // 2. If Learning Mode is on, analyze it
      if (learningMode) {
        const analysis = await analyzeStoryForLearning(storyResponse.content, targetLang);
        setLearningData(analysis);
      }

      setStatus('success');
    } catch (err: any) {
      setError(err.message || "An unknown malaise has afflicted the generator.");
      setStatus('error');
    }
  };

  const handleAddToTextbook = (item: VocabItem) => {
    onAddToTextbook({
      ...item,
      addedAt: Date.now()
    });
    alert("Added to Lexicon"); // Simple feedback
  };

  const handleSave = () => {
    if (!result) return;
    const textContent = `${result.title}\n\n${result.content}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!result) return;
    const textContent = `${result.title}\n\n${result.content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: textContent,
        });
      } catch (err) {
        // User cancelled or failed, fallback to clipboard
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(textContent);
        alert(t.shareSuccess);
      } catch (err) {
        alert(t.shareFail);
      }
    }
  };

  // Helper to render text with highlights
  const renderContent = () => {
    if (!result) return null;
    if (!learningData) {
      return result.content.split('\n').map((paragraph, idx) => (
         <p key={idx} className="mb-6">{paragraph}</p>
      ));
    }

    // Complex rendering for learning mode
    return result.content.split('\n').map((paragraph, pIdx) => {
      let parts = [{ text: paragraph, type: 'text', data: null as any }];

      // Apply Grammar Highlighting (Underline) - Simple exact match
      learningData.grammar.forEach(g => {
        const newParts: any[] = [];
        parts.forEach(part => {
          if (part.type !== 'text') {
             newParts.push(part);
             return;
          }
          const idx = part.text.indexOf(g.sentence);
          if (idx !== -1) {
             const pre = part.text.substring(0, idx);
             const match = part.text.substring(idx, idx + g.sentence.length);
             const post = part.text.substring(idx + g.sentence.length);
             if (pre) newParts.push({ text: pre, type: 'text' });
             newParts.push({ text: match, type: 'grammar', data: g });
             if (post) newParts.push({ text: post, type: 'text' });
          } else {
             newParts.push(part);
          }
        });
        parts = newParts;
      });

      // Apply Vocab Highlighting (Background) - Simple exact match within segments
      learningData.vocabulary.forEach(v => {
        const newParts: any[] = [];
        parts.forEach(part => {
          if (part.type !== 'text' && part.type !== 'grammar') {
            newParts.push(part);
            return;
          }
          
          // Only highlight inside text or grammar blocks, don't break existing blocks structure if possible
          // For simplicity, we only split 'text' blocks for vocab. 
          // Overlapping grammar/vocab is complex, prioritizing grammar structure, then scanning inside.
          
          const textToScan = part.text;
          const idx = textToScan.toLowerCase().indexOf(v.word.toLowerCase());
          
          if (idx !== -1 && part.type === 'text') {
             const pre = textToScan.substring(0, idx);
             const match = textToScan.substring(idx, idx + v.word.length);
             const post = textToScan.substring(idx + v.word.length);
             if (pre) newParts.push({ text: pre, type: 'text' });
             newParts.push({ text: match, type: 'vocab', data: v });
             if (post) newParts.push({ text: post, type: 'text' });
          } else if (idx !== -1 && part.type === 'grammar') {
            // Nested highlight inside grammar
             // This requires a recursive structure or simpler rendering. 
             // We will just keep the grammar underline and ignore vocab highlight inside grammar for MVP stability.
             newParts.push(part);
          } else {
             newParts.push(part);
          }
        });
        parts = newParts;
      });

      return (
        <p key={pIdx} className="mb-6 leading-loose">
          {parts.map((part, i) => {
            if (part.type === 'vocab') {
              return (
                <span 
                  key={i} 
                  className="bg-gold/30 cursor-pointer hover:bg-gold/60 rounded px-1 relative inline-block"
                  onClick={() => setSelectedVocab(part.data)}
                >
                  {part.text}
                </span>
              );
            }
            if (part.type === 'grammar') {
              return (
                <span 
                  key={i} 
                  className="decoration-burgundy underline decoration-2 underline-offset-4 cursor-help hover:bg-burgundy/5 rounded px-1"
                  onClick={() => setSelectedGrammar(part.data)}
                >
                  {part.text}
                </span>
              );
            }
            return <span key={i}>{part.text}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
       
       {/* Left Column: Input and Output */}
       <div className="lg:col-span-2 space-y-8">
        <SectionHeader title={t.scriptoriumTitle} subtitle={t.scriptoriumSubtitle} />

        {/* Input Area */}
        <div className="bg-parchment p-1 shadow-paper relative">
          <div className="border-2 border-ink/10 p-6">
              <label className="block font-header text-lg text-ink mb-4 text-center uppercase tracking-widest">
                {t.promptLabel}
              </label>
              <ParchmentTextArea 
                rows={4}
                placeholder="..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mb-6 text-xl leading-relaxed"
              />
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                 <LanguageSelector 
                    current={targetLang} 
                    onChange={setTargetLang} 
                    label={t.targetLang}
                 />
                 <label className="flex items-center gap-2 font-header text-sm uppercase cursor-pointer text-ink">
                   <input 
                     type="checkbox" 
                     checked={learningMode}
                     onChange={(e) => setLearningMode(e.target.checked)}
                     className="w-4 h-4 accent-burgundy"
                   />
                   {t.learningMode}
                 </label>
              </div>

              <div className="flex justify-center">
                <QuillButton 
                  onClick={handleGenerate} 
                  disabled={status === 'loading' || !prompt.trim()}
                  className="w-full md:w-auto min-w-[200px]"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 className="animate-spin w-5 h-5" /> {t.generatingBtn}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Send className="w-5 h-5" /> {t.generateBtn}
                    </span>
                  )}
                </QuillButton>
              </div>
              
              {error && (
                <div className="mt-4 text-center text-burgundy font-body text-lg italic">
                  "Alas! {error}"
                </div>
              )}
          </div>
        </div>

        {/* Output Area */}
        {result && (
          <div className="animate-fade-in-up">
              <div className="relative bg-[#fcf5e5] text-ink p-8 md:p-12 shadow-2xl border-t-4 border-b-4 border-double border-ink/20">
                {/* Decorative corners */}
                <Feather className="absolute top-6 left-6 text-ink/10 w-12 h-12 rotate-45" />
                <Feather className="absolute bottom-6 right-6 text-ink/10 w-12 h-12 -rotate-135" />

                <h2 className="font-header text-3xl md:text-4xl text-center font-bold mb-8 text-ink border-b border-ink/20 pb-4">
                  {result.title}
                </h2>
                
                <div className="font-body text-xl md:text-2xl leading-loose text-justify">
                  {renderContent()}
                </div>

                <div className="text-center mt-12 text-ink/40 font-script text-2xl mb-8">
                  {t.finis}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4 border-t border-ink/10">
                  <QuillButton variant="secondary" onClick={handleSave} className="flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4" /> {t.saveBtn}
                  </QuillButton>
                  <QuillButton variant="secondary" onClick={handleShare} className="flex items-center gap-2 text-sm">
                    <Share2 className="w-4 h-4" /> {t.shareBtn}
                  </QuillButton>
                </div>
              </div>
          </div>
        )}
       </div>

       {/* Right Column: Learning Tools */}
       {learningMode && result && (
         <div className="lg:col-span-1 animate-fade-in space-y-6 sticky top-6 h-fit">
            <div className="bg-ink text-parchment p-4 rounded-t-md shadow-lg">
               <h3 className="font-header text-xl flex items-center gap-2">
                 <GraduationCap className="w-5 h-5" /> Analysis Tools
               </h3>
            </div>
            
            <div className="bg-parchment border border-ink/20 p-4 shadow-paper min-h-[200px]">
               {!selectedVocab && !selectedGrammar && (
                 <div className="text-center opacity-50 py-8">
                    <Info className="w-10 h-10 mx-auto mb-4" />
                    <p className="font-body text-lg">Click highlighted words or underlined sentences to reveal their secrets.</p>
                 </div>
               )}

               {selectedVocab && (
                 <div className="animate-fade-in">
                    <h4 className="font-header text-2xl text-burgundy mb-1">{selectedVocab.word}</h4>
                    <span className="italic text-sm mb-4 block text-ink/60">{selectedVocab.partOfSpeech}</span>
                    <div className="space-y-2 font-body text-lg mb-6">
                       <p><strong>Meaning:</strong> {selectedVocab.definition}</p>
                       <p><strong>Translation:</strong> {selectedVocab.translation}</p>
                    </div>
                    <QuillButton variant="secondary" onClick={() => handleAddToTextbook(selectedVocab)} className="w-full text-sm py-1">
                       <BookOpen className="w-4 h-4 inline mr-2" /> {t.addToTextbook}
                    </QuillButton>
                 </div>
               )}

               {selectedGrammar && (
                 <div className="animate-fade-in">
                    <h4 className="font-header text-xl text-burgundy mb-4 border-b border-burgundy/20 pb-2">Grammar Note</h4>
                    <p className="font-bold font-header text-ink mb-2">{selectedGrammar.rule}</p>
                    <p className="font-body text-lg leading-relaxed">{selectedGrammar.explanation}</p>
                 </div>
               )}
            </div>

            {/* Legend */}
            <div className="bg-parchment/50 border border-ink/10 p-4 text-sm font-header text-ink/70">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 bg-gold/50 rounded block"></span> Vocabulary
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-burgundy rounded block"></span> Grammar
              </div>
            </div>
         </div>
       )}

    </div>
  );
};
