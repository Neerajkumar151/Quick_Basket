import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./locales/i18n";
import App from "./App.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { QueryProvider } from "./providers/QueryProvider.tsx";
import { ErrorFallback } from "./components/ui/ErrorFallback.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider defaultTheme="light" storageKey="quickbasket-theme">
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ErrorBoundary>
  </ThemeProvider>,
);
