import type { PNJ } from "@/lib/store/pnj-store"
import { generateDescriptionPrompt } from "@/lib/prompts/description-prompt"
import { generateGeminiContent } from "@/lib/services/gemini-service"

export async function POST(request: Request) {
  try {
    const { pnj } = (await request.json()) as { pnj: PNJ }

    // Utiliser le prompt depuis le fichier séparé
    const prompt = generateDescriptionPrompt(pnj)

    try {
      // Utiliser le service Gemini pour générer le contenu
      const text = await generateGeminiContent(prompt)

      // Retourner le texte généré
      return new Response(text, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      })
    } catch (modelError: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Erreur avec l'API Gemini:`, modelError)
      }

      // Extraire plus de détails de l'erreur
      const errorMessage = (modelError as Error)?.message || "Erreur inconnue"
      const errorDetails = {
        message: "Erreur lors de l'appel à l'API Gemini",
        error: errorMessage,
        status: (modelError as { status?: number })?.status || 500,
        details: (modelError as { details?: string })?.details || "Pas de détails supplémentaires",
      }

      if (process.env.NODE_ENV === 'development') {
        console.error("📋 Détails de l'erreur:", JSON.stringify(errorDetails, null, 2))
      }

      // Retourner les détails de l'erreur en JSON
      return new Response(JSON.stringify(errorDetails), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ Erreur générale lors de la génération:", error)
    }

    // Créer une réponse d'erreur détaillée
    const errorDetails = {
      message: "Erreur lors de la génération de la description",
      error: (error as Error)?.message || "Erreur inconnue",
      stack: process.env.NODE_ENV === "development" ? (error as Error)?.stack : undefined,
      timestamp: new Date().toISOString(),
    }

    if (process.env.NODE_ENV === 'development') {
      console.error("📋 Détails de l'erreur:", JSON.stringify(errorDetails, null, 2))
    }

    // Retourner les détails de l'erreur en JSON
    return new Response(JSON.stringify(errorDetails), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}