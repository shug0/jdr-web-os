import type React from "react";
import {
  Sword,
  Shield,
  FlaskConical,
  Gem,
  BookOpen,
  Scissors,
  Apple,
  ChefHat,
  Cat,
  Car,
  Search,
  Hammer,
  ShoppingBag,
  Package,
  Shirt,
  Wine,
  Fish,
  TreePine,
  Coins,
  Crown,
  Wand2,
} from "lucide-react";

export const categoryIcons: Record<string, React.ReactNode> = {
  // Armes et équipement de combat
  Armes: <Sword className="h-4 w-4" />,
  Armures: <Shield className="h-4 w-4" />,
  "Équipement d'aventurier": <Package className="h-4 w-4" />,

  // Artisanat et métiers
  Apothicaire: <FlaskConical className="h-4 w-4" />,
  Bijoutier: <Gem className="h-4 w-4" />,
  "Librairie Papeterie": <BookOpen className="h-4 w-4" />,
  Tailleur: <Scissors className="h-4 w-4" />,
  Forgeron: <Hammer className="h-4 w-4" />,

  // Nourriture et boissons
  Nourriture: <Apple className="h-4 w-4" />,
  Plats: <ChefHat className="h-4 w-4" />,
  Boissons: <Wine className="h-4 w-4" />,
  Épicerie: <ShoppingBag className="h-4 w-4" />,

  // Animaux et transport
  Animaux: <Cat className="h-4 w-4" />,
  Véhicules: <Car className="h-4 w-4" />,
  Montures: <Cat className="h-4 w-4" />,

  // Vêtements et textiles
  Vêtements: <Shirt className="h-4 w-4" />,
  Tissus: <Shirt className="h-4 w-4" />,

  // Ressources et matériaux
  Bois: <TreePine className="h-4 w-4" />,
  Matériaux: <Package className="h-4 w-4" />,
  Outils: <Hammer className="h-4 w-4" />,

  // Objets précieux et magiques
  "Objets précieux": <Crown className="h-4 w-4" />,
  Monnaie: <Coins className="h-4 w-4" />,
  "Objets magiques": <Wand2 className="h-4 w-4" />,

  // Autres catégories communes
  Divers: <Package className="h-4 w-4" />,
  "Non catégorisé": <Search className="h-4 w-4" />,
};
