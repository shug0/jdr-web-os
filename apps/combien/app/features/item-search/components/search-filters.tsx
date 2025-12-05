"use client";

import type React from "react";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { cn } from "@workspace/ui/lib/utils";
import { getCategoryIcon } from "@/app/features/item-search/utils/category-utils";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";

type SearchAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DISPLAY_LIMIT"; payload: number }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_FILTER_OPEN"; payload: boolean };

interface SearchFiltersProps {
  searchTerm: string;
  selectedCategories: string[];
  isFilterOpen: boolean;
  uniqueCategories: string[];
  dispatch: React.Dispatch<SearchAction>;
}

export function SearchFilters({
  searchTerm,
  selectedCategories,
  isFilterOpen,
  uniqueCategories,
  dispatch,
}: SearchFiltersProps) {
  return (
    <div className="mb-5">
      <Collapsible
        open={isFilterOpen}
        onOpenChange={(isOpen: boolean) =>
          dispatch({ type: "SET_FILTER_OPEN", payload: isOpen })
        }
        className="w-full"
      >
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un objet..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
              }
            />
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 h-9">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtres</span>
              {selectedCategories.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 px-1 text-xs"
                >
                  {selectedCategories.length}
                </Badge>
              )}
              {isFilterOpen ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="p-3 border rounded-md bg-background mt-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium">Filtrer par catégorie</h2>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
                  className="h-7 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer tout
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "TOGGLE_CATEGORY", payload: category })
                  }
                  className={cn(
                    "h-7 text-xs transition-all",
                    selectedCategories.includes(category)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10",
                  )}
                >
                  {getCategoryIcon(category)}
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
