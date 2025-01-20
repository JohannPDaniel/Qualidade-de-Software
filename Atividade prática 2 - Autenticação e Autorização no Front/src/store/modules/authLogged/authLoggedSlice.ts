import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResponseAPI } from '../../../configs/services/api.service';
import { loginService } from '../../../configs/services/auth.service';
import { LoginRequest } from '../../../utils/types/auth';
import { showAlert } from '../Alert/Alert';

export const loginAsyncThunk = createAsyncThunk(
	'authLogged/loginAsyncThunk',
	async (data: LoginRequest, { dispatch }) => {
		const { email, password, remember } = data;
		const response = await loginService({ email, password });

		if (!response.success) {
			dispatch(
				showAlert({
					type: 'error',
					message: response.message,
				})
			);
			return response;
		}

		const responseWithRemember = {
			...response,
			data: {
				...response.data,
				student: {
					id: response.data.student?.id || '',
					name: response.data.student?.name || '',
					email: response.data.student?.email || '',
					remember: remember || false,
					errors: '',
				},
			},
		};

		dispatch(
			showAlert({
				type: 'success',
				message: response.message,
			})
		);

		return responseWithRemember;
	}
);

interface InitialState {
	success: boolean;
	message: string;
	token: string;
	student: {
		id: string;
		name: string;
		email: string;
		remember: boolean;
		errors: string;
	};
}

const initialState: InitialState = {
	success: false,
	message: '',
	token: '',
	student: {
		id: '',
		name: '',
		email: '',
		remember: false,
		errors: '',
	},
};

const authLoggedSlice = createSlice({
	name: 'authLogged',
	initialState: initialState,
	reducers: {
		// login(state, action: PayloadAction<LoginRequest>) {
		// 	const { email, password, remember } = action.payload;
		// 	const usersFound = users.find(
		// 		(user) => user.email === email && user.senha === password
		// 	);
		// 	if (!usersFound) {
		// 		state.errors = 'invalid email or password !!';
		// 		return state;
		// 	}

		// 	state.id = usersFound.id;
		// 	state.name = usersFound.name;
		// 	state.email = usersFound.email;
		// 	state.remember = remember;
		// 	state.errors = '';
		// 	return state;
		// },

		logout() {
			return initialState;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(loginAsyncThunk.pending, () => {
				console.log(
					'Estou aguardando em estado de pending na função loginAsyncThunk '
				);
			})
			.addCase(
				loginAsyncThunk.fulfilled,
				(state, action: PayloadAction<ResponseAPI>) => {
					console.log('Payload recebido:', action.payload);

					state.success = action.payload.success;
					state.message = action.payload.message;

					if (action.payload.success) {
						const { student, token } = action.payload.data;
						state.token = token;
						state.student = {
							id: student.id || '',
							name: student.name || '',
							email: student.email || '',
							remember: student.remember || false,
							errors: '',
						};
					}
				}
			)

			.addCase(loginAsyncThunk.rejected, (state, action) => {
				console.log(
					'Estou aguardando em estado de rejected na função loginAsyncThunk '
				);
				state.success = false;
				state.message = action.payload as string;
			});
	},
});

export const { logout } = authLoggedSlice.actions;
export const authLoggedReducer = authLoggedSlice.reducer;
