import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-white rounded-2xl shadow-md mt-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-[#1061ff] mb-4 text-center leading-tight">
        Bienvenido a <span className="text-[#262626]">ActasExpress</span>
      </h1>
      <p className="text-lg text-[#4B5563] mb-8 text-center max-w-xl">
        La plataforma más ágil y segura para crear, firmar y gestionar actas de
        reunión. Digitaliza tus procesos y ahorra tiempo desde cualquier lugar.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/login"
          className="bg-[#1061ff] text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-[#0052cc] transition text-center"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-[#F5F6FA] text-[#1061ff] px-8 py-3 rounded-lg font-semibold border border-[#D6E4FF] hover:bg-[#E9F0FB] transition text-center"
        >
          Registrarse
        </Link>
      </div>
    </section>
  );
}
