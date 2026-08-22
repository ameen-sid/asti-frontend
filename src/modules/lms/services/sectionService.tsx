import axios from "axios";

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export async function getSections(sortOrder: 'asc' | 'desc' = 'asc', sortBy: string = 'id') {
    const res = await axios.get(
        `http://localhost:3001/api/v1/sections`,
        getHeaders()
    );
    return res;
}

export async function createSection(name: string, departmentId: number | string, subDepartmentId: number | string) {
    const res = await axios.post(
        'http://localhost:3001/api/v1/sections',
        {
            name,
            departmentId: Number(departmentId),
            subDepartmentId: Number(subDepartmentId),
        },
        getHeaders()
    );
    return res;
}

export async function updateSection(id: string | number, name: string) {
    const res = await axios.patch(
        `http://localhost:3001/api/v1/sections/${id}`,
        { name },
        getHeaders()
    );
    return res;
}

export async function deleteSection(id: string | number) {
    const res = await axios.delete(
        `http://localhost:3001/api/v1/sections/${id}`,
        getHeaders()
    );
    return res;
}
