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
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/50 backdrop-blur-sm px-2 py-1">
      {(Object.keys(labels) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1 rounded-full text-sm font-body transition-all duration-300 ${
            language === lang
              ? 'bg-accent text-accent-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
