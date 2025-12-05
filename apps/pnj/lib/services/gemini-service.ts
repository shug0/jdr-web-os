import { GoogleGenerativeAI } from "@google/generative-ai"
import { AI_CONFIG } from "@/lib/config/ai-config"

// Initialiser le client Google Generative AI
const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI_API_KEY)

// Mettre à jour la liste des modèles disponibles pour inclure Gemini 2.0 Flash
const AVAILABLE_MODELS = {
  GEMINI_PRO: "gemini-1.5-pro", // Modèle le plus récent et stable
  GEMINI_FLASH: "gemini-1.5-flash", // Version plus rapide
  GEMINI_2_FLASH: "gemini-2.0-flash", // Nouvelle version 2.0 Flash
}

// Modifier la configuration pour réduire le nombre de tokens maximum
export async function generateGeminiContent(prompt: string): Promise<string> {
  try {
    const modelName = AVAILABLE_MODELS.GEMINI_2_FLASH // Utiliser le nouveau modèle Gemini 2.0 Flash

    // Obtenir le modèle
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 400, // Réduire de 500 à 400 pour éviter les coupures
      },
    })

    // Générer le contenu
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    return text
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ Erreur lors de la génération avec Google Generative AI:", error)
    }
    throw error
  }
}

// Fonction simplifiée pour lister les modèles disponibles
export async function listAvailableModels(): Promise<string[]> {
    // Cette fonctionnalité n'est pas encore disponible dans l'API actuelle
    return Object.values(AVAILABLE_MODELS)
}