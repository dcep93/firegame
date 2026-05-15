import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

interface ConnectionContextValue {
  status: ConnectionStatus;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  return (
    <ConnectionContext.Provider value={{ status: "connected" }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection(): ConnectionContextValue {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}

