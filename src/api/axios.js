import axios from "axios";

// Utilizamos la URL base definida en el archivo .env
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,  // VITE_API_URL se define en el archivo .env
  withCredentials: true,  // Esto permite que las cookies se envíen en las solicitudes
});

export default instance;
