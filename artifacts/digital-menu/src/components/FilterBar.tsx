import { Leaf, Wheat, Nut, Flame, UtensilsCrossed, Coffee, IceCream, ChefHat, Heart, Star } from "lucide-react";

export type Category = "All" | "Appetizers" | "Main Courses" | "Desserts" | "Drinks" | "Favorites";
export type DietaryTag = "Gluten-Free" | "Vegetarian" | "Nut-Free" | "Spicy";

interface FilterBarProps {
  activeCategory: Category;
  onCategoryChange: (c: Category) => void;
  activeTags: DietaryTag[];
  onTagToggle: (t: DietaryTag) => void;
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "All", icon: <Star className="w-3.5 h-3.5" /> },
  { label: "Favorites", icon: <Heart className="w-3.5 h-3.5" /> },
  { label: "Appetizers", icon: <ChefHat className="w-3.5 h-3.5" /> },
  { label: "Main Courses", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { label: "Desserts", icon: <IceCream className="w-3.5 h-3.5" /> },
  { label: "Drinks", icon: <Coffee className="w-3.5 h-3.5" /> },
];

const TAGS: { label: DietaryTag; icon: React.ReactNode; activeClass: string }[] = [
  { label: "Gluten-Free", icon: <Wheat className="w-3 h-3" />, activeClass: "bg-emerald-600 text-white border-emerald-600" },
  { label: "Vegetarian", icon: <Leaf className="w-3 h-3" />, activeClass: "bg-green-600 text-white border-green-600" },
  { label: "Nut-Free", icon: <Nut className="w-3 h-3" />, activeClass: "bg-amber-600 text-white border-amber-600" },
  { label: "Spicy", icon: <Flame className="w-3 h-3" />, activeClass: "bg-red-600 text-white border-red-600" },
];

export default function FilterBar({ activeCategory, onCategoryChange, activeTags, onTagToggle }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Category Pills */}
      <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(({ label, icon }) => (
          <button
            key={label}
            data-testid={`filter-category-${label.toLowerCase().replace(" ", "-")}`}
            onClick={() => onCategoryChange(label)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap filter-pill border transition-all ${
              activeCategory === label
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            } ${label === "Favorites" && activeCategory !== "Favorites" ? "text-red-500/70" : ""}`}
          >
            <span className={activeCategory === label ? "text-primary-foreground" : label === "Favorites" ? "text-red-400" : "text-muted-foreground"}>
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Dietary Toggle Pills */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {TAGS.map(({ label, icon, activeClass }) => {
          const isActive = activeTags.includes(label);
          return (
            <button
              key={label}
              data-testid={`filter-tag-${label.toLowerCase().replace("-", "")}`}
              onClick={() => onTagToggle(label)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap filter-pill border transition-all ${
                isActive
                  ? activeClass
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
