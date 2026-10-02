const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? "https://cafe1-zpfs.onrender.com"
        : "http://localhost:5000");

export { API_BASE_URL };
