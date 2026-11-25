import { useMemo } from 'react'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { createAnmitsuTheme, type AnmitsuThemeOptions } from './theme/theme'
import type { Mode } from './theme/palette'

export type AnmitsuProviderProps = Omit<AnmitsuThemeOptions, 'mode'> & {
  /** Light or dark; follows the device when left out. */
  mode?: Mode
  children: React.ReactNode
}

/**
 * The app's theme and CSS baseline, light or dark as the device is unless `mode` says. Pass `overrides` as a stable
 * value (a constant, or memoised), since a new object rebuilds the theme.
 */
export function AnmitsuProvider({ mode, accent, secondary, radius, font, overrides, children }: AnmitsuProviderProps) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
  const resolved = mode ?? (prefersDark ? 'dark' : 'light')
  const theme = useMemo(() => createAnmitsuTheme({ mode: resolved, accent, secondary, radius, font, overrides }), [resolved, accent, secondary, radius, font, overrides])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
