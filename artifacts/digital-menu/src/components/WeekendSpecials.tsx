import { Sparkles } from "lucide-react";
import type { MenuItem } from "@/types/menu";

interface WeekendSpecialsProps {
  items: MenuItem[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onItemClick: (item: MenuItem) => void;
}

export default function WeekendSpecials({ items, favorites, onToggleFavorite, onItemClick }: WeekendSpecialsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-6" data-testid="section-weekend-specials">
      <div className="flex items-center gap-2 px-4 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="font-serif font-bold text-lg text-foreground">Weekend Specials</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-1">
        {items.map((item) => (
          <div
            key={item.id}
            data-testid={`card-special-${item.id}`}
            onClick={() => onItemClick(item)}
            className="flex-shrink-0 w-60 rounded-2xl overflow-hidden cursor-pointer card-hover relative"
            style={{
              background: "linear-gradient(135deg, hsl(25 65% 48%), hsl(15 70% 52%))",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <button
                data-testid={`btn-special-favorite-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <svg
                  className={`w-3.5 h-3.5 ${favorites.has(item.id) ? "fill-red-400 text-red-400" : "fill-none text-white"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-serif font-bold text-base leading-tight line-clamp-1">{item.title}</p>
                <p className="text-white/80 text-xs mt-0.5">${item.price}</p>
              </div>
            </div>

            <div className="px-3 py-2">
              <p className="text-white/90 text-xs leading-relaxed line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
