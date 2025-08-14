import { createContext, useContext } from "react";
import { useGetCurrentUserQuery } from "../components/auth/useAuth";
import type { User } from "../types/auth.interfaces";

type AppContextType = {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: currentUser, isLoading, isSuccess } = useGetCurrentUserQuery();

  const isAuthenticated = isSuccess && !!currentUser;

  const value = {
    isLoading,
    isAuthenticated,
    currentUser: currentUser ?? null,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
