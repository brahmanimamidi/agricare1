import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ChatBubble from '@/components/ChatBubble';
import { sendMessage } from '@/services/agriBot';
import { ChatMessage } from '@/types';
import { ArrowLeft, Send, Mic } from 'lucide-react';

const AgriBot = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'bot', content: t('bot.welcome'), timestamp: new Date() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ id: '1', role: 'bot', content: t('bot.welcome'), timestamp: new Date() }]);
  }, [language, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [t('bot.q1'), t('bot.q2'), t('bot.q3'), t('bot.q4')];

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const res = await sendMessage({ message: msg, language, chatHistory: [...messages, userMsg] });

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: res.reply || '...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const showQuickQuestions = messages.length <= 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col bg-background grain-bg">
      {/* Header */}
      <div className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between z-40">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="font-heading font-bold text-lg text-foreground">{t('bot.title')}</h1>
          {isTyping && (
            <span className="text-xs text-accent font-body">{t('bot.typing')}</span>
          )}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 pl-10">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  style={{
                    animation: `bounce-dot 1.4s infinite ease-in-out both`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick questions */}
      {showQuickQuestions && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-full text-xs font-body bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('bot.placeholder')}
            className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none input-glow transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            className="p-2.5 rounded-full bg-accent text-accent-foreground transition-all hover:glow-gold"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgriBot;
