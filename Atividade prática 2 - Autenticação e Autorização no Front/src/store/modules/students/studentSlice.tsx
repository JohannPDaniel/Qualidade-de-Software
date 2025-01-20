import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student, StudentsCreate } from '../../../utils/types/student';
import { createStudents } from '../../../configs/services/student.service';
import { showAlert } from '../Alert/Alert';

interface CreateStudentResponse {
	success: boolean;
	message: string;
	data?: Student;
}

export const studentAsyncThunck = createAsyncThunk<
	CreateStudentResponse, // Tipo de retorno esperado
	StudentsCreate // Tipo dos dados recebidos como argumento
>('students/create', async (data, { dispatch, rejectWithValue }) => {
	const response = await createStudents(data);

	if (!response.success) {
		dispatch(
			showAlert({
				type: 'error',
				message: response.message,
			})
		);
		// Retorna explicitamente o erro com rejectWithValue
		return rejectWithValue(response.message);
	}

	dispatch(
		showAlert({
			type: 'success',
			message: response.message,
		})
	);

	// Retorna a resposta no caso de sucesso
	return response as CreateStudentResponse;
});
interface StudentsState {
	students: Student[];
	loading: boolean;
	error: string | null;
	success: boolean;
	message: string;
}

const initialState: StudentsState = {
	students: [],
	loading: false,
	error: null,
	success: false,
	message: '',
};

const studentsSlice = createSlice({
	name: 'students',
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.error = null;
			state.message = '';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(studentAsyncThunck.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
				state.message = '';
			})
			.addCase(
				studentAsyncThunck.fulfilled,
				(
					state,
					action: PayloadAction<{
						success: boolean;
						message: string;
						data?: Student;
					}>
				) => {
					state.loading = false;
					state.success = action.payload.success;
					state.message = action.payload.message;

					if (action.payload.data) {
						state.students.push(action.payload.data);
					}
				}
			)
			.addCase(studentAsyncThunck.rejected, (state, action) => {
				state.loading = false;
				state.success = false;
				state.error = action.error.message || 'Erro inesperado no cadastro.';
			});
	},
});

export const { clearMessages } = studentsSlice.actions;
export const studentReducer = studentsSlice.reducer;
