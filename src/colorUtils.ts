export function alpha(color: number): number {
  return color >> 24
}

export function red(color: number): number {
  return (color >> 16) & 0xff
}

export function green(color: number): number {
  return (color >> 8) & 0xff
}

export function blue(color: number): number {
  return color & 0xff
}

export function rgb(red: number, green: number, blue: number) {
  return (red << 16) | (green << 8) | blue
}

export function argb(alpha: number, red: number, green: number, blue: number) {
  return (alpha << 24) | (red << 16) | (green << 8) | blue
}

export function hexToRgb(hex: string) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!match) return null
  return rgb(
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16)
  )
}

export function associateColor(
  color: number,
  redColor: number,
  greenColor: number,
  blueColor: number
): number {
  const alphaValue = alpha(color)

  const redValue = red(color)
  const greenValue = green(color)
  const blueValue = blue(color)

  const firstRed = (red(redColor) * redValue) / 255
  const firstGreen = (green(redColor) * redValue) / 255
  const firstBlue = (blue(redColor) * redValue) / 255

  const secondRed = (red(greenColor) * greenValue) / 255
  const secondGreen = (green(greenColor) * greenValue) / 255
  const secondBlue = (blue(greenColor) * greenValue) / 255

  const thirdRed = (red(blueColor) * blueValue) / 255
  const thirdGreen = (green(blueColor) * blueValue) / 255
  const thirdBlue = (blue(blueColor) * blueValue) / 255

  let finalRed = firstRed + secondRed + thirdRed
  let finalGreen = firstGreen + secondGreen + thirdGreen
  let finalBlue = firstBlue + secondBlue + thirdBlue

  if (finalRed > 255) finalRed = 255
  if (finalGreen > 255) finalGreen = 255
  if (finalBlue > 255) finalBlue = 255

  return argb(alphaValue, finalRed, finalGreen, finalBlue)
}
