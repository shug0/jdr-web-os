import type { PNJ } from "@/lib/store/pnj-store"

export function generateDescriptionPrompt(pnj: PNJ): string {
  return `
  Génère une description concise d'un personnage non-joueur (PNJ) pour un jeu de rôle avec les caractéristiques suivantes:
  
  Nom: ${pnj.nom || "Sans nom"}
  Race: ${pnj.race}
  ${pnj.classe ? `Classe: ${pnj.classe}` : ""}
  ${pnj.profession ? `Profession: ${pnj.profession}` : ""}
  ${pnj.alignement ? `Alignement: ${pnj.alignement}` : ""}
  Niveau d'expérience: ${pnj.experience}
  
  Apparence: ${pnj.apparence}
  Manie: ${pnj.manie}
  Trait d'interaction: ${pnj.traitInteraction}
  Talent: ${pnj.talent}
  
  Défaut/Secret: ${pnj.defautSecret}
  Idéal: ${pnj.ideal}
  Lien: ${pnj.lien}
  Couleur préférée: ${pnj.couleurPreferee}
  
  Caractéristique élevée: ${pnj.caracteristiqueElevee}
  Caractéristique basse: ${pnj.caracteristiqueBasse}
  
  Instructions:
  IMPORTANT: Sois CONCIS. La description complète ne doit pas dépasser 350 mots.
  
  1. Commence DIRECTEMENT par un court paragraphe (3-4 phrases) STRICTEMENT FACTUEL qui décrit UNIQUEMENT l'apparence physique observable du PNJ. 
     - Décris SEULEMENT ce qu'un observateur pourrait voir objectivement: taille, corpulence, couleur des yeux/cheveux/peau, vêtements, posture, etc.
     - ÉVITE ABSOLUMENT toute interprétation subjective comme "regard rêveur", "expression mystérieuse", "aura intimidante", etc.
     - N'utilise PAS d'adverbes comme "souvent", "parfois", "habituellement" qui suggèrent un comportement variable.
  
  2. Ensuite, dans un paragraphe séparé (3-4 phrases), décris la personnalité et le comportement du PNJ.
  
  3. Puis, dans un troisième paragraphe court (3-4 phrases), présente le passé et les motivations du personnage.
  
  4. Enfin, dans un dernier paragraphe très bref (2-3 phrases), mentionne ses compétences et possessions notables.
  
  - Écris à la troisième personne.
  - Intègre subtilement les attributs ci-dessus.
  - Mentionne la couleur préférée du personnage d'une manière naturelle.
  - NE CITE PAS DIRECTEMENT l'alignement (comme "loyal bon", "chaotique neutre", etc.) mais traduis ces concepts en traits de caractère concrets.
  - Évite les clichés et les stéréotypes.
`
}