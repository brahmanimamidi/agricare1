import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  path: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, path, index }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 120 }}
      transition={{ duration: 0.6, delay: index * 0.12, type: 'spring', stiffness: 80 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      onClick={() => navigate(path)}
      className="cursor-pointer w-[280px] rounded-[20px] p-8 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(200,168,75,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,168,75,0.7)';
        e.currentTarget.style.background = 'rgba(200,168,75,0.1)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-heading font-semibold text-lg mb-2" style={{ color: '#e8f5e8' }}>
        {title}
      </h3>
      <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,245,232,0.6)' }}>
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
