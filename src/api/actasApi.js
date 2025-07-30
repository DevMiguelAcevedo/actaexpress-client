import axios from "./axios.js";

export const getActasRequest = async () => {
  return await axios.get("/actas");
};

export const getActaRequest = async (id) => {
  return await axios.get(`/actas/${id}`);
};

export const createNewActaRequest = async (acta) => {
  return await axios.post("/actas", acta);
};

export const updateActaRequest = async (id, acta) => {
  return await axios.put(`/actas/${id}`, acta);
};

export const deleteActaRequest = async (id) => {
  return await axios.delete(`/actas/${id}`);
};