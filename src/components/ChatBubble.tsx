import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';

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
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 text-sm"
          style={{ background: 'rgba(45,106,45,0.3)' }}
        >
          🌿
        </div>
      )}
      <div
        className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={
          isBot
            ? {
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8f5e8',
                borderTopLeftRadius: '4px',
              }
            : {
                background: 'rgba(200,168,75,0.25)',
                border: '1px solid rgba(200,168,75,0.4)',
                color: '#e8f5e8',
                borderTopRightRadius: '4px',
              }
        }
      >
        {message.content}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
