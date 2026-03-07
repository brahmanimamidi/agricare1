import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FallingLeaves from '@/components/FallingLeaves';
import UploadZone from '@/components/disease/UploadZone';
import CropSelector from '@/components/disease/CropSelector';
import SymptomChips from '@/components/disease/SymptomChips';
import ScanningOverlay from '@/components/disease/ScanningOverlay';
import ResultHeroCard from '@/components/disease/ResultHeroCard';
import GeminiPanel from '@/components/disease/GeminiPanel';
import { detectDiseaseFromImage, getDiseaseAdvisory, detectDiseaseFromSymptoms } from '@/services/diseaseDetection';
import { DiseaseDetectionResult } from '@/types';
import { ArrowLeft, Search, Microscope } from 'lucide-react';

const DiseaseDetection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Typewriter state
  const [titleText, setTitleText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showUnderline, setShowUnderline] = useState(false);
  const fullTitle = t('disease.title');

  useEffect(() => {
    let i = 0;
    setTitleText('');
    setShowSubtitle(false);
    setShowUnderline(false);
    const interval = setInterval(() => {
      i++;
      setTitleText(fullTitle.slice(0, i));
      if (i >= fullTitle.length) {
        clearInterval(interval);
        setTimeout(() => setShowUnderline(true), 200);
        setTimeout(() => setShowSubtitle(true), 500);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [fullTitle]);

  // Tab state
  const [tab, setTab] = useState<'upload' | 'symptoms'>('upload');

  // Upload tab state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Shared state
  const [crop, setCrop] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const canAnalyse = tab === 'upload' ? !!image : !!(crop && selectedSymptoms.length > 0);

  const handleAnalyse = useCallback(async () => {
    if (!canAnalyse) return;

    setLoading(true);
    setResult(null);
    setShowResult(false);
    try {
      if (tab === 'upload' && image) {
        const detection = await detectDiseaseFromImage(image, language as 'en' | 'hi' | 'te');
        const initialResult: any = {
          diseaseName: detection.diseaseName,
          severity: detection.severity,
          confidence: detection.confidence,
          description: detection.description,
          diseaseType: detection.diseaseName.toLowerCase().includes('healthy') ? 'Healthy' : 'Disease Detected',
          urgency: detection.severity === 'high' ? 'Immediate Action' : detection.severity === 'medium' ? 'Act Soon' : 'None',
          region: 'Local Field',
          recommendedMedicine: detection.treatment,
          fertilizerAdvisory: detection.fertilizerAdvisory,
          precautions: detection.precautions,
          organicAlternatives: [detection.organicAlternatives],
          additionalTips: detection.additionalTips,
        };
        // Ensure crop context is updated if auto-detected
        if (detection.cropName && detection.cropName !== 'Unknown') {
          setCrop(detection.cropName);
        }
        setResult(initialResult);
      } else if (tab === 'symptoms' && crop && selectedSymptoms.length > 0) {
        const res = await detectDiseaseFromSymptoms({
          crop,
          symptoms: selectedSymptoms,
          additionalDetails,
          language: language as 'en' | 'hi' | 'te'
        });

        const initialResult: any = {
          diseaseName: res.diseaseName,
          severity: res.severity,
          confidence: res.confidence,
          description: res.description,
          diseaseType: 'Disease Detected',
          urgency: res.severity === 'high' ? 'Immediate Action' : 'Monitor closely',
          region: 'Local Field',
          recommendedMedicine: res.treatment,
          fertilizerAdvisory: res.fertilizerAdvisory,
          precautions: res.precautions,
          organicAlternatives: [res.organicAlternatives],
          additionalTips: res.additionalTips,
        };
        setResult(initialResult);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to analyze symptoms. Please try again.');
    }
    setLoading(false);
    setTimeout(() => setShowResult(true), 300);
  }, [canAnalyse, crop, image, tab, selectedSymptoms, additionalDetails, language]);

  const handleAdvisoryClick = async () => {
    if (!result || (result as any).recommendedMedicine) return;
    try {
      const advisory = await getDiseaseAdvisory(result.diseaseName, crop, language as 'en' | 'hi' | 'te');
      setResult((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          recommendedMedicine: advisory.treatment,
          fertilizerAdvisory: advisory.fertilizerAdvisory,
          precautions: advisory.precautions,
          organicAlternatives: [advisory.organicAlternatives],
          additionalTips: advisory.additionalTips,
        };
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Particle system
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative overflow-hidden" style={{ background: '#0a1f0a' }}>
      {/* Background layers */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(45,106,45,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,168,75,0.06) 0%, transparent 50%)',
        }} />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 grain-bg" style={{ zIndex: 1, opacity: 0.06 }} />

      {/* Particle system */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: 'rgba(232,245,232,0.3)',
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <motion.div className="absolute rounded-full" style={{ top: '5%', left: '5%', width: 300, height: 300, background: 'rgba(45,106,45,0.2)', filter: 'blur(80px)', zIndex: 1 }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute rounded-full" style={{ bottom: '10%', right: '5%', width: 250, height: 250, background: 'rgba(200,168,75,0.15)', filter: 'blur(60px)', zIndex: 1 }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity }} />

      {/* Falling leaves */}
      <FallingLeaves intensity="light" />

      {/* Header */}
      <div className="relative sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(10,31,10,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/features')} className="flex items-center gap-2 transition-colors" style={{ color: '#c8a84b' }}>
          <ArrowLeft className="w-5 h-5" /> <span className="font-body text-sm">{t('common.back')}</span>
        </button>
        <LanguageSwitcher />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-8" style={{ zIndex: 10 }}>
        {/* SECTION 1: Title with typewriter */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl relative inline-block" style={{ color: '#e8f5e8' }}>
            {titleText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: '#c8a84b' }}
            >
              |
            </motion.span>
          </h1>
          {showUnderline && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto"
              style={{ width: 200, height: 2, background: '#c8a84b', transformOrigin: 'left', boxShadow: '0 0 12px rgba(200,168,75,0.4)' }}
            />
          )}
          <AnimatePresence>
            {showSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-sm mx-auto max-w-md"
                style={{ color: 'rgba(232,245,232,0.6)' }}
              >
                Upload a leaf photo or describe symptoms — our AI will diagnose instantly
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Show form or result */}
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key="form" exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4 }} className="space-y-6">
              {/* SECTION 2: Tab selector */}
              <div className="relative flex rounded-full overflow-hidden mx-auto max-w-md"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Sliding indicator */}
                <motion.div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{ width: '50%', background: 'rgba(255,255,255,0.08)', borderBottom: '2px solid #c8a84b' }}
                  animate={{ x: tab === 'upload' ? '0%' : '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button
                  onClick={() => setTab('upload')}
                  className="relative z-10 flex-1 py-3 text-sm font-body font-medium transition-colors"
                  style={{ color: tab === 'upload' ? '#c8a84b' : 'rgba(232,245,232,0.4)' }}
                >
                  📸 Upload Photo
                </button>
                <button
                  onClick={() => setTab('symptoms')}
                  className="relative z-10 flex-1 py-3 text-sm font-body font-medium transition-colors"
                  style={{ color: tab === 'symptoms' ? '#c8a84b' : 'rgba(232,245,232,0.4)' }}
                >
                  📝 Describe Symptoms
                </button>
              </div>

              {/* Tab content */}
              <motion.div
                className="rounded-[20px] p-6 space-y-6 relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(200,168,75,0.2)',
                  minHeight: 300,
                }}
              >
                <ScanningOverlay visible={loading} imagePreview={imagePreview} mode={tab === 'upload' ? 'photo' : 'symptoms'} />

                <AnimatePresence mode="wait">
                  {tab === 'upload' ? (
                    <motion.div key="upload" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                      <UploadZone image={image} preview={imagePreview} onImageSelect={(f, p) => { setImage(f); setImagePreview(p); }} />
                    </motion.div>
                  ) : (
                    <motion.div key="symptoms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <CropSelector selected={crop} onSelect={setCrop} label={t('disease.selectCrop')} />
                      {crop && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <SymptomChips selected={selectedSymptoms} onToggle={toggleSymptom} label={t('disease.selectSymptoms')} />
                        </motion.div>
                      )}
                      {crop && selectedSymptoms.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <label className="block text-xs font-body mb-1" style={{ color: 'rgba(232,245,232,0.6)' }}>
                            Any other details? (optional)
                          </label>
                          <textarea
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value.slice(0, 200))}
                            placeholder="e.g. Noticed 3 days ago, spreading fast..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl text-sm font-body focus:outline-none resize-none"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#e8f5e8',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                          />
                          <p className="text-right text-xs font-body mt-1" style={{ color: 'rgba(232,245,232,0.3)' }}>
                            {additionalDetails.length}/200
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Analyse / Detect button */}
              <AnimatePresence>
                {canAnalyse && !loading && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyse}
                    className="w-full py-4 rounded-full font-body font-semibold text-base flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1.5px solid rgba(200,168,75,0.5)',
                      backdropFilter: 'blur(12px)',
                      color: '#c8a84b',
                      height: 56,
                    }}
                  >
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(200,168,75,0.15) 50%, transparent 60%)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {tab === 'upload' ? <><Microscope className="w-5 h-5" /> 🔬 Analyse Leaf</> : <><Search className="w-5 h-5" /> 🧬 Detect Disease</>}
                    </span>
                  </motion.button>
                )}
                {canAnalyse && loading && (
                  <div className="flex justify-center">
                    <motion.div
                      className="w-12 h-12 rounded-full border-2"
                      style={{ borderColor: '#c8a84b', borderTopColor: 'transparent' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                )}
                {!canAnalyse && !loading && (
                  <div className="w-full py-4 rounded-full font-body text-sm text-center" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(232,245,232,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {tab === 'upload' ? 'Upload an image to continue' : 'Select crop & symptoms to continue'}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* RESULT SECTION */
            result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <ResultHeroCard result={result} imagePreview={imagePreview} crop={crop} />
                <div onClickCapture={(e) => {
                  const target = e.target as HTMLElement;
                  const btn = target.closest('button');
                  if (btn && btn.textContent?.includes('Get Full Treatment Plan')) {
                    handleAdvisoryClick();
                  }
                }}>
                  <GeminiPanel result={result} crop={crop} />
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DiseaseDetection;
