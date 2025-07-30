import { useState, useRef, useEffect, useContext } from "react";
import { useActas } from "../../contexts/actasContext";

// Nombres y keys de las pestañas
const tabs = [
  { key: "participantes", label: "Participantes" },
  { key: "calendario", label: "Calendario y horario" },
  { key: "objetivos", label: "Objetivos" },
  { key: "compromisos", label: "Compromisos" },
  { key: "minuta", label: "Minuta" },
  { key: "conclusiones", label: "Conclusiones" },
  { key: "notas", label: "Notas" },
];

export default function CreateNewActaPage() {
  const { registeredUsers, createNewActa, loading } = useActas();
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const textareaRefs = useRef({});

  // Estados centrales de la nueva acta
  const [form, setForm] = useState({
    titulo: "",
    participantes: [],
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    objetivos: "",
    compromisos: "",
    minuta: "",
    conclusiones: "",
    notas: "",
  });

  // Handler para inputs sencillos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    adjustTextareaHeight(e.target);
  };

  // Ajustar altura de textareas dinámicamente
  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  // Inicializar referencias para los textareas
  useEffect(() => {
    Object.keys(textareaRefs.current).forEach((key) => {
      if (textareaRefs.current[key]) {
        adjustTextareaHeight(textareaRefs.current[key]);
      }
    });
  }, [activeTab]);

  // Filtrar personas basado en el término de búsqueda
  const filteredPeople = registeredUsers.filter(
    (person) =>
      person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.cargo &&
        person.cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar persona seleccionada
  const handleSelectPerson = (person) => {
    if (!form.participantes.some((p) => p._id === person._id)) {
      setForm((f) => ({
        ...f,
        participantes: [...f.participantes, person],
      }));
    }
    setSearchTerm("");
  };

  // Eliminar persona seleccionada
  const removeParticipante = (id) => {
    setForm((f) => ({
      ...f,
      participantes: f.participantes.filter((person) => person._id !== id),
    }));
  };

  // Validar formulario antes de guardar
  const validateForm = () => {
    if (!form.titulo) {
      setSubmitError("El título es requerido");
      return false;
    }
    if (form.participantes.length === 0) {
      setSubmitError("Debe agregar al menos un participante");
      setActiveTab("participantes");
      return false;
    }
    if (!form.fecha || !form.hora_inicio || !form.hora_fin) {
      setSubmitError("La fecha y horario son requeridos");
      setActiveTab("calendario");
      return false;
    }
    if (!form.objetivos) {
      setSubmitError("Los objetivos son requeridos");
      setActiveTab("objetivos");
      return false;
    }
    return true;
  };

  // Guardar acta en la base de datos
  const handleGuardar = async () => {
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos para enviar
      const actaData = {
        ...form,
        participantes: form.participantes.map((p) => p._id), // Solo enviamos los IDs
        estado: "pendiente", // Estado inicial por defecto
      };

      await createNewActa(actaData);
      alert("Acta creada exitosamente");
      // Aquí podrías redirigir o resetear el formulario
    } catch (error) {
      console.error("Error al guardar acta:", error);
      setSubmitError("Error al guardar el acta. Por favor intente nuevamente.");
    }
  };

  const handleCancelar = () => {
    if (window.confirm("¿Descartar y salir? Perderás los cambios.")) {
      // Aquí podrías redirigir a la lista de actas
      alert("Cambios descartados");
    }
  };

  // Renderizado de cada tab
  const renderTab = () => {
    switch (activeTab) {
      case "participantes":
        return (
          <div className="space-y-4">
            <label className="block font-medium text-[#262626]">
              Buscar y agregar participante
              <button
                type="button"
                className="w-full mt-2 bg-[#1061ff] text-white rounded-md px-4 py-2 font-semibold hover:bg-[#0052cc] transition flex items-center justify-center"
                onClick={() => setShowSearchModal(true)}
                disabled={loading}
              >
                <span>+ Buscar participantes registrados</span>
              </button>
            </label>

            {/* Lista de participantes agregados */}
            <div>
              <h4 className="font-medium text-[#262626] mb-2">
                Participantes confirmados:
              </h4>
              {form.participantes.length === 0 ? (
                <p className="text-[#4B5563] text-sm">
                  No hay participantes agregados.
                </p>
              ) : (
                <ul className="space-y-2">
                  {form.participantes.map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center gap-3 bg-[#F5F6FA] px-4 py-2 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{p.nombre}</p>
                        {p.cargo && (
                          <p className="text-xs text-[#4B5563]">{p.cargo}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="ml-auto text-[#d14343] hover:underline text-xs"
                        onClick={() => removeParticipante(p._id)}
                        disabled={loading}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      case "calendario":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col font-medium text-[#262626]">
              Fecha de la reunión
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
                required
                disabled={loading}
              />
            </label>
            <label className="flex flex-col font-medium text-[#262626]">
              Hora de inicio
              <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
                required
                disabled={loading}
              />
            </label>
            <label className="flex flex-col font-medium text-[#262626]">
              Hora de finalización
              <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
                className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
                required
                disabled={loading}
              />
            </label>
          </div>
        );
      case "objetivos":
        return (
          <label className="flex flex-col font-medium text-[#262626]">
            Objetivos de la reunión
            <textarea
              ref={(el) => (textareaRefs.current["objetivos"] = el)}
              name="objetivos"
              value={form.objetivos}
              onChange={handleChange}
              className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
              placeholder="Describe los objetivos principales..."
              style={{ minHeight: "100px", maxHeight: "300px" }}
              required
              disabled={loading}
            />
          </label>
        );
      case "compromisos":
        return (
          <label className="flex flex-col font-medium text-[#262626]">
            Compromisos / tareas
            <textarea
              ref={(el) => (textareaRefs.current["compromisos"] = el)}
              name="compromisos"
              value={form.compromisos}
              onChange={handleChange}
              className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
              placeholder="Lista de compromisos y responsables..."
              style={{ minHeight: "100px", maxHeight: "300px" }}
              required
              disabled={loading}
            />
          </label>
        );
      case "minuta":
        return (
          <label className="flex flex-col font-medium text-[#262626]">
            Minuta de la reunión
            <textarea
              ref={(el) => (textareaRefs.current["minuta"] = el)}
              name="minuta"
              value={form.minuta}
              onChange={handleChange}
              className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
              placeholder="Aquí va el resumen detallado de la reunión..."
              style={{ minHeight: "150px", maxHeight: "400px" }}
              required
              disabled={loading}
            />
          </label>
        );
      case "conclusiones":
        return (
          <label className="flex flex-col font-medium text-[#262626]">
            Conclusiones
            <textarea
              ref={(el) => (textareaRefs.current["conclusiones"] = el)}
              name="conclusiones"
              value={form.conclusiones}
              onChange={handleChange}
              className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
              placeholder="Resumen de conclusiones o acuerdos generales..."
              style={{ minHeight: "100px", maxHeight: "300px" }}
              required
              disabled={loading}
            />
          </label>
        );
      case "notas":
        return (
          <label className="flex flex-col font-medium text-[#262626]">
            Notas adicionales
            <textarea
              ref={(el) => (textareaRefs.current["notas"] = el)}
              name="notas"
              value={form.notas}
              onChange={handleChange}
              className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
              placeholder="Observaciones, notas o temas varios..."
              style={{ minHeight: "80px", maxHeight: "250px" }}
              disabled={loading}
            />
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto min-h-[85vh] bg-white rounded-2xl shadow-md p-4 md:p-8 mt-8 flex flex-col">
      <h2 className="text-2xl font-bold text-[#1061ff] mb-6 text-center">
        Nueva Acta de Reunión
      </h2>

      {/* Campo de título */}
      <div className="mb-6">
        <label className="flex flex-col font-medium text-[#262626]">
          Título de la reunión
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
            placeholder="Ej: Revisión de avances del proyecto X"
            required
            disabled={loading}
          />
        </label>
      </div>

      {/* Navegación de pestañas */}
      <nav className="flex overflow-x-auto gap-2 mb-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`
              px-4 py-2 rounded-t-md font-semibold whitespace-nowrap
              ${
                activeTab === tab.key
                  ? "bg-[#E9F0FB] text-[#1061ff] border-b-2 border-[#1061ff]"
                  : "bg-[#F5F6FA] text-[#4B5563] hover:bg-[#e6ecf6]"
              }
              transition
            `}
            onClick={() => setActiveTab(tab.key)}
            type="button"
            disabled={loading}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenido de la pestaña activa */}
      <div className="flex-1 mb-20">{renderTab()}</div>

      {/* Mensaje de error */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      {/* Barra inferior de acciones */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 mt-4">
        <div className="max-w-4xl mx-auto flex justify-end gap-4 px-4 md:px-8">
          <button
            onClick={handleCancelar}
            className="bg-[#F5F6FA] text-[#d14343] border border-[#d14343] rounded-md px-6 py-2 font-semibold hover:bg-[#ffe4e6] transition"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Descartar"}
          </button>
          <button
            onClick={handleGuardar}
            className="bg-[#1061ff] text-white rounded-md px-8 py-2 font-semibold hover:bg-[#0052cc] transition flex items-center justify-center min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar acta"
            )}
          </button>
        </div>
      </div>

      {/* Modal de búsqueda de participantes */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1061ff]">
                Buscar Participantes
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, cargo o email..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Lista de resultados */}
            <div className="overflow-y-auto flex-1">
              {filteredPeople.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {registeredUsers.length === 0
                    ? "Cargando usuarios..."
                    : "No se encontraron resultados"}
                </p>
              ) : (
                <ul className="divide-y">
                  {filteredPeople.map((person) => (
                    <li key={person._id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{person.nombre}</h4>
                          {person.cargo && (
                            <p className="text-sm text-gray-600">
                              {person.cargo}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {person.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSelectPerson(person)}
                          disabled={
                            form.participantes.some(
                              (p) => p._id === person._id
                            ) || loading
                          }
                          className={`px-3 py-1 rounded-md text-sm ${
                            form.participantes.some((p) => p._id === person._id)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-[#1061ff] text-white hover:bg-[#0052cc]"
                          }`}
                        >
                          {form.participantes.some((p) => p._id === person._id)
                            ? "Agregado"
                            : "Agregar"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
// // Datos mock de personas registradas
// const personasRegistradas = [
//   {
//     id: 1,
//     nombre: "Juan Pérez",
//     cargo: "Director Ejecutivo",
//     email: "juan@empresa.com",
//   },
//   {
//     id: 2,
//     nombre: "María López",
//     cargo: "Gerente de Proyectos",
//     email: "maria@empresa.com",
//   },
//   {
//     id: 3,
//     nombre: "Carlos Vega",
//     cargo: "Coordinador TI",
//     email: "carlos@empresa.com",
//   },
//   {
//     id: 4,
//     nombre: "Ana Martínez",
//     cargo: "Contadora",
//     email: "ana@empresa.com",
//   },
//   {
//     id: 5,
//     nombre: "Luis Ramírez",
//     cargo: "Asesor Legal",
//     email: "luis@empresa.com",
//   },
//   {
//     id: 6,
//     nombre: "Claudia Ruiz",
//     cargo: "RRHH",
//     email: "claudia@empresa.com",
//   },
// ];

// // Nombres y keys de las pestañas
// const tabs = [
//   { key: "participantes", label: "Participantes" },
//   { key: "calendario", label: "Calendario y horario" },
//   { key: "objetivos", label: "Objetivos" },
//   { key: "compromisos", label: "Compromisos" },
//   { key: "minuta", label: "Minuta" },
//   { key: "conclusiones", label: "Conclusiones" },
//   { key: "notas", label: "Notas" },
// ];

// export default function CreateNewActaPage() {
//   const [activeTab, setActiveTab] = useState(tabs[0].key);
//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const textareaRefs = useRef({});

//   // Estados centrales de la nueva acta
//   const [form, setForm] = useState({
//     participantes: [],
//     fecha: "",
//     hora_inicio: "",
//     hora_fin: "",
//     objetivos: "",
//     compromisos: "",
//     minuta: "",
//     conclusiones: "",
//     notas: "",
//   });

//   // Handler para inputs sencillos
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     adjustTextareaHeight(e.target);
//   };

//   // Ajustar altura de textareas dinámicamente
//   const adjustTextareaHeight = (textarea) => {
//     textarea.style.height = "auto";
//     textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
//   };

//   // Inicializar referencias para los textareas
//   useEffect(() => {
//     Object.keys(textareaRefs.current).forEach((key) => {
//       if (textareaRefs.current[key]) {
//         adjustTextareaHeight(textareaRefs.current[key]);
//       }
//     });
//   }, [activeTab]);

//   // Filtrar personas basado en el término de búsqueda
//   const filteredPeople = personasRegistradas.filter(
//     (person) =>
//       person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       person.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Agregar persona seleccionada
//   const handleSelectPerson = (person) => {
//     if (!form.participantes.some((p) => p.id === person.id)) {
//       setForm((f) => ({
//         ...f,
//         participantes: [...f.participantes, person],
//       }));
//     }
//     setSearchTerm("");
//   };

//   // Eliminar persona seleccionada
//   const removeParticipante = (id) => {
//     setForm((f) => ({
//       ...f,
//       participantes: f.participantes.filter((person) => person.id !== id),
//     }));
//   };

//   // Placeholder de guardado/cancelar
//   const handleGuardar = () => {
//     alert("Acta guardada (demo). Pronto integración real.");
//   };
//   const handleCancelar = () => {
//     if (window.confirm("¿Descartar y salir? Perderás los cambios.")) {
//       alert("Acta descartada (demo).");
//     }
//   };

//   // Renderizado de cada tab
//   const renderTab = () => {
//     switch (activeTab) {
//       case "participantes":
//         return (
//           <div className="space-y-4">
//             <label className="block font-medium text-[#262626]">
//               Buscar y agregar participante
//               <button
//                 type="button"
//                 className="w-full mt-2 bg-[#1061ff] text-white rounded-md px-4 py-2 font-semibold hover:bg-[#0052cc] transition flex items-center justify-center"
//                 onClick={() => setShowSearchModal(true)}
//               >
//                 <span>+ Buscar participantes registrados</span>
//               </button>
//             </label>

//             {/* Lista de participantes agregados */}
//             <div>
//               <h4 className="font-medium text-[#262626] mb-2">
//                 Participantes confirmados:
//               </h4>
//               {form.participantes.length === 0 ? (
//                 <p className="text-[#4B5563] text-sm">
//                   No hay participantes agregados.
//                 </p>
//               ) : (
//                 <ul className="space-y-2">
//                   {form.participantes.map((p) => (
//                     <li
//                       key={p.id}
//                       className="flex items-center gap-3 bg-[#F5F6FA] px-4 py-2 rounded-md"
//                     >
//                       <div>
//                         <p className="font-medium">{p.nombre}</p>
//                         <p className="text-xs text-[#4B5563]">{p.cargo}</p>
//                       </div>
//                       <button
//                         type="button"
//                         className="ml-auto text-[#d14343] hover:underline text-xs"
//                         onClick={() => removeParticipante(p.id)}
//                       >
//                         Quitar
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         );
//       case "calendario":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <label className="flex flex-col font-medium text-[#262626]">
//               Fecha de la reunión
//               <input
//                 type="date"
//                 name="fecha"
//                 value={form.fecha}
//                 onChange={handleChange}
//                 className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
//                 required
//               />
//             </label>
//             <label className="flex flex-col font-medium text-[#262626]">
//               Hora de inicio
//               <input
//                 type="time"
//                 name="hora_inicio"
//                 value={form.hora_inicio}
//                 onChange={handleChange}
//                 className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
//                 required
//               />
//             </label>
//             <label className="flex flex-col font-medium text-[#262626]">
//               Hora de finalización
//               <input
//                 type="time"
//                 name="hora_fin"
//                 value={form.hora_fin}
//                 onChange={handleChange}
//                 className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
//                 required
//               />
//             </label>
//           </div>
//         );
//       case "objetivos":
//         return (
//           <label className="flex flex-col font-medium text-[#262626]">
//             Objetivos de la reunión
//             <textarea
//               ref={(el) => (textareaRefs.current["objetivos"] = el)}
//               name="objetivos"
//               value={form.objetivos}
//               onChange={handleChange}
//               className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
//               placeholder="Describe los objetivos principales..."
//               style={{ minHeight: "100px", maxHeight: "300px" }}
//               required
//             />
//           </label>
//         );
//       case "compromisos":
//         return (
//           <label className="flex flex-col font-medium text-[#262626]">
//             Compromisos / tareas
//             <textarea
//               ref={(el) => (textareaRefs.current["compromisos"] = el)}
//               name="compromisos"
//               value={form.compromisos}
//               onChange={handleChange}
//               className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
//               placeholder="Lista de compromisos y responsables..."
//               style={{ minHeight: "100px", maxHeight: "300px" }}
//               required
//             />
//           </label>
//         );
//       case "minuta":
//         return (
//           <label className="flex flex-col font-medium text-[#262626]">
//             Minuta de la reunión
//             <textarea
//               ref={(el) => (textareaRefs.current["minuta"] = el)}
//               name="minuta"
//               value={form.minuta}
//               onChange={handleChange}
//               className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
//               placeholder="Aquí va el resumen detallado de la reunión..."
//               style={{ minHeight: "150px", maxHeight: "400px" }}
//               required
//             />
//           </label>
//         );
//       case "conclusiones":
//         return (
//           <label className="flex flex-col font-medium text-[#262626]">
//             Conclusiones
//             <textarea
//               ref={(el) => (textareaRefs.current["conclusiones"] = el)}
//               name="conclusiones"
//               value={form.conclusiones}
//               onChange={handleChange}
//               className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
//               placeholder="Resumen de conclusiones o acuerdos generales..."
//               style={{ minHeight: "100px", maxHeight: "300px" }}
//               required
//             />
//           </label>
//         );
//       case "notas":
//         return (
//           <label className="flex flex-col font-medium text-[#262626]">
//             Notas adicionales
//             <textarea
//               ref={(el) => (textareaRefs.current["notas"] = el)}
//               name="notas"
//               value={form.notas}
//               onChange={handleChange}
//               className="mt-2 border border-[#D6E4FF] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1061ff] overflow-y-auto"
//               placeholder="Observaciones, notas o temas varios..."
//               style={{ minHeight: "80px", maxHeight: "250px" }}
//             />
//           </label>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <section className="w-full max-w-4xl mx-auto min-h-[85vh] bg-white rounded-2xl shadow-md p-4 md:p-8 mt-8 flex flex-col">
//       <h2 className="text-2xl font-bold text-[#1061ff] mb-6 text-center">
//         Nueva Acta de Reunión
//       </h2>

//       {/* Navegación de pestañas */}
//       <nav className="flex overflow-x-auto gap-2 mb-8 border-b">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             className={`
//               px-4 py-2 rounded-t-md font-semibold whitespace-nowrap
//               ${
//                 activeTab === tab.key
//                   ? "bg-[#E9F0FB] text-[#1061ff] border-b-2 border-[#1061ff]"
//                   : "bg-[#F5F6FA] text-[#4B5563] hover:bg-[#e6ecf6]"
//               }
//               transition
//             `}
//             onClick={() => setActiveTab(tab.key)}
//             type="button"
//           >
//             {tab.label}
//           </button>
//         ))}
//       </nav>

//       {/* Contenido de la pestaña activa */}
//       <div className="flex-1 mb-20">{renderTab()}</div>

//       {/* Barra inferior de acciones */}
//       <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 mt-4">
//         <div className="max-w-4xl mx-auto flex justify-end gap-4 px-4 md:px-8">
//           <button
//             onClick={handleCancelar}
//             className="bg-[#F5F6FA] text-[#d14343] border border-[#d14343] rounded-md px-6 py-2 font-semibold hover:bg-[#ffe4e6] transition"
//           >
//             Descartar
//           </button>
//           <button
//             onClick={handleGuardar}
//             className="bg-[#1061ff] text-white rounded-md px-8 py-2 font-semibold hover:bg-[#0052cc] transition"
//           >
//             Guardar acta
//           </button>
//         </div>
//       </div>

//       {/* Modal de búsqueda de participantes */}
//       {showSearchModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#1061ff]">
//                 Buscar Participantes
//               </h3>
//               <button
//                 onClick={() => setShowSearchModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Buscar por nombre, cargo o email..."
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1061ff]"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Lista de resultados */}
//             <div className="overflow-y-auto flex-1">
//               {filteredPeople.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">
//                   No se encontraron resultados
//                 </p>
//               ) : (
//                 <ul className="divide-y">
//                   {filteredPeople.map((person) => (
//                     <li key={person.id} className="py-3">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-medium">{person.nombre}</h4>
//                           <p className="text-sm text-gray-600">
//                             {person.cargo}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {person.email}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleSelectPerson(person)}
//                           disabled={form.participantes.some(
//                             (p) => p.id === person.id
//                           )}
//                           className={`px-3 py-1 rounded-md text-sm ${
//                             form.participantes.some((p) => p.id === person.id)
//                               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                               : "bg-[#1061ff] text-white hover:bg-[#0052cc]"
//                           }`}
//                         >
//                           {form.participantes.some((p) => p.id === person.id)
//                             ? "Agregado"
//                             : "Agregar"}
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowSearchModal(false)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//               >
//                 Cerrar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
