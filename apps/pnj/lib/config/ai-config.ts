import { getOptionalGeminiApiKey } from "@workspace/foundation/env";

// Configuration centralisée pour les modèles d'IA
export const AI_CONFIG = {
  // Clé API pour Gemini avec gestion sécurisée
  GEMINI_API_KEY: getOptionalGeminiApiKey(),
};