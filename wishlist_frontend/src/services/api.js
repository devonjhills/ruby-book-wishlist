import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Rails activity tracking - will be injected by components
let railsActivityTracker = null;

export const setRailsActivityTracker = (tracker) => {
  railsActivityTracker = tracker;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", { user: userData }),
  login: (credentials) => api.post("/auth/login", credentials),
  me: () => api.get("/auth/me"),
};

export const itemsAPI = {
  getItems: (params = {}) => {
    railsActivityTracker?.addActivity(
      "load_dashboard",
      "Loading user items with filters and sorting",
    );
    return api.get("/items", { params });
  },
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => {
    railsActivityTracker?.addActivity(
      "create_book",
      `Creating new book: ${itemData.title}`,
    );
    return api.post("/items", { item: itemData });
  },
  updateItem: (id, itemData) => {
    railsActivityTracker?.addActivity(
      "update_book",
      `Updating book with ID: ${id}`,
    );
    return api.put(`/items/${id}`, { item: itemData });
  },
  deleteItem: (id) => api.delete(`/items/${id}`),
};

export const searchAPI = {
  searchBooks: (query) => {
    railsActivityTracker?.addActivity(
      "search_books",
      `Searching for books: "${query}"`,
    );
    return api.get("/search/books", { params: { q: query } });
  },
};

export default api;
