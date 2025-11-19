
import React, { ReactNode, useState } from 'react';
import { AppLanguage, VocabItem } from '../types';
import { translations } from '../utils/translations';
import { RotateCw } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export const QuillButton: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "font-header font-bold uppercase tracking-widest transition-all duration-300 px-6 py-2 border-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-ink text-parchment border-ink hover:bg-burgundy hover:border-burgundy hover:text-white shadow-md",
    secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-parchment",
    danger: "bg-transparent text-burgundy border-burgundy hover:bg-burgundy hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const ParchmentInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full bg-transparent border-b-2 border-ink/30 focus:border-burgundy focus:outline-none font-body text-xl text-ink placeholder-ink/50 py-2 px-1 transition-colors ${props.className}`}
  />
);

export const ParchmentTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full bg-parchment-dark/30 border-2 border-ink/20 focus:border-burgundy focus:outline-none font-body text-lg text-ink placeholder-ink/50 p-4 rounded-sm shadow-inner resize-none ${props.className}`}
  />
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-8 relative">
    <div className="absolute left-0 right-0 top-1/2 h-px bg-ink/20 -z-10 transform -translate-y-1/2"></div>
    <h2 className="font-header text-3xl text-ink bg-parchment px-6 inline-block border-y-2 border-ink/10 py-1">
      {title}
    </h2>
    {subtitle && <p className="font-script text-2xl text-burgundy mt-2">{subtitle}</p>}
  </div>
);

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-parchment border border-ink/10 p-6 shadow-paper relative overflow-hidden ${className}`}>
    {/* Corner Decoration */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold"></div>
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold"></div>
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold"></div>
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold"></div>
    {children}
  </div>
);

export const LanguageSelector: React.FC<{ 
  current: AppLanguage; 
  onChange: (l: AppLanguage) => void;
  label?: string;
  className?: string;
}> = ({ current, onChange, label, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
       {label && <span className="font-header text-xs text-ink/60 uppercase">{label}</span>}
       <div className="flex border border-ink/20 rounded overflow-hidden">
         {(['en', 'zh', 'de', 'es'] as AppLanguage[]).map(lang => (
           <button
             key={lang}
             onClick={() => onChange(lang)}
             className={`px-3 py-1 font-header text-sm transition-colors ${current === lang ? 'bg-ink text-parchment' : 'bg-parchment hover:bg-parchment-dark text-ink'}`}
           >
             {lang.toUpperCase()}
           </button>
         ))}
       </div>
    </div>
  );
};

export const Flashcard: React.FC<{ item: VocabItem; uiLang: AppLanguage }> = ({ item, uiLang }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 w-full h-64 cursor-pointer group"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <Card className="h-full flex flex-col items-center justify-center text-center bg-parchment hover:bg-parchment-dark/10 transition-colors">
            <h3 className="font-header text-3xl text-ink mb-2">{item.word}</h3>
            <span className="font-body italic text-burgundy/60">{item.partOfSpeech}</span>
            <div className="absolute bottom-4 text-xs text-ink/30 font-header uppercase flex items-center gap-1">
               <RotateCw className="w-3 h-3" /> {translations[uiLang].flipCard}
            </div>
          </Card>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full flex flex-col items-center justify-center text-center bg-[#1a1510] text-parchment border-gold">
             <p className="font-header text-2xl text-gold mb-4">{item.translation}</p>
             <p className="font-body text-lg text-parchment/80 px-4">{item.definition}</p>
          </Card>
        </div>

      </div>
    </div>
  );
};
