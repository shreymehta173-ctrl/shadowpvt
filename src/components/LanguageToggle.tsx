import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="gap-2 text-sm font-medium"
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'EN'}</span>
    </Button>
  );
}
