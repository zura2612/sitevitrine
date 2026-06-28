// fichier src/router-context.ts
import { createContext } from 'react';
import type { Auth0ContextInterface } from '@auth0/auth0-react';

// On définit le type du contexte que l'on passera au router
export interface RouterContextType {
  auth: Auth0ContextInterface;
}

export const routerContext = createContext<RouterContextType | null>(null);