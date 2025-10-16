import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { ErrorFallback } from "./utils/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { StrictMode } from "react";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";

function AppContent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Home />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute auth = {true}>
                <Login />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
