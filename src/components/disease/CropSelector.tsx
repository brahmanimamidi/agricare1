import { motion } from 'framer-motion';

const crops = [
  { key: 'cashew', emoji: '🥜', label: 'Cashew' },
  { key: 'cassava', emoji: '🌿', label: 'Cassava' },
  { key: 'maize', emoji: '🌽', label: 'Maize' },
  { key: 'tomato', emoji: '🍅', label: 'Tomato' },
];

interface CropSelectorProps {
  selected: string;
  onSelect: (crop: string) => void;
  label: string;
}

const CropSelector = ({ selected, onSelect, label }: CropSelectorProps) => (
  <div>
    <label className="block text-xs font-body mb-3" style={{ color: 'rgba(232,245,232,0.6)' }}>{label}</label>
    <div className="flex flex-wrap gap-3">
      {crops.map((c, i) => (
        <motion.button
          key={c.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          onClick={() => onSelect(c.key)}
          className="px-5 py-3 rounded-full text-sm font-body font-medium transition-all"
          style={
            selected === c.key
              ? { background: '#c8a84b', color: '#0a1f0a', border: '1.5px solid #c8a84b' }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(200,168,75,0.3)',
                  color: 'rgba(232,245,232,0.7)',
                  backdropFilter: 'blur(8px)',
                }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {c.emoji} {c.label}
        </motion.button>
      ))}
    </div>
  </div>
);

export default CropSelector;
