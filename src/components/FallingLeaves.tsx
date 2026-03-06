import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FallingLeavesProps {
  count?: number;
  intensity?: 'light' | 'normal' | 'heavy';
}

const leafEmojis = ['🍃', '🍂', '🌿', '🍁'];

interface LeafData {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  rotateStart: number;
  rotateEnd: number;
}

const intensityMap = { light: 15, normal: 30, heavy: 50 };

const FallingLeaves = ({ count, intensity = 'normal' }: FallingLeavesProps) => {
  const leafCount = count ?? intensityMap[intensity];
  const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [windOffset, setWindOffset] = useState(0);
  const windTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onResize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Wind gust effect
  const triggerWind = useCallback(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const force = 40 + Math.random() * 40;
    setWindOffset(direction * force);
    setTimeout(() => setWindOffset(0), 1500);
    windTimerRef.current = setTimeout(triggerWind, 8000 + Math.random() * 4000);
  }, []);

  useEffect(() => {
    windTimerRef.current = setTimeout(triggerWind, 5000 + Math.random() * 3000);
    return () => { if (windTimerRef.current) clearTimeout(windTimerRef.current); };
  }, [triggerWind]);

  const leaves: LeafData[] = useMemo(() =>
    Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
      x: Math.random() * 100,
      size: 20 + Math.random() * 32,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      swayAmount: 30 + Math.random() * 60,
      rotateStart: -45 + Math.random() * 90,
      rotateEnd: -180 + Math.random() * 360,
    }))
  , [leafCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}%`,
            top: -60,
            fontSize: leaf.size,
            lineHeight: 1,
          }}
          animate={{
            y: [0, dimensions.h + 80],
            x: [0, leaf.swayAmount + windOffset, -leaf.swayAmount + windOffset, leaf.swayAmount / 2 + windOffset, 0],
            rotate: [leaf.rotateStart, leaf.rotateEnd],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: leaf.duration, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: leaf.duration, repeat: Infinity, ease: 'linear' },
            opacity: {
              duration: leaf.duration,
              repeat: Infinity,
              times: [0, 0.1, 0.6, 0.8, 1],
            },
          }}
        >
          <span role="img" aria-hidden="true">{leaf.emoji}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default FallingLeaves;
