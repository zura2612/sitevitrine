// fichier src/components/MaintenanceGate.tsx
import type { ReactNode } from "react";
import { useMaintenanceStatus } from "@/hooks/useMaintenanceStatus";
import { MaintenancePage } from "./MaintenancePage";

interface MaintenanceGateProps {
  children: ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { status, isLoading } = useMaintenanceStatus();

  // Pendant le chargement, on affiche un loader minimal
  if (isLoading || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Mode maintenance : afficher la page dédiée
  if (status.mode === "maintenance") {
    return <MaintenancePage status={status} />;
  }

  // Mode normal : afficher le site
  return <>{children}</>;
}