import { createContext, useState, useContext, useEffect } from "react";
import {
  getActasRequest,
  getActaRequest,
  createNewActaRequest,
  deleteActaRequest,
  updateActaRequest,
} from "../api/actasApi.js";
import { getUsersRequest } from "../api/authUserApi.js"; // Nueva importación
import { useAuthUser } from "./authUserContext"; // Nueva importación

export const ActasContext = createContext();

export const useActas = () => {
  const context = useContext(ActasContext);
  if (!context) {
    throw new Error("useActas must be used within a ActasProvider");
  }
  return context;
};

export const ActasProvider = ({ children }) => {
  const [actas, setActas] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, authUser } = useAuthUser(); // Obtenemos el token del contexto de autenticación

  // Cargar usuarios registrados
  const loadRegisteredUsers = async (token) => {
    try {
      const response = await getUsersRequest(token);
      setRegisteredUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar usuarios registrados");
    }
  };

  // Cargar actas
  const getActas = async () => {
    try {
      setLoading(true);
      const response = await getActasRequest(token);
      setActas(response.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar actas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales cuando hay usuario autenticado
  useEffect(() => {
    if (token) {
      const initializeData = async () => {
        setLoading(true);
        try {
          await Promise.all([getActas(token), loadRegisteredUsers(token)]);
        } finally {
          setLoading(false);
        }
      };
      initializeData();
    }
  }, [token]); // Se ejecuta cuando cambia authUser

  // Modificar las demás funciones para incluir el token
  const createNewActa = async (actaData) => {
    try {
      setLoading(true);
      const response = await createNewActaRequest({
        ...actaData,
        responsable: authUser.id, // Se Agrega el ID del usuario logueado
      });
      setActas([...actas, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error creating acta:", error);
      throw error; // Esto permite manejar el error en el componente
    } finally {
      setLoading(false);
    }
  };

  const updateActa = async (id, actaData) => {
    try {
      setLoading(true);
      const response = await updateActaRequest(id, actaData);
      setActas(actas.map((acta) => (acta.id === id ? response.data : acta)));
      return response.data;
    } catch (error) {
      console.error(error);
      setError("Error al actualizar acta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteActa = async (id) => {
    try {
      setLoading(true);
      await deleteActaRequest(id);
      setActas(actas.filter((acta) => acta.id !== id));
    } catch (error) {
      console.error(error);
      setError("Error al eliminar acta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getActa = async (id) => {
    try {
      setLoading(true);
      const response = await getActaRequest(id);
      return response.data;
    } catch (error) {
      console.error(error);
      setError("Error al obtener acta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActasContext.Provider
      value={{
        actas,
        registeredUsers,
        loading,
        error,
        getActas,
        getActa: (id) => getActaRequest(id, token),
        createNewActa,
        updateActa: (id, actaData) =>
          updateActaRequest(id, actaData,token),
        deleteActa: (id) => deleteActaRequest(id, token),
        loadRegisteredUsers: () => loadRegisteredUsers(token),
      }}
    >
      {children}
    </ActasContext.Provider>
  );
};
