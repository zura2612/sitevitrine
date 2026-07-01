// fichier src/router-context.ts
import { createContext } from 'react';
//import type { Auth0ContextInterface } from '@auth0/auth0-react';

// On définit le type du contexte que l'on passera au router
/*export interface RouterContextType {
  auth: Auth0ContextInterface;
}*/
// ✅ Définition d'une interface générique pour l'état d'authentification
// Cela permet de ne pas être lié à une librairie spécifique comme Auth0
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    [key: string]: any; // Pour permettre d'autres propriétés spécifiques au provider
  };
}

// On définit le type du contexte que l'on passera au router
export interface RouterContextType {
  auth: AuthState;
}

export const routerContext = createContext<RouterContextType | null>(null);