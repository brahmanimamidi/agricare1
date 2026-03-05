import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResultCard from '@/components/ResultCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { detectDisease } from '@/services/diseaseDetection';
import { DiseaseDetectionResult, SeverityLevel } from '@/types';
import { ArrowLeft, Search, RotateCcw } from 'lucide-react';

const crops = ['rice', 'wheat', 'cotton', 'tomato', 'potato', 'maize'] as const;
const symptoms = ['yellowLeaves', 'brownSpots', 'wilting', 'stunted', 'whiteCoating', 'rootRot', 'leafCurl', 'fruitRot'] as const;

const severityColors: Record<SeverityLevel, string> = {
  low: 'bg-primary/30 text-primary-foreground',
  medium: 'bg-accent/30 text-accent-foreground',
  high: 'bg-destructive/30 text-destructive-foreground',
};

const DiseaseDetection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [crop, setCrop] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleDetect = async () => {
    setLoading(true);
    setResult(null);
    const res = await detectDisease({ crop, symptoms: selectedSymptoms });
    setResult(res);
    setLoading(false);
  };

  const handleReset = () => {
    setCrop('');
    setSelectedSymptoms([]);
    setResult(null);
  };

  const selectClass = "w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-body text-sm focus:outline-none input-glow transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background grain-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" /> <span className="font-body text-sm">{t('common.back')}</span>
        </button>
        <h1 className="font-heading font-bold text-lg text-foreground">{t('disease.title')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1: Crop */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <label className="block text-xs text-muted-foreground font-body mb-1">{t('disease.selectCrop')}</label>
          <select className={selectClass} value={crop} onChange={(e) => { setCrop(e.target.value); setSelectedSymptoms([]); setResult(null); }}>
            <option value="">—</option>
            {crops.map((c) => <option key={c} value={c}>{t(`cropName.${c}`)}</option>)}
          </select>
        </motion.div>

        {/* Step 2: Symptoms */}
        {crop && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-xs text-muted-foreground font-body mb-2">{t('disease.selectSymptoms')}</label>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-all border ${
                    selectedSymptoms.includes(s)
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-card text-muted-foreground border-border hover:border-accent/50'
                  }`}
                >
                  {t(`symptom.${s}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Detect */}
        {crop && selectedSymptoms.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleDetect}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm transition-all hover:glow-gold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? t('common.loading') : t('disease.detect')}
          </motion.button>
        )}

        {/* Results */}
        {loading && <LoadingSkeleton count={4} />}

        {!loading && result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <ResultCard title={t('disease.name')} value={result.diseaseName} index={0} />
            <ResultCard
              title={t('disease.severity')}
              value={
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${severityColors[result.severity]}`}>
                  {t(`disease.${result.severity}`)}
                </span>
              }
              index={1}
            />
            <ResultCard title={t('disease.description')} value={result.description} index={2} />
            <ResultCard title={t('disease.medicine')} value={result.recommendedMedicine} index={3} />
            <ResultCard title={t('disease.fertilizerAdvisory')} value={result.fertilizerAdvisory} index={4} />
            <ResultCard
              title={t('disease.precautions')}
              value={<ul className="list-disc list-inside space-y-1">{result.precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>}
              index={5}
            />
            <ResultCard
              title={t('disease.organic')}
              value={<ul className="list-disc list-inside space-y-1">{result.organicAlternatives.map((a, i) => <li key={i}>{a}</li>)}</ul>}
              index={6}
            />

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-body font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> {t('disease.checkAnother')}
            </motion.button>
          </motion.div>
        )}

        {!loading && !result && (
          <p className="text-center text-muted-foreground text-sm font-body py-12">{t('disease.noResults')}</p>
        )}
      </div>
    </motion.div>
  );
};

export default DiseaseDetection;
