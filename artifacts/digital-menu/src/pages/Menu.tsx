import { useState, useMemo } from "react";
import { Heart, UtensilsCrossed, Wine } from "lucide-react";
import menuData from "@/data/menuData.json";
import type { MenuItem } from "@/types/menu";
import FilterBar, { type Section, type FoodCategory, type DietaryTag } from "@/components/FilterBar";
import MenuCard from "@/components/MenuCard";
import ItemModal from "@/components/ItemModal";
import WeekendSpecials from "@/components/WeekendSpecials";
import { useFavorites } from "@/hooks/useFavorites";

const items = menuData as MenuItem[];

const FOOD_CATEGORIES = ["Appetizers", "Salads", "Soups", "Ceviches", "Entrees", "Desserts", "Coffee", "Tea"];
const DRINKS_CATEGORIES = ["Drinks"];

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState<Section>("Food");
  const [activeFoodCategory, setActiveFoodCategory] = useState<FoodCategory>("All");
  const [activeTags, setActiveTags] = useState<DietaryTag[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const handleSectionChange = (s: Section) => {
    setActiveSection(s);
    setActiveFoodCategory("All");
    setActiveTags([]);
  };

  const handleTagToggle = (tag: DietaryTag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const weekendSpecials = useMemo(() => items.filter((i) => i.isWeekendSpecial), []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (activeSection === "Favorites") {
      filtered = filtered.filter((i) => favorites.has(i.id));
    } else if (activeSection === "Food") {
      filtered = filtered.filter((i) => FOOD_CATEGORIES.includes(i.category));
      if (activeFoodCategory !== "All") {
        filtered = filtered.filter((i) => i.category === activeFoodCategory);
      }
    } else {
      // Drinks
      filtered = filtered.filter((i) => DRINKS_CATEGORIES.includes(i.category));
    }

    if (activeTags.length > 0) {
      filtered = filtered.filter((i) => activeTags.every((tag) => i.tags.includes(tag)));
    }

    return filtered;
  }, [activeSection, activeFoodCategory, activeTags, favorites]);

  const groupedItems = useMemo(() => {
    if (activeSection === "Favorites") {
      const groups: Record<string, MenuItem[]> = {};
      const allCats = [...FOOD_CATEGORIES, ...DRINKS_CATEGORIES];
      for (const cat of allCats) {
        const catItems = filteredItems.filter((i) => i.category === cat);
        if (catItems.length > 0) groups[cat] = catItems;
      }
      return groups;
    }

    if (activeSection === "Drinks") {
      return filteredItems.length > 0 ? { Drinks: filteredItems } : {};
    }

    // Food section
    if (activeFoodCategory !== "All") {
      return { [activeFoodCategory]: filteredItems };
    }

    const groups: Record<string, MenuItem[]> = {};
    for (const cat of FOOD_CATEGORIES) {
      const catItems = filteredItems.filter((i) => i.category === cat);
      if (catItems.length > 0) groups[cat] = catItems;
    }
    return groups;
  }, [activeSection, activeFoodCategory, filteredItems]);

  const showWeekendSpecials =
    activeSection === "Food" &&
    activeFoodCategory === "All" &&
    activeTags.length === 0 &&
    weekendSpecials.length > 0;

  return (
    <div className="min-h-dvh bg-background" data-testid="page-menu">
      {/* Header */}
      <header className="px-4 pt-8 pb-4 text-center" data-testid="header-menu">
        <div className="inline-block mb-1">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/70">Peruvian Bistro</span>
        </div>
        <h1 className="font-serif font-bold text-3xl text-foreground leading-tight">El Inca</h1>
        <p className="text-muted-foreground text-sm mt-1">Taste the heritage. Feel the warmth.</p>
      </header>

      {/* Sticky Filter Bar */}
      <FilterBar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        activeFoodCategory={activeFoodCategory}
        onFoodCategoryChange={setActiveFoodCategory}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
      />

      {/* Body */}
      <main className="pb-12">
        {/* Weekend Specials Carousel */}
        {showWeekendSpecials && (
          <div className="mt-5">
            <WeekendSpecials
              items={weekendSpecials}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onItemClick={setSelectedItem}
            />
          </div>
        )}

        {/* Section heading for Drinks */}
        {activeSection === "Drinks" && filteredItems.length > 0 && (
          <div className="flex items-center gap-2 px-4 mt-5 mb-1">
            <Wine className="w-4 h-4 text-primary" />
            <h2 className="font-serif font-bold text-xl text-foreground">Cocktails & Beverages</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Grouped item grids */}
        {Object.entries(groupedItems).map(([category, catItems]) => {
          const showHeading =
            activeSection === "Favorites" ||
            (activeSection === "Food" && activeFoodCategory === "All") ||
            (activeSection === "Drinks" && Object.keys(groupedItems).length > 1);

          return (
            <section
              key={category}
              className="mt-5 px-4"
              data-testid={`section-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {showHeading && (
                <h2 className="font-serif font-bold text-xl text-foreground mb-3">{category}</h2>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {catItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    isFavorite={favorites.has(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center" data-testid="empty-state">
            {activeSection === "Favorites" ? (
              <>
                <Heart className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="font-serif text-xl text-foreground mb-1">No favorites yet</p>
                <p className="text-muted-foreground text-sm">Tap the heart on any dish to save it here.</p>
              </>
            ) : activeSection === "Drinks" ? (
              <>
                <Wine className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="font-serif text-xl text-foreground mb-1">No drinks found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="font-serif text-xl text-foreground mb-1">No dishes found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
              </>
            )}
          </div>
        )}
      </main>

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isFavorite={selectedItem ? favorites.has(selectedItem.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
