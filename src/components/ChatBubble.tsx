import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';
import { Leaf } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

const ChatBubble = ({ message, index }: ChatBubbleProps) => {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isBot
            ? 'bg-card text-card-foreground rounded-tl-sm'
            : 'bg-accent text-accent-foreground rounded-tr-sm'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
