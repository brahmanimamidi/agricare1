export type Language = 'en' | 'hi' | 'te';

export interface CropAdvisoryInput {
  soilType: string;
  season: string;
  state: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  rainfall: number;
  temperature: number;
}

export interface CropAdvisoryResult {
  recommendedCrop: string;
  idealSeason: string;
  fertilizerSuggestion: string;
  expectedYield: string;
  tips: string[];
}

export interface DiseaseDetectionInput {
  crop: string;
  symptoms: string[];
  image?: File | null;
  additionalDetails?: string;
}

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface DiseaseDetectionResult {
  diseaseName: string;
  severity: SeverityLevel;
  confidence: number;
  description: string;
  diseaseType: string;
  urgency: string;
  region: string;
  recommendedMedicine: string;
  fertilizerAdvisory: string;
  precautions: string[];
  organicAlternatives: string[];
  additionalTips: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface AgriBotInput {
  message: string;
  language: Language;
  chatHistory: ChatMessage[];
}

export interface AgriBotResponse {
  reply: string;
}
