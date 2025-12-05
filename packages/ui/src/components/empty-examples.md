# Composant Empty - Exemples d'utilisation

Le composant `Empty` est un composant polyvalent pour afficher des états vides avec une interface cohérente.

## Exemple 1: État "Aucun résultat"

```tsx
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { Search } from "lucide-react"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Search />
    </EmptyMedia>
    <EmptyTitle>Aucun résultat trouvé</EmptyTitle>
    <EmptyDescription>
      Essayez de modifier vos critères de recherche ou utilisez d'autres mots-clés.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

## Exemple 2: État "Pas de données" avec action

```tsx
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent 
} from "@workspace/ui/components/empty"
import { Button } from "@workspace/ui/components/button"
import { Plus, Package } from "lucide-react"

<Empty className="bg-muted/30 border border-dashed">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Package />
    </EmptyMedia>
    <EmptyTitle>Aucun objet dans votre inventaire</EmptyTitle>
    <EmptyDescription>
      Commencez par ajouter des objets à votre collection pour les voir apparaître ici.
    </EmptyDescription>
  </EmptyHeader>
  
  <EmptyContent>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Ajouter un objet
    </Button>
  </EmptyContent>
</Empty>
```

## Exemple 3: État vide simple

```tsx
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"

<Empty>
  <EmptyHeader>
    <EmptyTitle>Aucune donnée disponible</EmptyTitle>
    <EmptyDescription>
      Les informations seront affichées ici une fois qu'elles seront disponibles.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

## Exemple 4: Avec média personnalisé (image ou illustration)

```tsx
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="default">
      <img 
        src="/illustrations/empty-folder.svg" 
        alt="Dossier vide" 
        className="w-24 h-24 opacity-60"
      />
    </EmptyMedia>
    <EmptyTitle>Dossier vide</EmptyTitle>
    <EmptyDescription>
      Ce dossier ne contient aucun fichier pour le moment.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

## Personnalisation

Le composant peut être personnalisé via les props `className` pour adapter le style à votre contexte :

- `bg-muted/50` : Arrière-plan subtil
- `border border-dashed border-muted-foreground/25` : Bordure pointillée
- `min-h-[400px]` : Hauteur minimale spécifique