export const BASE_URL = '/api/v1';

// Auth Endpoints
export const authEndpoints = {
	LOGIN_API: BASE_URL + '/auth/login',
	LOGOUT_API: BASE_URL + '/auth/logout',
};

// User Endpoints
export const userEndpoints = {
	GET_USERS_API: BASE_URL + '/users',
	CREATE_USER_API: BASE_URL + '/users',
	GET_USER_BY_ID_API: (id: string | number) => BASE_URL + `/users/${id}`,
	UPDATE_USER_API: (id: string | number) => BASE_URL + `/users/${id}`,
	DELETE_USER_API: (id: string | number) => BASE_URL + `/users/${id}`,
};

// Department Endpoints
export const departmentEndpoints = {
	GET_DEPARTMENTS_API: BASE_URL + '/departments',
	CREATE_DEPARTMENT_API: BASE_URL + '/departments',
	UPDATE_DEPARTMENT_API: (id: string | number) => BASE_URL + `/departments/${id}`,
	DELETE_DEPARTMENT_API: (id: string | number) => BASE_URL + `/departments/${id}`,
};

// Sub-Department Endpoints
export const subDepartmentEndpoints = {
	GET_SUB_DEPARTMENTS_API: BASE_URL + '/sub-departments',
	CREATE_SUB_DEPARTMENT_API: BASE_URL + '/sub-departments',
	UPDATE_SUB_DEPARTMENT_API: (id: string | number) => BASE_URL + `/sub-departments/${id}`,
	DELETE_SUB_DEPARTMENT_API: (id: string | number) => BASE_URL + `/sub-departments/${id}`,
};

// Section Endpoints
export const sectionEndpoints = {
	GET_SECTIONS_API: BASE_URL + '/sections',
	CREATE_SECTION_API: BASE_URL + '/sections',
	UPDATE_SECTION_API: (id: string | number) => BASE_URL + `/sections/${id}`,
	DELETE_SECTION_API: (id: string | number) => BASE_URL + `/sections/${id}`,
};

// Line Endpoints
export const lineEndpoints = {
	GET_LINES_API: BASE_URL + '/lines',
	CREATE_LINE_API: BASE_URL + '/lines',
	UPDATE_LINE_API: (id: string | number) => BASE_URL + `/lines/${id}`,
	DELETE_LINE_API: (id: string | number) => BASE_URL + `/lines/${id}`,
};

// Machine Endpoints
export const machineEndpoints = {
	GET_MACHINES_API: BASE_URL + '/machines',
	CREATE_MACHINE_API: BASE_URL + '/machines',
	UPDATE_MACHINE_API: (id: string | number) => BASE_URL + `/machines/${id}`,
	DELETE_MACHINE_API: (id: string | number) => BASE_URL + `/machines/${id}`,
};

// Requirements Endpoints (Dashboard / Operations)
export const requirementEndpoints = {
	GET_REQUIREMENTS_API: BASE_URL + '/requirements',
	CREATE_REQUIREMENT_API: BASE_URL + '/requirements',
	GET_REQUIREMENT_BY_ID_API: (id: string | number) => BASE_URL + `/requirements/${id}`,
	UPDATE_REQUIREMENT_API: (id: string | number) => BASE_URL + `/requirements/${id}`,
	DELETE_REQUIREMENT_API: (id: string | number) => BASE_URL + `/requirements/${id}`,
};

// Dashboard / Analytics Endpoints
export const dashboardEndpoints = {
	GET_OVERVIEW_METRICS_API: BASE_URL + '/dashboard/overview',
	GET_ATTENDANCE_API: BASE_URL + '/dashboard/attendance',
	GET_REPORTS_API: BASE_URL + '/dashboard/reports',
	GET_CTQ_MONITORING_API: BASE_URL + '/dashboard/ctq-monitoring',
};

// CMS Defect Endpoints
export const cmsEndpoints = {
	GET_DEFECTS_API: '/v1/cms/defects',
	SAVE_DEFECTS_API: '/v1/cms/defects',
};

// System / Health Check Endpoints
export const systemEndpoints = {
	HEALTH_CHECK_API: '/api/health',
};

// Combined API Endpoints Object
export const apiEndpoints = {
	auth: authEndpoints,
	users: userEndpoints,
	departments: departmentEndpoints,
	subDepartments: subDepartmentEndpoints,
	sections: sectionEndpoints,
	lines: lineEndpoints,
	machines: machineEndpoints,
	requirements: requirementEndpoints,
	dashboard: dashboardEndpoints,
	cms: cmsEndpoints,
	system: systemEndpoints,
};

export default apiEndpoints;