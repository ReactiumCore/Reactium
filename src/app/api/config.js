let apiConfig = {};

// the api from the browser's perspective
if (typeof window !== 'undefined') {
    apiConfig = {
        parseAppId: window.parseAppId,
        restAPI: window.restAPI,
    };
    // the api from the server's perspective
} else {
    apiConfig = {
        parseAppId: process.env.PARSE_APP_ID || 'Actinium',
        restAPI: process.env.REST_API_URL || 'http://demo3914762.mockable.io',
    };
}

export default apiConfig;
