export interface Microcopy {
  icon: string;
  text: string;
}

export interface MenuItem {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  tags: string[];
  allergyWarnings: string[];
  ingredients: string[];
  isWeekendSpecial: boolean;
  microcopy: Microcopy | null;
}
