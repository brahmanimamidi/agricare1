import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResultCard from '@/components/ResultCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getCropRecommendation } from '@/services/cropAdvisory';
import { CropAdvisoryInput, CropAdvisoryResult } from '@/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

const soilTypes = ['clay', 'sandy', 'loamy', 'black', 'red', 'alluvial'] as const;
const seasons = ['kharif', 'rabi', 'zaid'] as const;
const states = ['ap', 'ts', 'ka', 'mh', 'up', 'pb', 'mp'] as const;

const CropAdvisory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropAdvisoryResult | null>(null);
  const [form, setForm] = useState<CropAdvisoryInput>({
    soilType: '', season: '', state: '',
    nitrogen: 0, phosphorus: 0, potassium: 0,
    pH: 0, rainfall: 0, temperature: 0,
  });

  const handleChange = (field: keyof CropAdvisoryInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    const res = await getCropRecommendation(form);
    setResult(res);
    setLoading(false);
  };

  const selectClass = "w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-body text-sm focus:outline-none input-glow transition-all";
  const inputClass = selectClass;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-background grain-bg"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" /> <span className="font-body text-sm">{t('common.back')}</span>
        </button>
        <h1 className="font-heading font-bold text-lg text-foreground">{t('crop.title')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">{t('crop.soilType')}</label>
              <select className={selectClass} value={form.soilType} onChange={(e) => handleChange('soilType', e.target.value)}>
                <option value="">—</option>
                {soilTypes.map((s) => <option key={s} value={s}>{t(`soil.${s}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">{t('crop.season')}</label>
              <select className={selectClass} value={form.season} onChange={(e) => handleChange('season', e.target.value)}>
                <option value="">—</option>
                {seasons.map((s) => <option key={s} value={s}>{t(`season.${s}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">{t('crop.state')}</label>
              <select className={selectClass} value={form.state} onChange={(e) => handleChange('state', e.target.value)}>
                <option value="">—</option>
                {states.map((s) => <option key={s} value={s}>{t(`state.${s}`)}</option>)}
              </select>
            </div>
          </div>

          {/* Numeric inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(['nitrogen', 'phosphorus', 'potassium', 'pH', 'rainfall', 'temperature'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-muted-foreground font-body mb-1">{t(`crop.${field}`)}</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form[field] || ''}
                  onChange={(e) => handleChange(field, Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm transition-all hover:glow-gold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? t('common.loading') : t('crop.getRecommendation')}
          </motion.button>
        </motion.div>

        {/* Results */}
        {loading && <LoadingSkeleton count={5} />}

        {!loading && result && (
          <div className="space-y-3">
            <ResultCard title={t('crop.recommendedCrop')} value={result.recommendedCrop} index={0} />
            <ResultCard title={t('crop.idealSeason')} value={result.idealSeason} index={1} />
            <ResultCard title={t('crop.fertilizer')} value={result.fertilizerSuggestion} index={2} />
            <ResultCard title={t('crop.expectedYield')} value={result.expectedYield} index={3} />
            <ResultCard
              title={t('crop.tips')}
              value={
                <ul className="list-disc list-inside space-y-1">
                  {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              }
              index={4}
            />
          </div>
        )}

        {!loading && !result && (
          <p className="text-center text-muted-foreground text-sm font-body py-12">{t('common.noResults')}</p>
        )}
      </div>
    </motion.div>
  );
};

export default CropAdvisory;
