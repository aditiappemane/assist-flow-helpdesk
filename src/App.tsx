import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SubmitTicket from "./pages/SubmitTicket";
import MyTickets from "./pages/MyTickets";
import AskBot from "./pages/AskBot";
import AgentDashboard from "./pages/AgentDashboard";
import AgentTickets from "./pages/AgentTickets";
import AdminTickets from "./pages/AdminTickets";
import TicketDetails from "@/pages/TicketDetails";
import AdminAnalytics from "./pages/AdminAnalytics";
import UserManagement from "./pages/UserManagement";
import AIManagement from "./pages/AIManagement";
import NotFound from "./pages/NotFound";
import PrivateRoute from "@/components/PrivateRoute";
import AgentTicketDetail from "./pages/AgentTicketDetail";
import AdminTicketDetail from "./pages/AdminTicketDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/submit-ticket"
                element={
                  <PrivateRoute>
                    <SubmitTicket />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <PrivateRoute>
                    <MyTickets />
                  </PrivateRoute>
                }
              />
              <Route path="/ask-bot" element={<AskBot />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/agent-tickets" element={<AgentTickets />} />
              <Route
                path="/agent/ticket/:ticketNumber"
                element={
                  <PrivateRoute>
                    <AgentTicketDetail />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route
                path="/admin/ticket/:ticketNumber"
                element={
                  <PrivateRoute>
                    <AdminTicketDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tickets/:id"
                element={
                  <PrivateRoute>
                    <TicketDetails />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/ai" element={<AIManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
