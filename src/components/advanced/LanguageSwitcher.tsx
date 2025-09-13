import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
];

interface LanguageSwitcherProps {
  variant?: 'button' | 'dropdown' | 'compact';
  showFlag?: boolean;
  showNativeName?: boolean;
}

export const LanguageSwitcher = ({ 
  variant = 'dropdown', 
  showFlag = true, 
  showNativeName = true 
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    if (languageCode === i18n.language) return;
    
    setIsChanging(true);
    
    try {
      await i18n.changeLanguage(languageCode);
      
      // Store language preference
      localStorage.setItem('preferred-language', languageCode);
      
      // Update document language attribute
      document.documentElement.lang = languageCode;
      
      // Show success feedback with animation
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
      
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
    }
  };

  if (variant === 'button') {
    return (
      <div className="flex gap-2">
        {languages.map((language) => (
          <motion.div
            key={language.code}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={i18n.language === language.code ? "default" : "outline"}
              size="sm"
              onClick={() => changeLanguage(language.code)}
              disabled={isChanging}
              className="flex items-center gap-2"
            >
              {showFlag && <span className="text-sm">{language.flag}</span>}
              <span className="text-xs">
                {showNativeName ? language.nativeName : language.name}
              </span>
              {i18n.language === language.code && (
                <Check className="w-3 h-3" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((language) => (
          <motion.button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            disabled={isChanging}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
              i18n.language === language.code 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-accent'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`${language.name} (${language.nativeName})`}
          >
            {language.flag}
          </motion.button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isChanging}
          className="flex items-center gap-2 min-w-0"
        >
          <Languages className="w-4 h-4" />
          {showFlag && (
            <span className="text-sm">{currentLanguage.flag}</span>
          )}
          <span className="hidden sm:inline text-xs">
            {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
          </span>
          {isChanging && (
            <motion.div
              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            disabled={isChanging}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {showFlag && (
                <span className="text-lg">{language.flag}</span>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.name}</span>
                {showNativeName && language.name !== language.nativeName && (
                  <span className="text-xs text-muted-foreground">
                    {language.nativeName}
                  </span>
                )}
              </div>
            </div>
            
            {i18n.language === language.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <Check className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
        
        <div className="px-2 py-1.5 border-t mt-1">
          <p className="text-xs text-muted-foreground">
            Language changes apply immediately
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Hook for language detection and automatic setting
export const useLanguageDetection = () => {
  const { i18n } = useTranslation();

  const detectAndSetLanguage = () => {
    // Check for stored preference
    const storedLanguage = localStorage.getItem('preferred-language');
    if (storedLanguage && languages.some(lang => lang.code === storedLanguage)) {
      i18n.changeLanguage(storedLanguage);
      return;
    }

    // Detect from browser
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguage = languages.find(lang => lang.code === browserLanguage);
    
    if (supportedLanguage) {
      i18n.changeLanguage(supportedLanguage.code);
      localStorage.setItem('preferred-language', supportedLanguage.code);
    }
  };

  return { detectAndSetLanguage };
};

// Language status badge component
export const LanguageStatusBadge = () => {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <span className="text-xs">{currentLanguage.flag}</span>
      <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
    </Badge>
  );
};