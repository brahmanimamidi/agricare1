import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getCropRecommendation, CropResult, checkCropSuitability, getBestCropsForLocation, CropSuitabilityResult, LocationCropResult } from '@/services/cropAdvisory';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react';

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

  // Tab state
  const [tab, setTab] = useState<'npk' | 'location'>('npk');

  // NPK Form state
  const [form, setForm] = useState({
    nitrogen: '' as number | '', phosphorus: '' as number | '', potassium: '' as number | '',
    temperature: '' as number | '', humidity: '' as number | '', pH: '' as number | '', rainfall: '' as number | ''
  });

  // Location Form state
  const [locationForm, setLocationForm] = useState({
    city: '', crop: '', season: 'Kharif (June-October)'
  });

  // Results state
  const [suitabilityResult, setSuitabilityResult] = useState<CropSuitabilityResult | null>(null);
  const [locationCrops, setLocationCrops] = useState<LocationCropResult[] | null>(null);

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

  const handleLocationChange = (field: string, value: string) => {
    setLocationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckSuitability = async (overrideCrop?: string) => {
    const city = locationForm.city;
    const crop = overrideCrop || locationForm.crop;
    const season = locationForm.season;

    if (!city || !crop) {
      setErrorProps('Please enter city and crop name');
      return;
    }

    setLoading(true);
    setErrorProps(null);
    setSuitabilityResult(null);
    setLocationCrops(null);

    try {
      const res = await checkCropSuitability(
        city,
        crop,
        season,
        language as 'en' | 'hi' | 'te'
      );
      setSuitabilityResult(res);
      if (overrideCrop) {
        setLocationForm(prev => ({ ...prev, crop: overrideCrop }));
      }
    } catch (err: any) {
      setErrorProps(err.message || 'Failed to check crop suitability');
    } finally {
      setLoading(false);
    }
  };

  const handleGetBestCrops = async () => {
    if (!locationForm.city) {
      setErrorProps('Please enter your city');
      return;
    }

    setLoading(true);
    setErrorProps(null);
    setSuitabilityResult(null);
    setLocationCrops(null);

    try {
      const res = await getBestCropsForLocation(
        locationForm.city,
        locationForm.season,
        language as 'en' | 'hi' | 'te'
      );
      setLocationCrops(res);
    } catch (err: any) {
      setErrorProps(err.message || 'Failed to get best crops');
    } finally {
      setLoading(false);
    }
  };

  const glassInput = "w-full font-body text-sm focus:outline-none transition-all px-3 py-2.5 rounded-[10px]";
  const glassInputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8f5e8',
  };

  return (
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

        {/* Tab selector */}
        <div className="relative flex rounded-full overflow-hidden mx-auto max-w-md"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-0 bottom-0 rounded-full"
            style={{ width: '50%', background: 'rgba(255,255,255,0.08)', borderBottom: '2px solid #c8a84b' }}
            animate={{ x: tab === 'npk' ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setTab('npk')}
            className="relative z-10 flex-1 py-3 text-sm font-body font-medium transition-colors"
            style={{ color: tab === 'npk' ? '#c8a84b' : 'rgba(232,245,232,0.4)' }}
          >
            🌱 NPK Analysis
          </button>
          <button
            onClick={() => setTab('location')}
            className="relative z-10 flex-1 py-3 text-sm font-body font-medium transition-colors"
            style={{ color: tab === 'location' ? '#c8a84b' : 'rgba(232,245,232,0.4)' }}
          >
            📍 Location Based
          </button>
        </div>

        {/* TAB 1: NPK Form */}
        {tab === 'npk' && (
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
        )}

        {/* TAB 2: Location form */}
        {tab === 'location' && (
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
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-body mb-2" style={{ color: 'rgba(232,245,232,0.6)' }}>
                  Your City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Visakhapatnam, Hyderabad"
                    className={glassInput + ' pl-10'}
                    style={glassInputStyle}
                    value={locationForm.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'rgba(232,245,232,0.4)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body mb-2" style={{ color: 'rgba(232,245,232,0.6)' }}>
                  Crop You Want to Grow
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rice, Tomato, Turmeric"
                  className={glassInput}
                  style={glassInputStyle}
                  value={locationForm.crop}
                  onChange={(e) => handleLocationChange('crop', e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              <div>
                <label className="block text-xs font-body mb-2" style={{ color: 'rgba(232,245,232,0.6)' }}>
                  Season
                </label>
                <select
                  className={glassInput + ' appearance-none'}
                  style={{ ...glassInputStyle, backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c8a84b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                  value={locationForm.season}
                  onChange={(e) => handleLocationChange('season', e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <option value="Kharif (June-October)" style={{ background: '#0a1f0a' }}>Kharif (June-October)</option>
                  <option value="Rabi (November-March)" style={{ background: '#0a1f0a' }}>Rabi (November-March)</option>
                  <option value="Zaid (March-June)" style={{ background: '#0a1f0a' }}>Zaid (March-June)</option>
                  <option value="All Year" style={{ background: '#0a1f0a' }}>All Year</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckSuitability()}
                disabled={loading}
                className="py-3.5 rounded-xl font-body font-semibold text-sm transition-all flex justify-center items-center"
                style={{
                  background: '#c8a84b',
                  color: '#0a1f0a',
                  width: '48%'
                }}
              >
                🌱 Can I Grow This?
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetBestCrops}
                disabled={loading}
                className="py-3.5 rounded-xl font-body font-semibold text-sm transition-all flex justify-center items-center"
                style={{
                  background: 'transparent',
                  border: '1.5px solid #c8a84b',
                  color: '#c8a84b',
                  width: '48%'
                }}
              >
                🔍 Best Crops for My Location
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Loading state for all tabs */}
        {loading && <LoadingSkeleton count={5} />}

        {!loading && errorProps && (
          <p className="text-center text-red-400 text-sm font-body py-12" style={{ color: '#ff6b6b' }}>{errorProps}</p>
        )}

        {/* TAB 1: NPK Results */}
        {tab === 'npk' && !loading && result && result.length > 0 && (
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
        )
        }

        {
          tab === 'npk' && !loading && result && result.length === 0 && !errorProps && (
            <p className="text-center text-sm font-body py-12" style={{ color: 'rgba(232,245,232,0.5)' }}>{t('common.noResults')}</p>
          )
        }

        {/* TAB 2: Suitability Result */}
        {
          tab === 'location' && !loading && suitabilityResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Result Hero */}
              <div
                className="rounded-[24px] p-8 text-center relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="inline-flex justify-center items-center mb-4 relative"
                >
                  <div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{
                      background: suitabilityResult.verdict === 'yes' ? 'rgba(74,222,128,0.3)' :
                        suitabilityResult.verdict === 'no' ? 'rgba(248,113,113,0.3)' : 'rgba(250,204,21,0.3)'
                    }}
                  />
                  <span
                    className="relative z-10 px-8 py-3 rounded-full text-2xl font-bold font-heading uppercase"
                    style={{
                      background: suitabilityResult.verdict === 'yes' ? 'rgba(74,222,128,0.2)' :
                        suitabilityResult.verdict === 'no' ? 'rgba(248,113,113,0.2)' : 'rgba(250,204,21,0.2)',
                      color: suitabilityResult.verdict === 'yes' ? '#4ade80' :
                        suitabilityResult.verdict === 'no' ? '#f87171' : '#facc15',
                      border: `1px solid ${suitabilityResult.verdict === 'yes' ? '#4ade80' : suitabilityResult.verdict === 'no' ? '#f87171' : '#facc15'}`
                    }}
                  >
                    {suitabilityResult.verdict === 'yes' && '✅ YES'}
                    {suitabilityResult.verdict === 'no' && '❌ NO'}
                    {suitabilityResult.verdict === 'maybe' && '⚠️ MAYBE'}
                  </span>
                </motion.div>

                <h2 className="text-xl font-heading" style={{ color: '#e8f5e8' }}>
                  Grow <span style={{ color: '#c8a84b' }}>{locationForm.crop || 'this crop'}</span> in <span style={{ color: '#c8a84b' }}>{locationForm.city}</span>
                </h2>
              </div >

              {/* Info Grid */}
              < div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                {
                  [
                    { title: 'Why', content: suitabilityResult.reason, icon: '💡' },
                    { title: 'Best Season', content: suitabilityResult.bestSeason, icon: '📅' },
                    { title: 'Expected Yield', content: suitabilityResult.expectedYield, icon: '📈' },
                    { title: 'Key Challenges', content: suitabilityResult.keyChallenges, icon: '⚠️' }
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="rounded-2xl p-5"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span>{card.icon}</span>
                        <h4 className="font-semibold text-sm font-heading" style={{ color: '#c8a84b' }}>{card.title}</h4>
                      </div>
                      <p className="text-sm font-body leading-relaxed text-gray-300">{card.content}</p>
                    </motion.div>
                  ))
                }
              </div >

              {/* Bottom Details */}
              < motion.div
                initial={{ opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl p-6 space-y-5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Climate Match */}
                < div >
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2 font-heading" style={{ color: '#c8a84b' }}>
                      🌡️ Climate Compatibility
                    </h4>
                    <span className="text-sm font-bold" style={{ color: '#e8f5e8' }}>{suitabilityResult.climateMatch}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${suitabilityResult.climateMatch}%` }}
                      transition={{ duration: 1, delay: 0.5, type: 'spring' }}
                      className="h-full rounded-full"
                      style={{
                        background: suitabilityResult.climateMatch > 75 ? 'linear-gradient(90deg, #4ade80, #22c55e)' :
                          suitabilityResult.climateMatch > 40 ? 'linear-gradient(90deg, #facc15, #eab308)' :
                            'linear-gradient(90deg, #f87171, #ef4444)'
                      }}
                    />
                  </div>
                </div >

                {/* Fertilizers & Precautions */}
                < div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" >
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)' }}>
                    <h4 className="text-xs font-semibold mb-2" style={{ color: '#4ade80' }}>💊 Recommended Fertilizers</h4>
                    <p className="text-xs font-body text-gray-300">{suitabilityResult.recommendedFertilizers}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.1)' }}>
                    <h4 className="text-xs font-semibold mb-2" style={{ color: '#facc15' }}>⚠️ Region Precautions</h4>
                    <p className="text-xs font-body text-gray-300">{suitabilityResult.precautions}</p>
                  </div>
                </div >
              </motion.div >
            </motion.div >
          )
        }

        {/* TAB 2: Best Crops Result */}
        {
          tab === 'location' && !loading && locationCrops && (
            <div className="space-y-3">
              <h3 className="font-heading text-lg mb-4 text-center mt-8" style={{ color: '#e8f5e8' }}>
                Best recommendations for <span style={{ color: '#c8a84b' }}>{locationForm.city}</span>
              </h3>
              {locationCrops.map((crop, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{crop.emoji}</span>
                      <div>
                        <h4 className="font-heading text-lg font-bold" style={{ color: '#e8f5e8' }}>{crop.cropName}</h4>
                        <span className="text-xs font-body px-2 py-0.5 rounded-full" style={{ background: 'rgba(200,168,75,0.15)', color: '#c8a84b', border: '1px solid rgba(200,168,75,0.3)' }}>
                          {crop.bestSeason} Season
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-body text-gray-400 mt-1">{crop.reason}</p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3 min-w-[120px]">
                    <div className="flex gap-2 text-xs font-body font-semibold">
                      <span style={{
                        color: crop.difficulty === 'Easy' ? '#4ade80' : crop.difficulty === 'Medium' ? '#facc15' : '#f87171'
                      }}>
                        {crop.difficulty} Care
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                      <span style={{ color: '#c8a84b' }}>{crop.climateMatch}% Match</span>
                    </div>
                    <button
                      onClick={() => handleCheckSuitability(crop.cropName)}
                      className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      style={{
                        background: 'rgba(200,168,75,0.1)',
                        color: '#c8a84b',
                        border: '1px solid rgba(200,168,75,0.3)'
                      }}
                    >
                      Learn More →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        }
      </div >
    </motion.div >
  );
};

export default CropAdvisory;
