import { useTranslation } from "react-i18next";
import { Button } from "@/iwrs/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/iwrs/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'tr':
        return 'TR';
      case 'en':
        return 'EN';
      case 'zh':
        return '中文';
      default:
        return 'TR';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{getLanguageLabel(i18n.language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('tr')}
          className={i18n.language === 'tr' ? 'bg-accent' : ''}
        >
          🇹🇷 Türkçe (TR)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'bg-accent' : ''}
        >
          🇺🇸 English (EN)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('zh')}
          className={i18n.language === 'zh' ? 'bg-accent' : ''}
        >
          🇨🇳 中文 (ZH)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
