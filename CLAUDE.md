# CLAUDE.md

`@anmitsu/ui`: the shared MUI theme and page components for the anmitsu.dev apps (`ln-reader`, `event-tracker`, `debt-tracker`, `money-manager`, `cost-dashboard`). The README explains what it gives and how apps use it; `../CLAUDE.md` has the rules shared
by all the repos.

- The look comes from the user's "Angular UI Kit" design canvas (a claude.ai Design artifact, `XBakGa87Zg3FySM4w82GjJ`): Ant Design's structure, square 2px corners, pastel fills, Inter 14/22, 32px controls. Each app passes its own accent; all shades come
  from it (`src/theme/palette.ts`).
- Private GitHub repo `ryanYtan/anmitsu-ui`, not on npm. Apps depend on a tag (`git+ssh://git@github.com:ryanYtan/anmitsu-ui.git#vX.Y.Z`); Yarn builds `dist/` through `prepack`. A change reaches an app only after a new tag and a bump of that app's `#v…`.
  Bump `version` in `package.json` with the tag.
- Yarn 4 via Corepack, `node-modules` linker; Prettier config at the repo root (no semicolons, single quotes, `printWidth: 255`).
- Commands: `yarn dev` (the demo page in `demo/`, which imports `src/` directly), `yarn test`, `yarn lint`, `yarn typecheck`, `yarn build`. Check a change in the demo, light and dark, at 1280px and 390px wide (`?mode=dark&accent=teal`).
- `src/theme/theme.test.ts` checks text contrast for every accent in both modes. Keep it passing when changing a shade.
- MUI 9 has no per-size or per-adornment classes on inputs and no `iconSize*` / `labelSmall` keys; style through the classes in each component's `*Classes.js`. MUI X's date pickers draw their own field (`MuiPickersOutlinedInput`), styled in `src/dates`
  rather than the main theme so the theme doesn't need `@mui/x-date-pickers`.
- `sideEffects` in `package.json` must list `src/fonts.ts` and `dist/fonts.js`, or the bundler drops the font CSS.
- MUI 9's `Typography` `color` prop takes only palette names (`textSecondary`, `success`, `error`…); a path such as `'text.secondary'` or `'warning.main'` is silently ignored and the text keeps the main colour. Use the name, or put the path in `sx`.
