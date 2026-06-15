import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import { AuthGuard } from "./components/auth/AuthGuard";
import { AuthProvider } from "./context/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { RouteErrorBoundary } from "./components/ui/RouteErrorBoundary";
import { PageSkeleton } from "./components/ui/LoadingSkeletons";

// Lazy-loaded routes
const BasicInfoPage = lazy(() => import("./pages/onboarding/BasicInfoPage").then(m => ({ default: m.BasicInfoPage })));
const LocationPage = lazy(() => import("./pages/onboarding/LocationPage").then(m => ({ default: m.LocationPage })));
const BusinessIdentityPage = lazy(() => import("./pages/onboarding/BusinessIdentityPage").then(m => ({ default: m.BusinessIdentityPage })));
const PendingVerificationPage = lazy(() => import("./pages/onboarding/PendingVerificationPage").then(m => ({ default: m.PendingVerificationPage })));
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));

// Dashboard Pages
const OverviewPage = lazy(() => import("./pages/dashboard/OverviewPage").then(m => ({ default: m.OverviewPage })));
const ProductsPage = lazy(() => import("./pages/dashboard/ProductsPage").then(m => ({ default: m.ProductsPage })));
const CategoriesPage = lazy(() => import("./pages/dashboard/CategoriesPage").then(m => ({ default: m.CategoriesPage })));
const ReportsPage = lazy(() => import("./pages/dashboard/reports/ReportsPage").then(m => ({ default: m.ReportsPage })));
const SubCategoriesPage = lazy(() => import("./pages/dashboard/SubCategoriesPage").then(m => ({ default: m.SubCategoriesPage })));
const TagsPage = lazy(() => import("./pages/dashboard/TagsPage").then(m => ({ default: m.TagsPage })));
const BannersPage = lazy(() => import("./pages/dashboard/BannersPage").then(m => ({ default: m.BannersPage })));
const OrdersPage = lazy(() => import("./pages/dashboard/OrdersPage").then(m => ({ default: m.OrdersPage })));
const StoreProfilePage = lazy(() => import("./pages/dashboard/StoreProfilePage").then(m => ({ default: m.StoreProfilePage })));
const HelpPage = lazy(() => import("./pages/dashboard/HelpPage").then(m => ({ default: m.HelpPage })));

// Fallback component for Suspense
const SuspenseFallback = () => (
  <div className="p-8 w-full h-full">
    <PageSkeleton />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider must be inside BrowserRouter so it can use useNavigate */}
      <AuthProvider>
        <RouteErrorBoundary>
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/onboarding" element={<Navigate to="/onboarding/basic-info" replace />} />
              <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
              <Route path="/onboarding/location" element={<LocationPage />} />
              <Route path="/onboarding/identity" element={<BusinessIdentityPage />} />
              <Route path="/onboarding/pending" element={<PendingVerificationPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />

              {/* Dashboard Nested Routes */}
              <Route
                element={
                  <AuthGuard>
                    <DashboardLayout />
                  </AuthGuard>
                }
              >
                <Route path="/dashboard" element={<OverviewPage />} />
                <Route path="/dashboard/products" element={<ProductsPage />} />
                <Route path="/dashboard/categories" element={<CategoriesPage />} />
                <Route path="/dashboard/sub-categories" element={<SubCategoriesPage />} />
                <Route path="/dashboard/tags" element={<TagsPage />} />
                <Route path="/dashboard/banners" element={<BannersPage />} />
                <Route path="/dashboard/orders" element={<OrdersPage />} />
                <Route path="/dashboard/reports" element={<ReportsPage />} />
                <Route path="/dashboard/store-profile" element={<StoreProfilePage />} />
                <Route path="/dashboard/help" element={<HelpPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--success))",
                secondary: "hsl(var(--card))",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--error))",
                secondary: "hsl(var(--card))",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
