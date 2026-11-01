import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isLoginModalOpen: boolean;
    loginRedirectUrl: string | null;
    pendingAction: 'CART' | 'WISHLIST' | 'CHECKOUT' | null;
    pendingActionData: any | null;
    initialMode: 'LOGIN' | 'IDENTIFY';
}

const initialState: UiState = {
    isLoginModalOpen: false,
    loginRedirectUrl: null,
    pendingAction: null,
    pendingActionData: null,
    initialMode: 'LOGIN'
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openLoginModal: (state, action: PayloadAction<{
            redirectUrl?: string;
            pendingAction?: 'CART' | 'WISHLIST' | 'CHECKOUT';
            pendingActionData?: any;
            initialMode?: 'LOGIN' | 'IDENTIFY'
        } | undefined>) => {
            state.isLoginModalOpen = true;
            if (action.payload) {
                state.loginRedirectUrl = action.payload.redirectUrl || null;
                state.pendingAction = action.payload.pendingAction || null;
                state.pendingActionData = action.payload.pendingActionData || null;
                state.initialMode = action.payload.initialMode || (action.payload.pendingAction ? 'IDENTIFY' : 'LOGIN');
            } else {
                state.initialMode = 'LOGIN';
            }
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
            // We don't clear pending actions immediately to allow processing after successful login
        },
        clearPendingActions: (state) => {
            state.loginRedirectUrl = null;
            state.pendingAction = null;
            state.pendingActionData = null;
        }
    },
});

export const { openLoginModal, closeLoginModal, clearPendingActions } = uiSlice.actions;
export default uiSlice.reducer;
