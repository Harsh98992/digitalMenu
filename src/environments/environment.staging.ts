export const environment = {
    production: false,
    //   apiUrl: "https://qrsaybackend-gurg.onrender.com/api",
    // socketApiUrl: "https://qrsaybackend-gurg.onrender.com/",
    apiUrl: "https://qrsaybackend-testing-f67e.onrender.com/api",
    socketApiUrl: "https://qrsaybackend-testing-f67e.onrender.com/",

    // API server health check endpoint
    healthEndpoint: "/health",

    // Debug settings
    debug: {
        // Enable detailed logging for API requests
        logApiRequests: true,
        // Enable detailed logging for CORS issues
        logCorsIssues: true,
    },
};
