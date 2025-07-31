import axios from "./axios.js";

export const getActasRequest = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const res = await axios.get("/actas", config);
  return res;
};

// Las demás funciones también deberían recibir el token
export const getActaRequest = async (id, token) => {
  return await axios.get(`/actas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createNewActaRequest = async (acta) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de incluir el token
    },
  };
  return await axios.post("/actas", acta, config);
};

export const updateActaRequest = async (id, acta, token) => {
  return await axios.put(`/actas/${id}`, acta, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteActaRequest = async (id, token) => {
  return await axios.delete(`/actas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
