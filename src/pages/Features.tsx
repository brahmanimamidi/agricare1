import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FallingLeaves from '@/components/FallingLeaves';

const featureCards = [
  {
    key: 'cropAdvisory',
    icon: '🌱',
    accent: '#4a9e4a',
    path: '/crop-advisory',
    bullets: ['features.bullet1a', 'features.bullet1b', 'features.bullet1c'],
  },
  {
    key: 'diseaseDetection',
    icon: '🔬',
    accent: '#c8a84b',
    path: '/disease-detection',
    bullets: ['features.bullet2a', 'features.bullet2b', 'features.bullet2c'],
  },
  {
    key: 'agribot',
    icon: '🤖',
    accent: '#4ecdc4',
    path: '/agribot',
    bullets: ['features.bullet3a', 'features.bullet3b', 'features.bullet3c'],
  },
];

const orbs = [
  { color: 'rgba(45,106,45,0.3)', size: 400, blur: 80, top: '5%', left: '5%' },
  { color: 'rgba(200,168,75,0.2)', size: 300, blur: 60, top: '10%', right: '8%' },
  { color: 'rgba(45,106,45,0.25)', size: 350, blur: 70, bottom: '10%', left: '35%' },
];

const Features = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const titleWords = t('features.title').split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#0a1f0a' }}
    >
      {/* Animated gradient mesh */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, rgba(45,106,45,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,168,75,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(45,106,45,0.12) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Grain texture */}
      <div className="absolute inset-0 grain-bg" style={{ zIndex: 1, opacity: 0.08 }} />

      {/* Glowing orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            top: orb.top,
            left: orb.left,
            right: (orb as any).right,
            bottom: (orb as any).bottom,
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Falling leaves */}
      <FallingLeaves count={30} />

      {/* Header */}
      <div className="relative px-6 pt-6 flex items-center justify-between" style={{ zIndex: 10 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-body"
          style={{ color: '#c8a84b' }}
        >
          <ArrowLeft className="w-5 h-5" />
          {t('common.back')}
        </motion.button>
        <LanguageSwitcher />
      </div>

      {/* Page title */}
      <div className="relative text-center mt-8 mb-4 px-4" style={{ zIndex: 10 }}>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl flex flex-wrap justify-center gap-x-4">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ color: '#e8f5e8' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 font-body"
          style={{ color: 'rgba(232,245,232,0.65)', fontSize: '1.1rem' }}
        >
          {t('features.subtitle')}
        </motion.p>
      </div>

      {/* Cards */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 px-6 py-8" style={{ zIndex: 10 }}>
        {featureCards.map((card, i) => (
          <FeatureCard key={card.key} card={card} index={i} t={t} navigate={navigate} />
        ))}
      </div>

      {/* Bottom decorative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative text-center pb-10"
        style={{ zIndex: 10 }}
      >
        <div
          className="mx-auto mb-4"
          style={{
            width: 200,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #c8a84b, transparent)',
            boxShadow: '0 0 12px rgba(200,168,75,0.4)',
          }}
        />
        <p className="font-body text-sm" style={{ color: 'rgba(200,168,75,0.6)' }}>
          {t('features.tagline')}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Card sub-component
interface CardData {
  key: string;
  icon: string;
  accent: string;
  path: string;
  bullets: string[];
}

const FeatureCard = ({
  card,
  index,
  t,
  navigate,
}: {
  card: CardData;
  index: number;
  t: (k: string) => string;
  navigate: (p: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.2, type: 'spring', stiffness: 70 }}
      onClick={() => navigate(card.path)}
      className="cursor-pointer w-[320px] sm:w-[340px] relative overflow-hidden group"
      style={{
        height: 420,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 24,
        padding: '40px 32px',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.35 },
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(200,168,75,0.6)';
        el.style.background = 'rgba(255,255,255,0.10)';
        el.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(200,168,75,0.15)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(200,168,75,0.15)';
        el.style.background = 'rgba(255,255,255,0.06)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
          animation: 'shimmer-sweep 2s ease-out forwards',
          borderRadius: 24,
        }}
      />

      {/* Icon area */}
      <div className="flex justify-center mb-5">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 120, height: 120 }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${card.accent}33 0%, transparent 70%)`,
            }}
          />
          <motion.span
            className="text-6xl relative"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {card.icon}
          </motion.span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-heading font-semibold text-center mb-2" style={{ color: '#e8f5e8', fontSize: '1.6rem' }}>
        {t(`features.card${index + 1}Title`)}
      </h3>

      {/* Description */}
      <p className="font-body text-center mb-4" style={{ color: 'rgba(232,245,232,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>
        {t(`features.card${index + 1}Desc`)}
      </p>

      {/* Bullets */}
      <div className="space-y-1.5 mb-5">
        {card.bullets.map((bKey, bi) => (
          <motion.div
            key={bKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.2 + bi * 0.1 }}
            className="flex items-center gap-2 font-body"
            style={{ color: 'rgba(232,245,232,0.6)', fontSize: '0.85rem' }}
          >
            <span style={{ color: '#c8a84b' }}>•</span>
            {t(bKey)}
          </motion.div>
        ))}
      </div>

      {/* CTA button */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(card.path);
        }}
        className="w-full font-body font-medium"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1.5px solid rgba(200,168,75,0.5)',
          backdropFilter: 'blur(12px)',
          color: '#c8a84b',
          padding: '12px 0',
          borderRadius: 50,
          fontSize: '0.95rem',
          letterSpacing: '0.06em',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(200,168,75,0.15)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(200,168,75,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {t('features.openFeature')}
      </motion.button>
    </motion.div>
  );
};

export default Features;
