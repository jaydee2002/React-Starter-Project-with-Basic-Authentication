import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute.jsx";

import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Home from "./pages/Home.jsx";
import UserPage from "./pages/UserPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import PageNotFound from "./pages/errors/PageNotFound.jsx";
import Unauthorized from "./pages/errors/Unauthorized.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sourceSans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/user"
              element={
                <RoleProtectedRoute allowedRoles={["user"]}>
                  <UserPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <AdminPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
