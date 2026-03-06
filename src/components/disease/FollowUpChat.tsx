import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface FollowUpChatProps {
  diseaseName: string;
}

const FollowUpChat = ({ diseaseName }: FollowUpChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((p) => [...p, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Mock AI response
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((p) => [
      ...p,
      {
        role: 'bot',
        text: `Regarding ${diseaseName}: ${userMsg.length > 30 ? 'Based on your detailed question, I recommend consulting a local agricultural extension officer for field-specific advice. Meanwhile, ensure proper field hygiene and follow the prescribed treatment plan consistently.' : 'Good question! The treatment plan above should address this concern. Apply preventive measures during early growth stages for best results. Monitor the crop every 3-5 days for changes.'}`,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-body" style={{ color: 'rgba(232,245,232,0.6)' }}>
        Have a question about this disease?
      </label>

      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-body"
              style={
                msg.role === 'user'
                  ? { background: 'rgba(200,168,75,0.2)', color: '#c8a84b', border: '1px solid rgba(200,168,75,0.3)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(232,245,232,0.85)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {msg.role === 'bot' && <span className="text-xs font-semibold block mb-1" style={{ color: '#4a9e4a' }}>🤖 AI Response</span>}
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-start">
          <div className="px-4 py-3 rounded-2xl text-sm font-body" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(232,245,232,0.5)' }}>
            Thinking...
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about this disease..."
          className="flex-1 px-4 py-3 rounded-full text-sm font-body focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e8f5e8',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: '#c8a84b', color: '#0a1f0a' }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default FollowUpChat;
