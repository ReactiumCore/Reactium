let apiConfig = {};

if ( typeof window !== 'undefined' ) {
    apiConfig = {
        parseAppId: window.parseAppId,
        restAPI: window.restAPI,
    };
} else {
    apiConfig = {
        parseAppId: process.env.PARSE_APP_ID || "Actinium",
        restAPI: process.env.REST_API_URL || "http://localhost:9000/api",
    };
}

export default apiConfig;
