import { create } from "zustand"
import {
  defautsSecrets,
  idealBien,
  idealMal,
  idealLoi,
  idealChaos,
  idealNeutralite,
  idealAutres,
  liens,
  talents,
  apparence,
  traitsInteractions,
  manies,
  caracteristiquesElevees,
  caracteristiquesBasses,
  alignements,
  races,
  classes,
  professions,
  couleursPreferes,
  niveauxExperience,
} from "@/lib/data/pnj-data"
import { generateRandomName } from "@/lib/utils/markov-name-generator"

export type PNJ = {
  id: string
  nom: string
  race: string
  classe: string | null
  profession: string | null
  alignement: string | null
  defautSecret: string
  ideal: string
  lien: string
  talent: string
  apparence: string
  traitInteraction: string
  manie: string
  caracteristiqueElevee: string
  caracteristiqueBasse: string
  couleurPreferee: string
  experience: string
}

export type RegenerateField =
  | "race"
  | "classe"
  | "profession"
  | "alignement"
  | "defautSecret"
  | "ideal"
  | "lien"
  | "talent"
  | "apparence"
  | "traitInteraction"
  | "manie"
  | "caracteristiqueElevee"
  | "caracteristiqueBasse"
  | "couleurPreferee"
  | "experience"
  | "identite"
  | "apparenceComportement"
  | "personnalite"
  | "caracteristiques"

type PNJStore = {
  currentPnj: PNJ | null
  generateRandomPnj: () => void
  updatePnjName: (name: string) => void
  regenerateField: (field: RegenerateField) => void
}

const getRandomItem = (items: { id: number; value: string }[], currentValue?: string): string => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]?.value ?? ''

  if (currentValue && items.length > 1) {
    const filteredItems = items.filter((item) => item.value !== currentValue)
    if (filteredItems.length === 0) return items[0]?.value ?? ''
    const randomIndex = Math.floor(Math.random() * filteredItems.length)
    return filteredItems[randomIndex]?.value ?? ''
  }

  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex]?.value ?? ''
}

const getWeightedExperienceLevel = (currentValue?: string): string => {
  if (currentValue) {
    const filteredLevels = niveauxExperience.filter((level) => level.value !== currentValue)
    const totalWeight = filteredLevels.reduce((sum: number, level: { value: string; weight: number }) => sum + level.weight, 0)
    let random = Math.random() * totalWeight

    for (const level of filteredLevels) {
      random -= level.weight
      if (random <= 0) {
        return level.value
      }
    }

    return filteredLevels[0]?.value ?? ''
  }

  const totalWeight = niveauxExperience.reduce((sum: number, level: { value: string; weight: number }) => sum + level.weight, 0)
  let random = Math.random() * totalWeight

  for (const level of niveauxExperience) {
    random -= level.weight
    if (random <= 0) {
      return level.value
    }
  }

  return niveauxExperience[0]?.value || ""
}

const getRandomArrayItem = (items: string[], currentValue?: string): string => {
  if (items.length === 1) return items[0] || ""

  if (currentValue && items.length > 1) {
    const filteredItems = items.filter((item) => item !== currentValue)
    const randomIndex = Math.floor(Math.random() * filteredItems.length)
    return filteredItems[randomIndex] || ""
  }

  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex] || ""
}

const generateRandomIdeal = (currentValue?: string): string => {
  const idealTypes = [idealBien, idealMal, idealLoi, idealChaos, idealNeutralite, idealAutres]

  if (currentValue) {
    for (let i = 0; i < 5; i++) {
      const randomType = idealTypes[Math.floor(Math.random() * idealTypes.length)]
      const newValue = getRandomItem(randomType || [])
      if (newValue !== currentValue) {
        return newValue
      }
    }
  }

  const randomType = idealTypes[Math.floor(Math.random() * idealTypes.length)]
  return getRandomItem(randomType || [])
}

export const usePnjStore = create<PNJStore>((set) => ({
  currentPnj: null,

  generateRandomPnj: () => {
    const race = getRandomArrayItem(races)
    const randomName = generateRandomName(race)

    const highCharacteristic = getRandomItem(caracteristiquesElevees)

    const filteredLowCharacteristics = caracteristiquesBasses.filter(
      (item: { value: string }) => {
        const highCharBase = highCharacteristic.split(" - ")[0];
        return highCharBase ? !item.value.startsWith(highCharBase) : true;
      },
    )

    const lowCharacteristic = getRandomItem(filteredLowCharacteristics)

    const newPnj: PNJ = {
      id: crypto.randomUUID(),
      nom: randomName,
      race: race,
      classe: Math.random() > 0.5 ? getRandomArrayItem(classes) : null,
      profession: Math.random() > 0.5 ? getRandomArrayItem(professions) : null,
      alignement: getRandomArrayItem(alignements),
      defautSecret: getRandomItem(defautsSecrets),
      ideal: generateRandomIdeal(),
      lien: getRandomItem(liens),
      talent: getRandomItem(talents),
      apparence: getRandomItem(apparence),
      traitInteraction: getRandomItem(traitsInteractions),
      manie: getRandomItem(manies),
      caracteristiqueElevee: highCharacteristic,
      caracteristiqueBasse: lowCharacteristic,
      couleurPreferee: getRandomItem(couleursPreferes),
      experience: getWeightedExperienceLevel(),
    }

    set({ currentPnj: newPnj })
  },

  updatePnjName: (name: string) => {
    set((state) => ({
      currentPnj: state.currentPnj ? { ...state.currentPnj, nom: name } : null,
    }))
  },

  regenerateField: (field: RegenerateField) => {
    set((state) => {
      if (!state.currentPnj) return state

      const updatedPnj = { ...state.currentPnj }

      switch (field) {
        case "race":
          updatedPnj.race = getRandomArrayItem(races, updatedPnj.race)
          break
        case "classe":
          updatedPnj.classe = Math.random() > 0.5 ? getRandomArrayItem(classes, updatedPnj.classe ?? undefined) : null
          break
        case "profession":
          updatedPnj.profession = Math.random() > 0.5 ? getRandomArrayItem(professions, updatedPnj.profession ?? undefined) : null
          break
        case "alignement":
          updatedPnj.alignement = getRandomArrayItem(alignements, updatedPnj.alignement ?? undefined)
          break
        case "defautSecret":
          updatedPnj.defautSecret = getRandomItem(defautsSecrets, updatedPnj.defautSecret)
          break
        case "ideal":
          updatedPnj.ideal = generateRandomIdeal(updatedPnj.ideal)
          break
        case "lien":
          updatedPnj.lien = getRandomItem(liens, updatedPnj.lien)
          break
        case "talent":
          updatedPnj.talent = getRandomItem(talents, updatedPnj.talent)
          break
        case "apparence":
          updatedPnj.apparence = getRandomItem(apparence, updatedPnj.apparence)
          break
        case "traitInteraction":
          updatedPnj.traitInteraction = getRandomItem(traitsInteractions, updatedPnj.traitInteraction)
          break
        case "manie":
          updatedPnj.manie = getRandomItem(manies, updatedPnj.manie)
          break
        case "caracteristiqueElevee": {
          const newHighChar = getRandomItem(caracteristiquesElevees, updatedPnj.caracteristiqueElevee)
          const highCharBase = newHighChar.split(" - ")[0]
          const lowCharBase = updatedPnj.caracteristiqueBasse.split(" - ")[0]

          if (highCharBase === lowCharBase) {
            const filteredLowChars = caracteristiquesBasses.filter((item) => !item.value.startsWith(highCharBase ?? ''))
            updatedPnj.caracteristiqueBasse = getRandomItem(filteredLowChars) || updatedPnj.caracteristiqueBasse
          }

          updatedPnj.caracteristiqueElevee = newHighChar
          break
        }
        case "caracteristiqueBasse": {
          const newLowChar = getRandomItem(caracteristiquesBasses, updatedPnj.caracteristiqueBasse)
          const lowBase = newLowChar.split(" - ")[0]
          const highBase = updatedPnj.caracteristiqueElevee.split(" - ")[0]

          if (lowBase === highBase) {
            const filteredHighChars = caracteristiquesElevees.filter((item) => !item.value.startsWith(lowBase ?? ''))
            updatedPnj.caracteristiqueElevee = getRandomItem(filteredHighChars) || updatedPnj.caracteristiqueElevee
          }

          updatedPnj.caracteristiqueBasse = newLowChar
          break
        }
        case "couleurPreferee":
          updatedPnj.couleurPreferee = getRandomItem(couleursPreferes, updatedPnj.couleurPreferee)
          break
        case "experience":
          updatedPnj.experience = getWeightedExperienceLevel(updatedPnj.experience)
          break
        case "identite":
          updatedPnj.race = getRandomArrayItem(races, updatedPnj.race)
          updatedPnj.classe = Math.random() > 0.5 ? getRandomArrayItem(classes, updatedPnj.classe ?? undefined) : null
          updatedPnj.profession = Math.random() > 0.5 ? getRandomArrayItem(professions, updatedPnj.profession ?? undefined) : null
          updatedPnj.alignement = getRandomArrayItem(alignements, updatedPnj.alignement ?? undefined)
          break
        case "apparenceComportement":
          updatedPnj.apparence = getRandomItem(apparence, updatedPnj.apparence)
          updatedPnj.manie = getRandomItem(manies, updatedPnj.manie)
          updatedPnj.traitInteraction = getRandomItem(traitsInteractions, updatedPnj.traitInteraction)
          updatedPnj.talent = getRandomItem(talents, updatedPnj.talent)
          break
        case "personnalite":
          updatedPnj.defautSecret = getRandomItem(defautsSecrets, updatedPnj.defautSecret)
          updatedPnj.ideal = generateRandomIdeal(updatedPnj.ideal)
          updatedPnj.lien = getRandomItem(liens, updatedPnj.lien)
          updatedPnj.couleurPreferee = getRandomItem(couleursPreferes, updatedPnj.couleurPreferee)
          updatedPnj.experience = getWeightedExperienceLevel(updatedPnj.experience)
          break
        case "caracteristiques": {
          const highChar = getRandomItem(caracteristiquesElevees, updatedPnj.caracteristiqueElevee)
          const filteredLowChars = caracteristiquesBasses.filter(
            (item) => !item.value.startsWith(highChar.split(" - ")[0] ?? ''),
          )

          updatedPnj.caracteristiqueElevee = highChar
          updatedPnj.caracteristiqueBasse = getRandomItem(filteredLowChars) || updatedPnj.caracteristiqueBasse
          break
        }
      }

      return { currentPnj: updatedPnj }
    })
  },
}))

export default usePnjStore