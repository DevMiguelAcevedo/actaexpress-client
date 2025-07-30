import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationGate from "../../components/RegistrationGate";
import { useAuthUser } from "../../contexts/authUserContext";

const VITE_REGISTRO_KEY = import.meta.env.VITE_REGISTRO_KEY;

export default function Register() {
  const [unlocked, setUnlocked] = useState(false);

  const [form, setForm] = useState({
    identificacion: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [userCreated, setUserCreated] = useState(null);

  // Usa el contexto para registrar
  const { register } = useAuthUser();

  // Validación básica local
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio.";
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      errs.email = "Correo no válido.";
    if (!form.phone.match(/^\d{7,15}$/))
      errs.phone = "Teléfono inválido (sólo dígitos).";
    if (form.password.length < 6)
      errs.password = "La contraseña debe tener al menos 6 caracteres.";
    if (form.password !== form.password2)
      errs.password2 = "Las contraseñas no coinciden.";
    if (!form.role) errs.role = "Debes seleccionar un rol.";
    return errs;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    setSuccess(false);
    setUserCreated(null);

    try {
      // Prepara los datos para el registro (ajusta nombres si tu backend espera otros)
      const payload = {
        identificacion: form.identificacion,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password2,
        roles: [form.role], // Array o string según tu backend
      };
      // Usamos la función register del contexto
      const res = await register(payload);
      setSuccess(true);
      setUserCreated(res.user || res);
      setForm({
        identificacion: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
        role: "",
      });
    } catch (err) {
      setErrors({ api: err?.message || "Error al registrar usuario." });
    }
    setLoading(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      {!unlocked && (
        <RegistrationGate
          allowedKey={VITE_REGISTRO_KEY}
          onUnlock={() => setUnlocked(true)}
        />
      )}

      {unlocked && (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-[#1061ff] mb-6 text-center">
            Registro de usuario
          </h2>

          {success && userCreated && (
            <div className="bg-[#e6ffed] text-[#256029] rounded-md px-4 py-2 mb-4 text-center">
              Usuario registrado exitosamente.
              <br />
              Se envió un correo a <b>{userCreated.email}</b>.<br />
              <span className="text-xs text-[#4B5563]">
                Usuario: <b>{userCreated.name}</b> | Rol:{" "}
                <b>{userCreated.roles ? userCreated.roles.join(", ") : ""}</b>
              </span>
              <br />
              <Link to="/login" className="text-[#1061ff] hover:underline">
                Inicia sesión
              </Link>
            </div>
          )}

          {errors.api && (
            <div className="bg-[#ffe4e6] text-[#d14343] rounded-md px-4 py-2 mb-4 text-center">
              {errors.api}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Identificacion
              </span>
              <input
                type="text"
                name="identificacion"
                value={form.identificacion}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.identificacion ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="Tu numero de documento"
                required
              />
              {errors.identificacion && (
                <span className="text-[#d14343] text-sm">{errors.identificacion}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Nombre completo
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.name ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="Tu nombre"
                required
              />
              {errors.name && (
                <span className="text-[#d14343] text-sm">{errors.name}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Correo electrónico
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.email ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="correo@ejemplo.com"
                required
              />
              {errors.email && (
                <span className="text-[#d14343] text-sm">{errors.email}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">Teléfono</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.phone ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="Ej: 3012345678"
                required
              />
              {errors.phone && (
                <span className="text-[#d14343] text-sm">{errors.phone}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Contraseña
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.password ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="********"
                required
              />
              {errors.password && (
                <span className="text-[#d14343] text-sm">
                  {errors.password}
                </span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Confirmar contraseña
              </span>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.password2 ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                placeholder="********"
                required
              />
              {errors.password2 && (
                <span className="text-[#d14343] text-sm">
                  {errors.password2}
                </span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium text-[#262626] mb-1">
                Rol del usuario
              </span>
              <select
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] ${
                  errors.role ? "border-[#d14343]" : "border-[#D6E4FF]"
                }`}
                required
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                <option value="administrador">Administrador</option>
                <option value="secretaria">Secretaria</option>
                <option value="docente">Docente</option>
                <option value="invitado">Invitado</option>
                {/* Agrega más roles si los necesitas */}
              </select>
              {errors.role && (
                <span className="text-[#d14343] text-sm">{errors.role}</span>
              )}
            </label>

            <button
              type="submit"
              className={`mt-2 bg-[#1061ff] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#0052cc] transition ${
                loading ? "opacity-60 cursor-wait" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-[#4B5563]">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-[#1061ff] hover:underline font-medium"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
