import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import AuthGuard from "@/components/AuthGuard";
import Landing from "@/pages/Landing";
import InsightsPreview from "@/pages/InsightsPreview";
import Pricing from "@/pages/Pricing";
import FAQ from "@/pages/FAQ";
import Claim from "@/pages/Claim";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Survey from "@/pages/Survey";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Marketing pages with shared nav/footer */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/insights" element={<InsightsPreview />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected dashboard — no marketing layout */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />

            {/* Survey — standalone, no nav/footer */}
            <Route path="/survey" element={<Survey />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
