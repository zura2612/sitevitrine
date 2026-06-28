// fichier src/components/Auth0Wrapper.tsx
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../auth/auth0-config';
import type { ReactNode } from "react";

export function Auth0Wrapper({ children }: { children: ReactNode }) {
  //const [isMounted, setIsMounted] = useState(false);

  // ✅ Côté serveur : rend les enfants sans Auth0Provider
  // ✅ Côté client : rend les enfants AVEC Auth0Provider
  return typeof window !== 'undefined' ? (
    <Auth0Provider {...auth0Config}>{children}</Auth0Provider>
  ) : ( <>{children}</> );

}