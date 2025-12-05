export function getExperienceColor(experience: string): string {
  switch (experience.toLowerCase()) {
    case "novice":
      return "bg-gray-100"
    case "apprenti":
      return "bg-blue-100"
    case "compétent":
      return "bg-green-100"
    case "expert":
      return "bg-purple-100"
    case "maître":
      return "bg-yellow-100"
    default:
      return "bg-gray-100"
  }
}