import { Box } from '@mui/material'
import type { StepIconProps } from '@mui/material/StepIcon'

// The UI Kit's square controls. They draw in `currentColor`, which MUI sets from the control's `color` and state.

const box = { width: 16, height: 16, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 1 } as const

export function CheckboxIcon() {
  return <Box component='span' aria-hidden sx={{ ...box, border: 1, borderColor: 'neutral.disabled', bgcolor: 'background.paper', '.Mui-disabled &': { bgcolor: 'neutral.fill', borderColor: 'neutral.border' } }} />
}

function Mark({ d }: { d: string }) {
  return (
    <Box component='svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3.5' strokeLinecap='square' sx={{ color: 'primary.contrastText' }}>
      <path d={d} />
    </Box>
  )
}

export function CheckboxCheckedIcon() {
  return (
    <Box component='span' aria-hidden sx={{ ...box, bgcolor: 'currentColor', '.Mui-disabled &': { bgcolor: 'neutral.border' } }}>
      <Mark d='M5 12l5 5L20 7' />
    </Box>
  )
}

export function CheckboxIndeterminateIcon() {
  return (
    <Box component='span' aria-hidden sx={{ ...box, bgcolor: 'currentColor', '.Mui-disabled &': { bgcolor: 'neutral.border' } }}>
      <Mark d='M6 12h12' />
    </Box>
  )
}

export function RadioIcon() {
  return <Box component='span' aria-hidden sx={{ ...box, borderRadius: '50%', border: 1, borderColor: 'neutral.disabled', bgcolor: 'background.paper', '.Mui-disabled &': { bgcolor: 'neutral.fill', borderColor: 'neutral.border' } }} />
}

export function RadioCheckedIcon() {
  return <Box component='span' aria-hidden sx={{ ...box, borderRadius: '50%', border: '5px solid currentColor', bgcolor: 'background.paper' }} />
}

/** A numbered square: filled while current, ticked once done, outlined before. */
export function StepIcon({ active, completed, error, icon }: StepIconProps) {
  const tone = error ? 'error' : 'primary'
  return (
    <Box
      component='span'
      sx={{
        width: 32,
        height: 32,
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: 1,
        fontSize: 14,
        fontWeight: 600,
        border: 1,
        ...(error
          ? { bgcolor: 'error.tint', borderColor: 'error.border', color: 'error.ink' }
          : completed
            ? { bgcolor: `${tone}.tint`, borderColor: `${tone}.base`, color: `${tone}.ink` }
            : active
              ? { bgcolor: `${tone}.fill`, borderColor: `${tone}.fill`, color: `${tone}.ink` }
              : { borderColor: 'neutral.border', color: 'text.secondary', fontWeight: 400 }),
      }}
    >
      {completed && !error ? (
        <svg aria-hidden width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='square'>
          <path d='M5 12l5 5L20 7' />
        </svg>
      ) : (
        icon
      )}
    </Box>
  )
}
