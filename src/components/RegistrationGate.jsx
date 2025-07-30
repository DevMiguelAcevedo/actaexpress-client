import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegistrationGate({ allowedKey, onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === allowedKey) {
      onUnlock();
    } else {
      setError("Clave incorrecta. Contacta al administrador.");
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm animate-fade-in flex flex-col gap-5 items-center">
        {/* Icono candado */}
        <div className="mb-2">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="24" fill="#E9F0FB" />
            <path
              d="M16 22V18a8 8 0 1 1 16 0v4"
              stroke="#1061ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="14"
              y="22"
              width="20"
              height="14"
              rx="4"
              fill="#fff"
              stroke="#1061ff"
              strokeWidth="2"
            />
            <circle cx="24" cy="29" r="2" fill="#1061ff" />
            <path
              d="M24 31v2"
              stroke="#1061ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1061ff] text-center mb-2">
          Acceso restringido
        </h2>
        <p className="text-[#4B5563] text-center text-sm mb-2">
          Los registros están a cargo de personal autorizado.
          <br />
          Ingresa tu{" "}
          <span className="font-semibold">clave segura de registro</span> si
          eres administrativo.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input
            type="password"
            placeholder="Clave de registro"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] transition"
            required
            autoFocus
          />
          {error && <div className="text-[#d14343] text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-[#1061ff] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#0052cc] transition"
          >
            Validar clave
          </button>
        </form>
        <div className="mt-3 text-center text-sm text-[#4B5563]">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-[#1061ff] hover:underline font-medium"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
