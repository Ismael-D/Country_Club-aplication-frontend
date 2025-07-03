import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'https://country-club-aplication-backend.onrender.com/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getProfile: () => api.get('/users/profile'),
};

// Servicios de usuarios
export const userService = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (userId, role) => api.put(`/users/update-role`, { userId, role }),
};

// Servicios de miembros
export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (memberData) => api.post('/members', memberData),
  update: (id, memberData) => api.put(`/members/${id}`, memberData),
  delete: (id) => api.delete(`/members/${id}`),
  getActive: () => api.get('/members/active'),
  getByStatus: (status) => api.get(`/members/status/${status}`),
  search: (query) => api.get(`/members/search?q=${query}`),
};

// Servicios de eventos
export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getUpcoming: () => api.get('/events/upcoming'),
  getByDate: (date) => api.get(`/events/date/${date}`),
};

// Servicios de empleados
export const employeeService = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employeeData) => api.post('/employees', employeeData),
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  delete: (id) => api.delete(`/employees/${id}`),
  getActive: () => api.get('/employees/active'),
  getByDepartment: (department) => api.get(`/employees/department/${department}`),
};

// Servicios de inventario
export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (itemData) => api.post('/inventory', itemData),
  update: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  delete: (id) => api.delete(`/inventory/${id}`),
  getLowStock: () => api.get('/inventory/low-stock'),
  getByCategory: (category) => api.get(`/inventory/category/${category}`),
  updateStock: (id, quantity) => api.put(`/inventory/${id}/stock`, { quantity }),
};

// Servicios de mantenimiento
export const maintenanceService = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  create: (maintenanceData) => api.post('/maintenance', maintenanceData),
  update: (id, maintenanceData) => api.put(`/maintenance/${id}`, maintenanceData),
  delete: (id) => api.delete(`/maintenance/${id}`),
  getPending: () => api.get('/maintenance/pending'),
  getByStatus: (status) => api.get(`/maintenance/status/${status}`),
  assignTo: (id, employeeId) => api.put(`/maintenance/${id}/assign`, { employeeId }),
  updateStatus: (id, status) => api.put(`/maintenance/${id}/status`, { status }),
};

// Servicios de reportes
export const reportService = {
  getMembersReport: (params) => api.post('/reports/members', params),
  getEventsReport: (params) => api.post('/reports/events'),
  getInventoryReport: (params) => api.post('/reports/inventory'),
  getMaintenanceReport: (params) => api.post('/reports/maintenance'),
  getFinancialReport: (params) => api.post('/reports/financial'),
  downloadReport: (reportId) => api.get(`/reports/download/${reportId}`),
};

// Servicios de tipos de evento
export const eventTypeService = {
  getAll: () => api.get('/event-types'),
};

export default api; 