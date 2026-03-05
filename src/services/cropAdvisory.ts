import { CropAdvisoryInput, CropAdvisoryResult } from '@/types';

/**
 * Fetches crop recommendations based on soil, climate, and region data.
 * Currently a placeholder — connect to your AI API or Supabase backend.
 */
export async function getCropRecommendation(
  input: CropAdvisoryInput
): Promise<CropAdvisoryResult | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Placeholder: return null (no mock data)
  // Replace with actual API call:
  // const response = await fetch(`${import.meta.env.VITE_API_URL}/crop-advisory`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(input),
  // });
  // return response.json();

  return null;
}
