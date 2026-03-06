import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfidenceBarProps {
  value: number;
}

const ConfidenceBar = ({ value }: ConfidenceBarProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const dur = 1200;
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setDisplay(Math.round(p * value));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const color = value > 80 ? '#4ade80' : value > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-body" style={{ color: '#c8a84b' }}>AI Confidence</span>
        <span className="text-sm font-body font-bold" style={{ color }}>{display}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
