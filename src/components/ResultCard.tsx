import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  value: ReactNode;
  index?: number;
  icon?: ReactNode;
}

const ResultCard = ({ title, value, index = 0, icon }: ResultCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-[16px] p-4 space-y-2"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(200,168,75,0.15)',
      }}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-body" style={{ color: 'rgba(232,245,232,0.5)' }}>
        {icon}
        {title}
      </div>
      <div className="font-body text-sm" style={{ color: '#e8f5e8' }}>{value}</div>
    </motion.div>
  );
};

export default ResultCard;
