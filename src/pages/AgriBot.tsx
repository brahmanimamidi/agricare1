import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
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

  useEffect(() => {
    setMessages([{ id: '1', role: 'bot', content: t('bot.welcome'), timestamp: new Date() }]);
  }, [language, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [t('bot.q1'), t('bot.q2'), t('bot.q3'), t('bot.q4'), t('bot.q5')];

  const handleSend = async (text?: string) => {
    const inputMessage = text || input;
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setInput('')

    // Add user message to chat
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user' as const, content: userMessage, timestamp: new Date() }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)

    // Show typing indicator
    setIsTyping(true)

    try {
      const response = await sendMessage(
        userMessage,
        language as 'en' | 'hi' | 'te',
        updatedHistory
      )

      // Add bot response to chat
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot' as const,
        content: response.reply,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])

    } catch (error) {
      console.error('AgriBot error:', error)
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot' as const,
        content: language === 'hi'
          ? 'क्षमा करें, कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।'
          : language === 'te'
            ? 'క్షమించండి, కనెక్షన్ సమస్య ఉంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Sorry, connection failed. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  };

  const showQuickQuestions = messages.length <= 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col" style={{ background: '#0a1f0a' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between z-40"
        style={{
          background: 'rgba(10,31,10,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,245,232,0.6)' }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="font-heading font-bold text-lg" style={{ color: '#e8f5e8' }}>{t('bot.title')}</h1>
          {isTyping && (
            <span className="text-xs font-body" style={{ color: '#c8a84b' }}>{t('bot.typing')}</span>
          )}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick questions */}
      {showQuickQuestions && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-full text-xs font-body transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(200,168,75,0.3)',
                  color: 'rgba(232,245,232,0.7)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: 'rgba(10,31,10,0.8)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <button className="p-2 transition-colors" style={{ color: 'rgba(232,245,232,0.5)' }}>
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('bot.placeholder')}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-body focus:outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8f5e8',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#c8a84b'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            className="p-2.5 rounded-full transition-all"
            style={{
              background: '#c8a84b',
              color: '#0a1f0a',
            }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgriBot;
