"use client";

import type React from "react";
import { ItemCard } from "@/app/features/item-search/components/item-card";
import type { Item } from "@/app/features/item-search/types/types";

type SearchAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DISPLAY_LIMIT"; payload: number }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_FILTER_OPEN"; payload: boolean };

interface SearchResultsProps {
  filteredItems: Item[];
  displayLimit: number;
  dispatch: React.Dispatch<SearchAction>;
}

export function SearchResults({
  filteredItems,
  displayLimit,
  dispatch,
}: SearchResultsProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        {filteredItems.length > displayLimit
          ? `${displayLimit} objets affichés sur ${filteredItems.length} trouvés`
          : `${filteredItems.length} objets trouvés`}
      </p>

      <div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">Aucun résultat trouvé</p>
            <p className="text-sm text-muted-foreground mt-2">
              Essayez de modifier vos filtres ou termes de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.slice(0, displayLimit).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {filteredItems.length > displayLimit && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "SET_DISPLAY_LIMIT",
                payload: displayLimit + 25,
              })
            }
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Voir plus d'objets
          </button>
        </div>
      )}

      {filteredItems.length > 0 && filteredItems.length <= displayLimit && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Tous les objets sont affichés
        </div>
      )}
    </div>
  );
}
