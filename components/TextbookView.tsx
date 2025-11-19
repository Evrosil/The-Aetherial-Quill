
import React from 'react';
import { TextbookItem, AppLanguage } from '../types';
import { SectionHeader, Flashcard } from './UIComponents';
import { LibraryBig } from 'lucide-react';
import { translations } from '../utils/translations';

interface TextbookViewProps {
  items: TextbookItem[];
  language: AppLanguage;
}

export const TextbookView: React.FC<TextbookViewProps> = ({ items, language }) => {
  const t = translations[language];

  return (
    <div className="animate-fade-in">
      <SectionHeader title={t.flashcardsTitle} subtitle={t.flashcardsSubtitle} />

      {items.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <LibraryBig className="w-16 h-16 mx-auto mb-6 text-ink" />
          <p className="font-body text-2xl">{t.emptyTextbook}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Flashcard key={item.id + item.addedAt} item={item} uiLang={language} />
          ))}
        </div>
      )}
    </div>
  );
};
