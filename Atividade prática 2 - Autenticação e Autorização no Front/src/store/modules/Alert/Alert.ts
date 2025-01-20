import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
	open: boolean;
	type: 'success' | 'error' | 'warning';
	message: string;
}

const initialState: Alert = {
	open: false,
	type: 'success',
	message: '',
};

const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		showAlert(state, action: PayloadAction<Omit<Alert, 'open'>>) {
			state.open = true;
			state.type = action.payload.type;
			state.message = action.payload.message;
		},
		hiddenAlert(state) {
			state.open = false;
		},
	},
});

export const { showAlert, hiddenAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;
