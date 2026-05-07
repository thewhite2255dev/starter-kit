export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@")

  if (!localPart || !domain) return email

  let maskedLocalPart = localPart
  if (localPart.length > 4) {
    maskedLocalPart = localPart.slice(0, 3) + "*".repeat(localPart.length - 5) + localPart.slice(-2)
  } else {
    maskedLocalPart =
      localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1]
  }

  return `${maskedLocalPart}@${domain}`
}

export function generateAvatarFallback(name: string, index: number): string {
  return name
    .split(" ")
    .slice(0, index)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function getNamePart(name: string, index: number): string {
  const parts = name?.trim().split(/\s+/) ?? []
  return parts[index - 1] ?? ""
}
