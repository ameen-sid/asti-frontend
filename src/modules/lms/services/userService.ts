import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export async function createUser(payload: UserPayload) {
  const res = await axios.post(
    `${API_BASE_URL}/v1/users`,
    payload,
    getHeaders()
  );
  return res;
}

export async function getUser(
  sortOrder: "asc" | "desc" = "asc",
  sortBy: "id" | "name" | "createdAt" = "id"
) {
  const res = await axios.get(
    `${API_BASE_URL}/v1/users?sortBy=${sortBy}&sortOrder=${sortOrder}`,
    getHeaders()
  );
  return res;
}

export async function updateUser(
  id: string | number,
  payload: Partial<UserPayload>
) {
  const res = await axios.patch(
    `${API_BASE_URL}/v1/users/${id}`,
    payload,
    getHeaders()
  );
  return res;
}

export async function deleteUser(id: string | number) {
  const res = await axios.delete(
    `${API_BASE_URL}/v1/users/${id}`,
    getHeaders()
  );
  return res;
}
