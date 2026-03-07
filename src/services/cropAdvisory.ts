import { supabase } from '../lib/supabase'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

export interface CropInput {
  n: number
  p: number
  k: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
}

export interface CropResult {
  label: string
  N: number
  P: number
  K: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  confidence: number
}

export async function getCropRecommendation(
  inputs: CropInput
): Promise<CropResult[]> {

  console.log('Fetching all crops from Supabase...')

  const { data, error } = await supabase
    .from('crop_advisory')
    .select('*')

  console.log('Total rows fetched:', data?.length)
  console.log('Error if any:', error)
  console.log('First row sample:', data?.[0])

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) {
    throw new Error('No data in database')
  }

  // Do ALL comparison in JavaScript
  // No Supabase filtering at all
  const scored = data.map((row: any) => {

    // Get values - try both uppercase and lowercase
    const rowN = Number(row.N ?? row.n ?? 0)
    const rowP = Number(row.P ?? row.p ?? 0)
    const rowK = Number(row.K ?? row.k ?? 0)
    const rowTemp = Number(row.temperature ?? 0)
    const rowHumid = Number(row.humidity ?? 0)
    const rowPh = Number(row.ph ?? 0)
    const rowRain = Number(row.rainfall ?? 0)
    const rowLabel = row.label ?? row.crop_name ?? ''

    // Euclidean distance - normalized
    const nDiff = Math.abs(rowN - inputs.n) / 140
    const pDiff = Math.abs(rowP - inputs.p) / 145
    const kDiff = Math.abs(rowK - inputs.k) / 205
    const tempDiff = Math.abs(rowTemp - inputs.temperature) / 40
    const humidDiff = Math.abs(rowHumid - inputs.humidity) / 100
    const phDiff = Math.abs(rowPh - inputs.ph) / 10
    const rainDiff = Math.abs(rowRain - inputs.rainfall) / 300

    const distance = Math.sqrt(
      nDiff ** 2 + pDiff ** 2 + kDiff ** 2 +
      tempDiff ** 2 + humidDiff ** 2 +
      phDiff ** 2 + rainDiff ** 2
    )

    return {
      label: rowLabel,
      N: rowN,
      P: rowP,
      K: rowK,
      temperature: rowTemp,
      humidity: rowHumid,
      ph: rowPh,
      rainfall: rowRain,
      distance
    }
  })

  // Sort by closest match
  scored.sort((a: any, b: any) => a.distance - b.distance)

  console.log('Top 5 matches:', scored.slice(0, 5).map(
    (r: any) => ({ label: r.label, distance: r.distance.toFixed(3) })
  ))

  // Group by crop label, keep best match per crop
  const cropMap: { [key: string]: any } = {}

  scored.forEach((row: any) => {
    if (!cropMap[row.label]) {
      cropMap[row.label] = row
    }
  })

  // Convert to array and calculate confidence
  const maxDistance = Math.sqrt(7) // max possible distance

  const results = Object.values(cropMap)
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, 5)
    .map((row: any) => ({
      ...row,
      confidence: Math.round(
        Math.max(0, Math.min(100,
          (1 - row.distance / maxDistance) * 100
        ))
      )
    }))

  console.log('Final results:', results.map(
    (r: any) => ({ label: r.label, confidence: r.confidence })
  ))

  return results
}

export interface LocationAdvisoryInput {
  city: string
  crop: string
  season: string
  language: 'en' | 'hi' | 'te'
}

export interface CropSuitabilityResult {
  verdict: 'yes' | 'no' | 'maybe'
  climateMatch: number
  reason: string
  bestSeason: string
  expectedYield: string
  keyChallenges: string
  recommendedFertilizers: string
  precautions: string
  additionalTips: string
}

export interface LocationCropResult {
  cropName: string
  emoji: string
  reason: string
  bestSeason: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  climateMatch: number
}

export async function checkCropSuitability(
  city: string,
  crop: string,
  season: string,
  language: 'en' | 'hi' | 'te'
): Promise<CropSuitabilityResult> {

  const langMap = { en: 'English', hi: 'Hindi', te: 'Telugu' }

  const prompt = `
You are an expert agricultural scientist with deep 
knowledge of Indian regional farming conditions.

Farmer Location: ${city}, India
Crop: ${crop}
Season: ${season}

Analyze if this crop can be grown successfully here.

Respond ONLY in ${langMap[language]}.
Respond ONLY in valid JSON, no markdown:
{
  "verdict": "yes or no or maybe",
  "climateMatch": 85,
  "reason": "detailed explanation based on climate and soil of this city",
  "bestSeason": "best season to grow in this location",
  "expectedYield": "expected yield per acre",
  "keyChallenges": "specific challenges in this region",
  "recommendedFertilizers": "specific fertilizers for this region",
  "precautions": "region specific precautions",
  "additionalTips": "local market advice and government schemes"
}

verdict must be exactly: yes, no, or maybe
climateMatch must be number 0-100
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      })
    }
  )

  const data = await response.json()
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'API failed')
  }

  const text = data.candidates[0].content.parts[0].text
  let clean = text.replace(/```json|```/g, '').trim()
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1)

  try {
    const result = JSON.parse(clean)
    return {
      verdict: result.verdict || 'maybe',
      climateMatch: result.climateMatch || 70,
      reason: result.reason || '',
      bestSeason: result.bestSeason || '',
      expectedYield: result.expectedYield || '',
      keyChallenges: result.keyChallenges || '',
      recommendedFertilizers: result.recommendedFertilizers || '',
      precautions: result.precautions || '',
      additionalTips: result.additionalTips || ''
    }
  } catch {
    throw new Error('Could not process response. Try again.')
  }
}

export async function getBestCropsForLocation(
  city: string,
  season: string,
  language: 'en' | 'hi' | 'te'
): Promise<LocationCropResult[]> {

  const langMap = { en: 'English', hi: 'Hindi', te: 'Telugu' }

  const prompt = `
You are an expert agricultural scientist 
specializing in Indian regional farming.

Location: ${city}, India
Season: ${season}

Recommend TOP 5 most suitable crops for 
this specific location and season.

Respond ONLY in ${langMap[language]}.
Respond ONLY in valid JSON array, no markdown:
[
  {
    "cropName": "Rice",
    "emoji": "🌾",
    "reason": "why this suits this location",
    "bestSeason": "Kharif",
    "difficulty": "Easy",
    "climateMatch": 92
  }
]

difficulty must be: Easy, Medium, or Hard
climateMatch must be number 0-100
Be very specific to the Indian city mentioned.
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
      })
    }
  )

  const data = await response.json()
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'API failed')
  }

  const text = data.candidates[0].content.parts[0].text
  let clean = text.replace(/```json|```/g, '').trim()
  const start = clean.indexOf('[')
  const end = clean.lastIndexOf(']')
  if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1)

  try {
    return JSON.parse(clean).slice(0, 5)
  } catch {
    throw new Error('Could not process response. Try again.')
  }
}
