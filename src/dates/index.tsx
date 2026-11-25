import { useState } from 'react'
import { Stack, ThemeProvider, type Theme } from '@mui/material'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'

// Needs @mui/x-date-pickers and dayjs in the app.

/** MUI X draws its own field rather than an OutlinedInput, so it needs the theme's field styles over again. */
function withPickerStyles(outer: Theme): Theme {
  const { neutral: n, primary: p, error } = outer.palette
  const radius = outer.anmitsu?.radius ?? 2
  return {
    ...outer,
    components: {
      ...outer.components,
      MuiPickersOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius,
            backgroundColor: n.surface,
            padding: '0 11px',
            '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: n.border, padding: '0 6px' },
            '&:hover .MuiPickersOutlinedInput-notchedOutline': { borderColor: p.base },
            '&.Mui-focused': { boxShadow: `0 0 0 2px ${p.ring}` },
            '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: p.base, borderWidth: 1 },
            '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': { borderColor: error.base },
            '&.Mui-error.Mui-focused': { boxShadow: `0 0 0 2px ${error.ring}` },
            '&.Mui-disabled': { backgroundColor: n.fill },
            '& .MuiPickersInputBase-sectionsContainer': { padding: '8px 0', lineHeight: '22px', fontSize: outer.typography.pxToRem(14) },
            '&.MuiPickersInputBase-inputSizeSmall .MuiPickersInputBase-sectionsContainer': { padding: '4px 0' },
            '& .MuiInputAdornment-root .MuiIconButton-root': { padding: 4 },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': { fontSize: outer.typography.pxToRem(16) },
          },
        },
      },
    },
  }
}

/** Dates the British way, DD/MM/YYYY with weeks from Monday, for every picker inside. Goes inside AnmitsuProvider. */
export function DatesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={withPickerStyles}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  )
}

const ISO = 'YYYY-MM-DD'

export type DateFieldProps = {
  label: string
  /** 'YYYY-MM-DD', or '' for none. */
  value: string
  /** 'YYYY-MM-DD', '' once cleared, or undefined while what is typed is not a whole date. */
  onChange: (date: string | undefined) => void
  required?: boolean
  /** Shows a button to empty it; by default only when not required. */
  clearable?: boolean
  helperText?: React.ReactNode
  minDate?: string
  maxDate?: string
}

/**
 * A date typed or picked as DD/MM/YYYY, whatever the browser's language: the browser's own date box follows the
 * computer's locale, which can be MM/DD/YYYY.
 */
export function DateField({ label, value, onChange, required, clearable = !required, helperText, minDate, maxDate }: DateFieldProps) {
  const [shown, setShown] = useState<Dayjs | null>(value ? dayjs(value, ISO) : null)
  // A new date from outside, such as a preset range, replaces what is shown; one that only echoes it back does not.
  const [last, setLast] = useState(value)
  if (value !== last) {
    setLast(value)
    if (value !== (shown?.isValid() ? shown.format(ISO) : '')) setShown(value ? dayjs(value, ISO) : null)
  }
  return (
    <DatePicker
      label={label}
      value={shown}
      format='DD/MM/YYYY'
      minDate={minDate ? dayjs(minDate, ISO) : undefined}
      maxDate={maxDate ? dayjs(maxDate, ISO) : undefined}
      onChange={date => {
        setShown(date)
        onChange(date === null ? '' : date.isValid() && date.year() >= 1900 && date.year() <= 2099 ? date.format(ISO) : undefined)
      }}
      slotProps={{ textField: { required, helperText, size: 'small', fullWidth: true }, field: { clearable } }}
    />
  )
}

/**
 * From and To side by side, for picking a span to look at. Neither can be emptied: there is no room on a phone for a
 * clear button beside the date, and a half-typed date is ignored until it is whole.
 */
export function DateRange({ from, to, onChange }: { from: string; to: string; onChange: (change: { from?: string; to?: string }) => void }) {
  return (
    <Stack direction='row' spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
      <DateField label='From' value={from} onChange={date => date && onChange({ from: date })} clearable={false} />
      <DateField label='To' value={to} onChange={date => date && onChange({ to: date })} clearable={false} />
    </Stack>
  )
}
