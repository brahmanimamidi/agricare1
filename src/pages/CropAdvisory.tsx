import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResultCard from '@/components/ResultCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import TreeAnimation from '@/components/TreeAnimation';
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
  const [showTree, setShowTree] = useState(() => {
    if (sessionStorage.getItem('treeAnimationShown')) return false;
    return true;
  });
  const [showContent, setShowContent] = useState(!showTree);
  const [form, setForm] = useState<CropAdvisoryInput>({
    soilType: '', season: '', state: '',
    nitrogen: 0, phosphorus: 0, potassium: 0,
    pH: 0, rainfall: 0, temperature: 0,
  });

  const handleTreeComplete = useCallback(() => {
    sessionStorage.setItem('treeAnimationShown', 'true');
    setShowTree(false);
    setShowContent(true);
  }, []);

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

  const glassInput = "w-full font-body text-sm focus:outline-none transition-all px-3 py-2.5 rounded-[10px]";
  const glassInputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8f5e8',
  };

  return (
    <>
      {showTree && <TreeAnimation onComplete={handleTreeComplete} />}

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen"
          style={{ background: '#0a1f0a' }}
        >
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
            <h1 className="font-heading font-bold text-lg" style={{ color: '#e8f5e8' }}>{t('crop.title')}</h1>
            <LanguageSwitcher />
          </div>

          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[20px] p-6 space-y-4"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(200,168,75,0.2)',
              }}
            >
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>{t('crop.soilType')}</label>
                  <select className={glassInput} style={glassInputStyle} value={form.soilType} onChange={(e) => handleChange('soilType', e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; e.currentTarget.style.boxShadow = '0 0 12px rgba(200,168,75,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">—</option>
                    {soilTypes.map((s) => <option key={s} value={s}>{t(`soil.${s}`)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>{t('crop.season')}</label>
                  <select className={glassInput} style={glassInputStyle} value={form.season} onChange={(e) => handleChange('season', e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; e.currentTarget.style.boxShadow = '0 0 12px rgba(200,168,75,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">—</option>
                    {seasons.map((s) => <option key={s} value={s}>{t(`season.${s}`)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>{t('crop.state')}</label>
                  <select className={glassInput} style={glassInputStyle} value={form.state} onChange={(e) => handleChange('state', e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; e.currentTarget.style.boxShadow = '0 0 12px rgba(200,168,75,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">—</option>
                    {states.map((s) => <option key={s} value={s}>{t(`state.${s}`)}</option>)}
                  </select>
                </div>
              </div>

              {/* Numeric inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(['nitrogen', 'phosphorus', 'potassium', 'pH', 'rainfall', 'temperature'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>{t(`crop.${field}`)}</label>
                    <input
                      type="number"
                      className={glassInput}
                      style={glassInputStyle}
                      value={form[field] || ''}
                      onChange={(e) => handleChange(field, Number(e.target.value))}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; e.currentTarget.style.boxShadow = '0 0 12px rgba(200,168,75,0.2)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
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
                className="w-full py-3 rounded-full font-body font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(200,168,75,0.5)',
                  backdropFilter: 'blur(12px)',
                  color: '#c8a84b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200,168,75,0.15)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(200,168,75,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
              <p className="text-center text-sm font-body py-12" style={{ color: 'rgba(232,245,232,0.5)' }}>{t('common.noResults')}</p>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CropAdvisory;
