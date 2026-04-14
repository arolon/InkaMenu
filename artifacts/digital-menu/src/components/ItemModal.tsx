import { useEffect } from "react";
import { X, Heart, Flame, Gift, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { MenuItem } from "@/types/menu";

interface ItemModalProps {
  item: MenuItem | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
}

const TAG_COLORS: Record<string, string> = {
  "Gluten-Free": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Vegetarian": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Nut-Free": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Spicy": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function ItemModal({ item, isFavorite, onToggleFavorite, onClose }: ItemModalProps) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      data-testid="modal-item"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-2xl)", maxHeight: "90dvh" }}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Weekend Special */}
          {item.isWeekendSpecial && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Weekend Special
            </div>
          )}

          {/* Close Button */}
          <button
            data-testid="btn-modal-close"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Price on image */}
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-lg font-bold px-3 py-1 rounded-full">
            ${item.price}
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 225px)" }}>
          <div className="p-5">
            {/* Title + Favorite */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-serif font-bold text-2xl text-foreground leading-tight">
                {item.title}
              </h2>
              <button
                data-testid="btn-modal-favorite"
                onClick={() => onToggleFavorite(item.id)}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </button>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${TAG_COLORS[tag] ?? "bg-secondary text-secondary-foreground"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Microcopy */}
            {item.microcopy && (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5 mb-4">
                {item.microcopy.icon === "flame" ? (
                  <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                ) : (
                  <Gift className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="text-sm font-medium text-foreground">{item.microcopy.text}</span>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergy Warnings */}
            {item.allergyWarnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-3 py-3">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Allergy Information
                </h4>
                <p className="text-amber-700/80 dark:text-amber-300/80 text-xs">
                  Contains or may contain: <strong>{item.allergyWarnings.join(", ")}</strong>. Please inform your server of any allergies.
                </p>
              </div>
            )}

            {item.allergyWarnings.length === 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-xl px-3 py-3">
                <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  No major allergens listed. Speak with your server to confirm.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
