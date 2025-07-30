import { createContext, useState, useContext } from "react";
import {
  getActasRequest,
  getActaRequest,
  createNewActaRequest,
} from "../api/actasApi.js";

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

  const getActas = async () => {
    try {
      const response = await getActasRequest();
      setActas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createNewActa = async (acta) => {
    try {
      const response = await createNewActaRequest(acta);
      setActas([...actas, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const getActa = async (id) => {
    try {
      const response = await getActaRequest(id);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ActasContext.Provider value={{ getActas, actas, getActa }}>
      {children}
    </ActasContext.Provider>
  );
};
