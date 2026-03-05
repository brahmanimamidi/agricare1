import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FeatureCard from '@/components/FeatureCard';
import { ChevronDown } from 'lucide-react';

// Particle system
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; color: string;
    }

    const particles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#2d6a2d' : '#c8a84b',
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const cleanup = animate();
    const handleResize = () => animate();
    window.addEventListener('resize', handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener('resize', handleResize);
    };
  }, [animate]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 3 }} />;
};

const VIDEO_SRC = 'https://res.cloudinary.com/dav7cqgvw/video/upload/v1772636779/Farmer_walking_in_paddy_fields_delpmaspu__x0pag7.mp4';

const featureCards = [
  { key: 'cropAdvisory', icon: '🌱', path: '/crop-advisory' },
  { key: 'diseaseDetection', icon: '🐛', path: '/disease-detection' },
  { key: 'agribot', icon: '💬', path: '/agribot' },
];

const Landing = () => {
  const { t } = useLanguage();
  const [showCards, setShowCards] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Staggered letter animation for "AgriCare"
  const agriLetters = 'Agri'.split('');
  const careLetters = 'Care'.split('');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background video */}
      {!videoFailed ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0"
          style={{ zIndex: 0, background: 'linear-gradient(135deg, #0a1f0a, #1a3d1a)' }}
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          zIndex: 1,
          backgroundColor: '#0a1f0a',
          opacity: showCards ? 0.72 : 0.55,
        }}
      />

      {/* Particles */}
      <Particles />

      {/* Language Switcher */}
      <div className="fixed top-4 right-4" style={{ zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      {/* Hero Content */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4" style={{ zIndex: 4 }}>
        {/* AgriCare title with staggered letter animation */}
        <h1 className="font-heading font-bold text-6xl sm:text-7xl md:text-9xl tracking-tight flex">
          {agriLetters.map((letter, i) => (
            <motion.span
              key={`agri-${i}`}
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, type: 'spring', stiffness: 120 }}
              style={{ color: '#e8f5e8' }}
            >
              {letter}
            </motion.span>
          ))}
          {careLetters.map((letter, i) => (
            <motion.span
              key={`care-${i}`}
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, type: 'spring', stiffness: 120 }}
              style={{ color: '#c8a84b' }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-4 font-body tracking-[0.15em]"
          style={{ color: 'rgba(232,245,232,0.75)', fontSize: '1.2rem' }}
        >
          {t('landing.subtitle')}
        </motion.p>

        {/* Animated down arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 animate-float"
        >
          <ChevronDown className="w-6 h-6" style={{ color: 'rgba(232,245,232,0.5)' }} />
        </motion.div>

        {/* Get Advice button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCards(!showCards)}
          className="mt-8 font-body font-medium transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(200,168,75,0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#c8a84b',
            padding: '14px 44px',
            borderRadius: '50px',
            fontSize: '1.1rem',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200,168,75,0.15)';
            e.currentTarget.style.borderColor = '#c8a84b';
            e.currentTarget.style.boxShadow = '0 0 24px rgba(200,168,75,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(200,168,75,0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {showCards ? t('landing.hideAdvice') : t('landing.getAdvice')}
        </motion.button>

        {/* Feature Cards */}
        <AnimatePresence>
          {showCards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex flex-col md:flex-row items-center gap-6"
            >
              {featureCards.map((card, i) => (
                <FeatureCard
                  key={card.key}
                  icon={card.icon}
                  title={t(`landing.${card.key}`)}
                  description={t(`landing.${card.key}Desc`)}
                  path={card.path}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Landing;
