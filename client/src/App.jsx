import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../store/user.store";
import Navbar from "./components/Navbar";
import TabNavigation from "./components/TabNavigation";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/CreatePage";
import Bike from "./pages/BikePage";
import Customer from "./pages/CustomerPage";
import Transaction from "./pages/TransactionPage";
import User from "./pages/UserPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

function PrivateRoute({ children }) {
  const { user } = useUserStore();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useUserStore();
  return user && user.role === "admin" ? children : <Navigate to="/" />;
}

function App() {
  const { user } = useUserStore();
  const location = useLocation();

  // Don't show tabs on login/register pages
  const showTabs = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                {showTabs && <TabNavigation />}
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <>
                {showTabs && <TabNavigation />}
                <Create />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/bikes"
          element={
            <PrivateRoute>
              <>
                {showTabs && <TabNavigation />}
                <Bike />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <>
                {showTabs && <TabNavigation />}
                <Customer />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <>
                {showTabs && <TabNavigation />}
                <Transaction />
              </>
            </PrivateRoute>
          }
        />

        {/* Admin Only Route */}
        <Route
          path="/users"
          element={
            <AdminRoute>
              <>
                {showTabs && <TabNavigation />}
                <User />
              </>
            </AdminRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
