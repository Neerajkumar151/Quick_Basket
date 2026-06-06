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
import { TagsPage } from "./pages/dashboard/TagsPage";
import { BannersPage } from "./pages/dashboard/BannersPage";
import { OrdersPage } from "./pages/dashboard/OrdersPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/basic-info" replace />} />
        <Route path="/onboarding" element={<Navigate to="/onboarding/basic-info" replace />} />
        
        {/* Legacy redirects */}
        <Route path="/onboarding/1" element={<Navigate to="/onboarding/basic-info" replace />} />
        <Route path="/onboarding/2" element={<Navigate to="/onboarding/location" replace />} />
        <Route path="/onboarding/3" element={<Navigate to="/onboarding/identity" replace />} />

        <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
        <Route path="/onboarding/location" element={<LocationPage />} />
        <Route path="/onboarding/identity" element={<BusinessIdentityPage />} />
        <Route path="/onboarding/pending" element={<PendingVerificationPage />} />
        
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardLayout><OverviewPage /></DashboardLayout>} />
        <Route path="/dashboard/products" element={<DashboardLayout><ProductsPage /></DashboardLayout>} />
        <Route path="/dashboard/categories" element={<DashboardLayout><CategoriesPage /></DashboardLayout>} />
        <Route path="/dashboard/tags" element={<DashboardLayout><TagsPage /></DashboardLayout>} />
        <Route path="/dashboard/banners" element={<DashboardLayout><BannersPage /></DashboardLayout>} />
        <Route path="/dashboard/orders" element={<DashboardLayout><OrdersPage /></DashboardLayout>} />
        
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
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
