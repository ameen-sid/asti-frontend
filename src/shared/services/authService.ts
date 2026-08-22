import axios from "axios";

export async function loginAdmin(email: string, password: string) {
    const res = await axios.post('http://localhost:3001/api/v1/auth/login', { email, password });
    // Store token if returned in response
    const token = res.data?.data?.token || res.data?.token;
    if (token) {
        sessionStorage.setItem("token", token);
    }

    return res.data;
}
