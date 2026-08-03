# Project Agent Rules

## Scope

- Follow these rules for all code created or modified in this repository.
- Preserve existing user changes. Do not delete assets, configuration, or unrelated files unless explicitly asked.
- Keep changes focused on the requested feature or fix.

## Project Structure

- Put each React component in its own directory under `src/components/<ComponentName>/`.
- Keep the component implementation in `<ComponentName>.tsx` and its component-scoped style in `<ComponentName>.module.css`.
- Co-locate component-specific supporting code in underscored directories:
  - `_constants/index.ts` for static values, labels, and configuration.
  - `_types/index.ts` for shared TypeScript interfaces and types.
  - `_utils/index.ts` for pure helper functions.
- Extract constants, types, or utilities once they improve readability or are reused. Do not create empty directories or split trivial one-line values solely for the pattern.
- Import from the closest local module path; do not add barrel files at the global `components` level.

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
- Use `dl`, `dt`, and `dd` for term-and-description pairs such as labels and values, stop names and routes, or specifications. Use `div` only for non-semantic layout grouping, including decorative elements marked `aria-hidden`.
- Do not add an ARIA role when the equivalent native HTML element provides the same meaning.

## Styling

- Use CSS Modules for all component and feature styles: `*.module.css`.
- Use `src/index.css` only for global foundations: root variables, browser resets, base elements, and global accessibility preferences.
- Do not use global element selectors or global class names in component styles unless targeting a child element owned by the component.
- Keep responsive and interaction styles next to the component they affect.

## Formatting and Linting

- Prettier is the source of truth for formatting. Respect `.prettierrc.json`:
  - semicolons enabled;
  - spaces inside object and import braces enabled;
  - single quotes enabled;
  - trailing commas enabled.
- Format changed files with `npm run format` before handing off work.
- Run `npm run lint` and `npm run build` after TypeScript or React changes.
- `@typescript-eslint/no-empty-object-type` is intentionally disabled; empty `Props` interfaces are allowed for the established component pattern.
