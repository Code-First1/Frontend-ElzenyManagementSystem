import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import AppRouter from "./routes/AppRouter.tsx";
import { AppContextProvider } from "./context/AppContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
