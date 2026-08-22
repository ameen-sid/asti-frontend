import axios from "axios";

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export async function getLines(sortOrder: 'asc' | 'desc' = 'asc', sortBy: string = 'id') {
    const res = await axios.get(
        `http://localhost:3001/api/v1/lines`,
        getHeaders()
    );
    return res;
}

export async function createLine(
    name: string,
    departmentId: number | string,
    subDepartmentId: number | string,
    sectionId: number | string
) {
    const res = await axios.post(
        'http://localhost:3001/api/v1/lines',
        {
            name,
            departmentId: Number(departmentId),
            subDepartmentId: Number(subDepartmentId),
            sectionId: Number(sectionId),
        },
        getHeaders()
    );
    return res;
}

export async function updateLine(id: string | number, name: string) {
    const res = await axios.patch(
        `http://localhost:3001/api/v1/lines/${id}`,
        { name },
        getHeaders()
    );
    return res;
}

export async function deleteLine(id: string | number) {
    const res = await axios.delete(
        `http://localhost:3001/api/v1/lines/${id}`,
        getHeaders()
    );
    return res;
}
