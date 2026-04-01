import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import ContractsList from "./pages/dashboard/ContractsList.tsx";
import ContractDetail from "./pages/dashboard/ContractDetail.tsx";
import CreateContract from "./pages/dashboard/CreateContract.tsx";
import Wallet from "./pages/dashboard/Wallet.tsx";
import Disputes from "./pages/dashboard/Disputes.tsx";
import Settings from "./pages/dashboard/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="contracts" element={<ContractsList />} />
            <Route path="contracts/:id" element={<ContractDetail />} />
            <Route path="contracts/new" element={<CreateContract />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
