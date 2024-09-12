export const formatPrice = (str?: string | number | null) => {
  if (!str) return
  const st1: string | number = str.toString().replace(/\s+/g, '')
  const st2: string | number = new Number(st1).toLocaleString('fr-Fr')
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
