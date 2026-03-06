import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanningOverlayProps {
  visible: boolean;
  imagePreview?: string | null;
  mode: 'photo' | 'symptoms';
}

const loadingTexts = [
  '🔬 Scanning leaf structure...',
  '🧬 Identifying disease markers...',
  '📊 Calculating confidence score...',
  '✅ Preparing diagnosis...',
];

const ScanningOverlay = ({ visible, imagePreview, mode }: ScanningOverlayProps) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!visible) { setTextIndex(0); return; }
    const interval = setInterval(() => {
      setTextIndex((p) => (p + 1) % loadingTexts.length);
    }, 600);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-[20px]"
          style={{ background: 'rgba(10,31,10,0.85)', backdropFilter: 'blur(8px)', zIndex: 20 }}
        >
          {/* Scan animation */}
          <div className="relative" style={{ width: 200, height: 200 }}>
            {mode === 'photo' && imagePreview ? (
              <img src={imagePreview} alt="Scanning" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <span className="text-7xl">🧬</span>
              </div>
            )}

            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0"
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, #4a9e4a, transparent)',
                boxShadow: '0 0 20px #4a9e4a, 0 0 40px rgba(74,158,74,0.5)',
              }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Rotating ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-2xl"
              style={{
                border: '2px solid transparent',
                background: 'conic-gradient(from 0deg, #c8a84b, #4a9e4a, transparent, #c8a84b) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Corner brackets */}
            {[
              { top: -4, left: -4, borderTop: '3px solid #c8a84b', borderLeft: '3px solid #c8a84b' },
              { top: -4, right: -4, borderTop: '3px solid #c8a84b', borderRight: '3px solid #c8a84b' },
              { bottom: -4, left: -4, borderBottom: '3px solid #c8a84b', borderLeft: '3px solid #c8a84b' },
              { bottom: -4, right: -4, borderBottom: '3px solid #c8a84b', borderRight: '3px solid #c8a84b' },
            ].map((style, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ ...style, width: 24, height: 24 } as any}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              />
            ))}
          </div>

          {/* Loading text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-body text-sm"
              style={{ color: '#c8a84b' }}
            >
              {loadingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanningOverlay;
