// Générateur de noms basé sur les chaînes de Markov
import {
  humanFirstNames,
  humanLastNames,
  elfFirstNames,
  elfLastNames,
  dwarfFirstNames,
  dwarfLastNames,
  halflingFirstNames,
  halflingLastNames,
  gnomeFirstNames,
  gnomeLastNames,
  orcFirstNames,
  orcLastNames,
} from "../data/name-data"

// Type pour la table de transition Markov
type MarkovTable = {
  [key: string]: string[]
}

// Classe pour le générateur de noms Markov
export class MarkovNameGenerator {
  private firstNameTables: Record<string, MarkovTable> = {}
  private lastNameTables: Record<string, MarkovTable> = {}
  private orderSize: number

  constructor(orderSize = 2) {
    this.orderSize = orderSize
    this.initializeMarkovTables()
  }

  // Initialiser les tables Markov pour chaque race
  private initializeMarkovTables(): void {
    // Prénoms
    this.firstNameTables.human = this.buildMarkovTable(humanFirstNames)
    this.firstNameTables.elf = this.buildMarkovTable(elfFirstNames)
    this.firstNameTables.dwarf = this.buildMarkovTable(dwarfFirstNames)
    this.firstNameTables.halfling = this.buildMarkovTable(halflingFirstNames)
    this.firstNameTables.gnome = this.buildMarkovTable(gnomeFirstNames)
    this.firstNameTables.orc = this.buildMarkovTable(orcFirstNames)

    // Noms de famille
    this.lastNameTables.human = this.buildMarkovTable(humanLastNames)
    this.lastNameTables.elf = this.buildMarkovTable(elfLastNames)
    this.lastNameTables.dwarf = this.buildMarkovTable(dwarfLastNames)
    this.lastNameTables.halfling = this.buildMarkovTable(halflingLastNames)
    this.lastNameTables.gnome = this.buildMarkovTable(gnomeLastNames)
    this.lastNameTables.orc = this.buildMarkovTable(orcLastNames)
  }

  // Construire une table Markov à partir d'une liste de noms
  private buildMarkovTable(names: string[]): MarkovTable {
    const table: MarkovTable = {}

    // Ajouter un marqueur de début et de fin à chaque nom
    const processedNames = names.map((name) => `^${name}$`)

    for (const name of processedNames) {
      // Parcourir chaque nom et créer des séquences de caractères de taille orderSize
      for (let i = 0; i < name.length - this.orderSize; i++) {
        const key = name.substring(i, i + this.orderSize)
        const nextChar = name.charAt(i + this.orderSize)

        if (!table[key]) {
          table[key] = []
        }

        table[key].push(nextChar)
      }
    }

    return table
  }

  // Générer un nom à partir d'une table Markov
  private generateNameFromTable(table: MarkovTable, minLength = 4, maxLength = 12): string {
    // Trouver une clé de départ (qui commence par ^)
    const startKeys = Object.keys(table).filter((key) => key.startsWith("^"))
    if (startKeys.length === 0) return "Error"

    let key = startKeys[Math.floor(Math.random() * startKeys.length)]
    if (!key) return "Error"
    let name = key.substring(1) // Enlever le marqueur de début

    // Générer le nom caractère par caractère
    while (name.length < maxLength) {
      if (!key) break
      const possibleNextChars: string[] = table[key] || []

      // Si pas de caractères suivants possibles, arrêter
      if (possibleNextChars.length === 0) break

      // Choisir un caractère suivant au hasard
      const nextChar: string = possibleNextChars[Math.floor(Math.random() * possibleNextChars.length)] || '$'

      // Si c'est le marqueur de fin et que le nom est assez long, arrêter
      if (nextChar === "$" && name.length >= minLength) break

      // Si ce n'est pas le marqueur de fin, ajouter au nom
      if (nextChar !== "$") {
        name += nextChar
        // Mettre à jour la clé pour inclure le nouveau caractère
        key = (key?.substring(1) ?? "") + nextChar
      } else {
        break
      }
    }

    // Capitaliser la première lettre (en préservant les accents)
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  // Générer un nom complet pour une race donnée
  public generateName(race: string): string {
    // Mapper la race à la clé de table correspondante
    let tableKey: string

    switch (race.toLowerCase()) {
      case "elfe":
      case "demi-elfe":
        tableKey = "elf"
        break
      case "nain":
        tableKey = "dwarf"
        break
      case "halfelin":
        tableKey = "halfling"
        break
      case "gnome":
        tableKey = "gnome"
        break
      case "orc":
      case "demi-orc":
        tableKey = "orc"
        break
      default:
        tableKey = "human" // Utiliser les noms humains comme fallback
    }

    // Générer prénom et nom de famille
    const firstNameTable = this.firstNameTables[tableKey]
    const lastNameTable = this.lastNameTables[tableKey]
    
    if (!firstNameTable || !lastNameTable) {
      return "Unknown Name"
    }
    
    const firstName = this.generateNameFromTable(firstNameTable)
    const lastName = this.generateNameFromTable(lastNameTable)

    return `${firstName} ${lastName}`
  }
}

// Créer une instance du générateur avec un ordre plus élevé pour les noms français
const nameGenerator = new MarkovNameGenerator(3)

// Fonction pour générer un nom aléatoire basé sur la race
export function generateRandomName(race: string): string {
  return nameGenerator.generateName(race)
}