export const environment = {
    production: false,
    // Development environment - use localhost API
    apiUrl: "http://localhost:8080/api",
    socketApiUrl: "http://localhost:8080/",

    // Uncomment these lines to use the production API in development
    // apiUrl: "https://qrsaybackend-36c9.onrender.com/api",
    // socketApiUrl: "https://qrsaybackend-36c9.onrender.com/",

    // API server health check endpoint
    healthEndpoint: "/health",

    // Debug settings
    debug: {
        // Enable detailed logging for API requests
        logApiRequests: true,
        // Enable detailed logging for CORS issues
        logCorsIssues: true,
    }
};
