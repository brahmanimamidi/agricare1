import { AgriBotInput, AgriBotResponse } from '@/types';

/**
 * Sends a user message to the AgriBot service and returns a reply.
 * Accepts the current language and full chat history for context.
 *
 * Currently a placeholder — connect to any AI API (OpenAI, Gemini, etc.)
 * or a Supabase Edge Function.
 *
 * Example integration:
 * const response = await fetch(`${import.meta.env.VITE_API_URL}/agribot`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(input),
 * });
 * return response.json();
 */
export async function sendMessage(
  input: AgriBotInput
): Promise<AgriBotResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Placeholder reply
  return {
    reply: '',
  };
}
