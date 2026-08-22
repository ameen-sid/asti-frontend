import axios from "axios";

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export async function getMachines(sortOrder: 'asc' | 'desc' = 'asc', sortBy: string = 'id') {
    const res = await axios.get(
        `http://localhost:3001/api/v1/machines`,
        getHeaders()
    );
    return res;
}

export async function createMachine(
    name: string,
    departmentId: number | string,
    subDepartmentId: number | string,
    sectionId: number | string,
    lineId: number | string
) {
    const res = await axios.post(
        'http://localhost:3001/api/v1/machines',
        {
            name,
            departmentId: Number(departmentId),
            subDepartmentId: Number(subDepartmentId),
            sectionId: Number(sectionId),
            lineId: Number(lineId),
        },
        getHeaders()
    );
    return res;
}

export async function updateMachine(id: string | number, name: string) {
    const res = await axios.patch(
        `http://localhost:3001/api/v1/machines/${id}`,
        { name },
        getHeaders()
    );
    return res;
}

export async function deleteMachine(id: string | number) {
    const res = await axios.delete(
        `http://localhost:3001/api/v1/machines/${id}`,
        getHeaders()
    );
    return res;
}
