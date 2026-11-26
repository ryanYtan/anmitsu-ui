# @anmitsu/ui

The shared look of the anmitsu.dev apps: an MUI theme taken from the **Angular UI Kit** design canvas (Ant Design's structure, square 2px corners, pastel fills, Inter at 14px, 32px controls), plus the page pieces every app had its own copy of. Each app
keeps its own accent colour; everything else is the same everywhere.

It is not on npm. Apps install it from this private GitHub repo, at a tag.

## Install

In an app's `web/`:

```sh
yarn add "@anmitsu/ui@git+ssh://git@github.com:ryanYtan/anmitsu-ui.git#v0.1.1"
```

Yarn clones the tag, installs this repo's dev dependencies and runs `prepack` (`yarn build`), so the app gets the built `dist/`. It needs the same peer dependencies the apps already have: React 19, MUI 9 (`@mui/material`, `@mui/icons-material`, Emotion).
The `dates` and `auth` entry points also need `@mui/x-date-pickers` + `dayjs` and `oidc-client-ts` + `react-oidc-context`.

To take a new version: tag it here (`git tag v0.2.0 && git push --tags`), then change the `#v…` in the app's `package.json` and run `yarn install`.

## Use

```tsx
// main.tsx
import '@anmitsu/ui/fonts' // Inter and JetBrains Mono, self-hosted
import { ACCENTS, AnmitsuProvider } from '@anmitsu/ui'

createRoot(root).render(
  <AnmitsuProvider accent={ACCENTS.teal}>
    <App />
  </AnmitsuProvider>
)
```

`AnmitsuProvider` sets up the theme and `CssBaseline`, and follows the device's light or dark setting unless `mode` is given. The other options are `secondary`, `radius` (2), `font` (to replace Inter) and `overrides` (any MUI `ThemeOptions`, merged on
top; pass a stable value). `createAnmitsuTheme(options)` gives the same theme without the provider.

### Accents

`ACCENTS` has eight that sit well together: `lavender` (the UI Kit's own), `blue`, `sky`, `teal`, `green`, `amber`, `coral`, `rose`. Any hex colour works. Every shade is worked out from the accent, and text shades are adjusted until they are readable (the
tests check every accent in both modes).

Every palette colour (`primary`, `secondary`, `success`, `error`, `warning`, `info`) carries the UI Kit's shades, usable in `sx` like `bgcolor: 'primary.fill'`:

| Shade                             | Used for                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `base`                            | The colour itself: checkbox and switch fills, focused borders, progress bars |
| `fill`, `fillHover`, `fillActive` | Pastel fill of a contained button, the current step, the app icon            |
| `border`                          | Border of a filled button, tag or alert                                      |
| `tint`                            | Faint background: tags, alerts, selected rows, hovered list rows             |
| `ink`                             | Text in that colour, readable on white and on every fill                     |
| `ring`                            | Focus glow around a field                                                    |

`main` is `base` for primary and secondary, and `ink` for the status colours, because MUI writes error text and the like in `main`.

`palette.neutral` holds the greys, which lean slightly towards the accent: `text`, `secondary`, `disabled`, `border` (controls), `split` (card edges, rows), `fill` (hover), `subtle` (table heads), `surface`, `page`, `track`. `theme.anmitsu` has `radius`,
`monoFont` and the `shadows.card` / `shadows.overlay` strings.

### What the theme changes in MUI

- **Type:** Inter; 14px body with 22px lines; `h1` 38, `h2` 30, `h3` 24, `h4` 20, `h5` 18, `h6` 16 (all 600); `body2` 13; `caption` 12; `overline` is JetBrains Mono in capitals.
- **Buttons:** `contained` is the pastel fill with ink text (the UI Kit's "Primary"); `outlined` in `primary` is the plain "Default" button; `text` is ink. `color='error'` gives the danger versions. Heights are 24/32/40 for small/medium/large. There are
  no ripples; keyboard focus shows a ring instead.
- **Fields:** `TextField` defaults to `size='small'` and `fullWidth`, 32px high (40px with `size='medium'`), date pickers too. The label sits above the field, 6px clear, in medium weight (the UI Kit's form layout), never in its border; placeholders always show. `FormLabel` looks the same, for a label over a group of controls. `Autocomplete` is `fullWidth` too.
- **Checkbox, Radio, Switch, Slider:** the UI Kit's square 16px boxes, the 44×22 square switch and the diamond slider thumb.
- **Surfaces:** `Paper` and `Card` are outlined (1px `split` border). Dialogs, menus and popovers float on the overlay shadow. `AppBar` defaults to flat with a bottom border.
- **Chip** is a 22px square tag, tinted in its colour. **Alert** is tinted with a border. **Tooltip** is dark. **Tabs** have the Ant underline, with 32px between tabs. **ToggleButtonGroup** is the UI Kit's segmented control: borderless buttons on a faint track, the chosen one raised in white; 32px in all (28px `small`, 40px `large`).
- **Table:** a tinted head and 12px×16px cells (8px with `size='small'`). **Pagination**, **Stepper** (square numbered steps), **Breadcrumbs**, **Menu** and **ListItemButton** follow the UI Kit too.

## Components

From `@anmitsu/ui`:

| Component         | What                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppHeader`       | The sticky bar: the app icon in a square of its accent, its name, optional `nav` links (`NavLink`), and `actions` at the end. Pass `linkComponent={Link}` (react-router) so the name links with `to`. |
| `Page`            | The page's width (`lg`) and padding under the header, its children 24px apart.                                                                                                                        |
| `PageHeader`      | The `h1` (24px), with optional `eyebrow`, `start` (back button), `action`, and a line of explanation as children.                                                                                     |
| `Section`         | An `h2` (16px) with an optional action and description, 8px above its content.                                                                                                                        |
| `Panel`           | An outlined `Paper` with the standard padding; `flush` for a list of `Rows` inside.                                                                                                                   |
| `Rows`, `ListRow` | A list with lines between rows; a non-button row padded like `ListItemButton`.                                                                                                                        |
| `AddButton`       | "+ Add" for a Section's action, lined up with the panel's edge.                                                                                                                                       |
| `Stat`, `Stats`   | A total with a label (and note) in a row of equal panels, two to a line on phones.                                                                                                                    |
| `Delta`           | ▲/▼ with a value, green or red by whether up is `good`.                                                                                                                                               |
| `Dot`             | A small square of colour before a label.                                                                                                                                                              |
| `Empty`           | "Nothing here yet" inside a panel.                                                                                                                                                                    |
| `Loading`         | A centred spinner.                                                                                                                                                                                    |
| `SignInCard`      | What a signed-out visitor sees: icon, name, a line about the app, error and Sign in button.                                                                                                           |
| `FormDialog`      | A dialog around a form: Save runs `onSubmit` and closes, or shows the error; Delete asks again; full screen on phones, fitted to what the keyboard leaves visible (`useVisibleArea`) so its buttons stay in view.                                                                                |
| `FieldRow`        | Two fields side by side, stacked on phones unless `inline`.                                                                                                                                           |
| `HeroButton`      | The UI Kit's chamfered call to action; at most one per screen.                                                                                                                                        |

From `@anmitsu/ui/dates`: `DatesProvider` (DD/MM/YYYY, weeks from Monday, and the field styles for MUI X's pickers), `DateField` and `DateRange`, which take and give `'YYYY-MM-DD'` strings.

From `@anmitsu/ui/auth`: `useRenewal(userManager)`, which keeps the shared Cognito sign-in renewed (see its comment). It is the `renew.ts` four apps had.

## Developing

```sh
corepack yarn          # install
yarn dev               # the demo page (demo/), every component in every accent, light and dark
yarn test              # Vitest: colour maths and contrast in every accent and mode
yarn lint && yarn typecheck
yarn build             # dist/, what apps get
```

The demo reads `?mode=dark`, `?accent=teal` and `?dialog=1` from its URL, which helps for screenshots.

MUI 9 dropped many older class keys (`inputSizeSmall`, `iconSizeMedium`, `labelSmall` and so on), so the theme styles sizes and states through selectors on the classes that remain, such as `.MuiInputBase-sizeSmall > &`. Check a component's `*Classes.js`
in `node_modules/@mui/material` before adding a key.
