import { motion } from 'framer-motion';
import { useState } from 'react';

const crops = [
  { name: 'Apple', emoji: '🍎' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Blueberry', emoji: '🫐' },
  { name: 'Cherry', emoji: '🍒' },
  { name: 'Coconut', emoji: '🥥' },
  { name: 'Coffee', emoji: '☕' },
  { name: 'Cotton', emoji: '🌿' },
  { name: 'Corn (Maize)', emoji: '🌽' },
  { name: 'Grape', emoji: '🍇' },
  { name: 'Groundnut', emoji: '🥜' },
  { name: 'Jute', emoji: '🌾' },
  { name: 'Lemon', emoji: '🍋' },
  { name: 'Mango', emoji: '🥭' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Orange', emoji: '🍊' },
  { name: 'Peach', emoji: '🍑' },
  { name: 'Pepper', emoji: '🫑' },
  { name: 'Potato', emoji: '🥔' },
  { name: 'Pomegranate', emoji: '🍎' },
  { name: 'Rice', emoji: '🌾' },
  { name: 'Soybean', emoji: '🫘' },
  { name: 'Strawberry', emoji: '🍓' },
  { name: 'Sugarcane', emoji: '🎋' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Wheat', emoji: '🌾' },
  { name: 'Cashew', emoji: '🌰' },
  { name: 'Cassava', emoji: '🥔' },
  { name: 'Watermelon', emoji: '🍉' },
  { name: 'Papaya', emoji: '🫐' },
  { name: 'Chilli', emoji: '🌶️' },
  { name: 'Brinjal', emoji: '🍆' },
  { name: 'Okra', emoji: '🥦' },
  { name: 'Cauliflower', emoji: '🥦' },
  { name: 'Cabbage', emoji: '🥬' },
  { name: 'Pea', emoji: '🫛' },
  { name: 'Sunflower', emoji: '🌻' },
  { name: 'Turmeric', emoji: '🌿' },
  { name: 'Ginger', emoji: '🫚' },
]

interface CropSelectorProps {
  selected: string;
  onSelect: (crop: string) => void;
  label: string;
}

const CropSelector = ({ selected, onSelect, label }: CropSelectorProps) => {
  const [showOther, setShowOther] = useState(false);
  const isSelectedPredefined = crops.some(c => c.name === selected);
  const isOtherActive = showOther || (selected !== '' && !isSelectedPredefined);

  return (
    <div>
      <label className="block text-xs font-body mb-3" style={{ color: 'rgba(232,245,232,0.6)' }}>{label}</label>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2 pb-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(200,168,75,0.3) transparent'
        }}
      >
        {crops.map((c, i) => (
          <motion.button
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => {
              setShowOther(false);
              onSelect(c.name);
            }}
            className="px-4 py-3 rounded-full text-sm font-body font-medium transition-all flex items-center justify-center gap-2"
            style={
              selected === c.name && !isOtherActive
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
            <span>{c.emoji}</span>
            <span className="truncate">{c.name}</span>
          </motion.button>
        ))}
        {/* Other option */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: crops.length * 0.02 }}
          onClick={() => {
            setShowOther(true);
            if (isSelectedPredefined) {
              onSelect('');
            }
          }}
          className="px-4 py-3 rounded-full text-sm font-body font-medium transition-all flex items-center justify-center gap-2"
          style={
            isOtherActive
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
          <span>✏️</span>
          <span className="truncate">Other</span>
        </motion.button>
      </div>

      {isOtherActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <input
            type="text"
            value={isSelectedPredefined ? '' : selected}
            onChange={(e) => onSelect(e.target.value)}
            placeholder="Type your crop name..."
            className="w-full px-4 py-3 rounded-xl text-sm font-body focus:outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8f5e8',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default CropSelector;
