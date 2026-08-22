import axios from "axios";

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
        'http://localhost:3001/api/v1/departments',
        { name: deptName },
        getHeaders()
    );
    return res;
}

export async function getDepartment(sortOrder: 'asc' | 'desc' = 'asc', sortBy: 'id' | 'name' | 'createdAt' = 'id') {
    const res = await axios.get(
        `http://localhost:3001/api/v1/departments`,
        getHeaders()
    );
    return res;
}

export async function updateDepartment(id: string | number, deptName: string) {
    const res = await axios.patch(
        `http://localhost:3001/api/v1/departments/${id}`,
        { name: deptName },
        getHeaders()
    );
    return res;
}

export async function deleteDepartment(id: string | number) {
    const res = await axios.delete(
        `http://localhost:3001/api/v1/departments/${id}`,
        getHeaders()
    );
    return res;
}
