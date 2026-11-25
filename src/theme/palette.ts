import { contrast, mix, readable } from './color'

export type Mode = 'light' | 'dark'

/**
 * Accents that sit together: similar strength, different hues. Each app picks one so the apps look alike but can be
 * told apart. Any other hex colour works too; the shades below are worked out from it.
 */
export const ACCENTS = {
  lavender: '#9b72e8',
  blue: '#5b8def',
  sky: '#3d9fd1',
  teal: '#2fa595',
  green: '#3fae6a',
  amber: '#d9962b',
  coral: '#e57a5a',
  rose: '#e0709b',
} as const

/** The status colours, as base hues; their shades are worked out like an accent's. */
export const STATUS = {
  success: ACCENTS.green,
  warning: '#e0a526',
  error: '#e0505e',
  info: '#4a8fd9',
} as const

/** The shades of one colour, as the UI Kit uses them. */
export type Scale = {
  /** The colour itself (darkened or lightened only if it would not stand out from the surface): checkbox and switch fills, focused borders, progress bars, the slider. */
  base: string
  /** Pastel fill of a primary button or a selected step. */
  fill: string
  fillHover: string
  fillActive: string
  /** Border of a filled button, tag or alert. */
  border: string
  /** Faint background of a tag, alert or selected row. */
  tint: string
  /** Text in this colour, readable on white (or the dark surface) and on every fill above. */
  ink: string
}

export function scale(colour: string, mode: Mode, surface: string): Scale {
  const light = mode === 'light'
  const ground = light ? '#ffffff' : surface
  const towards = light ? '#000000' : '#ffffff'
  // A very pale accent on the dark surface (or a very dark one on white) would leave no room for readable text on its
  // fills, so the fills are made fainter until text has room.
  let k = 1
  while (k > 0.3 && contrast(towards, mix(colour, ground, (light ? 0.45 : 0.44) * k)) < 6) k -= 0.05
  const at = (weight: number) => mix(colour, ground, weight * k)
  if (light) {
    const fillActive = at(0.45)
    return { base: readable(colour, towards, [ground], 3), fill: at(0.25), fillHover: at(0.35), fillActive, border: at(0.45), tint: at(0.12), ink: readable(colour, towards, [fillActive, ground], 4.5, 0.4) }
  }
  const fillActive = at(0.44)
  return { base: readable(mix(colour, '#ffffff', 0.85), towards, [surface], 3), fill: at(0.28), fillHover: at(0.36), fillActive, border: mix(colour, surface, 0.55), tint: at(0.16), ink: readable(colour, towards, [fillActive, surface], 4.5, 0.3) }
}

/** Greys with a little of the accent in them, so each app's neutrals lean towards its own hue. */
export type Neutrals = {
  text: string
  secondary: string
  disabled: string
  /** Borders of controls: inputs, default buttons. */
  border: string
  /** Lines between things: card edges, table rows, dividers. */
  split: string
  /** Hover and disabled backgrounds. */
  fill: string
  /** Table heads, input add-ons. */
  subtle: string
  /** Cards, dialogs, inputs. */
  surface: string
  /** The page behind the cards. */
  page: string
  /** Switch track when off. */
  track: string
}

const GREYS: Record<Mode, Record<keyof Neutrals, [string, number]>> = {
  light: {
    text: ['#1f1f24', 0.12],
    secondary: ['#58585f', 0.1],
    disabled: ['#8d8c96', 0.1],
    border: ['#d9d9dd', 0.08],
    split: ['#ececef', 0.07],
    fill: ['#f4f4f6', 0.06],
    subtle: ['#f9f9fa', 0.04],
    surface: ['#ffffff', 0],
    page: ['#f7f7f8', 0.03],
    track: ['#c6c6cc', 0.12],
  },
  dark: {
    text: ['#ececf0', 0.05],
    secondary: ['#a8a7b1', 0.08],
    disabled: ['#6c6b75', 0.08],
    border: ['#3b3a43', 0.1],
    split: ['#2b2a31', 0.08],
    fill: ['#26252c', 0.08],
    subtle: ['#1f1e25', 0.06],
    surface: ['#1b1a20', 0.05],
    page: ['#131217', 0.04],
    track: ['#4a4952', 0.1],
  },
}

export function neutrals(accent: string, mode: Mode): Neutrals {
  return Object.fromEntries(Object.entries(GREYS[mode]).map(([key, [grey, k]]) => [key, mix(accent, grey, k)])) as Neutrals
}
