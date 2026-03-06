import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiseaseDetectionResult } from '@/types';
import PrecautionList from './PrecautionList';
import FollowUpChat from './FollowUpChat';

interface GeminiPanelProps {
  result: DiseaseDetectionResult;
  crop: string;
}

const shimmerGradient = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)';

const GeminiPanel = ({ result, crop }: GeminiPanelProps) => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      const timer = setTimeout(() => setLoaded(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [open, loaded]);

  const handleCopyResults = () => {
    const summary = `Disease: ${result.diseaseName}\nSeverity: ${result.severity}\nMedicine: ${result.recommendedMedicine}\nPrecautions: ${result.precautions.join(', ')}`;
    navigator.clipboard.writeText(summary);
  };

  const sections = [
    {
      icon: '💊', title: 'Treatment & Medicine',
      content: result.recommendedMedicine,
      bg: 'rgba(45,106,45,0.1)', border: 'rgba(45,106,45,0.2)',
      tags: result.recommendedMedicine.match(/[A-Z][a-z]+(?:azim|ozeb|onazole|obin|nil)\w*/g) || [],
    },
    {
      icon: '🌱', title: 'Fertilizer Advisory',
      content: result.fertilizerAdvisory,
      bg: 'rgba(74,158,74,0.08)', border: 'rgba(74,158,74,0.2)',
    },
    {
      icon: '⚠️', title: 'Precautions',
      content: null,
      precautions: result.precautions,
      bg: 'rgba(200,168,75,0.06)', border: 'rgba(200,168,75,0.2)',
    },
    {
      icon: '🍃', title: 'Organic Alternatives',
      content: result.organicAlternatives.join('\n• '),
      bg: 'rgba(74,222,128,0.05)', border: 'rgba(74,222,128,0.15)',
      eco: true,
    },
    {
      icon: '💡', title: 'Additional Tips & Prevention',
      content: result.additionalTips,
      bg: 'rgba(200,168,75,0.04)', border: 'rgba(200,168,75,0.15)',
    },
  ];

  return (
    <div className="space-y-4">
      {/* CTA Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="relative w-full max-w-[500px] mx-auto block rounded-[50px] font-body font-bold text-lg overflow-hidden"
          style={{
            height: 64,
            background: 'linear-gradient(135deg, #c8a84b, #a07830)',
            color: '#0a1f0a',
            boxShadow: '0 8px 32px rgba(200,168,75,0.4)',
          }}
          whileHover={{ scale: 1.02, boxShadow: '0 12px 48px rgba(200,168,75,0.6)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">✨ Get Full Treatment Plan</span>
          <span className="block text-xs font-normal relative z-10" style={{ color: 'rgba(10,31,10,0.6)' }}>
            Powered by Gemini AI
          </span>
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>
      )}

      {/* Panel content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden space-y-4"
          >
            {!loaded ? (
              /* Skeleton loading */
              <div className="space-y-4 py-4">
                {['💊 Preparing treatment plan...', '🌱 Calculating fertilizer doses...', '⚠️ Compiling precautions...'].map((text, i) => (
                  <div key={i} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-body text-sm" style={{ color: 'rgba(232,245,232,0.5)' }}>{text}</p>
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: shimmerGradient }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                ))}
                <p className="text-center text-xs font-body" style={{ color: 'rgba(232,245,232,0.4)' }}>
                  Consulting AI Agricultural Expert
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>...</motion.span>
                </p>
              </div>
            ) : (
              /* Actual content */
              <div className="space-y-4 py-4">
                {sections.map((sec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-2xl p-6 relative"
                    style={{ background: sec.bg, border: `1px solid ${sec.border}` }}
                  >
                    {sec.eco && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-body" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                        eco-friendly
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{sec.icon}</span>
                      <h3 className="font-heading text-lg font-semibold" style={{ color: '#c8a84b' }}>{sec.title}</h3>
                    </div>

                    {sec.precautions ? (
                      <PrecautionList items={sec.precautions} />
                    ) : (
                      <p className="font-body text-sm whitespace-pre-line" style={{ color: 'rgba(232,245,232,0.85)', lineHeight: 1.8 }}>
                        {sec.content?.startsWith('• ') ? `• ${sec.content}` : sec.content}
                      </p>
                    )}

                    {sec.tags && sec.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {sec.tags.map((tag, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded-full text-[10px] font-body" style={{ background: 'rgba(200,168,75,0.15)', color: '#c8a84b', border: '1px solid rgba(200,168,75,0.2)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Follow-up chat */}
                <FollowUpChat diseaseName={result.diseaseName} cropName={crop} />

                {/* Bottom actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 py-3 rounded-full font-body font-medium text-sm"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,168,75,0.3)', color: '#c8a84b' }}
                  >
                    🔄 Check Another Crop
                  </button>
                  <button
                    onClick={handleCopyResults}
                    className="flex-1 py-3 rounded-full font-body font-medium text-sm"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,168,75,0.3)', color: '#c8a84b' }}
                  >
                    📤 Share Results
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeminiPanel;
