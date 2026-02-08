'use client'

export function AboutApp() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">À propos de JDR Coffee</h1>
      
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground mb-4">
            Une collection d'outils pour les jeux de rôle, dans un environnement OS rétro.
          </p>
          <div className="space-y-2">
            <p><strong>Combien</strong> : Pricing d'objets médiévaux fantastiques</p>
            <p><strong>PNJ Generator</strong> : Création de personnages avec l'IA</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Créé par Tomo</h2>
          <p className="text-muted-foreground">
            Facilitateur de communautés JDR et passionné de wikis. 
            J'aime créer des outils pratiques pour les maîtres de jeu.
          </p>
        </div>
      </div>
    </div>
  )
}