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
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

const AgriBot = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'bot', content: t('bot.welcome'), timestamp: new Date() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);

  const { speak, stop, isSupported: ttsSupported } = useSpeechSynthesis();

  useEffect(() => {
    setMessages([{ id: '1', role: 'bot', content: t('bot.welcome'), timestamp: new Date() }]);
  }, [language, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [t('bot.q1'), t('bot.q2'), t('bot.q3'), t('bot.q4'), t('bot.q5')];
  const showQuickQuestions = messages.length <= 1;

  const speakMessage = (text: string, messageId: string) => {
    if (speakingMessageId === messageId) {
      stop();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    setIsSpeaking(true);

    speak(
      text,
      language as 'en' | 'hi' | 'te',
      () => {
        setIsSpeaking(true);
        setSpeakingMessageId(messageId);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    );
  };

  const handleSend = async (text?: string, fromVoice?: boolean) => {
    stop();
    setIsSpeaking(false);
    setSpeakingMessageId(null);

    const inputMessage = text || input;
    if (!inputMessage.trim()) return;

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

      // AUTO SPEAK if triggered by voice input
      if (fromVoice) {
        setTimeout(() => {
          speakMessage(response.reply, botMsg.id);
        }, 300);
      }

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

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    // Set language based on current app language
    const langCodes: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN'
    };
    recognition.lang = langCodes[language as string] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText('');

      // Stop TTS if speaking
      stop();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      setInterimText(currentInterim);
      if (finalTranscript) {
        setInput(prev => prev + finalTranscript + ' ');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');

      // Small timeout to allow state to settle
      setTimeout(() => {
        setInput(prev => {
          if (prev.trim()) {
            handleSend(prev, true); // true = fromVoice
            return '';
          }
          return prev;
        });
      }, 500);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };


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
          <h1 className="font-heading font-bold text-lg flex items-center justify-center gap-2" style={{ color: '#e8f5e8' }}>
            {t('bot.title')}
            {isSpeaking && (
              <span style={{
                background: 'rgba(200,168,75,0.15)',
                border: '1px solid rgba(200,168,75,0.4)',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '0.75rem',
                color: '#c8a84b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🔊 Speaking...
              </span>
            )}
          </h1>
          {isTyping && (
            <span className="text-xs font-body" style={{ color: '#c8a84b' }}>{t('bot.typing')}</span>
          )}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            <ChatBubble message={msg} index={i} />
            {msg.role === 'bot' && (
              <button
                onClick={() => speakMessage(msg.content, msg.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: speakingMessageId === msg.id
                    ? '#c8a84b'
                    : 'rgba(200,168,75,0.5)',
                  fontSize: '0.75rem',
                  fontFamily: 'DM Sans',
                  transition: 'color 0.2s',
                  marginLeft: '12px'
                }}
              >
                {speakingMessageId === msg.id ? (
                  <>
                    <span>🔊</span>
                    <span style={{ fontSize: '0.7rem' }}>Speaking...</span>
                    <span style={{
                      display: 'flex',
                      gap: '2px',
                      alignItems: 'center'
                    }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} style={{
                          width: '3px',
                          height: i === 1 ? '12px' : '8px',
                          background: '#c8a84b',
                          borderRadius: '2px',
                          animation: 'soundwave 0.6s infinite',
                          animationDelay: `${i * 0.15}s`
                        }} />
                      ))}
                    </span>
                  </>
                ) : (
                  <>
                    <span>🔈</span>
                    <span style={{ fontSize: '0.7rem' }}>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
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
        className="flex-shrink-0 px-4 py-3 relative"
        style={{
          background: 'rgba(10,31,10,0.8)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {isListening && interimText && (
          <div className="absolute bottom-full left-0 right-0 px-4 pb-2">
            <div className="max-w-2xl mx-auto rounded-xl p-3" style={{
              background: 'rgba(10,31,10,0.95)',
              border: '1px solid rgba(200,168,75,0.3)',
            }}>
              <p className="font-body text-sm italic opacity-70" style={{ color: '#c8a84b' }}>
                {interimText}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 max-w-2xl mx-auto relative">
          <button
            onClick={handleMicClick}
            className={`p-2 transition-all rounded-full relative ${isListening ? 'bg-opacity-20' : ''}`}
            style={{
              color: isListening ? '#c8a84b' : 'rgba(232,245,232,0.5)',
              background: isListening ? 'rgba(200,168,75,0.2)' : 'transparent',
            }}
          >
            <Mic className="w-5 h-5" />
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2" style={{
                borderColor: '#c8a84b',
                opacity: 0.5,
                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
            )}
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
