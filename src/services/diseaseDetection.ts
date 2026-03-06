import * as tmImage from '@teachablemachine/image'

const MODEL_URL = import.meta.env.VITE_TEACHABLE_MACHINE_URL
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

let model: tmImage.CustomMobileNet | null = null

export interface DetectionResult {
  diseaseName: string
  crop: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  isHealthy: boolean
}

export interface AdvisoryResult {
  treatment: string
  fertilizerAdvisory: string
  precautions: string[]
  organicAlternatives: string
  additionalTips: string
}

export async function detectDiseaseFromImage(
  imageFile: File
): Promise<DetectionResult> {

  if (!model) {
    model = await tmImage.load(
      MODEL_URL + 'model.json',
      MODEL_URL + 'metadata.json'
    )
  }

  const imageURL = URL.createObjectURL(imageFile)
  const img = new Image()
  img.src = imageURL
  await new Promise(resolve => img.onload = resolve)

  const predictions = await model.predict(img)
  URL.revokeObjectURL(imageURL)

  const top = predictions.sort(
    (a, b) => b.probability - a.probability
  )[0]

  const isHealthy = top.className.toLowerCase().includes('healthy')
  const confidence = Math.round(top.probability * 100)

  return {
    diseaseName: top.className,
    crop: top.className.split(' ')[0],
    confidence,
    severity: isHealthy ? 'low' :
      confidence > 85 ? 'high' : 'medium',
    isHealthy
  }
}

export async function getDiseaseAdvisory(
  diseaseName: string,
  cropName: string,
  language: 'en' | 'hi' | 'te'
): Promise<AdvisoryResult> {

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu'
  }

  const prompt = `
You are an expert agricultural scientist advising Indian farmers.
Crop: ${cropName}
Disease detected: ${diseaseName}

Respond ONLY in ${langMap[language]} language.
Respond ONLY in valid JSON format, no markdown, no extra text:
{
  "treatment": "detailed medicine names, dosage and how to apply",
  "fertilizerAdvisory": "specific fertilizer recommendations with quantities",
  "precautions": ["precaution 1", "precaution 2", "precaution 3", "precaution 4"],
  "organicAlternatives": "natural and organic treatment options",
  "additionalTips": "prevention tips and recovery guidance"
}
Be specific to Indian farming.
Include medicine brand names available in India.
Use simple language a farmer can understand.
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024
        }
      })
    }
  )

  const data = await response.json()
  const text = data.candidates[0].content.parts[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function askFollowUpQuestion(
  question: string,
  diseaseName: string,
  cropName: string,
  language: 'en' | 'hi' | 'te'
): Promise<string> {

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu'
  }

  const prompt = `
You are an expert agricultural scientist.
Context: Farmer has ${diseaseName} disease in ${cropName} crop.
Farmer question: ${question}

Answer in ${langMap[language]} only.
Keep answer practical, simple, under 150 words.
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 512
        }
      })
    }
  )

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

export interface SymptomInput {
  crop: string
  symptoms: string[]
  additionalDetails?: string
  language: 'en' | 'hi' | 'te'
}

export interface DiseaseResult {
  diseaseName: string
  severity: 'low' | 'medium' | 'high'
  description: string
  treatment: string
  fertilizerAdvisory: string
  precautions: string[]
  organicAlternatives: string
  additionalTips: string
  confidence: number
}

export async function detectDiseaseFromSymptoms(
  input: SymptomInput
): Promise<DiseaseResult> {

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu'
  }

  const prompt = `
You are an expert plant pathologist and agricultural scientist 
specializing in Indian farming.

Crop: ${input.crop}
Observed symptoms: ${input.symptoms.join(', ')}
${input.additionalDetails ? `Additional details: ${input.additionalDetails}` : ''}

Based on these symptoms, identify the most likely disease 
and provide complete treatment advice.

Respond ONLY in ${langMap[input.language]} language.
Respond ONLY in valid JSON format, no markdown, no extra text:
{
  "diseaseName": "exact disease name",
  "severity": "low or medium or high",
  "confidence": 85,
  "description": "what this disease is and how it spreads",
  "treatment": "specific medicine names, dosage and application method available in India",
  "fertilizerAdvisory": "fertilizer recommendations to help recovery",
  "precautions": [
    "precaution 1",
    "precaution 2", 
    "precaution 3",
    "precaution 4"
  ],
  "organicAlternatives": "natural and organic treatment options",
  "additionalTips": "prevention tips for future and current recovery guidance"
}

Be very specific to Indian farming conditions.
Include actual medicine/pesticide brand names sold in India.
severity must be exactly: low, medium, or high
confidence must be a number between 60 and 98
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    }
  )

  const data = await response.json()

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'Gemini API failed')
  }

  const text = data.candidates[0].content.parts[0].text
  console.log('Raw Gemini response:', text)
  let clean = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const jsonStart = clean.indexOf('{')
  const jsonEnd = clean.lastIndexOf('}')

  if (jsonStart !== -1 && jsonEnd !== -1) {
    clean = clean.substring(jsonStart, jsonEnd + 1)
  }

  console.log('Cleaned JSON:', clean)

  try {
    const result = JSON.parse(clean)

    return {
      diseaseName: result.diseaseName || 'Unknown Disease',
      severity: result.severity || 'medium',
      confidence: result.confidence || 75,
      description: result.description || '',
      treatment: result.treatment || '',
      fertilizerAdvisory: result.fertilizerAdvisory || '',
      precautions: Array.isArray(result.precautions)
        ? result.precautions
        : [result.precautions || ''],
      organicAlternatives: result.organicAlternatives || '',
      additionalTips: result.additionalTips || ''
    }
  } catch (parseError) {
    console.error('Parse error:', parseError)
    console.error('Failed to parse:', clean)

    throw new Error(
      'Could not process response. Please try again.'
    )
  }
}

export async function askDiseaseFollowUp(
  question: string,
  diseaseName: string,
  cropName: string,
  language: 'en' | 'hi' | 'te'
): Promise<string> {

  const langMap = { en: 'English', hi: 'Hindi', te: 'Telugu' }

  const prompt = `
Agricultural expert context: 
Farmer has ${diseaseName} disease in ${cropName} crop.
Farmer question: ${question}

Answer in ${langMap[language]} only.
Practical, simple answer under 120 words.
Include specific product names if relevant.
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 256 }
      })
    }
  )

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}
