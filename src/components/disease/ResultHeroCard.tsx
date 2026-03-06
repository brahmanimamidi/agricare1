import { motion } from 'framer-motion';
import { DiseaseDetectionResult } from '@/types';
import ConfidenceBar from './ConfidenceBar';

interface ResultHeroCardProps {
  result: DiseaseDetectionResult;
  imagePreview?: string | null;
  crop: string;
}

const severityConfig: Record<string, { color: string; bg: string; label: string; pulse?: boolean }> = {
  high: { color: '#ef4444', bg: 'rgba(239,68,68,0.2)', label: '🔴 HIGH SEVERITY', pulse: true },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.2)', label: '🟡 MEDIUM SEVERITY' },
  low: { color: '#4ade80', bg: 'rgba(74,222,128,0.2)', label: '🟢 LOW SEVERITY' },
};

const cropEmojis: Record<string, string> = { cashew: '🥜', cassava: '🌿', maize: '🌽', tomato: '🍅' };

const ResultHeroCard = ({ result, imagePreview, crop }: ResultHeroCardProps) => {
  const sev = severityConfig[result.severity] || severityConfig.low;
  const nameWords = result.diseaseName.split(' ');

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="rounded-[28px] p-8 sm:p-10"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(200,168,75,0.3)',
      }}
    >
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: image + confidence */}
        <div className="flex-shrink-0 space-y-3" style={{ width: 140 }}>
          {imagePreview ? (
            <img src={imagePreview} alt="Leaf" className="w-[120px] h-[120px] object-cover rounded-2xl" style={{ border: '2px solid #c8a84b' }} />
          ) : (
            <div className="w-[120px] h-[120px] rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(200,168,75,0.3)' }}>
              <span className="text-5xl">🌿</span>
            </div>
          )}
          <ConfidenceBar value={result.confidence} />
        </div>

        {/* Right: main result */}
        <div className="flex-1 space-y-3">
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#c8a84b', letterSpacing: '0.2em' }}>
            DETECTED DISEASE
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold flex flex-wrap gap-x-2" style={{ color: '#e8f5e8' }}>
            {nameWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 rounded-full text-xs font-body font-medium" style={{ background: 'rgba(200,168,75,0.2)', color: '#c8a84b', border: '1px solid rgba(200,168,75,0.3)' }}>
              {cropEmojis[crop] || '🌱'} {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </span>
            <motion.span
              className="px-3 py-1 rounded-full text-xs font-body font-semibold"
              style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.color}40` }}
              animate={sev.pulse ? { scale: [1, 1.05, 1] } : {}}
              transition={sev.pulse ? { duration: 1.5, repeat: Infinity } : {}}
            >
              {sev.label}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6" style={{ height: 1, background: 'linear-gradient(90deg, transparent, #c8a84b, transparent)', boxShadow: '0 0 8px rgba(200,168,75,0.3)' }} />

      {/* Quick summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          `🔬 ${result.diseaseType}`,
          `📅 ${result.urgency}`,
          `🌍 ${result.region}`,
        ].map((chip, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="px-3 py-1.5 rounded-full text-xs font-body"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(232,245,232,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultHeroCard;
