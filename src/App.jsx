import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ForgotFlow from "./pages/ForgotFlow";

import GoogleSuccess from "./pages/GoogleSuccess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  console.log(import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
      <Routes>
        {/* default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotFlow />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* protected route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
