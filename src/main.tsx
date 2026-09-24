import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { I18nProvider } from "./i18n";
import { ProgramSharePage } from "./pages/ProgramSharePage";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";
import { LandingPage } from "./pages/LandingPage";
import { StudioCmsPage } from "./pages/studio/StudioCmsPage";
import { StudioFollowersPage } from "./pages/studio/StudioFollowersPage";
import { StudioHomePage } from "./pages/studio/StudioHomePage";
import { StudioLibraryPage } from "./pages/studio/StudioLibraryPage";
import { StudioLoginPage } from "./pages/studio/StudioLoginPage";
import { StudioNewProgramPage } from "./pages/studio/StudioNewProgramPage";
import { StudioProgramDetailPage } from "./pages/studio/StudioProgramDetailPage";
import { StudioProgramsPage } from "./pages/studio/StudioProgramsPage";
import { StudioSettingsPage } from "./pages/studio/StudioSettingsPage";
import { StudioShell } from "./pages/studio/StudioShell";
import { StudioStudentsPage } from "./pages/studio/StudioStudentsPage";
import "./styles.css";
import "./studio.css";

const el = document.querySelector("#app");
if (!el) throw new Error("#app missing");

createRoot(el).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/p/:id" element={<ProgramSharePage />} />
            <Route path="/studio/login" element={<StudioLoginPage />} />
            <Route path="/studio" element={<StudioShell />}>
              <Route index element={<StudioHomePage />} />
              <Route path="programs" element={<StudioProgramsPage />} />
              <Route path="programs/new" element={<StudioNewProgramPage />} />
              <Route path="programs/:id" element={<StudioProgramDetailPage />} />
              <Route path="cms" element={<StudioCmsPage />} />
              <Route path="students" element={<StudioStudentsPage />} />
              <Route path="followers" element={<StudioFollowersPage />} />
              <Route path="library" element={<StudioLibraryPage />} />
              <Route path="settings" element={<StudioSettingsPage />} />
              <Route path="new" element={<Navigate to="/studio/programs/new" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
);
