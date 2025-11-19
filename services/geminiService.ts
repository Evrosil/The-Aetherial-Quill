
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MemoryItem, AppLanguage, LearningAnalysis, MemoryCategory } from '../types';

// Initialize the Gemini client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const getLanguageName = (code: AppLanguage) => {
  switch(code) {
    case 'zh': return 'Simplified Chinese';
    case 'de': return 'German';
    case 'es': return 'Spanish';
    default: return 'English';
  }
};

/**
 * Maps internal categories to explicit AI instructions for better prompting.
 */
const getCategoryContextLabel = (category: MemoryCategory): string => {
  switch (category) {
    case MemoryCategory.CHARACTER:
      return "DRAMATIS PERSONAE (Characters & Traits)";
    case MemoryCategory.SETTING:
      return "SETTING & ATMOSPHERE (World Building Rules)";
    case MemoryCategory.PLOT:
      return "PLOT OUTLINE (Required Events)";
    case MemoryCategory.STYLE:
      return "STYLISTIC INSTRUCTIONS (Tone, Voice, & Constraints)";
    default:
      return "ADDITIONAL CONTEXT";
  }
};

/**
 * Generates a Victorian-style fan fiction based on user input and memory library context.
 */
export const generateFictionStory = async (
  userPrompt: string,
  memoryLibrary: MemoryItem[],
  targetLanguage: AppLanguage
): Promise<{ title: string; content: string }> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const langName = getLanguageName(targetLanguage);

  // Construct the context from the memory library with enhanced headers
  const memoryContext = memoryLibrary.map(item => 
    `[${getCategoryContextLabel(item.category)}]: 
     Name: ${item.name}
     Details: ${item.description}`
  ).join('\n\n');

  const systemInstruction = `
    You are a distinguished Victorian novelist, akin to the likes of Dickens, Brontë, or Doyle. 
    Your task is to write a short fan-fiction piece based on the User's Request, strictly adhering to the provided "Memory Library".
    
    Target Language: ${langName}
    
    Tone and Style:
    - Use elegant, slightly archaic vocabulary appropriate for the 19th century in the target language.
    - Sentence structures should be rhythmic and descriptive.
    - The narrative voice should be omniscient or first-person, depending on the prompt, but always sophisticated.
    
    Memory Library Usage Rules:
    1. [DRAMATIS PERSONAE]: Integrate these characters naturally. Use their described traits.
    2. [SETTING & ATMOSPHERE]: Set the scene using these rules and locations.
    3. [PLOT OUTLINE]: If present, ensure these events occur or are referenced.
    4. [STYLISTIC INSTRUCTIONS]: STRICTLY FOLLOW these constraints regarding tone or narrative voice.
    
    General Rules:
    - Do not contradict the Memory Library.
    - Generate a creative Title for the piece in the Target Language.
    - Keep the length between 300-600 words unless specified otherwise.
    
    Output Format (JSON):
    {
      "title": "The Title of the Story",
      "content": "The full story content..."
    }
  `;

  const fullPrompt = `
    === MEMORY LIBRARY (MANDATORY CONTEXT) ===
    ${memoryContext || "The archives are currently empty."}

    === USER'S REQUEST (INSPIRATION) ===
    ${userPrompt}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.8, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The spirit of the quill was silent (No response).");
    }

    const parsed = JSON.parse(text);
    return {
      title: parsed.title || "Untitled Chronicle",
      content: parsed.content || text
    };

  } catch (error) {
    console.error("Error generating fiction:", error);
    throw error;
  }
};

/**
 * Analyzes the generated story for language learning purposes (specifically for Chinese users/learners).
 */
export const analyzeStoryForLearning = async (
  storyContent: string,
  targetLanguage: AppLanguage
): Promise<LearningAnalysis> => {
  if (!apiKey) throw new Error("API Key is missing.");

  // If the story is in Chinese, we explain in English, otherwise explain in Chinese.
  const explanationLang = targetLanguage === 'zh' ? 'English' : 'Simplified Chinese';
  const targetLangName = getLanguageName(targetLanguage);

  const systemInstruction = `
    You are a strict language tutor specializing in Victorian literature. 
    Analyze the provided text (which is in ${targetLangName}) for a student who speaks ${explanationLang}.
    
    Tasks:
    1. Vocabulary: Identify 5-8 advanced, period-appropriate, or useful words used in the text. 
       - Provide the exact word as it appears (or its lemma).
       - Provide the translation in ${explanationLang}.
       - Provide a brief definition in ${explanationLang}.
    
    2. Grammar: Identify 2 complex grammar structures or stylized sentence patterns used in the text.
       - Copy the *exact* sentence from the text where this appears.
       - Explain the grammar rule or stylistic choice in ${explanationLang}.

    Output JSON format:
    {
      "vocabulary": [
        { "id": "v1", "word": "...", "translation": "...", "definition": "...", "partOfSpeech": "..." }
      ],
      "grammar": [
        { "sentence": "Exact sentence...", "rule": "Name of rule", "explanation": "..." }
      ]
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this text:\n${storyContent}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Analysis failed.");
    return JSON.parse(text) as LearningAnalysis;

  } catch (error) {
    console.error("Error analyzing story:", error);
    // Return empty analysis on failure to not break the app
    return { vocabulary: [], grammar: [] };
  }
};

/**
 * Enhances a memory entry draft using AI to provide Victorian flair and detail.
 */
export const enhanceMemoryEntry = async (
  draft: { category: string; name: string; description: string },
  language: AppLanguage
): Promise<{ name: string; description: string }> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const langName = getLanguageName(language);

  const systemInstruction = `
    You are a helpful Victorian literary assistant and world-builder.
    Your task is to take a rough draft for a story element (Character, Setting, Plot, or Style) and refine it into a rich, atmospheric entry suitable for a 19th-century novel's notes.
    Write the output in ${langName}.
    
    Guidelines:
    1. Enhance the Name: If provided name is simple (e.g., "John"), suggest a period-appropriate full name (e.g., "Dr. Johnathan Ashbourne"). If empty, invent one fitting the category.
    2. Expand the Description: Turn brief notes into 2-3 evocative sentences using Victorian vocabulary. Focus on sensory details, secrets, or dramatic potential.
    3. Maintain consistency with the requested Category.
    4. Output must be valid JSON.
  `;

  const prompt = `
    Please refine this archive entry draft:
    
    Category: ${draft.category}
    Draft Name: ${draft.name}
    Draft Description: ${draft.description}
    
    Return JSON format:
    {
      "name": "Refined Name",
      "description": "Refined Description"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error enhancing entry:", error);
    throw error;
  }
};
