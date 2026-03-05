import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sprout, Bug, MessageCircle, ArrowRight } from 'lucide-react';

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
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  useEffect(() => {
    animate();
    const handleResize = () => animate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animate]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const featureCards = [
  { key: 'cropAdvisory', icon: Sprout, path: '/crop-advisory', color: 'from-primary/20 to-primary/5' },
  { key: 'diseaseDetection', icon: Bug, path: '/disease-detection', color: 'from-accent/20 to-accent/5' },
  { key: 'agribot', icon: MessageCircle, path: '/agribot', color: 'from-primary/15 to-accent/10' },
];

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grain-bg relative overflow-hidden">
      <Particles />

      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-9xl font-heading font-bold text-foreground tracking-tight"
        >
          <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            AgriCare
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-lg md:text-xl text-muted-foreground font-body tracking-wide"
        >
          {t('landing.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 animate-float"
        >
          <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 px-4 pb-24 -mt-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(card.path)}
              className={`cursor-pointer group relative rounded-xl border border-border bg-gradient-to-br ${card.color} backdrop-blur-sm p-6 transition-shadow duration-300 hover:glow-green`}
            >
              <card.icon className="w-10 h-10 text-accent mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                {t(`landing.${card.key}`)}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {t(`landing.${card.key}Desc`)}
              </p>
              <div className="mt-4 flex items-center gap-1 text-accent text-sm font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('landing.explore')} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
