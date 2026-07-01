// fichier src/components/WorkOSWrapper.tsx
import { AuthKitProvider } from '@workos-inc/authkit-react';
import { workosConfig } from '../auth/workos-config';
import type { ReactNode } from "react";

export function WorkOSWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider {...workosConfig}>
      {children}
    </AuthKitProvider>
  );
}