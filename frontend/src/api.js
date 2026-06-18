import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const goalsService = {
  getAll: async () => {
    const response = await api.get('/meta');
    return response.data;
  },
  create: async (goalData) => {
    const response = await api.post('/meta', goalData);
    return response.data;
  },
  update: async (id, goalData) => {
    const response = await api.put(`/meta/${id}`, goalData);
    return response.data;
  },
  updateEstatus: async (id, estatus, porcentaje) => {
    const response = await api.put(`/meta/estatus/${id}`, {
      Estatus: estatus,
      Porcentaje_Actual: porcentaje
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/meta/${id}`);
    return response.data;
  }
};

export default api;
