import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResultCard from '@/components/ResultCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import TreeAnimation from '@/components/TreeAnimation';
import { getCropRecommendation, CropResult } from '@/services/cropAdvisory';
import { ArrowLeft, Sparkles } from 'lucide-react';

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(styleSheet);

const CropAdvisory = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropResult[] | null>(null);
  const [errorProps, setErrorProps] = useState<string | null>(null);
  const [showTree, setShowTree] = useState(() => {
    if (sessionStorage.getItem('treeAnimationShown')) return false;
    return true;
  });
  const [showContent, setShowContent] = useState(!showTree);
  const [form, setForm] = useState({
    nitrogen: '' as number | '', phosphorus: '' as number | '', potassium: '' as number | '',
    temperature: '' as number | '', humidity: '' as number | '', pH: '' as number | '', rainfall: '' as number | ''
  });

  const handleTreeComplete = useCallback(() => {
    sessionStorage.setItem('treeAnimationShown', 'true');
    setShowTree(false);
    setShowContent(true);
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { nitrogen: n, phosphorus: p, potassium: k, temperature, humidity, pH: ph, rainfall } = form;

    if (!n || !p || !k || !temperature || !humidity || !ph || !rainfall) {
      setErrorProps('Please fill in all fields')
      return
    }

    setLoading(true)
    setErrorProps('')
    setResult([])

    try {
      const data = await getCropRecommendation({
        n: Number(n),
        p: Number(p),
        k: Number(k),
        temperature: Number(temperature),
        humidity: Number(humidity),
        ph: Number(ph),
        rainfall: Number(rainfall)
      })

      if (data.length === 0) {
        setErrorProps(
          language === 'hi'
            ? 'कोई फसल नहीं मिली। कृपया अलग मान दर्ज करें।'
            : language === 'te'
              ? 'పంటలు కనుగొనబడలేదు. దయచేసి వేరే విలువలు నమోదు చేయండి.'
              : 'No crops found for these values. Try different values.'
        )
      } else {
        setResult(data)
      }
    } catch (error) {
      console.error('Crop advisory error:', error)
      setErrorProps(
        language === 'hi'
          ? 'डेटा लोड करने में समस्या हुई। कृपया दोबारा कोशिश करें।'
          : language === 'te'
            ? 'డేటా లోడ్ చేయడంలో సమస్య. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Failed to load data. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

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
              {/* Numeric inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'Enter value (0-140)', step: '1' },
                  { id: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'Enter value (5-145)', step: '1' },
                  { id: 'potassium', label: 'Potassium (K)', placeholder: 'Enter value (5-205)', step: '1' },
                  { id: 'temperature', label: 'Temperature (°C)', placeholder: 'Enter value (8-44)', step: 'any' },
                  { id: 'humidity', label: 'Humidity (%)', placeholder: 'Enter value (14-100)', step: '1' },
                  { id: 'pH', label: 'pH Level', placeholder: 'Enter value (3.5-9.9)', step: 'any' },
                  { id: 'rainfall', label: 'Rainfall (mm)', placeholder: 'Enter value (20-300)', step: 'any' },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>
                      {field.label}
                    </label>
                    <input
                      type="number"
                      step={field.step}
                      placeholder={field.placeholder}
                      className={glassInput}
                      style={glassInputStyle}
                      value={form[field.id as keyof typeof form]}
                      onChange={(e) => handleChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
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

            {!loading && errorProps && (
              <p className="text-center text-red-400 text-sm font-body py-12" style={{ color: '#ff6b6b' }}>{errorProps}</p>
            )}

            {!loading && result && result.length > 0 && (
              <div className="space-y-3">
                {result.map((crop, index) => (
                  <div
                    key={index}
                    className="result-card"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(200,168,75,0.2)',
                      borderRadius: '20px',
                      padding: '28px',
                      marginBottom: '16px',
                      animation: `fadeSlideUp 0.5s ease forwards`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0
                    }}
                  >
                    {/* Crop Name */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.6rem',
                        color: '#e8f5e8',
                        textTransform: 'capitalize',
                        margin: 0
                      }}>
                        🌾 {crop.label}
                      </h3>
                      <span style={{
                        background: 'rgba(200,168,75,0.2)',
                        border: '1px solid #c8a84b',
                        borderRadius: '50px',
                        padding: '4px 14px',
                        color: '#c8a84b',
                        fontSize: '0.85rem',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        #{index + 1} Match
                      </span>
                    </div>

                    {/* Confidence Bar */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'rgba(232,245,232,0.7)', fontSize: '0.85rem', fontFamily: 'DM Sans' }}>
                          Match Score
                        </span>
                        <span style={{ color: '#c8a84b', fontSize: '0.85rem', fontFamily: 'DM Sans', fontWeight: 600 }}>
                          {crop.confidence}%
                        </span>
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${crop.confidence}%`,
                          height: '100%',
                          background: crop.confidence > 75
                            ? 'linear-gradient(90deg, #2d6a2d, #4aaa4a)'
                            : crop.confidence > 50
                              ? 'linear-gradient(90deg, #a07830, #c8a84b)'
                              : 'linear-gradient(90deg, #8b2020, #c84b4b)',
                          borderRadius: '50px',
                          transition: 'width 1s ease'
                        }} />
                      </div>
                    </div>

                    {/* NPK Values Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '10px',
                      marginBottom: '16px'
                    }}>
                      {[
                        { label: 'Nitrogen', value: Math.round(crop.N), unit: 'N', color: '#4a9e4a' },
                        { label: 'Phosphorus', value: Math.round(crop.P), unit: 'P', color: '#c8a84b' },
                        { label: 'Potassium', value: Math.round(crop.K), unit: 'K', color: '#4ecdc4' },
                        { label: 'pH Level', value: Number(crop.ph).toFixed(1), unit: 'pH', color: '#a78bfa' }
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          padding: '12px 8px',
                          textAlign: 'center',
                          border: `1px solid ${item.color}30`
                        }}>
                          <div style={{ color: item.color, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'DM Sans' }}>
                            {item.value}
                          </div>
                          <div style={{ color: 'rgba(232,245,232,0.5)', fontSize: '0.7rem', fontFamily: 'DM Sans' }}>
                            {item.unit}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extra Values Row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px'
                    }}>
                      {[
                        { label: '🌡️ Temp', value: `${Number(crop.temperature).toFixed(1)}°C` },
                        { label: '💧 Humidity', value: `${Number(crop.humidity).toFixed(0)}%` },
                        { label: '🌧️ Rainfall', value: `${Number(crop.rainfall).toFixed(0)}mm` }
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '10px',
                          padding: '10px',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: '#e8f5e8', fontSize: '0.85rem', fontFamily: 'DM Sans' }}>
                            {item.value}
                          </div>
                          <div style={{ color: 'rgba(232,245,232,0.4)', fontSize: '0.7rem', fontFamily: 'DM Sans' }}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && result && result.length === 0 && !errorProps && (
              <p className="text-center text-sm font-body py-12" style={{ color: 'rgba(232,245,232,0.5)' }}>{t('common.noResults')}</p>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CropAdvisory;
