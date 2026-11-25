import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography, type ButtonProps } from '@mui/material'

/** A spinner in the middle of the page, while it loads. */
export function Loading({ label }: { label?: string }) {
  return (
    <Stack spacing={1.5} role='status' aria-label={label ?? 'Loading'} sx={{ alignItems: 'center', py: 8 }}>
      <CircularProgress size={28} thickness={4} />
      {label && (
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
      )}
    </Stack>
  )
}

/** "Nothing here yet", centred inside a panel or list. */
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Typography color='text.secondary' sx={{ py: 3, px: 2, textAlign: 'center' }}>
      {children}
    </Typography>
  )
}

/** A number with a label above it, for the row of totals at the top of a page. */
export function Stat({ label, children, note }: { label: React.ReactNode; children: React.ReactNode; note?: React.ReactNode }) {
  return (
    // Equal shares of the row whatever the values' widths.
    <Paper sx={{ flex: '1 1 0', minWidth: { xs: 'calc(50% - 6px)', sm: 0 }, p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography component='div' sx={{ fontSize: 24, lineHeight: '32px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
      {note && (
        <Typography variant='caption' color='text.secondary' component='div'>
          {note}
        </Typography>
      )}
    </Paper>
  )
}

/** A row of Stats, two to a line on phones. */
export function Stats({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction='row' spacing={1.5} useFlexGap sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
      {children}
    </Stack>
  )
}

/**
 * A change with a small triangle: up or down by its sign. `good` says which way is good news (costs going up are
 * bad), and colours it; `children` is the formatted value, such as "12%".
 */
export function Delta({ value, good = 'up', children }: { value: number; good?: 'up' | 'down' | 'neither'; children: React.ReactNode }) {
  const up = value > 0
  const flat = value === 0
  const tone = flat || good === 'neither' ? 'text.secondary' : up === (good === 'up') ? 'success.main' : 'error.main'
  return (
    <Typography component='span' sx={{ color: tone, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5, fontVariantNumeric: 'tabular-nums', fontSize: 'inherit', lineHeight: 'inherit' }}>
      {!flat && (
        <svg aria-hidden width='10' height='10' viewBox='0 0 10 10' fill='currentColor'>
          <path d={up ? 'M5 1l4 6H1z' : 'M5 9L1 3h8z'} />
        </svg>
      )}
      {children}
    </Typography>
  )
}

/** A small square of colour before a label: a status, a category, an app. */
export function Dot({ colour, size = 8 }: { colour?: string; size?: number }) {
  return <Box component='span' aria-hidden sx={{ display: 'inline-block', width: size, height: size, flexShrink: 0, bgcolor: colour ?? 'text.disabled' }} />
}

/** The card a signed-out visitor sees: the app's name, a line about it, and the sign-in button. */
export function SignInCard({ icon, name, children, error, onSignIn, buttonProps }: { icon?: React.ReactNode; name: React.ReactNode; children?: React.ReactNode; error?: React.ReactNode; onSignIn: () => void; buttonProps?: ButtonProps }) {
  return (
    <Paper sx={{ p: { xs: 3, sm: 5 }, mt: { xs: 4, sm: 10 }, textAlign: 'center', maxWidth: 440, mx: 'auto' }}>
      {icon && <Box sx={{ width: 48, height: 48, mx: 'auto', mb: 2, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: 'primary.fill', color: 'primary.ink', '& .MuiSvgIcon-root': { fontSize: 28 } }}>{icon}</Box>}
      <Typography variant='h4' component='h1' gutterBottom>
        {name}
      </Typography>
      {children && (
        <Typography color='text.secondary' sx={{ mb: 3 }}>
          {children}
        </Typography>
      )}
      {error && (
        <Alert severity='error' sx={{ mb: 2, textAlign: 'left' }}>
          {error}
        </Alert>
      )}
      <Button variant='contained' size='large' onClick={onSignIn} {...buttonProps}>
        {buttonProps?.children ?? 'Sign in'}
      </Button>
    </Paper>
  )
}

/** The UI Kit's chamfered call to action. At most one per screen, for its single most important action. */
export function HeroButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant='contained'
      size='large'
      {...props}
      sx={[
        {
          px: 3,
          fontWeight: 600,
          border: 0,
          borderRadius: 0,
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          '&:hover, &:active': { border: 0 },
          '&.Mui-focusVisible': { clipPath: 'none' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  )
}
