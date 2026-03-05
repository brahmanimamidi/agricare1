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
      className="bg-card border border-border rounded-lg p-4 space-y-2"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-body">
        {icon}
        {title}
      </div>
      <div className="text-foreground font-body text-sm">{value}</div>
    </motion.div>
  );
};

export default ResultCard;
