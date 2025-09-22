import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
  // The entire app must be wrapped in AuthProvider and LanguageProvider
  <AuthProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </AuthProvider>
);

