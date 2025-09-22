import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
  // Wrap the entire app in LanguageProvider first, then AuthProvider
  <LanguageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LanguageProvider>
);

