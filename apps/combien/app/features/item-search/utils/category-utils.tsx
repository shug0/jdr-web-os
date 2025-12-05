import type React from "react";
import { Search } from "lucide-react";
import { categoryIcons } from "@/app/features/item-search/constants/category-icons";

export function getCategoryIcon(category: string): React.ReactNode {
  const normalizedCategory = category.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (key.toLowerCase() === normalizedCategory) return icon;
  }
  return <Search className="h-4 w-4" />;
}
