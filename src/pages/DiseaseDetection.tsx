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
const symptoms = ['yellowLeaves', 'brownSpots', 'wilting', 'stunted', 'whiteCoating', 'holesInLeaves', 'rootRot', 'leafCurl', 'blackSpots', 'driedTips'] as const;

const severityBadge: Record<SeverityLevel, { bg: string; color: string }> = {
  low: { bg: 'rgba(45,106,45,0.3)', color: '#4ade80' },
  medium: { bg: 'rgba(200,168,75,0.3)', color: '#c8a84b' },
  high: { bg: 'rgba(239,68,68,0.3)', color: '#ef4444' },
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

  const glassInput = "w-full font-body text-sm focus:outline-none transition-all px-3 py-2.5 rounded-[10px]";
  const glassStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8f5e8',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen" style={{ background: '#0a1f0a' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(10,31,10,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,245,232,0.6)' }}>
          <ArrowLeft className="w-5 h-5" /> <span className="font-body text-sm">{t('common.back')}</span>
        </button>
        <h1 className="font-heading font-bold text-lg" style={{ color: '#e8f5e8' }}>{t('disease.title')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] p-6 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(200,168,75,0.2)',
          }}
        >
          {/* Step 1: Crop */}
          <div>
            <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>{t('disease.selectCrop')}</label>
            <select
              className={glassInput}
              style={glassStyle}
              value={crop}
              onChange={(e) => { setCrop(e.target.value); setSelectedSymptoms([]); setResult(null); }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <option value="">—</option>
              {crops.map((c) => <option key={c} value={c}>{t(`cropName.${c}`)}</option>)}
            </select>
          </div>

          {/* Step 2: Symptoms */}
          {crop && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <label className="block text-xs font-body mb-2" style={{ color: 'rgba(232,245,232,0.6)' }}>{t('disease.selectSymptoms')}</label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-body transition-all"
                    style={
                      selectedSymptoms.includes(s)
                        ? { background: 'rgba(200,168,75,0.2)', border: '1px solid #c8a84b', color: '#c8a84b' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(232,245,232,0.6)' }
                    }
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
              className="w-full py-3 rounded-full font-body font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(200,168,75,0.5)',
                backdropFilter: 'blur(12px)',
                color: '#c8a84b',
              }}
            >
              <Search className="w-4 h-4" />
              {loading ? t('common.loading') : t('disease.detect')}
            </motion.button>
          )}
        </motion.div>

        {/* Results */}
        {loading && <LoadingSkeleton count={4} />}

        {!loading && result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <ResultCard title={t('disease.name')} value={<span style={{ color: '#c8a84b', fontSize: '1.1rem', fontWeight: 600 }}>{result.diseaseName}</span>} index={0} />
            <ResultCard
              title={t('disease.severity')}
              value={
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={severityBadge[result.severity]}
                >
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
              value={<ul className="space-y-1">{result.precautions.map((p, i) => <li key={i}>⚠️ {p}</li>)}</ul>}
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
              className="w-full py-3 rounded-full font-body font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(232,245,232,0.7)',
              }}
            >
              <RotateCcw className="w-4 h-4" /> {t('disease.checkAnother')}
            </motion.button>
          </motion.div>
        )}

        {!loading && !result && (
          <p className="text-center text-sm font-body py-12" style={{ color: 'rgba(232,245,232,0.5)' }}>{t('disease.noResults')}</p>
        )}
      </div>
    </motion.div>
  );
};

export default DiseaseDetection;
