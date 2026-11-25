// Colour arithmetic for deriving a whole palette from one accent. Hex colours only (#rgb or #rrggbb).

type Rgb = [number, number, number]

function parse(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = [...h].map(c => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Not a hex colour: ${hex}`)
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) as Rgb
}

function format([r, g, b]: Rgb): string {
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

/** `weight` of `a` mixed into `b` (like CSS `color-mix(in srgb, a weight, b)`). */
export function mix(a: string, b: string, weight: number): string {
  const x = parse(a)
  const y = parse(b)
  return format([0, 1, 2].map(i => x[i] * weight + y[i] * (1 - weight)) as Rgb)
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio, 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * `colour` moved towards `towards` (black or white) one step at a time, starting at `start` of `towards`, until it
 * reaches `ratio` contrast against every one of `backgrounds`. Gives text in the accent's hue that is still readable.
 */
export function readable(colour: string, towards: string, backgrounds: string[], ratio = 4.5, start = 0): string {
  for (let k = start; k <= 1; k += 0.02) {
    const candidate = mix(towards, colour, k)
    if (backgrounds.every(bg => contrast(candidate, bg) >= ratio)) return candidate
  }
  return towards
}
