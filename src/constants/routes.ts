import type { To } from 'react-router';

const ROUTES = {
  invitation: '/',
  gallery: '/gallery',
} as const satisfies Record<string, To>;

export { ROUTES };
