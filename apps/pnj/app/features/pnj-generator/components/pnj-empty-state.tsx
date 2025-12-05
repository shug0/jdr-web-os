"use client"

import { Button } from "@workspace/ui/components/button"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent 
} from "@workspace/ui/components/empty"
import { Dice6 } from "lucide-react"
import { usePnjStore } from "@/lib/store/pnj-store"

export function PnjEmptyState() {
  const generateRandomPnj = usePnjStore((state) => state.generateRandomPnj)

  return (
    <Empty className="bg-muted/50 border border-dashed border-muted-foreground/25">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Dice6 />
        </EmptyMedia>
        <EmptyTitle>Aucun PNJ généré</EmptyTitle>
        <EmptyDescription>
          Créez un personnage non-joueur aléatoire pour votre aventure en un seul clic. 
          Chaque PNJ est unique avec sa propre personnalité et ses caractéristiques.
        </EmptyDescription>
      </EmptyHeader>
      
      <EmptyContent>
        <Button onClick={generateRandomPnj} size="lg" className="bg-primary hover:bg-primary/90">
          <Dice6 className="mr-2 h-5 w-5" />
          Générer un PNJ
        </Button>
      </EmptyContent>
    </Empty>
  )
}