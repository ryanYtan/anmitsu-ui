import { AppBar, Box, Button, Container, Paper, Stack, Toolbar, Typography, type Breakpoint, type PaperProps, type StackProps, type SxProps, type Theme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// The page rhythm, kept in one place so every app lines up:
// an AppHeader across the top; a Page of a PageHeader and Sections 24px apart; a Section is a heading 8px above a
// Panel; lists inside a panel are Rows with a line between them, 12px by 16px each.

const merge = (base: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> => [base, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>

type AppHeaderProps = {
  /** The app's icon, drawn in a square of its accent. */
  icon: React.ReactNode
  /** The app's name, beside the icon. */
  name: React.ReactNode
  /** Where the icon and name lead. */
  homeTo?: string
  /** A router link component (react-router's Link), given `to`; a plain link with `href` when left out. */
  linkComponent?: React.ElementType
  /** Between the name and the actions, such as links to the app's pages; hidden on phones unless `navOnPhones`. */
  nav?: React.ReactNode
  navOnPhones?: boolean
  /** At the end: icon buttons, the account menu. */
  actions?: React.ReactNode
  /** Matches the Page below it, so the edges line up. */
  maxWidth?: Breakpoint | false
}

/** The bar across the top of every app: icon and name, optional page links, actions at the end. */
export function AppHeader({ icon, name, homeTo = '/', linkComponent, nav, navOnPhones, actions, maxWidth = 'lg' }: AppHeaderProps) {
  const link = linkComponent ? { component: linkComponent, to: homeTo } : { component: 'a', href: homeTo }
  return (
    <AppBar position='sticky'>
      <Container maxWidth={maxWidth} disableGutters>
        <Toolbar sx={{ gap: 1, px: { xs: 2, sm: 3 } }}>
          <Stack
            {...link}
            direction='row'
            spacing={1.25}
            sx={{ alignItems: 'center', color: 'text.primary', textDecoration: 'none', mr: { xs: 'auto', sm: 3 }, flexShrink: 0, borderRadius: 1, '&:focus-visible': { outline: 2, outlineColor: 'primary.border', outlineOffset: 2 } }}
          >
            <Box sx={{ width: 28, height: 28, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: 'primary.fill', color: 'primary.ink', '& .MuiSvgIcon-root': { fontSize: 18 } }}>{icon}</Box>
            <Typography component='span' sx={{ fontSize: 16, lineHeight: '24px', fontWeight: 600, letterSpacing: '-0.01em' }}>
              {name}
            </Typography>
          </Stack>
          {nav && (
            <Stack component='nav' direction='row' spacing={0.5} sx={{ display: navOnPhones ? 'flex' : { xs: 'none', sm: 'flex' }, alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
              {nav}
            </Stack>
          )}
          {!nav && <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />}
          {actions && (
            <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
              {actions}
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

/** A link in the AppHeader's `nav`, highlighted while its page is open. Pass `component` and `to` for a router link. */
export function NavLink({ active, sx, ...props }: { active?: boolean; children: React.ReactNode; sx?: SxProps<Theme> } & Record<string, unknown>) {
  return (
    <Button
      color='inherit'
      aria-current={active ? 'page' : undefined}
      {...props}
      sx={merge({ color: active ? 'primary.ink' : 'text.secondary', fontWeight: active ? 600 : 500, bgcolor: active ? 'primary.tint' : undefined, '&:hover': { color: 'primary.ink', bgcolor: active ? 'primary.tint' : 'neutral.fill' } }, sx)}
    />
  )
}

/** The page's width and padding, under the AppHeader, with its parts 24px apart. */
export function Page({ maxWidth = 'lg', children, sx }: { maxWidth?: Breakpoint | false; children: React.ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Container maxWidth={maxWidth} sx={merge({ pt: { xs: 2.5, sm: 4 }, pb: 6, px: { xs: 2, sm: 3 } }, sx)}>
      <Stack spacing={3}>{children}</Stack>
    </Container>
  )
}

/** The page title, with an optional back button before it, actions at the end and a line of explanation below. */
export function PageHeader({ title, eyebrow, start, action, children }: { title: React.ReactNode; eyebrow?: React.ReactNode; start?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Box>
      {eyebrow && (
        <Typography variant='overline' component='div' color='text.secondary'>
          {eyebrow}
        </Typography>
      )}
      <Stack direction='row' spacing={1} useFlexGap sx={{ alignItems: 'center', minHeight: 40 }}>
        {start}
        <Typography variant='h3' component='h1' sx={{ flexGrow: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children && (
        <Typography color='text.secondary' sx={{ mt: 0.5, maxWidth: 720 }}>
          {children}
        </Typography>
      )}
    </Box>
  )
}

/** A heading with an optional action at its end and an optional line of explanation, above its panel. */
export function Section({ title, action, description, children }: { title: React.ReactNode; action?: React.ReactNode; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box component='section' sx={{ minWidth: 0 }}>
      <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 32, mb: description ? 0 : 1 }}>
        <Typography variant='h6' component='h2'>
          {title}
        </Typography>
        {action}
      </Stack>
      {description && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  )
}

/** A bordered panel with the standard padding, for forms and text; lists go in a `<Panel flush>` with Rows. */
export function Panel({ flush, sx, ...props }: PaperProps & { flush?: boolean }) {
  return <Paper {...props} sx={merge(flush ? { overflow: 'hidden' } : { p: { xs: 2, sm: 2.5 } }, sx)} />
}

/** One row of a list that is not a button: the same padding ListItemButton gets from the theme, content in a line. */
export function ListRow({ sx, ...props }: StackProps) {
  // useFlexGap: a child hidden on phones then leaves no gap behind.
  return <Stack direction='row' spacing={1.5} useFlexGap {...props} sx={merge({ px: 2, py: 1.5, alignItems: 'center' }, sx)} />
}

/** Rows of a list, with a line between each. */
export function Rows({ children }: { children: React.ReactNode }) {
  // :not(:first-child) rather than `* + *`, to outweigh the `border: 0` that buttons reset to.
  return <Box sx={{ '& > :not(:first-child)': { borderTop: 1, borderColor: 'divider' } }}>{children}</Box>
}

/** "+ Add" at the end of a Section's heading, lined up with the panel's edge below it. */
export function AddButton({ onClick, children = 'Add' }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <Button size='small' startIcon={<AddIcon />} onClick={onClick} sx={{ mr: '-7px' }}>
      {children}
    </Button>
  )
}
