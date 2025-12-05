"use client"

import { useState, useEffect } from "react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { RefreshCw, Edit2, HelpCircle, User } from "lucide-react"
import { generateRandomName } from "@/lib/utils/markov-name-generator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { usePnjStore } from "@/lib/store/pnj-store"

export function PnjNameGenerator() {
  const pnj = usePnjStore((state) => state.currentPnj)
  const updatePnjName = usePnjStore((state) => state.updatePnjName)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(pnj?.nom || "")
  const [isSpinning, setIsSpinning] = useState(false)

  // Update the name when the PNJ changes
  useEffect(() => {
    if (pnj) {
      setName(pnj.nom)
    }
  }, [pnj])

  // Update the name if it's empty
  useEffect(() => {
    if (pnj && !pnj.nom && pnj.race) {
      const randomName = generateRandomName(pnj.race)
      updatePnjName(randomName)
      setName(randomName)
    }
  }, [pnj, updatePnjName])

  // Generate a new name
  const handleGenerateNewName = () => {
    if (!pnj) return

    setIsSpinning(true)

    // Generate a new name different from the current one
    let newName = name
    let attempts = 0

    // Try up to 5 times to generate a different name
    while (newName === name && attempts < 5) {
      newName = generateRandomName(pnj.race)
      attempts++
    }

    setName(newName)
    updatePnjName(newName)

    // Stop the animation after a short delay
    setTimeout(() => {
      setIsSpinning(false)
    }, 700)
  }

  const handleSaveName = () => {
    updatePnjName(name)
    setIsEditing(false)
  }

  if (!pnj) return null

  return (
    <div>
      <div className="flex items-center mb-2 relative">
        <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
          <User className="h-3.5 w-3.5 mr-1" />
          Nom
        </h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Comment les noms sont générés</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={5} className="w-64 max-w-[250px]">
              <p className="text-sm">
                Ce nom est généré par un algorithme de chaîne de Markov qui analyse des exemples de noms typiques de la
                race du personnage. Il apprend les motifs de lettres les plus fréquents et crée de nouveaux noms qui
                "sonnent" comme ceux de cette culture.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold"
            placeholder="Nom du PNJ"
            autoFocus
          />
          <Button onClick={handleSaveName} size="sm">
            Sauvegarder
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{name || "PNJ sans nom"}</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
              aria-label="Modifier le nom"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateNewName}
              className="h-8 w-8 p-0"
              aria-label="Générer un nouveau nom"
            >
              <RefreshCw className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}