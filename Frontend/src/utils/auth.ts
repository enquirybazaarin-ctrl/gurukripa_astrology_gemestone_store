// Note: These utility functions are deprecated in favor of Redux state
// Keep for backward compatibility but redirect to Redux

import { store } from '../store';

export const isLoggedIn = (): boolean => {
    return store.getState().auth.isAuthenticated;
};

export const getToken = (): string | null => {
    // Tokens are now in httpOnly cookies, not accessible from JavaScript
    // Return null to indicate tokens are managed by cookies
    return null;
};

export const logout = (): void => {
    // Logout is now handled by Redux action and API call
    // This function is deprecated
    console.warn('auth.logout() is deprecated. Use Redux logout action instead.');
};
