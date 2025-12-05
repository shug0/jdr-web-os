"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import type { Item } from "@/app/features/item-search/types/types";
import {
  getCoinImage,
  formatPriceForDisplay,
} from "@/app/features/item-search/utils/price-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { getCategoryIcon } from "@/app/features/item-search/utils/category-utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ItemCardProps {
  item: Item;
}

// Composants de composition stylisés
function InfoSection({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>;
}

function InfoLabel({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-semibold mb-1">{children}:</h4>;
}

function InfoBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="text-xs">
      {children}
    </Badge>
  );
}

function InfoBadgeGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1">{children}</div>;
}

export function ItemCard({ item }: ItemCardProps) {
  const [titleFontSize, setTitleFontSize] = useState<string>("text-lg");
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const titleLength = item.name.length;
      if (titleLength > 50) setTitleFontSize("text-sm");
      else if (titleLength > 40) setTitleFontSize("text-base");
      else setTitleFontSize("text-lg");
    }
  }, [item.name]);

  const categoryVariant = "secondary";
  const hasProperties = item.properties && item.properties.length > 0;
  const coinImage = getCoinImage(item.price);

  // Helper functions
  const hasWeight = item?.weight > 0;
  const isCoinStack = (imagePath: string | null) =>
    imagePath?.includes("coins_");

  const getDescription = () => {
    if (item.description) return item.description;
    if (item.subcategory) return item.subcategory;
    return item.category;
  };

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col py-2 gap-1 relative">
        {/* Badge de prix en haut à droite */}
        {item.price > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center bg-secondary px-2.5 py-1.5 rounded-lg border border-secondary-foreground/10">
              <div className="mr-1.5 relative w-4 h-4 flex items-center justify-center">
                <Image
                  src={coinImage || "/placeholder.svg"}
                  alt="Pièce de monnaie"
                  width={isCoinStack(coinImage) ? 14 : 16}
                  height={isCoinStack(coinImage) ? 14 : 16}
                  className={cn(
                    "object-contain",
                    isCoinStack(coinImage) ? "scale-90" : "scale-100"
                  )}
                />
              </div>
              <p className="font-bold text-sm text-secondary-foreground">
                {formatPriceForDisplay(item.price)}
              </p>
            </div>
          </div>
        )}

        <CardHeader className="px-4 pt-2 pr-24">
          <div className="flex items-start gap-3">
            {/* Icône de catégorie en haut à gauche dans un rond - TAILLE AUGMENTÉE */}
            <div className="flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={categoryVariant}
                    className={cn(
                      "h-10 w-10 min-h-[2rem] min-w-[2rem] flex items-center justify-center",
                      "rounded-full aspect-square shrink-0 p-0"
                    )}
                    aria-label={`Catégorie: ${item.category}`}
                  >
                    <span className="scale-125">
                      {getCategoryIcon(item.category)}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.category}</p>
                  {item.subcategory && (
                    <p className="text-xs text-muted-foreground">
                      {item.subcategory}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-1 min-h-10 flex-col min-w-0 justify-center">
              <CardTitle
                ref={titleRef}
                className={cn(
                  titleFontSize,
                  "font-bold line-clamp-2 leading-tight"
                )}
                title={item.name}
              >
                {item.name}
              </CardTitle>
              {item.subcategory && (
                <CardDescription className="mt-0.5 text-xs">
                  {item.subcategory}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow px-4 pb-2">
          {/* Description légèrement réduite */}
          <p className="text-xs leading-relaxed">{getDescription()}</p>
          
          <div className="flex gap-5">

          {hasProperties && (
            <InfoSection>
              <InfoLabel>Propriétés</InfoLabel>
              <InfoBadgeGroup>
                {item.properties?.map((prop: string) => (
                  <Badge
                    key={prop}
                    variant="outline"
                    className="text-xs bg-secondary/50"
                  >
                    {prop}
                  </Badge>
                ))}
              </InfoBadgeGroup>
            </InfoSection>
          )}

          {item.rarity && item.rarity !== "Commun" && (
            <InfoSection>
              <InfoLabel>Rareté</InfoLabel>
              <InfoBadge>{item.rarity}</InfoBadge>
            </InfoSection>
          )}

          {hasWeight && (
            <InfoSection>
              <InfoLabel>Poids</InfoLabel>
              <InfoBadge>{item.weight} kg</InfoBadge>
            </InfoSection>
          )}

          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
