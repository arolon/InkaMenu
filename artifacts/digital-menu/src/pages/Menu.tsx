import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import menuData from "@/data/menuData.json";
import type { MenuItem } from "@/types/menu";
import FilterBar, { type Category, type DietaryTag } from "@/components/FilterBar";
import MenuCard from "@/components/MenuCard";
import ItemModal from "@/components/ItemModal";
import WeekendSpecials from "@/components/WeekendSpecials";
import { useFavorites } from "@/hooks/useFavorites";

const items = menuData as MenuItem[];

const CATEGORY_ORDER = ["Appetizers", "Salads", "Soups", "Ceviches", "Entrees", "Drinks", "Desserts", "Coffee", "Tea"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeTags, setActiveTags] = useState<DietaryTag[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const handleTagToggle = (tag: DietaryTag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const weekendSpecials = useMemo(() => items.filter((i) => i.isWeekendSpecial), []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (activeCategory === "Favorites") {
      filtered = filtered.filter((i) => favorites.has(i.id));
    } else if (activeCategory !== "All") {
      filtered = filtered.filter((i) => i.category === activeCategory);
    }

    if (activeTags.length > 0) {
      filtered = filtered.filter((i) => activeTags.every((tag) => i.tags.includes(tag)));
    }

    return filtered;
  }, [activeCategory, activeTags, favorites]);

  const groupedItems = useMemo(() => {
    if (activeCategory !== "All" && activeCategory !== "Favorites") {
      return { [activeCategory]: filteredItems };
    }
    const groups: Record<string, MenuItem[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const catItems = filteredItems.filter((i) => i.category === cat);
      if (catItems.length > 0) groups[cat] = catItems;
    }
    return groups;
  }, [activeCategory, filteredItems]);

  const showWeekendSpecials = activeCategory === "All" && activeTags.length === 0;

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
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
      />

      {/* Body */}
      <main className="pb-12">
        {/* Weekend Specials Carousel */}
        {showWeekendSpecials && weekendSpecials.length > 0 && (
          <div className="mt-5">
            <WeekendSpecials
              items={weekendSpecials}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onItemClick={setSelectedItem}
            />
          </div>
        )}

        {/* Grouped Category Grids */}
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <section key={category} className="mt-5 px-4" data-testid={`section-${category.toLowerCase().replace(/\s+/g, "-")}`}>
            {(activeCategory === "All" || activeCategory === "Favorites") && (
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
        ))}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center" data-testid="empty-state">
            {activeCategory === "Favorites" ? (
              <>
                <Heart className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="font-serif text-xl text-foreground mb-1">No favorites yet</p>
                <p className="text-muted-foreground text-sm">Tap the heart on any dish to save it here for when your server arrives.</p>
              </>
            ) : (
              <>
                <p className="font-serif text-xl text-foreground mb-1">No dishes found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters to see more options.</p>
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
