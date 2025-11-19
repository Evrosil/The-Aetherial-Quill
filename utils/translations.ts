
import { AppLanguage } from '../types';

type TranslationKey = 
  | 'appTitle'
  | 'appSubtitle'
  | 'tabArchives'
  | 'tabScriptorium'
  | 'tabLexicon'
  | 'footer'
  | 'archivesTitle'
  | 'archivesSubtitle'
  | 'newEntry'
  | 'category'
  | 'nameTitle'
  | 'description'
  | 'consultMuse'
  | 'archiveEntry'
  | 'scriptoriumTitle'
  | 'scriptoriumSubtitle'
  | 'promptLabel'
  | 'generateBtn'
  | 'generatingBtn'
  | 'finis'
  | 'addToTextbook'
  | 'learningMode'
  | 'targetLang'
  | 'flashcardsTitle'
  | 'flashcardsSubtitle'
  | 'emptyTextbook'
  | 'flipCard'
  // Categories
  | 'catCharacter'
  | 'catSetting'
  | 'catPlot'
  | 'catStyle'
  // Delete Confirmation
  | 'deleteConfirmTitle'
  | 'deleteConfirmMessage'
  | 'confirm'
  | 'cancel';

export const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    appTitle: "The Aetherial Quill",
    appSubtitle: "Automaton of Victorian Narratives",
    tabArchives: "The Archives",
    tabScriptorium: "The Scriptorium",
    tabLexicon: "The Lexicon",
    footer: "© 1895 The Aetherial Quill • Powered by Gemini Automaton Engine",
    archivesTitle: "The Archives",
    archivesSubtitle: "Repository of known facts and lore",
    newEntry: "New Entry",
    category: "Category",
    nameTitle: "Name / Title",
    description: "Description",
    consultMuse: "Consult Muse",
    archiveEntry: "Archive Entry",
    scriptoriumTitle: "The Scriptorium",
    scriptoriumSubtitle: "Where imagination meets ink",
    promptLabel: "Your Muse's Whisper",
    generateBtn: "Inscribe Fiction",
    generatingBtn: "Inscribing...",
    finis: "~ Finis ~",
    addToTextbook: "Add to Textbook",
    learningMode: "Language Learning Mode",
    targetLang: "Story Language",
    flashcardsTitle: "The Lexicon",
    flashcardsSubtitle: "Your collected vocabulary",
    emptyTextbook: "Your lexicon is empty. Read stories to collect new words.",
    flipCard: "Click to Flip",
    // Categories
    catCharacter: "Character",
    catSetting: "World Setting",
    catPlot: "Storyline",
    catStyle: "Narrative Style",
    // Delete
    deleteConfirmTitle: "Burn this Entry?",
    deleteConfirmMessage: "Are you certain you wish to scrub this from the archives? This action cannot be undone.",
    confirm: "Burn It",
    cancel: "Keep It"
  },
  zh: {
    appTitle: "以太羽毛笔",
    appSubtitle: "维多利亚叙事自动机",
    tabArchives: "档案馆",
    tabScriptorium: "缮写室",
    tabLexicon: "词汇典",
    footer: "© 1895 以太羽毛笔 • 由 Gemini 自动机引擎驱动",
    archivesTitle: "档案馆",
    archivesSubtitle: "已知事实与传说的宝库",
    newEntry: "新条目",
    category: "类别",
    nameTitle: "名称 / 标题",
    description: "描述",
    consultMuse: "咨询缪斯",
    archiveEntry: "归档条目",
    scriptoriumTitle: "缮写室",
    scriptoriumSubtitle: "想象力与墨水的交汇处",
    promptLabel: "缪斯的低语",
    generateBtn: "铭刻小说",
    generatingBtn: "铭刻中...",
    finis: "~ 完 ~",
    addToTextbook: "加入生词本",
    learningMode: "语言学习模式",
    targetLang: "故事语言",
    flashcardsTitle: "词汇典",
    flashcardsSubtitle: "您收集的词汇",
    emptyTextbook: "您的词汇典是空的。阅读故事以收集新词汇。",
    flipCard: "点击翻转",
    // Categories
    catCharacter: "角色 (Character)",
    catSetting: "世界观设定 (Setting)",
    catPlot: "故事情节 (Storyline)",
    catStyle: "叙事风格 (Style)",
    // Delete
    deleteConfirmTitle: "销毁此条目？",
    deleteConfirmMessage: "您确定要从档案馆中抹去此记录吗？此操作无法撤销。",
    confirm: "销毁",
    cancel: "保留"
  },
  de: {
    appTitle: "Die Ätherische Feder",
    appSubtitle: "Automat für Viktorianische Erzählungen",
    tabArchives: "Das Archiv",
    tabScriptorium: "Das Skriptorium",
    tabLexicon: "Das Lexikon",
    footer: "© 1895 Die Ätherische Feder • Angetrieben von Gemini Automaton Engine",
    archivesTitle: "Das Archiv",
    archivesSubtitle: "Speicher bekannter Fakten und Überlieferungen",
    newEntry: "Neuer Eintrag",
    category: "Kategorie",
    nameTitle: "Name / Titel",
    description: "Beschreibung",
    consultMuse: "Muse Konsultieren",
    archiveEntry: "Eintrag Archivieren",
    scriptoriumTitle: "Das Skriptorium",
    scriptoriumSubtitle: "Wo Fantasie auf Tinte trifft",
    promptLabel: "Das Flüstern Ihrer Muse",
    generateBtn: "Fiktion Inschrift",
    generatingBtn: "Einschreiben...",
    finis: "~ Ende ~",
    addToTextbook: "Zum Lehrbuch hinzufügen",
    learningMode: "Sprachlernmodus",
    targetLang: "Geschichtensprache",
    flashcardsTitle: "Das Lexikon",
    flashcardsSubtitle: "Ihr gesammeltes Vokabular",
    emptyTextbook: "Ihr Lexikon ist leer. Lesen Sie Geschichten, um Wörter zu sammeln.",
    flipCard: "Zum Umdrehen klicken",
    // Categories
    catCharacter: "Charakter",
    catSetting: "Weltbild",
    catPlot: "Handlungsstrang",
    catStyle: "Erzählstil",
    // Delete
    deleteConfirmTitle: "Eintrag verbrennen?",
    deleteConfirmMessage: "Sind Sie sicher, dass Sie dies aus den Archiven löschen möchten? Dies kann nicht rückgängig gemacht werden.",
    confirm: "Verbrennen",
    cancel: "Behalten"
  },
  es: {
    appTitle: "La Pluma Etérea",
    appSubtitle: "Autómata de Narrativas Victorianas",
    tabArchives: "Los Archivos",
    tabScriptorium: "El Escritorio",
    tabLexicon: "El Léxico",
    footer: "© 1895 La Pluma Etérea • Impulsado por Motor Gemini Automaton",
    archivesTitle: "Los Archivos",
    archivesSubtitle: "Repositorio de hechos y tradiciones conocidos",
    newEntry: "Nueva Entrada",
    category: "Categoría",
    nameTitle: "Nombre / Título",
    description: "Descripción",
    consultMuse: "Consultar Musa",
    archiveEntry: "Archivar Entrada",
    scriptoriumTitle: "El Escritorio",
    scriptoriumSubtitle: "Donde la imaginación encuentra la tinta",
    promptLabel: "El Susurro de tu Musa",
    generateBtn: "Inscribir Ficción",
    generatingBtn: "Inscribiendo...",
    finis: "~ Fin ~",
    addToTextbook: "Añadir al Libro de Texto",
    learningMode: "Modo de Aprendizaje",
    targetLang: "Idioma de la Historia",
    flashcardsTitle: "El Léxico",
    flashcardsSubtitle: "Tu vocabulario coleccionado",
    emptyTextbook: "Tu léxico está vacío. Lee historias para recolectar palabras.",
    flipCard: "Clic para voltear",
    // Categories
    catCharacter: "Personaje",
    catSetting: "Ambientación",
    catPlot: "Trama",
    catStyle: "Estilo Narrativo",
    // Delete
    deleteConfirmTitle: "¿Quemar esta entrada?",
    deleteConfirmMessage: "¿Estás seguro de que deseas borrar esto de los archivos? Esta acción no se puede deshacer.",
    confirm: "Quemar",
    cancel: "Mantener"
  }
};
