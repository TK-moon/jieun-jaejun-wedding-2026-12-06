# Project Agent Rules

## Scope

- Follow these rules for all code created or modified in this repository.
- Preserve existing user changes. Do not delete assets, configuration, or unrelated files unless explicitly asked.
- Keep changes focused on the requested feature or fix.

## App Composition

`src/App.tsx` composes the primary invitation UI inside `<main>` from `src/sections/*`:

- Current order: `BannerSection` → `GreetingSection` → `TicketSection` → `ContactSection`.
- New screens, layout, and visual design belong in `src/sections`.
- Shared UI (titles, toast, map links, icons) belongs in `src/components`.
- Wedding facts (names, phones, accounts, venue, ceremony) live in `src/constants` (`WEDDING_INFO`). Do not hardcode those values inside section components.

## Project Structure

- Put page sections for the primary design under `src/sections/<SectionName>/` with `index.tsx` and `index.module.css`.
- Nested section components under `src/sections/<SectionName>/<ComponentName>/` also keep styles beside their `index.tsx` as `index.module.css`. Do not share a parent section stylesheet across children.
- Put shared or reusable units under `src/components/<ComponentName>/`.
- Put shared icons under `src/components/icons/<IconName>/` with `<IconName>.tsx` and `<IconName>.module.css`.
- Keep the component implementation in `<ComponentName>.tsx` and its component-scoped style in `<ComponentName>.module.css`.
- Co-locate component-specific supporting code in underscored directories:
  - `_constants/index.ts` for static values, labels, and configuration.
  - `_types/index.ts` for shared TypeScript interfaces and types.
  - `_utils/index.ts` for pure helper functions.
- Extract constants, types, or utilities once they improve readability or are reused. Do not create empty directories or split trivial one-line values solely for the pattern.
- Import from the closest local module path; do not add barrel files at the global `components` level.

### Section shell pattern

- Section root: `section` + `aria-labelledby` wired to `SectionTitle` / heading `useId()`.
- Content column: a `.frame` (or equivalent) using `--layout-frame-width`.
- Nested blocks that have their own heading are also `section` with `h3` / `h4` and local `useId()`.

### `SectionTitle`

- Shared section header in `src/components/SectionTitle/SectionTitle.tsx`.
- `title` is required. `label` is optional — omit it when the section should show only the main heading (e.g. ContactSection).
- When `label` is present, render it above the title; when absent, do not reserve empty space for it.

## React and TypeScript

- Use named exports only. Do not add default exports.
- Declare every component with this pattern:

  ```tsx
  import type { FC } from 'react';

  interface Props {}

  const ComponentName: FC<Props> = () => {
    return <div />;
  };

  export { ComponentName };
  ```

- Use an `interface` for component props. For components with children, extend `PropsWithChildren`.
- Use arrow functions for components and exported helpers.
- Keep components focused on rendering and interaction. Move pure calculations and static data into `_utils` and `_constants` when appropriate.
- Prefer direct, named imports over default imports and broad barrel imports.
- Use native semantic HTML before `div` and ARIA roles. Choose `main`, `section`, `nav`, `header`, `footer`, `article`, `address`, `time`, `ol`/`ul`, and heading elements when they describe the content.
- Use `dl`, `dt`, and `dd` for term-and-description pairs such as labels and values, person + contact actions, stop names and routes, or specifications. Use `div` only for non-semantic layout grouping, including decorative elements marked `aria-hidden`.
- Do not add an ARIA role when the equivalent native HTML element provides the same meaning.
- Icon-only links and buttons need an `aria-label` that names the target and action (e.g. `재준에게 전화`).

## Wedding data

- Read people, phones, accounts, venue, and ceremony from `WEDDING_INFO` in `src/constants/index.ts`.
- Person phone shape:
  - Couple: `groom.phone` / `bride.phone`
  - Parents: `groom.parents.father|mother` and `bride.parents.father|mother` as `{ name, phone }`
- Build `tel:` / `sms:` hrefs by stripping non-digits in section `_utils`. Do not embed raw `tel:` strings in JSX.
- Placeholder phones may ship temporarily as `010-0000-0000`; replace before public launch. Do not invent alternate fake formats.

## Styling

- Use CSS Modules for all component and feature styles: `*.module.css`.
- Use `src/index.css` only for global foundations: root variables, browser resets, base elements, and global accessibility preferences.
- Do not use global element selectors or global class names in component styles unless targeting a child element owned by the component.
- Keep responsive and interaction styles next to the component they affect.
- Prefer existing CSS variables over new hardcoded colors.

### Layout

- Section content frames share one width and horizontal padding from `src/index.css`:
  - `--layout-frame-width` for the main content frame (e.g. Banner `.frame`, Ticket `.ticket_frame`, Contact `.frame`)
  - `--layout-inline-padding` for section horizontal padding
  - `--layout-section-padding-block` for non-full-viewport section vertical padding
- Do not hardcode a competing frame max-width in section CSS. Change the shared variables when the content column needs to grow or shrink.
- Keep section frames horizontally centered with the shared inline padding so stacked sections align.
- Two-column side-by-side blocks (couple / hosts) use CSS grid `1fr 1fr` with a center divider via `--color-line`. Avoid card chrome (heavy radius, multi-layer shadow, bordered panels) unless interaction requires a clear control surface.

### Typography and visual hierarchy

Fonts from `src/index.css`:

- `--display-font`: Cormorant Garamond / Noto Serif KR — emotional or personal emphasis (section titles, person names, greeting copy).
- `--body-font`: Pretendard stack — UI labels, supporting copy, role prefixes, actions.

Hierarchy conventions:

1. **Section title** (`SectionTitle` `h2`): display font, `--color-sky-deep`, largest clamp size.
2. **Optional section label** (`SectionTitle` `label`): body font, `--color-sky`, small, letter-spacing `0.06em`.
3. **In-section subheading** (`h3` / side titles like “신랑, 신부에게 연락하기”, “신랑측 혼주”): body font, `--color-sky`, label-scale size — must not compete with the section title.
4. **Role prefix** (신랑, 신부, 아버지, 어머니): body font, `--color-ink-muted`, smaller than the name.
5. **Person name**: display font, `--color-sky-deep`, medium weight (`500`) — names read as serif emphasis, not heavy sans UI text.
6. **Body / meta copy**: body font, `--color-ink` or `--color-ink-muted`.

Do not reverse role/name fonts (serif role + bold sans name). That hierarchy reads as UI chrome instead of invitation typography.

### Color usage

- Surfaces: `--color-canvas`, `--color-paper`, `--color-paper-raised`, `--color-sky-wash`
- Text: `--color-ink`, `--color-ink-muted`, `--color-ink-subtle`
- Accent / links / icons: `--color-sky`, hover/strong `--color-sky-deep`, soft focus `--color-sky-soft`
- Dividers: `--color-line`, `--color-line-soft`
- Keep the ivory × sky ticket direction. Do not introduce purple gradients, glow stacks, or unrelated accent systems.

### Icons and contact actions

- Shared stroke icons use `currentColor` and live under `src/components/icons/<IconName>/`.
- Contact phone/SMS icon links should keep a touch target around 44×44px; icon glyph about 20–22px.
- Default icon color `--color-sky`; hover/focus `--color-sky-deep`.

## Formatting and Linting

- Prettier is the source of truth for formatting. Respect `.prettierrc.json`:
  - semicolons enabled;
  - spaces inside object and import braces enabled;
  - single quotes enabled;
  - trailing commas enabled.
- Format changed files with `npm run format` before handing off work.
- Run `npm run lint` and `npm run build` after TypeScript or React changes.
- `@typescript-eslint/no-empty-object-type` is intentionally disabled; empty `Props` interfaces are allowed for the established component pattern.
