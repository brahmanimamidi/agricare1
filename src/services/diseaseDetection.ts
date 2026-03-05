import { DiseaseDetectionInput, DiseaseDetectionResult } from '@/types';

/**
 * Detects crop diseases based on selected crop and symptoms.
 * Currently a placeholder — connect to your AI API or Supabase backend.
 */
export async function detectDisease(
  input: DiseaseDetectionInput
): Promise<DiseaseDetectionResult | null> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Placeholder: return null
  // Replace with actual API call
  return null;
}
