export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getToken = () => {
    return localStorage.getItem('access_token');
};