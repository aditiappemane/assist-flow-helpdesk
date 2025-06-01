
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SubmitTicket from "./pages/SubmitTicket";
import MyTickets from "./pages/MyTickets";
import AskBot from "./pages/AskBot";
import AgentDashboard from "./pages/AgentDashboard";
import AgentTickets from "./pages/AgentTickets";
import AdminTickets from "./pages/AdminTickets";
import TicketDetail from "./pages/TicketDetail";
import AdminAnalytics from "./pages/AdminAnalytics";
import UserManagement from "./pages/UserManagement";
import AIManagement from "./pages/AIManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit-ticket" element={<SubmitTicket />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/ask-bot" element={<AskBot />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/agent-tickets" element={<AgentTickets />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/ai" element={<AIManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
