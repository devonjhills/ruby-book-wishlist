import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  BackendActivityProvider,
  useBackendActivity,
} from "./contexts/BackendActivityContext";
import { setRailsActivityTracker } from "./services/api";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
        <span className="ml-3 text-muted-foreground animate-pulse">Loading Ruby Library...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
        <span className="ml-3 text-muted-foreground animate-pulse">Loading Ruby Library...</span>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const { addActivity } = useBackendActivity();

  useEffect(() => {
    // Connect the Rails activity tracker to the API service
    setRailsActivityTracker({ addActivity });
  }, [addActivity]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BackendActivityProvider>
        <Router>
          <div className="min-h-screen bg-background relative">
            {/* Ruby-themed background pattern */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
              <div className="absolute top-20 left-10 w-4 h-4 bg-primary rotate-45 rounded-sm"></div>
              <div className="absolute top-40 right-20 w-3 h-3 bg-accent rotate-12 rounded-sm"></div>
              <div className="absolute bottom-40 left-20 w-5 h-5 bg-primary/50 rotate-45 rounded-sm"></div>
              <div className="absolute bottom-20 right-10 w-3 h-3 bg-accent/70 rotate-12 rounded-sm"></div>
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary/30 rotate-45 rounded-sm"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent/40 rotate-12 rounded-sm"></div>
            </div>
            <div className="relative z-10">
              <AppContent />
            </div>
          </div>
        </Router>
      </BackendActivityProvider>
    </AuthProvider>
  );
}

export default App;
