import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const symptoms = [
  { key: 'yellowLeaves', emoji: '🟡', label: 'Yellow Leaves' },
  { key: 'brownSpots', emoji: '🟤', label: 'Brown Spots' },
  { key: 'wilting', emoji: '🥀', label: 'Wilting' },
  { key: 'stunted', emoji: '📏', label: 'Stunted Growth' },
  { key: 'whiteCoating', emoji: '⬜', label: 'White Powder' },
  { key: 'holesInLeaves', emoji: '🕳️', label: 'Holes in Leaves' },
  { key: 'rootRot', emoji: '🫚', label: 'Root Rot' },
  { key: 'leafCurl', emoji: '🌀', label: 'Leaf Curl' },
  { key: 'blackSpots', emoji: '⚫', label: 'Black Spots' },
  { key: 'driedTips', emoji: '🟫', label: 'Dried Leaf Tips' },
  { key: 'waterSoaked', emoji: '💧', label: 'Water Soaked' },
  { key: 'redLesions', emoji: '🔴', label: 'Red Lesions' },
];

interface SymptomChipsProps {
  selected: string[];
  onToggle: (s: string) => void;
  label: string;
}

const SymptomChips = ({ selected, onToggle, label }: SymptomChipsProps) => (
  <div>
    <label className="block text-xs font-body mb-3" style={{ color: 'rgba(232,245,232,0.6)' }}>{label}</label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {symptoms.map((s, i) => {
        const active = selected.includes(s.key);
        return (
          <motion.button
            key={s.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onToggle(s.key)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body transition-all text-left"
            style={
              active
                ? { background: 'rgba(200,168,75,0.15)', border: '1.5px solid #c8a84b', color: '#c8a84b' }
                : { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', color: 'rgba(232,245,232,0.6)' }
            }
            whileTap={{ scale: 0.95 }}
          >
            <span>{s.emoji}</span>
            <span className="flex-1">{s.label}</span>
            {active && <Check className="w-3 h-3" />}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default SymptomChips;
