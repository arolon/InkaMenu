import { Leaf, Wheat, Nut, Flame, UtensilsCrossed, Coffee, IceCream, ChefHat, Heart, Fish, Sprout, Wine, Soup, Salad, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export type Section = "Food" | "Drinks" | "Favorites";
export type FoodCategory = "All" | "Appetizers" | "Salads" | "Soups" | "Ceviches" | "Entrees" | "Desserts" | "Coffee" | "Tea";
export type DietaryTag = "Gluten-Free" | "Vegetarian" | "Vegan" | "Nut-Free" | "Spicy" | "Seafood" | "Alcoholic";

interface FilterBarProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  activeFoodCategory: FoodCategory;
  onFoodCategoryChange: (c: FoodCategory) => void;
  activeTags: DietaryTag[];
  onTagToggle: (t: DietaryTag) => void;
}

const FOOD_CATEGORIES: { label: FoodCategory; icon: React.ReactNode }[] = [
  { label: "All", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { label: "Appetizers", icon: <ChefHat className="w-3.5 h-3.5" /> },
  { label: "Salads", icon: <Salad className="w-3.5 h-3.5" /> },
  { label: "Soups", icon: <Soup className="w-3.5 h-3.5" /> },
  { label: "Ceviches", icon: <Fish className="w-3.5 h-3.5" /> },
  { label: "Entrees", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { label: "Desserts", icon: <IceCream className="w-3.5 h-3.5" /> },
  { label: "Coffee", icon: <Coffee className="w-3.5 h-3.5" /> },
  { label: "Tea", icon: <Leaf className="w-3.5 h-3.5" /> },
];

const TAGS: { label: DietaryTag; icon: React.ReactNode; activeClass: string }[] = [
  { label: "Gluten-Free", icon: <Wheat className="w-3 h-3" />, activeClass: "bg-emerald-600 text-white border-emerald-600" },
  { label: "Vegetarian", icon: <Leaf className="w-3 h-3" />, activeClass: "bg-green-600 text-white border-green-600" },
  { label: "Vegan", icon: <Sprout className="w-3 h-3" />, activeClass: "bg-lime-600 text-white border-lime-600" },
  { label: "Nut-Free", icon: <Nut className="w-3 h-3" />, activeClass: "bg-amber-600 text-white border-amber-600" },
  { label: "Spicy", icon: <Flame className="w-3 h-3" />, activeClass: "bg-red-600 text-white border-red-600" },
  { label: "Seafood", icon: <Fish className="w-3 h-3" />, activeClass: "bg-blue-600 text-white border-blue-600" },
  { label: "Alcoholic", icon: <Wine className="w-3 h-3" />, activeClass: "bg-purple-600 text-white border-purple-600" },
];

export default function FilterBar({
  activeSection,
  onSectionChange,
  activeFoodCategory,
  onFoodCategoryChange,
  activeTags,
  onTagToggle,
}: FilterBarProps) {
  const { language } = useLanguage();

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">

      {/* Top-level segmented control: Food | Drinks | Favorites */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex rounded-xl overflow-hidden border border-border bg-muted/60 p-0.5 gap-0.5">
          {(["Food", "Drinks", "Favorites"] as Section[]).map((section) => (
            <button
              key={section}
              data-testid={`section-tab-${section.toLowerCase()}`}
              onClick={() => onSectionChange(section)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeSection === section
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section === "Food" && <UtensilsCrossed className="w-3.5 h-3.5" />}
              {section === "Drinks" && <Wine className="w-3.5 h-3.5" />}
              {section === "Favorites" && (
                <Heart
                  className={`w-3.5 h-3.5 ${activeSection === "Favorites" ? "" : "text-red-400"}`}
                  fill={activeSection === "Favorites" ? "currentColor" : "none"}
                />
              )}
              {t(section, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Food sub-category pills — only visible when Food is selected */}
      {activeSection === "Food" && (
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {FOOD_CATEGORIES.map(({ label, icon }) => (
            <button
              key={label}
              data-testid={`filter-category-${label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onFoodCategoryChange(label)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap filter-pill border transition-all ${
                activeFoodCategory === label
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className={activeFoodCategory === label ? "text-primary-foreground" : "text-muted-foreground"}>
                {icon}
              </span>
              {t(label, language)}
            </button>
          ))}
        </div>
      )}

      {/* Dietary tag toggles */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {TAGS.map(({ label, icon, activeClass }) => {
          const isActive = activeTags.includes(label);
          return (
            <button
              key={label}
              data-testid={`filter-tag-${label.toLowerCase().replace(/[^a-z]/g, "")}`}
              onClick={() => onTagToggle(label)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap filter-pill border transition-all ${
                isActive
                  ? activeClass
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {icon}
              {t(label, language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
