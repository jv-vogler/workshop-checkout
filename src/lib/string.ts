export const isEmpty = (
  value: string | undefined | null,
): value is '' | undefined | null => {
  return typeof value !== 'string' || value.trim().length === 0
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
