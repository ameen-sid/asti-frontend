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

export async function createDepartment(deptName: string) {
    const res = await axios.post(
        `${API_BASE_URL}/v1/departments`,
        { name: deptName },
        getHeaders()
    );
    return res;
}

export async function getDepartment(sortOrder: 'asc' | 'desc' = 'asc', sortBy: 'id' | 'name' | 'createdAt' = 'id') {
    const res = await axios.get(
        `${API_BASE_URL}/v1/departments?sortBy=${sortBy}&sortOrder=${sortOrder}`,
        getHeaders()
    );
    return res;
}

export async function updateDepartment(id: string | number, deptName: string) {
    const res = await axios.patch(
        `${API_BASE_URL}/v1/departments/${id}`,
        { name: deptName },
        getHeaders()
    );
    return res;
}

export async function deleteDepartment(id: string | number) {
    const res = await axios.delete(
        `${API_BASE_URL}/v1/departments/${id}`,
        getHeaders()
    );
    return res;
}
