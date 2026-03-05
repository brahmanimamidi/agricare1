import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface TreeAnimationProps {
  onComplete: () => void;
}

const TreeAnimation = ({ onComplete }: TreeAnimationProps) => {
  const { t } = useLanguage();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const skip = () => {
    setShow(false);
    setTimeout(onComplete, 200);
  };

  // SVG tree paths
  const trunk = 'M150 300 L150 180';
  const branchLeft = 'M150 200 L100 150';
  const branchRight = 'M150 200 L200 150';
  const subBranches = [
    'M100 150 L75 115',
    'M100 150 L115 110',
    'M200 150 L185 110',
    'M200 150 L225 115',
    'M150 180 L130 130',
    'M150 180 L170 130',
  ];

  const leaves = [
    { cx: 75, cy: 110, color: '#2d6a2d' },
    { cx: 115, cy: 105, color: '#c8a84b' },
    { cx: 185, cy: 105, color: '#2d6a2d' },
    { cx: 225, cy: 110, color: '#c8a84b' },
    { cx: 130, cy: 125, color: '#c8a84b' },
    { cx: 170, cy: 125, color: '#2d6a2d' },
    { cx: 100, cy: 145, color: '#2d6a2d' },
    { cx: 200, cy: 145, color: '#c8a84b' },
    { cx: 150, cy: 100, color: '#2d6a2d' },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'linear-gradient(to bottom, #0a1f0a, #1a3d1a)' }}
          onClick={skip}
        >
          {/* Skip button */}
          <button
            onClick={skip}
            className="absolute top-6 right-6 font-body text-sm z-50"
            style={{ color: '#c8a84b' }}
          >
            {t('common.skip')}
          </button>

          <svg width="300" height="320" viewBox="0 0 300 320">
            {/* Trunk */}
            <motion.path
              d={trunk}
              stroke="#2d6a2d"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            {/* Main branches */}
            <motion.path
              d={branchLeft}
              stroke="#2d6a2d"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              d={branchRight}
              stroke="#2d6a2d"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            />
            {/* Sub-branches */}
            {subBranches.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#2d6a2d"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 1.2 + i * 0.1, ease: 'easeOut' }}
              />
            ))}
            {/* Leaves */}
            {leaves.map((leaf, i) => (
              <motion.ellipse
                key={i}
                cx={leaf.cx}
                cy={leaf.cy}
                rx={10}
                ry={7}
                fill={leaf.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{
                  delay: 1.8 + i * 0.05,
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 200,
                }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TreeAnimation;
