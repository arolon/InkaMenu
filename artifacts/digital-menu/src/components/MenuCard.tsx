import { useState } from "react";
import { Heart, Flame, Gift, Star } from "lucide-react";
import type { MenuItem } from "@/types/menu";

interface MenuCardProps {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: () => void;
}

const TAG_COLORS: Record<string, string> = {
  "Gluten-Free": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Vegetarian": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Nut-Free": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Spicy": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const MicrocopyIcon = ({ icon }: { icon: string }) => {
  if (icon === "flame") return <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />;
  if (icon === "gift") return <Gift className="w-3 h-3 text-primary flex-shrink-0" />;
  return <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />;
};

export default function MenuCard({ item, isFavorite, onToggleFavorite, onClick }: MenuCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      data-testid={`card-menu-${item.id}`}
      className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer card-hover"
      style={{ boxShadow: "var(--shadow-sm)" }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Weekend Special Badge */}
        {item.isWeekendSpecial && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Weekend Special
          </div>
        )}

        {/* Favorite Button */}
        <button
          data-testid={`btn-favorite-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-150 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-300"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif font-semibold text-foreground text-base leading-tight line-clamp-1">
            {item.title}
          </h3>
          <span className="text-primary font-semibold text-sm whitespace-nowrap">
            ${item.price}
          </span>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-2.5">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-secondary text-secondary-foreground"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Microcopy */}
        {item.microcopy && (
          <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2 py-1.5">
            <MicrocopyIcon icon={item.microcopy.icon} />
            <span className="text-[11px] text-muted-foreground font-medium">{item.microcopy.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
