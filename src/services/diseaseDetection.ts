import { DiseaseDetectionInput, DiseaseDetectionResult } from '@/types';

const mockResults: Record<string, DiseaseDetectionResult> = {
  cashew: {
    diseaseName: 'Anthracnose (Colletotrichum gloeosporioides)',
    severity: 'high',
    confidence: 92,
    description: 'Anthracnose is a fungal disease affecting cashew leaves and nuts, causing dark necrotic lesions and premature fruit drop.',
    diseaseType: 'Fungal Disease',
    urgency: 'Act within 48hrs',
    region: 'Common in India',
    recommendedMedicine: 'Apply Carbendazim 50% WP at 1g/L or Mancozeb 75% WP at 2.5g/L as foliar spray. Repeat every 15 days during monsoon.',
    fertilizerAdvisory: 'Apply NPK 10:5:20 at 500g per tree. Add zinc sulphate 50g and borax 20g per tree. Avoid excess nitrogen during infection period.',
    precautions: [
      'Remove and burn infected plant parts immediately',
      'Ensure proper spacing between trees for air circulation',
      'Avoid overhead irrigation during humid conditions',
      'Apply copper-based fungicides preventively before monsoon',
      'Monitor regularly during flowering and fruiting stages',
    ],
    organicAlternatives: [
      'Neem oil spray (5ml/L) every 10 days',
      'Trichoderma viride bio-fungicide application',
      'Bordeaux mixture (1%) as preventive spray',
      'Pseudomonas fluorescens foliar application',
    ],
    additionalTips: 'Prune overcrowded branches to improve air circulation. Maintain field hygiene by collecting fallen debris. Intercrop with legumes to improve soil health. Schedule spraying in early morning or late evening for best results.',
  },
  cassava: {
    diseaseName: 'Cassava Mosaic Disease (CMD)',
    severity: 'medium',
    confidence: 87,
    description: 'A viral disease transmitted by whiteflies causing mosaic patterns, leaf distortion, and reduced tuber yield.',
    diseaseType: 'Viral Disease',
    urgency: 'Act within 1 week',
    region: 'Common in India',
    recommendedMedicine: 'No direct cure for viral diseases. Control whitefly vectors using Imidacloprid 17.8% SL at 0.3ml/L or install yellow sticky traps.',
    fertilizerAdvisory: 'Apply balanced NPK 15:15:15 at 200kg/ha. Supplement with potassium to boost plant immunity.',
    precautions: [
      'Use only disease-free planting material',
      'Remove and destroy infected plants immediately',
      'Control whitefly populations with insecticides',
      'Practice crop rotation with non-host crops',
    ],
    organicAlternatives: [
      'Yellow sticky traps for whitefly monitoring',
      'Neem seed kernel extract spray',
      'Intercropping with repellent plants like marigold',
    ],
    additionalTips: 'Source certified disease-free stem cuttings. Plant resistant varieties when available. Rogue out infected plants early to prevent spread.',
  },
  maize: {
    diseaseName: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    severity: 'medium',
    confidence: 85,
    description: 'A fungal disease causing long, cigar-shaped gray-green lesions on maize leaves, leading to significant yield loss.',
    diseaseType: 'Fungal Disease',
    urgency: 'Act within 72hrs',
    region: 'Common in India',
    recommendedMedicine: 'Apply Propiconazole 25% EC at 1ml/L or Azoxystrobin 23% SC at 1ml/L as foliar spray at first symptom appearance.',
    fertilizerAdvisory: 'Apply nitrogen in split doses. Use NPK 20:10:10 at 250kg/ha. Add zinc sulphate 25kg/ha.',
    precautions: [
      'Plant resistant hybrid varieties',
      'Maintain optimal plant spacing',
      'Remove crop residues after harvest',
      'Rotate with non-cereal crops',
    ],
    organicAlternatives: [
      'Trichoderma harzianum seed treatment',
      'Compost tea foliar spray',
      'Crop residue management through composting',
    ],
    additionalTips: 'Early planting helps avoid peak disease pressure. Monitor fields regularly from V6 stage onwards. Ensure good drainage to reduce humidity.',
  },
  tomato: {
    diseaseName: 'Early Blight (Alternaria solani)',
    severity: 'high',
    confidence: 90,
    description: 'A common fungal disease causing concentric ring-patterned brown lesions on lower leaves, progressing upward.',
    diseaseType: 'Fungal Disease',
    urgency: 'Act within 48hrs',
    region: 'Common in India',
    recommendedMedicine: 'Spray Chlorothalonil 75% WP at 2g/L or Mancozeb + Metalaxyl combination. Apply at 10-day intervals.',
    fertilizerAdvisory: 'Apply calcium-rich fertilizers. Use NPK 12:12:17 at 300kg/ha. Foliar spray of calcium chloride 0.5%.',
    precautions: [
      'Stake plants to improve air circulation',
      'Mulch around plants to prevent soil splash',
      'Water at base, avoid wetting foliage',
      'Remove lower infected leaves promptly',
      'Practice 3-year crop rotation',
    ],
    organicAlternatives: [
      'Copper hydroxide organic fungicide',
      'Bacillus subtilis bio-fungicide',
      'Compost tea and effective microorganisms (EM)',
      'Neem cake soil application',
    ],
    additionalTips: 'Stake and prune plants for better ventilation. Harvest promptly when ripe. Use drip irrigation to keep foliage dry.',
  },
};

export async function detectDisease(
  input: DiseaseDetectionInput
): Promise<DiseaseDetectionResult> {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return mockResults[input.crop] || mockResults['tomato'];
}
