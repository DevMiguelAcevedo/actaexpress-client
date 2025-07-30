import { useAuthUser } from "./contexts/authUserContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { token, loading, authUser } = useAuthUser();
  if (loading)
    return <div className="w-full text-center py-16">Cargando...</div>;
  if (!token || !authUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}
