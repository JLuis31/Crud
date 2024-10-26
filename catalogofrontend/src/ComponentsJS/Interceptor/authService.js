import axios from "axios";

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://localhost:7211/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para verificar si el Access Token ha expirado
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000; // Convertir a milisegundos
  return Date.now() >= exp; // Comprobar si ha expirado
};

// Interceptor para manejar el Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar la renovación del token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verificar si el error es 401 y si no se ha reintentado ya
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No hay Refresh Token disponible.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirigir al login
        return Promise.reject(error);
      }

      // Verifica si el Access Token ha expirado
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        console.log(
          "Access Token ha expirado, intentando renovarlo con el Refresh Token:",
          refreshToken
        );
        try {
          const response = await axios.post(
            "https://localhost:7211/api/auth/refresh-token",
            { refreshToken }
          );

          console.log(
            "Nuevo Access Token recibido:",
            response.data.accessToken
          );

          // Guardar el nuevo Access Token
          localStorage.setItem("token", response.data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest); // Reintentar la solicitud original
        } catch (refreshError) {
          console.error("Error al renovar el token:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Redirigir al login
        }
      } else {
        // Si el Access Token aún es válido, simplemente reintenta la solicitud original
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
