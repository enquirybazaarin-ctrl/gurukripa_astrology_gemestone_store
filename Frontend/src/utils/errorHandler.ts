/**
 * Extract user-friendly error message from API error response
 * Priority: userMessage > message > fallback
 */
export const getErrorMessage = (error: any, fallback: string = 'Something went wrong'): string => {
    // Check for user-friendly message from backend
    if (error.response?.data?.error?.userMessage) {
        return error.response.data.error.userMessage;
    }

    // Fallback to technical message
    if (error.response?.data?.error?.message) {
        return error.response.data.error.message;
    }

    // Legacy format support
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Network or other errors
    if (error.message) {
        return error.message;
    }

    return fallback;
};
