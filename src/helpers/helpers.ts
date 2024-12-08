export const formatPrice = (str?: string | number | null) => {
  if (str === null || str === undefined) return // Handle null/undefined
  if (str === 0 || str === '0') return '0' // Explicitly check for 0

  const st1: string = str.toString().replace(/\s+/g, '') // Remove any spaces
  const st2: string = new Number(st1).toLocaleString('fr-FR') // Format number
  return st2
}

export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
