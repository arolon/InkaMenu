import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/LanguageContext";
import type { SupportedLanguage } from "@/types/menu";

const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full bg-secondary/60 hover:bg-secondary/90 px-3 py-1.5 text-sm font-medium transition-colors outline-none w-max">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-secondary-foreground">{currentLang.flag}</span>
        <span className="sr-only">Switch language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer flex items-center gap-2 ${language === lang.code ? "bg-primary/10 text-primary font-bold" : ""
              }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
