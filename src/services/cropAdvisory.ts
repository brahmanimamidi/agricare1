import { supabase } from '../lib/supabase'

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
