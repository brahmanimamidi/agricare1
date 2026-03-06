import { motion } from 'framer-motion';

interface PrecautionListProps {
  items: string[];
}

const PrecautionList = ({ items }: PrecautionListProps) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <motion.li
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}
        className="flex items-start gap-3 font-body text-sm"
        style={{ color: 'rgba(232,245,232,0.85)', lineHeight: 1.8 }}
      >
        <motion.svg
          width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0 mt-1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
        >
          <motion.path
            d="M3 9 L7 13 L15 5"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
          />
        </motion.svg>
        <span>{item}</span>
      </motion.li>
    ))}
  </ul>
);

export default PrecautionList;
