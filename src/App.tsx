import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BasicInfoPage } from "./pages/onboarding/BasicInfoPage";
import { LocationPage } from "./pages/onboarding/LocationPage";
import { BusinessIdentityPage } from "./pages/onboarding/BusinessIdentityPage";
import { PendingVerificationPage } from "./pages/onboarding/PendingVerificationPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { OverviewPage } from "./pages/dashboard/OverviewPage";
import { ProductsPage } from "./pages/dashboard/ProductsPage";
import { CategoriesPage } from "./pages/dashboard/CategoriesPage";
import { SubCategoriesPage } from "./pages/dashboard/SubCategoriesPage";
import { TagsPage } from "./pages/dashboard/TagsPage";
import { BannersPage } from "./pages/dashboard/BannersPage";
import { OrdersPage } from "./pages/dashboard/OrdersPage";
import { StoreProfilePage } from "./pages/dashboard/StoreProfilePage";
import { HelpPage } from "./pages/dashboard/HelpPage";
import { Toaster } from "react-hot-toast";
import { AuthGuard } from "./components/auth/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/onboarding" element={<Navigate to="/onboarding/basic-info" replace />} />


        <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
        <Route path="/onboarding/location" element={<LocationPage />} />
        <Route path="/onboarding/identity" element={<BusinessIdentityPage />} />
        <Route path="/onboarding/pending" element={<PendingVerificationPage />} />
        
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<AuthGuard><DashboardLayout><OverviewPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/products" element={<AuthGuard><DashboardLayout><ProductsPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/categories" element={<AuthGuard><DashboardLayout><CategoriesPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/sub-categories" element={<AuthGuard><DashboardLayout><SubCategoriesPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/tags" element={<AuthGuard><DashboardLayout><TagsPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/banners" element={<AuthGuard><DashboardLayout><BannersPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/orders" element={<AuthGuard><DashboardLayout><OrdersPage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/store-profile" element={<AuthGuard><DashboardLayout><StoreProfilePage /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/help" element={<AuthGuard><DashboardLayout><HelpPage /></DashboardLayout></AuthGuard>} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--success))',
              secondary: 'hsl(var(--card))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--error))',
              secondary: 'hsl(var(--card))',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
