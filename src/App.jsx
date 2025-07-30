import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthUserProvider } from "./contexts/authUserContext";
import { ActasProvider } from "./contexts/actasContext";
import DashboardAdmin from "./pages/auth/DashboardAdminPage";
import CreateNewActaPage from "./pages/auth/CreateNewActaPage";

export default function App() {
  return (
    <AuthUserProvider>
      <ActasProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#F5F6FA]">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardAdmin />} />
                  <Route path="/newacta" element={<CreateNewActaPage />} />
                  <Route path="/newact" element={<h1>Nueva Acta</h1>} />
                  <Route path="/listact" element={<h1>Lista de Actas</h1>} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ActasProvider>
    </AuthUserProvider>
  );
}
