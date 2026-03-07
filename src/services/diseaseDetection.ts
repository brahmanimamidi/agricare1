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
  imageFile: File,
  language: 'en' | 'hi' | 'te' = 'en'
): Promise<DiseaseResult> {

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu'
  }

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
  })

  const prompt = `
You are an expert plant pathologist and agricultural 
scientist specializing in Indian farming.
Carefully analyze this crop leaf image and identify:
1. The exact crop type
2. Any disease, pest damage or confirm if healthy
3. Complete treatment advice for Indian farmers

Respond ONLY in ${langMap[language]} language.
Respond ONLY in valid JSON, no markdown:
{
  "diseaseName": "exact disease name or Healthy Plant",
  "cropName": "identified crop name",
  "severity": "low or medium or high",
  "confidence": 85,
  "description": "what you see and what the disease is",
  "treatment": "specific medicine names and dosage in India",
  "fertilizerAdvisory": "fertilizer recommendations",
  "precautions": ["precaution 1","precaution 2","precaution 3"],
  "organicAlternatives": "natural treatment options",
  "additionalTips": "prevention and recovery tips"
}
severity must be: low, medium, or high
confidence must be number 60-98
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            {
              inline_data: {
                mime_type: imageFile.type || 'image/jpeg',
                data: base64
              }
            },
            { text: prompt }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024
        }
      })
    }
  )

  const data = await response.json()
  console.log('Vision response:', data)

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'Vision API failed')
  }

  const text = data.candidates[0].content.parts[0].text
  let clean = text.replace(/```json|```/g, '').trim()
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    clean = clean.substring(start, end + 1)
  }

  try {
    const result = JSON.parse(clean)
    return {
      diseaseName: result.diseaseName || 'Unknown',
      cropName: result.cropName || 'Unknown',
      severity: result.severity || 'medium',
      confidence: result.confidence || 75,
      description: result.description || '',
      treatment: result.treatment || '',
      fertilizerAdvisory: result.fertilizerAdvisory || '',
      precautions: Array.isArray(result.precautions)
        ? result.precautions : [],
      organicAlternatives: result.organicAlternatives || '',
      additionalTips: result.additionalTips || ''
    }
  } catch {
    throw new Error('Could not process image. Try again.')
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
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
  cropName?: string
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
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
