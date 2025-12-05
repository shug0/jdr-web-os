"use client";

import { Button } from "@workspace/ui/components/button";
import { Download, Copy, Dice6, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { usePnjStore } from "@/lib/store/pnj-store";
import { useToast } from "@workspace/ui/hooks/use-toast";

export function PnjActions() {
  const { toast } = useToast();
  const pnj = usePnjStore((state) => state.currentPnj);
  const generateRandomPnj = usePnjStore((state) => state.generateRandomPnj);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    generateRandomPnj();
    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleCopy = async () => {
    if (!pnj) return;

    const pnjData = `${pnj.nom}
Race: ${pnj.race}
Classe: ${pnj.classe || "Aucune"}
Profession: ${pnj.profession || "Aucune"}
Alignement: ${pnj.alignement}
Expérience: ${pnj.experience}

Apparence: ${pnj.apparence}
Manie: ${pnj.manie}
Trait d'interaction: ${pnj.traitInteraction}
Talent: ${pnj.talent}

Défaut/Secret: ${pnj.defautSecret}
Idéal: ${pnj.ideal}
Lien: ${pnj.lien}
Couleur préférée: ${pnj.couleurPreferee}

Caractéristique élevée: ${pnj.caracteristiqueElevee}
Caractéristique basse: ${pnj.caracteristiqueBasse}`;

    try {
      await navigator.clipboard.writeText(pnjData);
      toast({
        description: "Copié ! Les détails du PNJ ont été copiés dans le presse-papiers.",
      });
    } catch (error) {
      // Fallback for iframe or when clipboard API is not available
      console.log('Clipboard API not available, using fallback');
      
      // Create a temporary textarea to copy the text
      const textArea = document.createElement('textarea');
      textArea.value = pnjData;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          description: "Copié ! Les détails du PNJ ont été copiés (méthode alternative).",
        });
      } catch (fallbackError) {
        toast({
          description: "Impossible de copier. Vous pouvez exporter le PNJ à la place.",
          variant: "destructive"
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  const handleExport = () => {
    if (!pnj) return;

    const pnjData = `${pnj.nom}
Race: ${pnj.race}
Classe: ${pnj.classe || "Aucune"}
Profession: ${pnj.profession || "Aucune"}
Alignement: ${pnj.alignement}
Expérience: ${pnj.experience}

Apparence: ${pnj.apparence}
Manie: ${pnj.manie}
Trait d'interaction: ${pnj.traitInteraction}
Talent: ${pnj.talent}

Défaut/Secret: ${pnj.defautSecret}
Idéal: ${pnj.ideal}
Lien: ${pnj.lien}
Couleur préférée: ${pnj.couleurPreferee}

Caractéristique élevée: ${pnj.caracteristiqueElevee}
Caractéristique basse: ${pnj.caracteristiqueBasse}`;

    const blob = new Blob([pnjData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pnj.nom.replace(/\s+/g, '_')}_PNJ.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Exporté ! Le PNJ a été exporté en fichier texte.",
    });
  };

  const pnjActions = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            aria-label={isGenerating ? "Génération en cours..." : "Générer un nouveau PNJ"}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Dice6 className="h-4 w-4 mr-1" />
            )}
            <span className="hidden sm:inline">{isGenerating ? "Génération..." : "Nouveau"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Générer un nouveau personnage aléatoire</p>
        </TooltipContent>
      </Tooltip>

      {pnj && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Options du PNJ">
                  <Copy className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Options du PNJ</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
              <Copy className="h-4 w-4 mr-2" />
              Copier le PNJ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Exporter le PNJ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TooltipProvider>
  );

  return pnjActions;
}