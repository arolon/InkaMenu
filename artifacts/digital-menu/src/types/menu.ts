export type SupportedLanguage = 'en' | 'es' | 'pt' | 'fr' | 'de';

export type LocalizedString = Record<SupportedLanguage, string>;

export interface Microcopy {
  icon: string;
  text: string;
}

export interface MenuItem {
  id: number;
  title: LocalizedString;
  price: number | null;
  description: LocalizedString;
  image: string;
  category: string;
  tags: string[];
  allergyWarnings: string[];
  ingredients: Record<SupportedLanguage, string[]>;
  isWeekendSpecial: boolean;
  microcopy: Microcopy | null;
}
