"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@workspace/ui/components/button"
import { Loader2, RefreshCw, BookOpen, AlertCircle, HelpCircle, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { useToast } from "@workspace/ui/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"
import type { PNJ } from "@/lib/store/pnj-store"

interface PnjDescriptionProps {
  pnj: PNJ
}

export function PnjDescription({ pnj }: PnjDescriptionProps) {
  const { toast } = useToast()
  const [pnjId, setPnjId] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const generateDescription = useCallback(async () => {
    if (!pnj) return

    setIsLoading(true)
    setErrorDetails(null)

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pnj }),
      })

      // Lire le contenu de la réponse une seule fois
      const responseText = await response.text()

      if (!response.ok) {
        // Essayer de parser le texte comme JSON pour les erreurs
        try {
          const errorData = JSON.parse(responseText)
          const errorMessage = errorData.message || errorData.error || `Erreur HTTP: ${response.status}`
          setErrorDetails(JSON.stringify(errorData, null, 2))
          throw new Error(errorMessage)
        } catch (parseError) {
          // Si ce n'est pas du JSON valide, utiliser le texte brut comme message d'erreur
          setErrorDetails(responseText || `Erreur HTTP: ${response.status}`)
          throw new Error(responseText || `Erreur HTTP: ${response.status}`)
        }
      }

      // If we arrive here, the response is OK
      setDescription(responseText)
    } catch (error: unknown) {
      // If we don't already have error details, use the error message
      if (!errorDetails) {
        setErrorDetails((error as Error)?.message || "Erreur inconnue")
      }

      toast({
        description: "Erreur de génération: Impossible de générer l'histoire du personnage.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [pnj, errorDetails, toast])

  // Generate a description automatically when the PNJ changes
  useEffect(() => {
    if (pnj?.id && pnj.id !== pnjId) {
      setPnjId(pnj.id)
      generateDescription()
    }
  }, [pnj, pnjId, generateDescription])

  // Function to format the description with paragraphs
  const formatDescription = (text: string | null) => {
    if (!text) return null

    // Preserve existing line breaks
    return text.split("\n\n").map((paragraph, index) => (
      <p key={`${index}-${paragraph.slice(0, 20)}`} className="mb-3 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  const copyDescriptionToClipboard = async () => {
    if (!description) return

    try {
      await navigator.clipboard.writeText(description)
      toast({
        description: "Copié ! La description a été copiée dans le presse-papiers.",
      })
    } catch (error) {
      // Fallback for iframe or when clipboard API is not available
      console.log('Clipboard API not available, using fallback');
      
      // Create a temporary textarea to copy the text
      const textArea = document.createElement('textarea');
      textArea.value = description;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          description: "Copié ! La description a été copiée (méthode alternative).",
        });
      } catch (fallbackError) {
        toast({
          description: "Impossible de copier dans ce contexte. Utilisez l'export à la place.",
          variant: "destructive"
        });
      }
      
      document.body.removeChild(textArea);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Histoire & Description
          </h3>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Comment fonctionne la génération</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5} className="w-64 max-w-[250px]">
                <p className="text-sm">
                  Cette description est générée automatiquement par intelligence artificielle basée sur toutes les
                  caractéristiques du personnage. Elle crée une histoire unique et cohérente pour votre PNJ.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          {description && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyDescriptionToClipboard}
              className="h-8 px-3"
              aria-label="Copier la description"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={generateDescription}
            disabled={isLoading}
            className="h-8 px-3"
            aria-label="Régénérer la description"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Génération de l'histoire en cours...</span>
            </div>
          ) : description ? (
            <div className="text-sm leading-relaxed">{formatDescription(description)}</div>
          ) : errorDetails ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h4 className="font-medium mb-2">Erreur de génération</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Impossible de générer l'histoire du personnage.
              </p>
              <details className="text-left mb-4">
                <summary className="cursor-pointer text-sm font-medium mb-2">Détails de l'erreur</summary>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{errorDetails}</pre>
              </details>
              <Button variant="outline" size="sm" onClick={generateDescription}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="font-medium mb-2">Pas encore d'histoire</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Cliquez sur le bouton ci-dessus pour générer automatiquement une description unique pour ce personnage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}