import { createTheme, type Components, type Shadows, type Theme, type ThemeOptions } from '@mui/material/styles'
import { mix } from './color'
import { CheckboxCheckedIcon, CheckboxIcon, CheckboxIndeterminateIcon, RadioCheckedIcon, RadioIcon, StepIcon } from './icons'
import { ACCENTS, neutrals, scale, STATUS, type Mode, type Neutrals, type Scale } from './palette'

export const FONT = "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
export const MONO_FONT = "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"

declare module '@mui/material/styles' {
  // Every palette colour carries the UI Kit's shades of it (see Scale in palette.ts).
  interface PaletteColor extends Scale {
    ring: string
  }
  interface SimplePaletteColorOptions extends Partial<Scale> {
    ring?: string
  }
  interface Palette {
    neutral: Neutrals
  }
  interface PaletteOptions {
    neutral?: Neutrals
  }
  interface Theme {
    anmitsu: AnmitsuTokens
  }
  interface ThemeOptions {
    anmitsu?: AnmitsuTokens
  }
}

export type AnmitsuTokens = {
  mode: Mode
  accent: string
  /** Corner radius in px; the UI Kit's is 2. */
  radius: number
  monoFont: string
  shadows: { card: string; overlay: string }
}

export type AnmitsuThemeOptions = {
  mode?: Mode
  /** The app's own colour, as a hex string; ACCENTS has ones that suit. Lavender if left out. */
  accent?: string
  /** For the odd second colour (MUI's `secondary`). Rose, or lavender when the accent is rose. */
  secondary?: string
  /** Corner radius in px. 2 (the UI Kit's square look) if left out. */
  radius?: number
  /** Replaces Inter, such as for an app whose font is a reader setting. */
  font?: string
  /** Anything else, merged over the theme with MUI's createTheme. */
  overrides?: ThemeOptions
}

const COLOURS = ['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const
type Colour = (typeof COLOURS)[number]

const rem = (px: number) => `${px / 16}rem`

/** The UI Kit (Ant Design's structure, square corners, pastel fills) as an MUI theme, in the app's accent. */
export function createAnmitsuTheme({ mode = 'light', accent = ACCENTS.lavender, secondary, radius = 2, font = FONT, overrides }: AnmitsuThemeOptions = {}): Theme {
  const n = neutrals(accent, mode)
  const colour = (c: string) => {
    const s = scale(c, mode, n.surface)
    return { ...s, ring: mix(s.base, n.surface, mode === 'light' ? 0.2 : 0.35) }
  }
  const sec = secondary ?? (accent.toLowerCase() === ACCENTS.rose ? ACCENTS.lavender : ACCENTS.rose)
  const scales: Record<Colour, Scale & { ring: string }> = {
    primary: colour(accent),
    secondary: colour(sec),
    success: colour(STATUS.success),
    error: colour(STATUS.error),
    warning: colour(STATUS.warning),
    info: colour(STATUS.info),
  }
  const p = scales.primary
  const light = mode === 'light'
  const shadows = light
    ? { card: '0 1px 2px rgba(0,0,0,0.06), 0 1px 6px -1px rgba(0,0,0,0.08)', overlay: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)' }
    : { card: `0 0 0 1px ${n.split}, 0 1px 4px rgba(0,0,0,0.4)`, overlay: `0 0 0 1px ${n.border}, 0 6px 16px rgba(0,0,0,0.4), 0 9px 28px 8px rgba(0,0,0,0.3)` }
  const focusRing = { outline: `2px solid ${p.border}`, outlineOffset: 1 }
  const insetFocusRing = { outline: `2px solid ${p.border}`, outlineOffset: -2 }
  const overlayPaper = { border: 0, boxShadow: shadows.overlay, backgroundImage: 'none' }
  const sm = '@media (min-width:600px)'

  // Palette colours: MUI's `main` is the accent itself for primary and secondary (fills, borders, bars), and the
  // readable ink for the status colours, since MUI writes error text and the like in `main`.
  const paletteColour = (c: Colour) => {
    const s = scales[c]
    const isStatus = c !== 'primary' && c !== 'secondary'
    const main = isStatus ? s.ink : s.base
    return { ...s, main, light: s.fill, dark: s.ink, contrastText: light ? '#ffffff' : n.page }
  }

  const buttonColours = COLOURS.flatMap(c => {
    const s = scales[c]
    return [
      {
        props: { variant: 'contained' as const, color: c },
        style: {
          backgroundColor: s.fill,
          color: s.ink,
          borderColor: s.border,
          '&:hover': { backgroundColor: s.fillHover, borderColor: s.base, boxShadow: 'none' },
          '&:active': { backgroundColor: s.fillActive, borderColor: s.ink },
        },
      },
      {
        props: { variant: 'outlined' as const, color: c },
        style:
          c === 'primary'
            ? { backgroundColor: n.surface, color: n.text, borderColor: n.border, '&:hover': { backgroundColor: n.surface, borderColor: s.base, color: s.ink }, '&:active': { backgroundColor: s.tint, borderColor: s.ink } }
            : { backgroundColor: n.surface, color: s.ink, borderColor: s.border, '&:hover': { backgroundColor: s.tint, borderColor: s.base } },
      },
      {
        props: { variant: 'text' as const, color: c },
        style: { color: s.ink, '&:hover': { backgroundColor: s.tint } },
      },
    ]
  })

  const chipColours = COLOURS.flatMap(c => {
    const s = scales[c]
    return [
      {
        props: { variant: 'filled' as const, color: c },
        style: {
          backgroundColor: s.tint,
          borderColor: s.border,
          color: s.ink,
          '& .MuiChip-deleteIcon': { color: s.ink, opacity: 0.7, '&:hover': { color: s.ink, opacity: 1 } },
          '&.MuiChip-clickable:hover, &.Mui-focusVisible': { backgroundColor: s.fill },
        },
      },
      {
        props: { variant: 'outlined' as const, color: c },
        style: { backgroundColor: 'transparent', borderColor: s.border, color: s.ink, '& .MuiChip-deleteIcon': { color: s.ink, opacity: 0.7 }, '&.MuiChip-clickable:hover': { backgroundColor: s.tint } },
      },
    ]
  })

  const alertSeverities = (['success', 'info', 'warning', 'error'] as const).flatMap(c => {
    const s = scales[c]
    return [
      { props: { variant: 'standard' as const, severity: c }, style: { backgroundColor: s.tint, borderColor: s.border, color: n.text, '& .MuiAlert-icon': { color: s.ink } } },
      { props: { variant: 'outlined' as const, severity: c }, style: { backgroundColor: n.surface, borderColor: s.border, color: n.text, '& .MuiAlert-icon': { color: s.ink } } },
      { props: { variant: 'filled' as const, severity: c }, style: { backgroundColor: s.fill, borderColor: s.fill, color: s.ink, '& .MuiAlert-icon': { color: s.ink } } },
    ]
  })

  const components: Components<Theme> = {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { '--anmitsu-radius': `${radius}px`, colorScheme: mode },
        body: { backgroundColor: n.page },
        'code, kbd, pre, samp': { fontFamily: MONO_FONT, fontSize: '0.92em' },
        '::selection': { backgroundColor: p.fill, color: n.text },
      },
    },

    // Crisp edges instead of ripples; keyboard focus gets a ring instead.
    MuiButtonBase: { defaultProps: { disableRipple: true }, styleOverrides: { root: { '&.Mui-focusVisible': focusRing } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          border: '1px solid transparent',
          minWidth: 0,
          whiteSpace: 'nowrap',
          '&.Mui-focusVisible': focusRing,
          '&.MuiButton-outlined.MuiButton-colorInherit': { borderColor: n.border },
          '&.Mui-disabled.MuiButton-contained, &.Mui-disabled.MuiButton-outlined': { backgroundColor: n.fill, borderColor: n.border, color: n.disabled },
          variants: buttonColours,
        },
        sizeSmall: { height: 24, padding: '0 7px', fontSize: rem(14) },
        sizeMedium: { height: 32, padding: '0 15px', fontSize: rem(14) },
        sizeLarge: { height: 40, padding: '0 15px', fontSize: rem(16) },
        colorInherit: { '&:hover': { backgroundColor: n.fill } },
        startIcon: { marginLeft: -2, marginRight: 8, '& > *:nth-of-type(1)': { fontSize: 16 }, '.MuiButton-sizeSmall > &': { marginRight: 6, '& > *:nth-of-type(1)': { fontSize: 14 } }, '.MuiButton-sizeLarge > & > *:nth-of-type(1)': { fontSize: 18 } },
        endIcon: { marginLeft: 8, marginRight: -2, '& > *:nth-of-type(1)': { fontSize: 16 }, '.MuiButton-sizeSmall > &': { marginLeft: 6, '& > *:nth-of-type(1)': { fontSize: 14 } }, '.MuiButton-sizeLarge > & > *:nth-of-type(1)': { fontSize: 18 } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: radius, padding: 6, color: n.secondary, '&:hover': { backgroundColor: n.fill, color: n.text }, '&.Mui-focusVisible': focusRing },
        sizeSmall: { padding: 4 },
        sizeLarge: { padding: 10 },
        colorPrimary: { color: p.ink, '&:hover': { backgroundColor: p.tint, color: p.ink } },
        colorInherit: { color: 'inherit' },
      },
    },
    MuiSvgIcon: { styleOverrides: { fontSizeSmall: { fontSize: rem(16) }, fontSizeMedium: { fontSize: rem(20) }, fontSizeLarge: { fontSize: rem(28) } } },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { '& .MuiToggleButtonGroup-grouped.Mui-selected': { borderColor: p.base, position: 'relative', zIndex: 1 } },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          height: 32,
          padding: '0 15px',
          textTransform: 'none',
          fontSize: rem(14),
          fontWeight: 400,
          lineHeight: '22px',
          color: n.text,
          borderColor: n.border,
          borderRadius: radius,
          backgroundColor: n.surface,
          '&:hover': { backgroundColor: n.surface, color: p.ink },
          '&.Mui-selected': { color: p.ink, backgroundColor: n.surface, borderColor: p.base, '&:hover': { backgroundColor: p.tint } },
          '&.Mui-focusVisible': insetFocusRing,
        },
        sizeSmall: { height: 24, padding: '0 7px' },
        sizeLarge: { height: 40, padding: '0 15px', fontSize: rem(16) },
      },
    },

    MuiPaper: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { backgroundImage: 'none' }, outlined: { borderColor: n.split } },
    },
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '12px 16px', borderBottom: `1px solid ${n.split}` },
        title: { fontSize: rem(14), lineHeight: '22px', fontWeight: 600 },
        subheader: { fontSize: rem(13), lineHeight: '20px', color: n.secondary },
        action: { margin: '-4px -8px -4px 0', alignSelf: 'center' },
      },
    },
    MuiCardContent: { styleOverrides: { root: { padding: 16, '&:last-child': { paddingBottom: 16 } } } },
    MuiCardActions: { styleOverrides: { root: { padding: '8px 16px', borderTop: `1px solid ${n.split}` } } },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: { root: { border: 0, borderBottom: `1px solid ${n.split}`, backgroundColor: n.surface, color: n.text } },
    },
    MuiToolbar: { styleOverrides: { regular: { minHeight: 56, [sm]: { minHeight: 56 } } } },
    MuiDivider: { styleOverrides: { root: { borderColor: n.split } } },
    MuiSkeleton: { styleOverrides: { root: { borderRadius: radius }, text: { borderRadius: radius } } },
    MuiAccordion: {
      defaultProps: { disableGutters: true },
      styleOverrides: { root: { '&::before': { display: 'none' }, '&:first-of-type, &:last-of-type': { borderRadius: radius } } },
    },

    // Fields: 32px high (40px for size="medium"), labels inside the border as MUI draws them.
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          backgroundColor: n.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: n.border, padding: '0 6px' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: p.base },
          '&.Mui-focused': { boxShadow: `0 0 0 2px ${p.ring}` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: p.base, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: scales.error.base },
          '&.Mui-error.Mui-focused': { boxShadow: `0 0 0 2px ${scales.error.ring}` },
          '&.Mui-disabled': { backgroundColor: n.fill },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: n.border },
          '&.MuiInputBase-adornedStart': { paddingLeft: 11 },
          '&.MuiInputBase-adornedEnd': { paddingRight: 11 },
          '&.MuiInputBase-multiline': { padding: '8px 11px' },
          '&.MuiInputBase-multiline.MuiInputBase-sizeSmall': { padding: '4px 11px' },
        },
        // MUI 9 has no classes on the input for its size or adornments, so these look at the field around it.
        input: {
          padding: '8px 11px',
          height: 22,
          lineHeight: '22px',
          '.MuiInputBase-sizeSmall > &': { padding: '4px 11px' },
          '.MuiInputBase-adornedStart > &': { paddingLeft: 0 },
          '.MuiInputBase-adornedEnd > &': { paddingRight: 0 },
          '.MuiInputBase-multiline > &': { padding: 0 },
        },
      },
    },
    MuiInputBase: { styleOverrides: { root: { fontSize: rem(14), lineHeight: '22px' }, input: { '&::placeholder': { color: n.disabled, opacity: 1 } } } },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: n.secondary,
          fontSize: rem(14),
          lineHeight: '20px',
          '&.MuiInputLabel-outlined': { transform: 'translate(11px, 10px) scale(1)' },
          '&.MuiInputLabel-outlined.MuiInputLabel-sizeSmall': { transform: 'translate(11px, 6px) scale(1)' },
          '&.MuiInputLabel-outlined.MuiInputLabel-shrink': { transform: 'translate(11px, -9px) scale(0.75)', maxWidth: 'calc(133% - 22px)' },
          '&.Mui-focused': { color: p.ink },
          '&.Mui-error': { color: scales.error.ink },
        },
      },
    },
    MuiInputAdornment: { styleOverrides: { root: { color: n.secondary }, positionStart: { marginRight: 8 }, positionEnd: { marginLeft: 8 } } },
    MuiSelect: { styleOverrides: { select: { minHeight: 22, lineHeight: '22px' }, icon: { color: n.secondary } } },
    MuiNativeSelect: { styleOverrides: { icon: { color: n.secondary } } },
    MuiFormHelperText: { styleOverrides: { root: { margin: '4px 0 0', fontSize: rem(12), lineHeight: '18px', color: n.secondary }, contained: { marginLeft: 0, marginRight: 0 } } },
    MuiFormLabel: { styleOverrides: { root: { color: n.text, fontSize: rem(14), '&.Mui-focused': { color: n.text } } } },
    MuiFormControlLabel: { styleOverrides: { root: { marginLeft: -8, marginRight: 16 }, label: { fontSize: rem(14), lineHeight: '22px' } } },
    MuiAutocomplete: {
      defaultProps: { fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 7,
            '& .MuiAutocomplete-input': { padding: '4px' },
            '&.MuiInputBase-sizeSmall': { paddingTop: 0, paddingBottom: 0, paddingLeft: 7, '& .MuiAutocomplete-input': { padding: '4px' } },
          },
          '& .MuiAutocomplete-tag': { margin: 2 },
        },
        paper: overlayPaper,
        listbox: {
          padding: 4,
          '& .MuiAutocomplete-option': {
            minHeight: 32,
            padding: '5px 12px',
            borderRadius: radius,
            fontSize: rem(14),
            '&.Mui-focused': { backgroundColor: n.fill },
            '&[aria-selected="true"]': { backgroundColor: p.tint, fontWeight: 600, '&.Mui-focused': { backgroundColor: p.fill } },
          },
        },
        groupLabel: { fontSize: rem(12), lineHeight: '28px', color: n.secondary, fontWeight: 600 },
        noOptions: { fontSize: rem(14), color: n.secondary },
        loading: { fontSize: rem(14), color: n.secondary },
      },
    },

    MuiCheckbox: {
      defaultProps: { icon: <CheckboxIcon />, checkedIcon: <CheckboxCheckedIcon />, indeterminateIcon: <CheckboxIndeterminateIcon /> },
      styleOverrides: { root: { padding: 8, color: n.disabled, '&:hover': { backgroundColor: 'transparent' }, '&.Mui-focusVisible': { outline: 'none' }, '&.Mui-focusVisible > span': focusRing } },
    },
    MuiRadio: {
      defaultProps: { icon: <RadioIcon />, checkedIcon: <RadioCheckedIcon /> },
      styleOverrides: { root: { padding: 8, color: n.disabled, '&:hover': { backgroundColor: 'transparent' }, '&.Mui-focusVisible': { outline: 'none' }, '&.Mui-focusVisible > span': { ...focusRing, borderRadius: '50%' } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 44, height: 22, padding: 0, margin: '5px 8px', overflow: 'visible' },
        switchBase: {
          padding: 2,
          '&:hover': { backgroundColor: 'transparent' },
          '&.Mui-checked': { transform: 'translateX(22px)', '&:hover': { backgroundColor: 'transparent' } },
          '&.Mui-checked + .MuiSwitch-track': { opacity: 1 },
          '&.Mui-focusVisible': { outline: 'none' },
          '&.Mui-focusVisible + .MuiSwitch-track': focusRing,
          '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.4 },
        },
        thumb: { width: 18, height: 18, borderRadius: Math.max(0, radius * 0.6), backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,35,11,0.2)' },
        track: { borderRadius: radius, opacity: 1, backgroundColor: n.track },
        sizeSmall: {
          width: 32,
          height: 16,
          padding: 0,
          '& .MuiSwitch-switchBase': { padding: 2, '&.Mui-checked': { transform: 'translateX(16px)' } },
          '& .MuiSwitch-thumb': { width: 12, height: 12 },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { height: 4, padding: '10px 0', borderRadius: 0 },
        rail: { opacity: 1, backgroundColor: n.split },
        track: { border: 'none', opacity: 0.6 },
        thumb: {
          width: 12,
          height: 12,
          borderRadius: 0,
          boxSizing: 'border-box',
          backgroundColor: n.surface,
          border: '2px solid currentColor',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          '.MuiSlider-vertical &': { transform: 'translate(-50%, 50%) rotate(45deg)' },
          '&::before': { boxShadow: 'none' },
          '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: `0 0 0 4px ${p.ring}` },
        },
        valueLabel: { borderRadius: radius, backgroundColor: n.text, color: n.surface, fontSize: rem(12), padding: '2px 6px' },
        mark: { width: 2, height: 4, borderRadius: 0 },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40, '&:not(.MuiTabs-vertical)': { borderBottom: `1px solid ${n.split}` } },
        indicator: { height: 2, borderRadius: 0 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          minWidth: 0,
          padding: '9px 0',
          textTransform: 'none',
          fontSize: rem(14),
          lineHeight: '22px',
          fontWeight: 400,
          color: n.text,
          '&:not(:last-of-type):not(.MuiTab-fullWidth)': { marginRight: 32 },
          '&.MuiTab-fullWidth': { padding: '9px 12px' },
          '&:hover': { color: p.ink },
          '&.Mui-selected': { color: p.ink, fontWeight: 500 },
          '&.Mui-focusVisible': insetFocusRing,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${n.split}`, padding: '12px 16px', fontSize: rem(14), lineHeight: '22px' },
        head: { backgroundColor: n.subtle, fontWeight: 600, color: n.text },
        sizeSmall: { padding: '8px' },
      },
    },
    MuiTableRow: { styleOverrides: { root: { '&.MuiTableRow-hover:hover': { backgroundColor: n.subtle }, '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: p.tint } } } },
    MuiTablePagination: { styleOverrides: { root: { borderBottom: 0 }, selectLabel: { fontSize: rem(14) }, displayedRows: { fontSize: rem(14), color: n.secondary } } },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          height: 32,
          minWidth: 32,
          margin: '0 4px',
          fontSize: rem(14),
          border: '1px solid transparent',
          color: n.text,
          '&:hover': { backgroundColor: n.fill },
          '&.Mui-selected': { backgroundColor: n.surface, borderColor: p.base, color: p.ink, fontWeight: 600, '&:hover': { backgroundColor: p.tint } },
          '&.MuiPaginationItem-previousNext': { borderColor: n.border },
        },
        sizeSmall: { height: 24, minWidth: 24 },
        outlined: { borderColor: n.border },
      },
    },

    // Tags: 22px (small, the default) or 24px, square, tinted.
    MuiChip: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          height: 24,
          borderRadius: radius,
          fontSize: rem(12),
          lineHeight: '20px',
          border: `1px solid ${n.border}`,
          backgroundColor: n.subtle,
          color: n.text,
          '&.MuiChip-clickable:hover': { backgroundColor: n.fill },
          variants: [{ props: { variant: 'outlined' as const, color: 'default' as const }, style: { backgroundColor: 'transparent' } }, ...chipColours],
        },
        sizeSmall: { height: 22 },
        label: { padding: '0 7px' },
        icon: { fontSize: 14, marginLeft: 6, marginRight: -3, color: 'inherit' },
        avatar: { width: 16, height: 16, marginLeft: 3, marginRight: -3, fontSize: rem(10) },
        deleteIcon: { fontSize: 14, color: n.secondary, margin: '0 4px 0 -3px', '&:hover': { color: n.text } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { borderRadius: radius, height: 20, minWidth: 20, padding: '0 6px', fontSize: rem(12), fontWeight: 500, boxShadow: `0 0 0 1px ${n.surface}` },
        dot: { height: 8, minWidth: 8, padding: 0, borderRadius: radius },
        ...Object.fromEntries(COLOURS.map(c => [`color${c[0].toUpperCase()}${c.slice(1)}`, { backgroundColor: scales[c].fillActive, color: scales[c].ink }])),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { width: 32, height: 32, fontSize: rem(13), fontWeight: 600, borderRadius: radius },
        colorDefault: { backgroundColor: p.fill, color: p.ink },
      },
    },
    MuiAvatarGroup: { styleOverrides: { avatar: { border: `2px solid ${n.surface}`, marginLeft: -6 } } },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius, border: '1px solid transparent', padding: '0 12px', fontSize: rem(14), lineHeight: '22px', variants: alertSeverities },
        icon: { marginRight: 10, padding: '11px 0', fontSize: 16, opacity: 1 },
        message: { padding: '8px 0' },
        action: { paddingTop: 4, marginRight: -6 },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontSize: rem(14), lineHeight: '22px', fontWeight: 600, margin: '0 0 2px' } } },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: light ? n.text : n.border, color: light ? '#ffffff' : n.text, fontSize: rem(13), lineHeight: '20px', padding: '6px 8px', borderRadius: radius, maxWidth: 260, fontWeight: 400 },
        arrow: { color: light ? n.text : n.border },
      },
    },
    MuiSnackbarContent: { styleOverrides: { root: { backgroundColor: n.surface, color: n.text, boxShadow: shadows.overlay, borderRadius: radius, padding: '1px 12px', fontSize: rem(14) } } },
    MuiLinearProgress: {
      styleOverrides: {
        // The bars in each colour's own shade, not MUI's `main` (the darker ink, for the status colours).
        root: { height: 8, borderRadius: 0, '&&': { backgroundColor: n.split }, variants: COLOURS.map(c => ({ props: { color: c }, style: { '& .MuiLinearProgress-bar1': { backgroundColor: scales[c].base } } })) },
        bar: { borderRadius: 0 },
      },
    },
    MuiStepLabel: {
      defaultProps: { slots: { stepIcon: StepIcon } },
      styleOverrides: {
        label: { fontSize: rem(14), color: n.secondary, '&.Mui-active': { color: n.text, fontWeight: 600 }, '&.Mui-completed': { color: n.text, fontWeight: 400 } },
        iconContainer: { paddingRight: 8 },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: { borderColor: n.split },
        root: { '&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line': { borderColor: p.base } },
        alternativeLabel: { top: 16 },
      },
    },
    MuiBreadcrumbs: { styleOverrides: { root: { color: n.secondary, fontSize: rem(14) }, separator: { color: n.disabled, marginLeft: 8, marginRight: 8 } } },
    MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { color: p.ink, textDecorationColor: 'currentColor', '&:hover': { color: light ? mix(p.ink, '#000000', 0.75) : mix(p.ink, '#ffffff', 0.75) } } } },

    MuiDialog: {
      styleOverrides: {
        paper: { ...overlayPaper, borderRadius: radius },
        paperFullScreen: { borderRadius: 0 },
      },
    },
    // Dialogs fill the screen on phones, so their edges match the page's 16px there.
    MuiDialogTitle: { styleOverrides: { root: { fontSize: rem(16), lineHeight: '24px', fontWeight: 600, padding: '16px 16px 8px', [sm]: { padding: '20px 24px 8px' } } } },
    MuiDialogContent: { styleOverrides: { root: { padding: '8px 16px', [sm]: { padding: '8px 24px' } } } },
    MuiDialogContentText: { styleOverrides: { root: { color: n.secondary, fontSize: rem(14) } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '12px 16px 16px', gap: 8, [sm]: { padding: '16px 24px 20px' }, '& > :not(style) ~ :not(style)': { marginLeft: 0 } } } },
    MuiBackdrop: { styleOverrides: { root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: light ? 'rgba(39,33,58,0.32)' : 'rgba(0,0,0,0.6)' } } } },
    MuiPopover: { styleOverrides: { paper: { ...overlayPaper, borderRadius: radius } } },
    MuiMenu: { styleOverrides: { list: { padding: 4 } } },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
          padding: '5px 12px',
          borderRadius: radius,
          fontSize: rem(14),
          lineHeight: '22px',
          [sm]: { minHeight: 32 },
          '&:hover': { backgroundColor: n.fill },
          '&.Mui-focusVisible': { backgroundColor: n.fill, outline: 'none' },
          '&.Mui-selected': { backgroundColor: p.tint, fontWeight: 600, '&:hover, &.Mui-focusVisible': { backgroundColor: p.fill } },
          '& + .MuiDivider-root': { margin: '4px 0' },
          '& .MuiListItemIcon-root': { minWidth: 28 },
        },
      },
    },

    // List rows: 12px by 16px, the accent's tint under the pointer.
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '&:hover': { backgroundColor: p.tint },
          '&.Mui-selected': { backgroundColor: p.tint, color: p.ink, boxShadow: `inset 2px 0 0 ${p.base}`, '&:hover': { backgroundColor: p.fill } },
          '&.Mui-focusVisible': { ...insetFocusRing, backgroundColor: p.tint },
        },
      },
    },
    MuiListItemIcon: { styleOverrides: { root: { minWidth: 36, color: 'inherit' } } },
    MuiListItemText: { styleOverrides: { primary: { fontSize: rem(14), lineHeight: '22px' }, secondary: { fontSize: rem(13), lineHeight: '20px', color: n.secondary } } },
    MuiListSubheader: { styleOverrides: { root: { fontSize: rem(12), lineHeight: '32px', fontWeight: 600, color: n.secondary, backgroundColor: n.surface } } },
    MuiBottomNavigationAction: { styleOverrides: { root: { color: n.secondary, '&.Mui-selected': { color: p.ink } }, label: { fontSize: rem(12), '&.Mui-selected': { fontSize: rem(12), fontWeight: 600 } } } },
  }

  const base = createTheme({
    palette: {
      mode,
      primary: paletteColour('primary'),
      secondary: paletteColour('secondary'),
      success: paletteColour('success'),
      error: paletteColour('error'),
      warning: paletteColour('warning'),
      info: paletteColour('info'),
      neutral: n,
      text: { primary: n.text, secondary: n.secondary, disabled: n.disabled },
      background: { default: n.page, paper: n.surface },
      divider: n.split,
      action: { hover: n.fill, selected: p.tint, disabledBackground: n.fill, disabled: n.disabled, focus: p.tint },
    },
    shape: { borderRadius: radius },
    // Elevation 1-2 is a resting card, anything higher an overlay (menus, dialogs, popovers).
    shadows: ['none', shadows.card, shadows.card, ...Array(22).fill(shadows.overlay)] as Shadows,
    typography: {
      fontFamily: font,
      fontSize: 14,
      htmlFontSize: 16,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h1: { fontSize: rem(38), lineHeight: '46px', fontWeight: 600, letterSpacing: '-0.02em' },
      h2: { fontSize: rem(30), lineHeight: '38px', fontWeight: 600, letterSpacing: '-0.01em' },
      h3: { fontSize: rem(24), lineHeight: '32px', fontWeight: 600, letterSpacing: '-0.005em' },
      h4: { fontSize: rem(20), lineHeight: '28px', fontWeight: 600 },
      h5: { fontSize: rem(18), lineHeight: '26px', fontWeight: 600 },
      h6: { fontSize: rem(16), lineHeight: '24px', fontWeight: 600 },
      subtitle1: { fontSize: rem(16), lineHeight: '24px', fontWeight: 500 },
      subtitle2: { fontSize: rem(14), lineHeight: '22px', fontWeight: 600 },
      body1: { fontSize: rem(14), lineHeight: '22px' },
      body2: { fontSize: rem(13), lineHeight: '20px' },
      button: { fontSize: rem(14), lineHeight: '22px', fontWeight: 500, textTransform: 'none' },
      caption: { fontSize: rem(12), lineHeight: '18px' },
      overline: { fontFamily: MONO_FONT, fontSize: rem(12), lineHeight: '20px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 400 },
    },
    components,
    anmitsu: { mode, accent, radius, monoFont: MONO_FONT, shadows },
  })
  return overrides ? createTheme(base, overrides) : base
}
