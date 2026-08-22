import axios from "axios";

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export async function getSubDepartments(sortOrder: 'asc' | 'desc' = 'asc', sortBy: string = 'id') {
    const res = await axios.get(
        `http://localhost:3001/api/v1/sub-departments?sortOrder=${sortOrder}&sortBy=${sortBy}`,
        getHeaders()
    );
    return res;
}

export async function createSubDepartment(name: string, departmentId: number | string) {
    const res = await axios.post(
        'http://localhost:3001/api/v1/sub-departments',
        { name, departmentId: Number(departmentId) },
        getHeaders()
    );
    return res;
}

export async function updateSubDepartment(id: string | number, name: string) {
    const res = await axios.patch(
        `http://localhost:3001/api/v1/sub-departments/${id}`,
        { name },
        getHeaders()
    );
    return res;
}

export async function deleteSubDepartment(id: string | number) {
    const res = await axios.delete(
        `http://localhost:3001/api/v1/sub-departments/${id}`,
        getHeaders()
    );
    return res;
}
