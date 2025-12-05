"use client";

import { useEffect } from "react";
import { PnjCard } from "./pnj-card";
import { PnjEmptyState } from "./pnj-empty-state";
import { Toaster } from "@workspace/ui/components/custom/toaster";
import { PnjActions } from "@/app/components/pnj-actions";
import { usePnjStore } from "@/lib/store/pnj-store";

export function PnjGenerator() {
  const pnj = usePnjStore((state) => state.currentPnj);
  const generateRandomPnj = usePnjStore((state) => state.generateRandomPnj);

  // Option: Générer automatiquement un PNJ au premier chargement
  // Décommenter la ligne ci-dessous pour activer la génération automatique
  // useEffect(() => {
  //   if (!pnj) {
  //     generateRandomPnj();
  //   }
  // }, [pnj, generateRandomPnj]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 container mx-auto max-w-4xl mt-8 px-4 sm:px-6">
        {/* Actions en haut */}
        <div className="flex items-center justify-end mb-6">
          <PnjActions />
        </div>

        {pnj ? (
          <div>
            <PnjCard />
          </div>
        ) : (
          <PnjEmptyState />
        )}
      </main>

      <Toaster />
    </div>
  );
}
