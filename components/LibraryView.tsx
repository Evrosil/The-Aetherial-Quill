
import React, { useState } from 'react';
import { MemoryItem, MemoryCategory, AppLanguage } from '../types';
import { QuillButton, ParchmentInput, ParchmentTextArea, SectionHeader, Card } from './UIComponents';
import { Trash2, Book, Map, User, Feather, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { enhanceMemoryEntry } from '../services/geminiService';
import { translations } from '../utils/translations';

interface LibraryViewProps {
  items: MemoryItem[];
  onAddItem: (item: MemoryItem) => void;
  onDeleteItem: (id: string) => void;
  language: AppLanguage;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ items, onAddItem, onDeleteItem, language }) => {
  const [newItem, setNewItem] = useState<Partial<MemoryItem>>({
    category: MemoryCategory.CHARACTER,
    name: '',
    description: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = translations[language];

  const handleAdd = () => {
    if (newItem.name && newItem.description && newItem.category) {
      onAddItem({
        id: crypto.randomUUID(),
        category: newItem.category,
        name: newItem.name,
        description: newItem.description
      });
      setNewItem({ ...newItem, name: '', description: '' });
    }
  };

  const handleEnhance = async () => {
    if (!newItem.category) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceMemoryEntry({
        category: newItem.category,
        name: newItem.name || '',
        description: newItem.description || ''
      }, language);
      setNewItem(prev => ({
        ...prev,
        name: enhanced.name,
        description: enhanced.description
      }));
    } catch (error) {
      console.error("Failed to enhance:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDeleteItem(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const getIcon = (cat: MemoryCategory) => {
    switch (cat) {
      case MemoryCategory.CHARACTER: return <User className="w-5 h-5" />;
      case MemoryCategory.SETTING: return <Map className="w-5 h-5" />;
      case MemoryCategory.PLOT: return <Book className="w-5 h-5" />;
      case MemoryCategory.STYLE: return <Feather className="w-5 h-5" />;
    }
  };

  const getLocalizedCategory = (cat: MemoryCategory) => {
    switch (cat) {
      case MemoryCategory.CHARACTER: return t.catCharacter;
      case MemoryCategory.SETTING: return t.catSetting;
      case MemoryCategory.PLOT: return t.catPlot;
      case MemoryCategory.STYLE: return t.catStyle;
      default: return cat;
    }
  };

  return (
    <div className="animate-fade-in relative">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-parchment border-4 border-double border-ink p-8 max-w-md w-full shadow-2xl relative text-center transform transition-all scale-100">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-burgundy"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-burgundy"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-burgundy"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-burgundy"></div>
              
              <AlertTriangle className="w-12 h-12 text-burgundy mx-auto mb-4" />
              
              <h3 className="font-header text-2xl text-ink mb-2">{t.deleteConfirmTitle}</h3>
              <p className="font-body text-lg text-ink/80 mb-8">{t.deleteConfirmMessage}</p>
              
              <div className="flex justify-center gap-4">
                <QuillButton variant="secondary" onClick={cancelDelete}>
                   {t.cancel}
                </QuillButton>
                <QuillButton variant="danger" onClick={confirmDelete}>
                   {t.confirm}
                </QuillButton>
              </div>
           </div>
        </div>
      )}

      <SectionHeader title={t.archivesTitle} subtitle={t.archivesSubtitle} />

      {/* Add New Item Form */}
      <Card className="mb-10 bg-parchment-dark/20">
        <h3 className="font-header text-xl mb-4 text-ink flex items-center gap-2">
          <Feather className="w-5 h-5 text-burgundy" /> {t.newEntry}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block font-header text-sm text-ink/70 mb-1 uppercase">{t.category}</label>
            <select
              className="w-full bg-parchment border-b-2 border-ink/30 py-2 font-body text-xl focus:outline-none focus:border-burgundy cursor-pointer"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value as MemoryCategory })}
            >
              {Object.values(MemoryCategory).map((cat) => (
                <option key={cat} value={cat}>{getLocalizedCategory(cat)}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block font-header text-sm text-ink/70 mb-1 uppercase">{t.nameTitle}</label>
            <ParchmentInput
              placeholder="e.g., 'Count Reginald', 'The Mist-Shrouded Moors'"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-6">
           <div className="flex justify-between items-end mb-1">
             <label className="block font-header text-sm text-ink/70 uppercase">{t.description}</label>
           </div>
           <ParchmentTextArea
             rows={3}
             placeholder="..."
             value={newItem.description}
             onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
           />
        </div>
        <div className="flex justify-end gap-4 flex-wrap">
          <QuillButton 
            variant="secondary" 
            onClick={handleEnhance} 
            disabled={isEnhancing}
            className="flex items-center gap-2"
            title="Let the AI refine your ideas"
          >
             {isEnhancing ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
             {t.consultMuse}
          </QuillButton>
          <QuillButton onClick={handleAdd} disabled={!newItem.name || !newItem.description}>
            {t.archiveEntry}
          </QuillButton>
        </div>
      </Card>

      {/* Existing Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length === 0 ? (
           <div className="col-span-full text-center py-12 opacity-50">
             <Book className="w-12 h-12 mx-auto mb-4 text-ink" />
             <p className="font-body text-xl">The archives are currently empty. Add items to begin.</p>
           </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="flex items-center gap-2 text-xs font-header tracking-widest text-burgundy uppercase bg-burgundy/10 px-2 py-1 rounded">
                  {getIcon(item.category)} {getLocalizedCategory(item.category)}
                </span>
                <button 
                  onClick={() => setDeleteId(item.id)}
                  className="text-ink/40 hover:text-burgundy transition-colors p-1"
                  title="Burn from archives"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-header text-xl text-ink mb-2 font-bold">{item.name}</h4>
              <p className="font-body text-lg text-ink/80 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                {item.description}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
