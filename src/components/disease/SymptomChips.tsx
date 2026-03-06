import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const symptoms = [
  'Yellow Leaves',
  'Brown Spots',
  'Black Spots',
  'White Powder',
  'White Mold',
  'Wilting',
  'Stunted Growth',
  'Holes in Leaves',
  'Leaf Curl',
  'Root Rot',
  'Dried Leaf Tips',
  'Water Soaked Spots',
  'Rust Colored Spots',
  'Mosaic Pattern',
  'Blight',
  'Lesions',
  'Stem Rot',
  'Fruit Rot',
  'Yellowing Veins',
  'Leaf Drop',
  'Abnormal Growth',
  'Sticky Residue',
  'Insect Damage',
  'Discolored Fruit',
  'Powdery Coating',
]

interface SymptomChipsProps {
  selected: string[];
  onToggle: (s: string) => void;
  label: string;
}

const SymptomChips = ({ selected, onToggle, label }: SymptomChipsProps) => (
  <div>
    <label className="block text-xs font-body mb-3" style={{ color: 'rgba(232,245,232,0.6)' }}>{label}</label>
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 pb-2"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(200,168,75,0.3) transparent'
      }}
    >
      {symptoms.map((s, i) => {
        const active = selected.includes(s);
        return (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onToggle(s)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-body transition-all text-left"
            style={
              active
                ? { background: 'rgba(200,168,75,0.15)', border: '1.5px solid #c8a84b', color: '#c8a84b' }
                : { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', color: 'rgba(232,245,232,0.6)' }
            }
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex-1 truncate mr-2">{s}</span>
            {active && <Check className="w-3 h-3 flex-shrink-0" />}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default SymptomChips;
