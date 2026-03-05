import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/types';

const labels: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(labels) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1 rounded-full text-sm font-body transition-all duration-300 ${
            language === lang
              ? 'font-semibold'
              : 'hover:opacity-80'
          }`}
          style={
            language === lang
              ? {
                  background: 'rgba(200,168,75,0.2)',
                  border: '1.5px solid #c8a84b',
                  color: '#c8a84b',
                }
              : {
                  background: 'transparent',
                  border: '1.5px solid transparent',
                  color: 'rgba(232,245,232,0.6)',
                }
          }
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
