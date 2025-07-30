import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../../contexts/authUserContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      setLoading(false);
      navigate("/dashboard"); // Solo si login fue exitoso
    } catch (err) {
      setLoading(false);
      setError(
        err?.error ||
          err?.message ||
          "Credenciales incorrectas. Intenta de nuevo."
      );
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-[#1061ff] mb-6 text-center">
          Iniciar sesión
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label className="flex flex-col">
            <span className="text-[#262626] font-medium mb-1">
              Correo electrónico
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] transition"
              placeholder="correo@ejemplo.com"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-[#262626] font-medium mb-1">Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] transition"
              placeholder="********"
              required
            />
          </label>
          {error && (
            <div className="bg-[#ffe4e6] text-[#d14343] rounded-md px-4 py-2 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className={`mt-2 bg-[#1061ff] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#0052cc] transition ${
              loading ? "opacity-60 cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-[#4B5563]">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-[#1061ff] hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </section>
  );
}

// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Simula autenticación (aquí va tu llamada real a la API)
//     setTimeout(() => {
//       setLoading(false);
//       if (form.email === "test@email.com" && form.password === "123456") {
//         // Aquí va la lógica de redirección o setUser
//         alert("¡Login exitoso! (simulado)");
//       } else {
//         setError("Credenciales incorrectas. Intenta de nuevo.");
//       }
//     }, 1200);
//   };

//   return (
//     <section className="flex items-center justify-center min-h-[80vh] px-4">
//       <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-8">
//         <h2 className="text-3xl font-bold text-[#1061ff] mb-6 text-center">
//           Iniciar sesión
//         </h2>
//         <form
//           className="flex flex-col gap-4"
//           onSubmit={handleSubmit}
//           autoComplete="off"
//         >
//           <label className="flex flex-col">
//             <span className="text-[#262626] font-medium mb-1">
//               Correo electrónico
//             </span>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] transition"
//               placeholder="correo@ejemplo.com"
//               required
//             />
//           </label>
//           <label className="flex flex-col">
//             <span className="text-[#262626] font-medium mb-1">Contraseña</span>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               className="border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] transition"
//               placeholder="********"
//               required
//             />
//           </label>
//           {error && (
//             <div className="bg-[#ffe4e6] text-[#d14343] rounded-md px-4 py-2 text-sm">
//               {error}
//             </div>
//           )}
//           <button
//             type="submit"
//             className={`mt-2 bg-[#1061ff] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#0052cc] transition ${
//               loading ? "opacity-60 cursor-wait" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Ingresando..." : "Ingresar"}
//           </button>
//         </form>
//         <div className="mt-6 text-center text-sm text-[#4B5563]">
//           ¿No tienes cuenta?{" "}
//           <Link
//             to="/register"
//             className="text-[#1061ff] hover:underline font-medium"
//           >
//             Regístrate aquí
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
