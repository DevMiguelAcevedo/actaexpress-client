import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../contexts/authUserContext";
import { useActas } from "../../contexts/actasContext";

// Estados posibles para las actas y sus estilos
const estadoActa = {
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-400",
  ejecucion: "bg-blue-100 text-blue-700 border-blue-400",
  firma: "bg-purple-100 text-purple-700 border-purple-400",
  firmada: "bg-green-100 text-green-700 border-green-400",
};

export default function DashboardAdmin() {
  const { actas, loading, error, getActas } = useActas();
  const { authUser, token } = useAuthUser();
  useEffect(() => {
    if (token) {
      getActas(); // No necesitamos pasar el token, ya lo maneja el contexto
    }
  }, [token]); // Se ejecuta cuando cambia el token

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="text-[#1061ff] text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }
  return (
    <section className="w-full min-h-[85vh] flex flex-col bg-white rounded-2xl shadow-md p-4 md:p-8 mt-8">
      {/* Panel superior (header de dashboard) */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1061ff] mb-1">
            Panel de Administración
          </h2>
          <p className="text-[#4B5563] text-sm">
            Gestiona todas tus actas y revisa su estado.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Botón para crear nueva acta */}
          <Link
            to="/newacta"
            className="bg-[#1061ff] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#0052cc] transition"
          >
            + Nueva Acta
          </Link>
          {/* Casilla de perfil */}
          <div className="flex items-center gap-3 bg-[#F5F6FA] px-3 py-2 rounded-xl shadow-sm">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                authUser?.name || "Usuario"
              )}&background=1061ff&color=fff`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-[#1061ff] object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[#262626] font-semibold text-sm">
                {authUser?.name || "Usuario"}
              </span>
              <span className="text-xs text-[#4B5563]">
                {Array.isArray(authUser?.roles)
                  ? authUser.roles.join(", ")
                  : authUser?.roles || "Rol"}
              </span>
            </div>
            <Link
              to="/perfil"
              className="ml-2 px-3 py-1 bg-[#1061ff] text-white rounded-md text-xs hover:bg-[#0052cc] transition"
              title="Ver perfil"
            >
              Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Lista de actas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participantes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No hay actas registradas.
                </td>
              </tr>
            )}
            {actas.map((acta) => (
              <tr key={acta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{acta.titulo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{acta.fecha}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">
                    {acta.hora_inicio} - {acta.hora_fin}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{acta.responsable || "-"}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-500">
                    {acta.asistentes?.length || 0} participantes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      estadoActa[acta.estado?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700 border-gray-400"
                    }`}
                  >
                    {acta.estado || "pendiente"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-4">
                    <Link
                      to={`/actas/${acta.id}`}
                      className="text-[#1061ff] hover:text-[#0052cc] hover:underline"
                      title="Ver detalles"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/actas/${acta.id}/edit`}
                      className="text-gray-600 hover:text-[#1061ff] hover:underline"
                      title="Editar acta"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
// import { useState } from "react";
// import { Link } from "react-router-dom"; // Si usas rutas para crear/editar/ver

// // Estados posibles para las actas y sus estilos
// const estadoActa = {
//   pendiente: "bg-yellow-100 text-yellow-700 border-yellow-400",
//   ejecucion: "bg-blue-100 text-blue-700 border-blue-400",
//   firma: "bg-purple-100 text-purple-700 border-purple-400",
//   firmada: "bg-green-100 text-green-700 border-green-400",
// };

// // Datos mock de actas
// const actasEjemplo = [
//   {
//     id: 1,
//     titulo: "Acta Junta Directiva Julio",
//     fecha: "2024-07-18",
//     hora_inicio: "10:00",
//     hora_fin: "12:30",
//     estado: "pendiente",
//     responsable: "Claudia Ruiz",
//   },
//   {
//     id: 2,
//     titulo: "Acta Comité Proyectos",
//     fecha: "2024-07-15",
//     hora_inicio: "09:00",
//     hora_fin: "11:00",
//     estado: "firma",
//     responsable: "Carlos Vega",
//   },
//   {
//     id: 3,
//     titulo: "Acta Asamblea General",
//     fecha: "2024-07-10",
//     hora_inicio: "15:00",
//     hora_fin: "17:00",
//     estado: "firmada",
//     responsable: "Lucía Gómez",
//   },
//   {
//     id: 4,
//     titulo: "Acta Comité Evaluación",
//     fecha: "2024-07-05",
//     hora_inicio: "08:30",
//     hora_fin: "10:00",
//     estado: "ejecucion",
//     responsable: "Mariana Pérez",
//   },
// ];

// export default function DashboardAdmin() {
//   const [actas, setActas] = useState(actasEjemplo);

//   return (
//     <section className="w-full min-h-[85vh] flex flex-col bg-white rounded-2xl shadow-md p-4 md:p-8 mt-8">
//       {/* Panel superior (header de dashboard) */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-[#1061ff] mb-1">
//             Panel de Administración
//           </h2>
//           <p className="text-[#4B5563] text-sm">
//             Gestiona todas tus actas y revisa su estado.
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           {/* Botón para crear nueva acta */}
//           <Link
//             to="/newacta"
//             className="bg-[#1061ff] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#0052cc] transition"
//           >
//             + Nueva Acta
//           </Link>
//           {/* Casilla de perfil */}
//           <div className="flex items-center gap-3 bg-[#F5F6FA] px-3 py-2 rounded-xl shadow-sm">
//             <img
//               src="https://ui-avatars.com/api/?name=Admin+User&background=1061ff&color=fff"
//               alt="Avatar"
//               className="w-10 h-10 rounded-full border-2 border-[#1061ff] object-cover"
//             />
//             <div className="flex flex-col">
//               <span className="text-[#262626] font-semibold text-sm">
//                 Admin User
//               </span>
//               <span className="text-xs text-[#4B5563]">Administrador</span>
//             </div>
//             <button
//               className="ml-2 px-3 py-1 bg-[#1061ff] text-white rounded-md text-xs hover:bg-[#0052cc] transition"
//               title="Ver perfil"
//             >
//               Perfil
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Lista de actas */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-xl border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Título
//               </th>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Fecha
//               </th>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Hora inicio
//               </th>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Hora fin
//               </th>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Responsable
//               </th>
//               <th className="px-4 py-2 text-left text-[#262626] font-medium">
//                 Estado
//               </th>
//               <th className="px-4 py-2"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {actas.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="px-4 py-6 text-center text-[#4B5563]"
//                 >
//                   No hay actas registradas.
//                 </td>
//               </tr>
//             )}
//             {actas.map((acta) => (
//               <tr key={acta.id} className="border-t">
//                 <td className="px-4 py-3">{acta.titulo}</td>
//                 <td className="px-4 py-3">{acta.fecha}</td>
//                 <td className="px-4 py-3">{acta.hora_inicio}</td>
//                 <td className="px-4 py-3">{acta.hora_fin}</td>
//                 <td className="px-4 py-3">{acta.responsable}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`
//                     px-3 py-1 rounded-full border font-semibold text-xs capitalize
//                     ${
//                       acta.estado === "pendiente"
//                         ? "bg-yellow-100 text-yellow-700 border-yellow-400"
//                         : acta.estado === "firma"
//                         ? "bg-purple-100 text-purple-700 border-purple-400"
//                         : acta.estado === "firmada"
//                         ? "bg-green-100 text-green-700 border-green-400"
//                         : "bg-blue-100 text-blue-700 border-blue-400"
//                     }
//                   `}
//                   >
//                     {acta.estado}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 flex gap-2">
//                   <Link
//                     to={`/actas/${acta.id}`}
//                     className="text-[#1061ff] hover:underline text-sm"
//                     title="Ver detalles"
//                   >
//                     Ver detalle
//                   </Link>
//                   <Link
//                     to={`/actas/${acta.id}/edit`}
//                     className="text-[#4B5563] hover:text-[#1061ff] hover:underline text-sm"
//                     title="Editar acta"
//                   >
//                     Editar
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }
