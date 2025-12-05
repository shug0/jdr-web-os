"use client";

import { useReducer, useMemo } from "react";
import type { Item } from "@/app/features/item-search/types/types";
import { useFuzzySearch } from "@/app/features/item-search/hooks/use-fuzzy-search.hook";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";
import { SearchFilters } from "./search-filters";
import { SearchResults } from "./search-results";

interface SearchContainerClientProps {
  initialItems: Item[];
}

interface SearchState {
  searchTerm: string;
  displayLimit: number;
  selectedCategories: string[];
  isFilterOpen: boolean;
}

type SearchAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DISPLAY_LIMIT"; payload: number }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_FILTER_OPEN"; payload: boolean };

const initialState: SearchState = {
  searchTerm: "",
  displayLimit: 25,
  selectedCategories: [],
  isFilterOpen: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, displayLimit: 25 };
    case "SET_DISPLAY_LIMIT":
      return { ...state, displayLimit: action.payload };
    case "TOGGLE_CATEGORY":
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.payload)
          ? state.selectedCategories.filter((cat) => cat !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    case "CLEAR_FILTERS":
      return { ...state, selectedCategories: [], displayLimit: 25 };
    case "SET_FILTER_OPEN":
      return { ...state, isFilterOpen: action.payload };
    default:
      return state;
  }
}

function SearchContainerClient({ initialItems }: SearchContainerClientProps) {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { searchTerm, displayLimit, selectedCategories, isFilterOpen } = state;

  const uniqueCategories = useMemo(() => {
    if (!initialItems || initialItems.length === 0) return [] as string[];
    const categories = new Set<string>();
    for (const item of initialItems) {
      if (item.category) categories.add(item.category);
    }
    return Array.from(categories).sort();
  }, [initialItems]);

  const searchResults = useFuzzySearch(initialItems, searchTerm);

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) return searchResults;
    return searchResults.filter((item) =>
      selectedCategories.includes(item.category)
    );
  }, [searchResults, selectedCategories]);

  if (!initialItems || initialItems.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucun objet n'a été trouvé dans la base de données.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <SearchFilters
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        isFilterOpen={isFilterOpen}
        uniqueCategories={uniqueCategories}
        dispatch={dispatch}
      />
      <SearchResults
        filteredItems={filteredItems}
        displayLimit={displayLimit}
        dispatch={dispatch}
      />
    </div>
  );
}

export { SearchContainerClient };
