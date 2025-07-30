import { createContext, useState, useContext, useEffect } from "react";
import {
  getActasRequest,
  getActaRequest,
  createNewActaRequest,
  deleteActaRequest,
  updateActaRequest
} from "../api/actasApi.js";
import { getUsersRequest } from "../api/authUserApi.js"; // Nueva importación

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
  const [registeredUsers, setRegisteredUsers] = useState([]); // Lista de usuarios reales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios registrados al iniciar
  const loadRegisteredUsers = async () => {
    try {
      const response = await getUsersRequest();
      setRegisteredUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar usuarios registrados");
    }
  };

  // Cargar actas y usuarios al montar el provider
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([getActas(), loadRegisteredUsers()]);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const getActas = async () => {
    try {
      const response = await getActasRequest();
      setActas(response.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar actas");
    }
  };

  const createNewActa = async (actaData) => {
    try {
      setLoading(true);
      const response = await createNewActaRequest(actaData);
      setActas([...actas, response.data]);
      return response.data; // Retorna la acta creada
    } catch (error) {
      console.error(error);
      setError("Error al crear acta");
      throw error; // Permite manejar el error en el componente
    } finally {
      setLoading(false);
    }
  };

  const updateActa = async (id, actaData) => {
    try {
      setLoading(true);
      const response = await updateActaRequest(id, actaData);
      setActas(actas.map(acta => acta._id === id ? response.data : acta));
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
      setActas(actas.filter(acta => acta._id !== id));
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
        getActa,
        createNewActa,
        updateActa,
        deleteActa,
        loadRegisteredUsers
      }}
    >
      {children}
    </ActasContext.Provider>
  );
};