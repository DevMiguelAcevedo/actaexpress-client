import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthUser } from "../contexts/authUserContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authUser, logout } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 relative">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#1061ff] tracking-wide">
          <Link to="/">ActasExpress</Link>
        </div>

        {/* Si el usuario está logueado, muestra navbar para dashboard */}
        {authUser ? (
          <>
            {/* Menú Desktop Auth */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-md font-medium text-[#1061ff] hover:underline"
              >
                Dashboard
              </Link>
              <Link
                to="/actas"
                className="px-5 py-2 rounded-md font-medium text-[#1061ff] hover:underline"
              >
                Actas
              </Link>
              <Link
                to="/perfil"
                className="px-5 py-2 rounded-md font-medium text-[#1061ff] hover:underline"
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-md bg-[#d14343] text-white hover:bg-[#b61d1d] font-medium transition"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          // Menú Desktop público
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-md border border-[#1061ff] text-[#1061ff] hover:bg-[#1061ff] hover:text-white font-medium transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-md bg-[#1061ff] text-white hover:bg-[#0052cc] font-medium transition"
            >
              Registrarse
            </Link>
          </div>
        )}

        {/* Menú hamburguesa para móvil */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((open) => !open)}
            className="focus:outline-none"
          >
            <svg
              className="w-7 h-7 text-[#1061ff]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
              />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 w-52 bg-white shadow-lg rounded-lg flex flex-col z-20 md:hidden animate-fade-in">
            {authUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-3 border-b border-[#F5F6FA] text-[#1061ff] hover:bg-[#F5F6FA] font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/actas"
                  className="px-5 py-3 border-b border-[#F5F6FA] text-[#1061ff] hover:bg-[#F5F6FA] font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Actas
                </Link>
                <Link
                  to="/perfil"
                  className="px-5 py-3 border-b border-[#F5F6FA] text-[#1061ff] hover:bg-[#F5F6FA] font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-3 text-white bg-[#d14343] hover:bg-[#b61d1d] rounded-b-lg font-medium transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-3 border-b border-[#F5F6FA] text-[#1061ff] hover:bg-[#F5F6FA] font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-3 text-white bg-[#1061ff] hover:bg-[#0052cc] font-medium rounded-b-lg transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
