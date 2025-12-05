"use client";

import { Button } from '@workspace/ui/components/button';
import { Download, Copy, Dice6, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

interface PnjActionsProps {
  pnj: unknown; // Type à définir selon le store PNJ
  onGenerate: () => void;
  onCopy: () => void;
  onExport: () => void;
}

export function PnjActions({ pnj, onGenerate, onCopy, onExport }: PnjActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    onGenerate();
    setTimeout(() => setIsGenerating(false), 500);
  };

  return (
    <div className="flex items-center gap-2">
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

        {pnj !== null && (
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
              <DropdownMenuItem onClick={onCopy} className="cursor-pointer">
                <Copy className="h-4 w-4 mr-2" />
                Copier le PNJ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Exporter le PNJ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TooltipProvider>
    </div>
  );
}