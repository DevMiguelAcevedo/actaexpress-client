import axios from "./axios.js";

export const getActasRequest = () => {
  return axios.get("/actas");
};

export const getActaRequest = (id) => {
  return axios.get(`/acta/${id}`);
};

export const createNewActaRequest = (data) => {
  return axios.post("/newacta", data);
};
