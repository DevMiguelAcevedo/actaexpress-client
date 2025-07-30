import axios from "./axios.js";

export const getUsersRequest = async () => {
  return await axios.get("/users");
};

export const loginUserRequest = async (email, password) => {
  const res = await axios.post("/login", { email, password });
  return res.data; // { message, user, token }
};

export const registerUserRequest = async (data) => {
  const res = await axios.post("/register", data);
  return res.data; // { message, user, token }
};

export const getProfile = async (token) => {
  const res = await axios.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logoutUserRequest = async (token) => {
  const res = await axios.post("/logout", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
