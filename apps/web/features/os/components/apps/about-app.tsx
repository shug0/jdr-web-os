'use client'

export function AboutApp() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">À propos de JDR Coffee</h1>
      <p className="text-muted-foreground mb-4">
        JDR Coffee est une collection d'outils pour les jeux de rôle, 
        organisés dans un environnement OS-like pour une expérience immersive.
      </p>
      <div className="space-y-2">
        <p><strong>Combien</strong> : Outil de pricing pour objets médiévaux fantastiques</p>
        <p><strong>PNJ Generator</strong> : Générateur de personnages non-joueurs avec IA</p>
      </div>
    </div>
  )
}