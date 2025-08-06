import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import AppRouter from "./routes/AppRouter.tsx";
import { AppContextProvider } from "./context/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </StrictMode>
);
