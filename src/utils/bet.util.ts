export const breakCombinations = (string: string): string[] => {
  const results: string[] = []

  // Recursive function to generate permutations
  const generatePermutations = (remaining: string, current: string): any => {
    if (remaining.length === 0) {
      results.push(current)
      return
    }

    for (let i = 0; i < remaining.length; i++) {
      if (i > 0 && remaining[i] === remaining[i - 1]) {
        continue // Skip duplicate characters
      }

      const char = remaining[i]
      const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1)
      generatePermutations(newRemaining, current + char)
    }
  }

  const sortedString = string.split('').sort().join('')
  generatePermutations(sortedString, '')

  return results
}
