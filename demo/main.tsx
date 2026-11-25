import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined'
import PaletteOutlined from '@mui/icons-material/PaletteOutlined'
import SearchIcon from '@mui/icons-material/Search'
import WidgetsOutlined from '@mui/icons-material/WidgetsOutlined'
import '../src/fonts'
import { ACCENTS, AddButton, AnmitsuProvider, AppHeader, Delta, Dot, Empty, FieldRow, FormDialog, HeroButton, ListRow, NavLink, Page, PageHeader, Panel, Rows, Section, Stat, Stats, type Mode } from '../src'
import { DateField, DatesProvider } from '../src/dates'

const params = new URLSearchParams(location.search)

function Demo({ mode, setMode, accent, setAccent }: { mode: Mode; setMode: (m: Mode) => void; accent: string; setAccent: (a: string) => void }) {
  const [tab, setTab] = useState(0)
  const [view, setView] = useState('list')
  const [dialog, setDialog] = useState(params.get('dialog') === '1')
  const [date, setDate] = useState('2026-11-25')
  return (
    <>
      <AppHeader
        icon={<WidgetsOutlined />}
        name='anmitsu UI'
        homeTo='?'
        nav={
          <>
            <NavLink active>Components</NavLink>
            <NavLink>Layout</NavLink>
          </>
        }
        actions={
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton aria-label='Toggle dark mode' onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
              {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
          </Tooltip>
        }
      />
      <Page>
        <PageHeader
          eyebrow='00 / Foundations'
          title='anmitsu UI'
          action={
            <Button variant='contained' startIcon={<AddIcon />}>
              New page
            </Button>
          }
        >
          The UI Kit's look as an MUI theme: 14px type, 32px controls, square 2px corners and pastel fills, in each app's own accent.
        </PageHeader>

        <Section title='Accent' description='Each app picks one; every shade below is worked out from it.'>
          <Panel>
            <ToggleButtonGroup exclusive size='small' value={accent} onChange={(_, a) => a && setAccent(a)} sx={{ flexWrap: 'wrap' }}>
              {Object.entries(ACCENTS).map(([name, hex]) => (
                <ToggleButton key={name} value={hex} sx={{ gap: 1 }}>
                  <Dot colour={hex} />
                  {name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Swatches />
          </Panel>
        </Section>

        <Stats>
          <Stat
            label='This month'
            note={
              <Delta value={0.12} good='down'>
                12% on last month
              </Delta>
            }
          >
            S$84.20
          </Stat>
          <Stat label='Active users' note={<Delta value={0.034}>3.4%</Delta>}>
            1,234
          </Stat>
          <Stat label='Forecast'>S$97.00</Stat>
          <Stat label='Untagged' note='Shared costs'>
            S$3.10
          </Stat>
        </Stats>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Section title='Buttons'>
            <Panel sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <Button variant='contained'>Primary</Button>
                <Button variant='outlined'>Default</Button>
                <Button>Text</Button>
                <Button variant='contained' color='error'>
                  Delete
                </Button>
                <Button variant='outlined' color='error'>
                  Remove
                </Button>
                <Button variant='contained' disabled>
                  Disabled
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <Button variant='contained' size='large'>
                  Large
                </Button>
                <Button variant='contained'>Middle</Button>
                <Button variant='contained' size='small'>
                  Small
                </Button>
                <Button variant='outlined' startIcon={<DownloadOutlined />}>
                  Export
                </Button>
                <IconButton aria-label='More actions'>
                  <MoreHorizIcon />
                </IconButton>
                <IconButton color='primary' aria-label='Search'>
                  <SearchIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <ToggleButtonGroup exclusive value={view} onChange={(_, v) => v && setView(v)}>
                  <ToggleButton value='list'>List</ToggleButton>
                  <ToggleButton value='board'>Board</ToggleButton>
                  <ToggleButton value='calendar'>Calendar</ToggleButton>
                </ToggleButtonGroup>
                <HeroButton>Start free trial</HeroButton>
              </Box>
            </Panel>
          </Section>

          <Section title='Data entry'>
            <Panel sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FieldRow>
                <TextField label='Name' placeholder='Enter a name' />
                <TextField label='Email' defaultValue='ryan@acme' error helperText='Enter a valid email address' />
              </FieldRow>
              <FieldRow>
                <TextField
                  placeholder='Search orders'
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon fontSize='small' />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField select label='Country' defaultValue='SG'>
                  <MenuItem value='JP'>Japan</MenuItem>
                  <MenuItem value='MY'>Malaysia</MenuItem>
                  <MenuItem value='SG'>Singapore</MenuItem>
                </TextField>
              </FieldRow>
              <FieldRow>
                <Autocomplete options={['Japan', 'Malaysia', 'Singapore', 'Vietnam']} defaultValue='Japan' renderInput={p => <TextField {...p} label='Autocomplete' />} />
                <DateField label='Date' value={date} onChange={d => d !== undefined && setDate(d)} />
              </FieldRow>
              <TextField label='Notes' multiline minRows={2} placeholder='Add context for the reviewer' />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label='Email' />
                <FormControlLabel control={<Checkbox />} label='SMS' />
                <FormControlLabel control={<Checkbox indeterminate />} label='Some' />
                <FormControlLabel control={<Checkbox disabled />} label='Archive' />
              </Box>
              <RadioGroup row defaultValue='monthly'>
                <FormControlLabel value='monthly' control={<Radio />} label='Monthly' />
                <FormControlLabel value='yearly' control={<Radio />} label='Yearly' />
              </RadioGroup>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <FormControlLabel control={<Switch defaultChecked />} label='Push notifications' />
                <FormControlLabel control={<Switch size='small' />} label='Beta' />
                <Slider defaultValue={60} aria-label='Volume' sx={{ flex: 1, minWidth: 160 }} />
              </Box>
            </Panel>
          </Section>
        </Box>

        <Section title='Orders' action={<AddButton onClick={() => setDialog(true)}>New order</AddButton>}>
          <Tabs value={tab} onChange={(_, t) => setTab(t)} sx={{ mb: 2 }}>
            <Tab label='All' />
            <Tab label='Processing' />
            <Tab label='Shipped' />
          </Tabs>
          <Paper sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['#1042', 'Acme Logistics', 'Shipped', 'success', 'S$1,280.00'],
                  ['#1041', 'Kopi Co', 'Processing', 'primary', 'S$96.50'],
                  ['#1040', 'Lumen Labs', 'On hold', 'warning', 'S$410.00'],
                  ['#1039', 'Northwind', 'Failed', 'error', 'S$58.00'],
                ].map(([id, who, status, colour, amount]) => (
                  <TableRow key={id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{id}</TableCell>
                    <TableCell>{who}</TableCell>
                    <TableCell>
                      <Chip label={status} color={colour as 'success'} />
                    </TableCell>
                    <TableCell align='right' sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Pagination count={10} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }} />
        </Section>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          <Section title='Lists'>
            <Panel flush>
              <Rows>
                <ListItemButton>
                  <ListItemText primary='Tokyo, March' secondary='5 expenses' />
                </ListItemButton>
                <ListItemButton selected>
                  <ListItemText primary='Osaka, May' secondary='12 expenses' />
                </ListItemButton>
                <ListRow>
                  <Dot colour={ACCENTS.teal} />
                  <Typography sx={{ flexGrow: 1 }}>Groceries</Typography>
                  <Typography sx={{ fontWeight: 600 }}>S$42.10</Typography>
                </ListRow>
              </Rows>
            </Panel>
            <Panel flush sx={{ mt: 2 }}>
              <Empty>No trips yet.</Empty>
            </Panel>
          </Section>

          <Section title='Tags and badges'>
            <Panel sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label='Default' />
                <Chip label='Processing' color='primary' />
                <Chip label='Success' color='success' />
                <Chip label='Warning' color='warning' />
                <Chip label='Error' color='error' />
                <Chip label='react' onDelete={() => {}} />
                <Chip label='Outlined' variant='outlined' color='primary' />
              </Box>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Badge badgeContent={5} color='error'>
                  <Box sx={{ width: 40, height: 40, bgcolor: 'neutral.fill', borderRadius: 1, display: 'grid', placeItems: 'center' }}>
                    <NotificationsOutlined fontSize='small' />
                  </Box>
                </Badge>
                <AvatarGroup max={4}>
                  <Avatar>RT</Avatar>
                  <Avatar sx={{ bgcolor: 'success.fill', color: 'success.ink' }}>JL</Avatar>
                  <Avatar sx={{ bgcolor: 'warning.fill', color: 'warning.ink' }}>KM</Avatar>
                  <Avatar>AB</Avatar>
                  <Avatar>CD</Avatar>
                </AvatarGroup>
              </Box>
              <LinearProgress variant='determinate' value={45} />
              <LinearProgress variant='determinate' value={100} color='success' />
            </Panel>
          </Section>

          <Section title='Card'>
            <Card>
              <CardHeader
                title='Deployment'
                action={
                  <Link href='#' sx={{ px: 1 }}>
                    More
                  </Link>
                }
              />
              <CardContent>
                <Typography color='text.secondary'>api-gateway · production</Typography>
                <LinearProgress variant='determinate' value={72} sx={{ mt: 1.5, height: 6 }} />
              </CardContent>
              <CardActions>
                <Button>Promote</Button>
                <Button color='inherit'>Pause</Button>
              </CardActions>
            </Card>
          </Section>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Section title='Feedback'>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Alert severity='info'>A new version of the dashboard is available.</Alert>
              <Alert severity='success'>Settings saved.</Alert>
              <Alert severity='warning'>Your trial ends in 3 days.</Alert>
              <Alert severity='error' onClose={() => {}}>
                <AlertTitle>Payment failed</AlertTitle>
                The card on file was declined. Update your billing details to keep the workspace active.
              </Alert>
            </Box>
          </Section>
          <Section title='Navigation'>
            <Panel sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stepper activeStep={1}>
                <Step>
                  <StepLabel>Account</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Workspace</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Invite</StepLabel>
                </Step>
              </Stepper>
              <Breadcrumbs>
                <Link href='#' color='inherit'>
                  Home
                </Link>
                <Link href='#' color='inherit'>
                  Projects
                </Link>
                <Typography color='text.primary'>api-gateway</Typography>
              </Breadcrumbs>
              <Paper elevation={8} variant='elevation' sx={{ width: 220 }}>
                <MenuList>
                  <MenuItem>Rename</MenuItem>
                  <MenuItem selected>Duplicate</MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <PaletteOutlined fontSize='small' />
                    </ListItemIcon>
                    Change colour
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ color: 'error.main' }}>Delete</MenuItem>
                </MenuList>
              </Paper>
            </Panel>
          </Section>
        </Box>

        <Section title='Typography'>
          <Panel sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'body1', 'body2', 'caption', 'overline'] as const).map(v => (
              <Box key={v} sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
                <Typography variant='overline' color='text.secondary' sx={{ width: 88, flexShrink: 0 }}>
                  {v}
                </Typography>
                <Typography variant={v}>The quick brown fox</Typography>
              </Box>
            ))}
          </Panel>
        </Section>

        <PageHeader
          start={
            <IconButton aria-label='Back'>
              <ArrowBackIcon />
            </IconButton>
          }
          title='A page header with a back button'
        />
      </Page>

      {dialog && (
        <FormDialog title='New order' onClose={() => setDialog(false)} onSubmit={() => new Promise((_, reject) => setTimeout(() => reject(new Error('The server said no.')), 600))} onDelete={async () => {}}>
          <TextField label='Customer' required />
          <FieldRow inline>
            <TextField label='Amount' />
            <TextField select label='Currency' defaultValue='SGD' sx={{ width: 120, flexShrink: 0 }}>
              <MenuItem value='SGD'>SGD</MenuItem>
              <MenuItem value='JPY'>JPY</MenuItem>
            </TextField>
          </FieldRow>
        </FormDialog>
      )}
    </>
  )
}

function Swatches() {
  const { palette } = useTheme()
  const rows = (['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const).map(c => [c, palette[c]] as const)
  return (
    <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {rows.map(([name, s]) => (
        <Box key={name} sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          {[s.base, s.border, s.fill, s.tint].map(c => (
            <Box key={c} sx={{ flex: 1, height: 48, bgcolor: c }} />
          ))}
          <Box sx={{ flex: 1.6, px: 1.5, bgcolor: s.fill, color: s.ink, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{name}</Typography>
            <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
              {s.base}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function App() {
  const [mode, setMode] = useState<Mode>((params.get('mode') as Mode) ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [accent, setAccent] = useState<string>(ACCENTS[params.get('accent') as keyof typeof ACCENTS] ?? ACCENTS.lavender)
  return (
    <AnmitsuProvider mode={mode} accent={accent}>
      <DatesProvider>
        <Demo mode={mode} setMode={setMode} accent={accent} setAccent={setAccent} />
      </DatesProvider>
    </AnmitsuProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
