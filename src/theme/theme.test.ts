import { describe, expect, it } from 'vitest'
import { contrast, mix } from './color'
import { ACCENTS } from './palette'
import { createAnmitsuTheme } from './theme'

describe('mix', () => {
  it('mixes like CSS color-mix', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
    expect(mix('#9b72e8', '#ffffff', 1)).toBe('#9b72e8')
    expect(mix('#fff', '#000', 0)).toBe('#000000')
  })
})

describe('contrast', () => {
  it('is 21 for black on white and 1 for a colour on itself', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrast('#9b72e8', '#9b72e8')).toBe(1)
  })
})

const accents = [...Object.entries(ACCENTS), ['dark blue', '#1f5f8b'], ['pale yellow', '#f2e27a']] as const

describe.each(['light', 'dark'] as const)('%s theme', mode => {
  it.each(accents)('keeps text readable with a %s accent', (_, accent) => {
    const { palette } = createAnmitsuTheme({ mode, accent })
    const surfaces = [palette.background.paper, palette.background.default, palette.neutral.subtle]
    for (const bg of surfaces) {
      expect(contrast(palette.text.primary, bg)).toBeGreaterThanOrEqual(7)
      expect(contrast(palette.text.secondary, bg)).toBeGreaterThanOrEqual(4.5)
    }
    for (const colour of [palette.primary, palette.secondary, palette.success, palette.error, palette.warning, palette.info]) {
      // Button text on its fill at rest, hovered and pressed; tag and alert text on their tint.
      for (const bg of [colour.fill, colour.fillHover, colour.fillActive, colour.tint, palette.background.paper]) expect(contrast(colour.ink, bg)).toBeGreaterThanOrEqual(4.5)
    }
    // Checkbox, switch and progress fills stand out from the surface, and the tick on them shows.
    expect(contrast(palette.primary.base, palette.background.paper)).toBeGreaterThanOrEqual(2.5)
    expect(contrast(palette.primary.contrastText, palette.primary.base)).toBeGreaterThanOrEqual(2.5)
    // Alerts write body text in the normal text colour on the tint.
    expect(contrast(palette.text.primary, palette.error.tint)).toBeGreaterThanOrEqual(4.5)
  })
})

it('follows the UI Kit for its own lavender', () => {
  const { palette, shape, typography } = createAnmitsuTheme()
  expect(palette.primary.main).toBe('#9b72e8')
  // color-mix(in srgb, #9b72e8 25%, white) in the canvas.
  expect(palette.primary.fill).toBe(mix('#9b72e8', '#ffffff', 0.25))
  expect(shape.borderRadius).toBe(2)
  expect(typography.fontSize).toBe(14)
})

it('takes overrides', () => {
  const theme = createAnmitsuTheme({ overrides: { palette: { background: { default: '#000000' } } } })
  expect(theme.palette.background.default).toBe('#000000')
  expect(theme.palette.primary.fill).toBeDefined()
})
