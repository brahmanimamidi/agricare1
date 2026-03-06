import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface FallingLeavesProps {
  count?: number;
  speedMultiplier?: number;
}

// Three distinct leaf SVG paths
const leafPaths = [
  // Type 1: Simple oval pointed leaf
  'M0,-20 C8,-18 12,-8 12,0 C12,8 8,18 0,20 C-8,18 -12,8 -12,0 C-12,-8 -8,-18 0,-20 Z',
  // Type 2: Maple-style five-pointed leaf
  'M0,-18 L4,-8 L14,-10 L8,-2 L12,8 L4,6 L0,16 L-4,6 L-12,8 L-8,-2 L-14,-10 L-4,-8 Z',
  // Type 3: Long thin rice/paddy leaf
  'M0,-24 C3,-16 4,-6 3,4 C2,14 1,22 0,26 C-1,22 -2,14 -3,4 C-4,-6 -3,-16 0,-24 Z',
];

const leafColors = ['#2d6a2d', '#4a9e4a', '#c8a84b', '#8bc34a'];

interface LeafData {
  id: number;
  x: number;
  pathIndex: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
  rotateStart: number;
  rotateEnd: number;
}

const FallingLeaves = ({ count = 30, speedMultiplier = 1 }: FallingLeavesProps) => {
  const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const leaves: LeafData[] = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      pathIndex: i % 3,
      color: leafColors[i % leafColors.length],
      size: 0.6 + Math.random() * 0.6,
      duration: (4 + Math.random() * 8) / speedMultiplier,
      delay: Math.random() * 10,
      swayAmount: 30 + Math.random() * 60,
      rotateStart: -30 + Math.random() * 20,
      rotateEnd: 10 + Math.random() * 20,
    }))
  , [count, speedMultiplier]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: `${leaf.x}%`, top: -40 }}
          animate={{
            y: [0, dimensions.h + 60],
            x: [0, leaf.swayAmount, -leaf.swayAmount, leaf.swayAmount / 2, 0],
            rotate: [leaf.rotateStart, leaf.rotateEnd, leaf.rotateStart],
            opacity: [0.8, 0.8, 0.8, 0.8, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: leaf.duration, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: leaf.duration * 0.8, repeat: Infinity, ease: 'easeInOut' },
            opacity: {
              duration: leaf.duration,
              repeat: Infinity,
              times: [0, 0.3, 0.6, 0.8, 1],
            },
          }}
        >
          <svg
            width={24 * leaf.size}
            height={48 * leaf.size}
            viewBox="-16 -26 32 54"
            fill={leaf.color}
            opacity={0.7}
          >
            <path d={leafPaths[leaf.pathIndex]} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FallingLeaves;
