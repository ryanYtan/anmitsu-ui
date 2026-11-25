import { useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, useMediaQuery, useTheme, type Breakpoint } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useVisibleArea } from './viewport'

export type FormDialogProps = {
  title: React.ReactNode
  onClose: () => void
  onSubmit: () => Promise<void>
  onDelete?: () => Promise<void>
  deleteLabel?: string
  submitLabel?: string
  busyLabel?: string
  /** Keeps Save disabled. */
  blocked?: boolean
  /** Shown while the delete button asks "Really delete?", such as a choice about what goes with it. */
  deleteExtra?: React.ReactNode
  /** Turns a thrown error into the message shown; its `message` by default. */
  errorMessage?: (error: unknown) => string
  maxWidth?: Breakpoint
  children: React.ReactNode
}

const defaultMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))

/**
 * A dialog around a form: Save runs `onSubmit` and closes when it succeeds, or shows its error; Delete asks once
 * more before running `onDelete`. It fills the screen on phones.
 */
export function FormDialog({ title, onClose, onSubmit, onDelete, deleteLabel = 'Delete', submitLabel = 'Save', busyLabel = 'Saving…', blocked, deleteExtra, errorMessage = defaultMessage, maxWidth = 'sm', children }: FormDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const visible = useVisibleArea()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [confirming, setConfirming] = useState(false)

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(undefined)
    try {
      await action()
      onClose()
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }

  return (
    <Dialog
      open
      onClose={busy ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      // On phones it fills only what the keyboard and toolbars leave visible, so Save and Cancel stay in view above them.
      sx={fullScreen && visible ? { top: `${visible.top}px`, bottom: 'auto', height: `${visible.height}px` } : undefined}
    >
      <Box
        component='form'
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          void run(onSubmit)
        }}
        sx={{ display: 'contents' }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component='span' sx={{ flexGrow: 1, minWidth: 0 }}>
            {title}
          </Box>
          <IconButton size='small' aria-label='Close' onClick={onClose} disabled={busy} sx={{ mr: -0.5 }}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {children}
            {confirming && deleteExtra}
            {error && <Alert severity='error'>{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          {onDelete && (
            <Button color='error' variant={confirming ? 'contained' : 'text'} disabled={busy} onClick={() => (confirming ? void run(onDelete) : setConfirming(true))} sx={{ mr: 'auto' }}>
              {confirming ? 'Really delete?' : deleteLabel}
            </Button>
          )}
          <Button variant='outlined' onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' disabled={busy || blocked}>
            {busy ? busyLabel : submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

/** Two fields side by side, stacked on phones unless `inline` (for pairs that fit, like an amount and its currency). */
export function FieldRow({ inline, children }: { inline?: boolean; children: React.ReactNode }) {
  return (
    <Stack direction={inline ? 'row' : { xs: 'column', sm: 'row' }} spacing={inline ? 1.5 : 2}>
      {children}
    </Stack>
  )
}
