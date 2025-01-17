import { createSlice } from '@reduxjs/toolkit';
import { Assessment } from '../../../utils/types/assessment';
import {
	createAssessmentAsyncThunk,
	deleteAssessmentAsyncThunk,
	findAllAssessmentsAsyncThunk,
	updateAssessmentAsyncThunk,
} from './assessment.action';

// Nome
// Valor inicial
// Ações

interface InitialState {
	count: number;
	assessments: Array<Assessment>;
	message: string;
	success: boolean;
	loading: boolean;
}

const initialState: InitialState = {
	assessments: [],
	count: 0,
	loading: false,
	message: '',
	success: false,
};

const assessmentsSlice = createSlice({
	name: 'assessments',
	initialState,
	reducers: {
		createAssessment() {
			// state.errors = '';
			// state.success = false;
			// // criar a nova avaliação
			// const newAssessment: Assessment = {
			// 	id: crypto.randomUUID(),
			// 	title: action.payload.title,
			// 	description: action.payload.description,
			// 	grade: action.payload.grade,
			// 	createdAt: new Date().toDateString(),
			// };
			// // jogar para lista (data)
			// state.data.push(newAssessment);
			// // state.data = [...state.data, newAssessment]
			// state.errors = '';
			// state.success = true;
			// return state;
		},

		updateAssessment() {
			// state.errors = '';
			// state.success = false;
			// const index = state.data.findIndex((ass) => ass.id === action.payload.id);
			// if (index === -1) {
			// 	state.errors = 'Assessment not found!';
			// 	return state;
			// }
			// // state.data[index].title = title || state.data[index].title;
			// // state.data[index].description =
			// //   description || state.data[index].description;
			// // state.data[index].grade = grade || state.data[index].grade;
			// state.data[index] = {
			// 	...state.data[index],
			// 	...action.payload,
			// };
			// state.errors = '';
			// state.success = true;
			// return state;
		},
		deleteAssessment() {
			// // Acha index => splice
			// // filter !=
			// state.errors = '';
			// state.success = false;
			// const index = state.data.findIndex((ass) => ass.id === action.payload); // "120asmdioasmdias1-023S"
			// if (index === -1) {
			// 	state.errors = 'Not found';
			// 	state.success = false;
			// 	return state;
			// }
			// state.data.splice(index, 1);
			// state.errors = '';
			// state.success = true;
			// return state;
		},
		resetSuccess(state) {
			state.success = false;
		},
	},

	extraReducers(builder) {
		builder
			.addCase(createAssessmentAsyncThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(createAssessmentAsyncThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.success = action.payload.success;
				state.message = action.payload.message;
				if (action.payload.success && action.payload.data) {
					state.assessments.push(action.payload.data);
				}
			})
			.addCase(createAssessmentAsyncThunk.rejected, (state) => {
				state.loading = false;
				state.success = false;
			});

		builder
			.addCase(findAllAssessmentsAsyncThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(findAllAssessmentsAsyncThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.success = action.payload.success;
				state.message = action.payload.message;

				if (action.payload.success) {
					state.assessments = action.payload.data;
					state.count = action.payload.data.count;
				}
			})
			.addCase(findAllAssessmentsAsyncThunk.rejected, (state) => {
				state.loading = false;
				state.success = false;
			});
		builder
			.addCase(updateAssessmentAsyncThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateAssessmentAsyncThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.success = action.payload.success;
				state.message = action.payload.message;

				if (action.payload.success && action.payload.data) {
					const index = state.assessments.findIndex(
						(ass) => ass.id === action.payload.data.id
					);
					if (index !== -1) {
						state.assessments[index] = {
							...state.assessments[index],
							...action.payload.data,
						};
					}
				}
			})
			.addCase(updateAssessmentAsyncThunk.rejected, (state) => {
				state.loading = false;
				state.success = false;
			});
		builder
			.addCase(deleteAssessmentAsyncThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteAssessmentAsyncThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.message = action.payload.message;

				// Remove a avaliação do estado usando o ID retornado
				state.assessments = state.assessments.filter(
					(assessment) => assessment.id !== action.payload.data.id
				);
			})
			.addCase(deleteAssessmentAsyncThunk.rejected, (state, action) => {
				state.loading = false;
				state.success = false;
				state.message = action.error.message || 'Erro ao excluir a avaliação.';
			});
	},
});

// setListAssessments({ ...listAssessments, data: [] });
// setListAssessments({ ...listAssessments, errors: "meu aeurnauin" });

export const {
	createAssessment,
	resetSuccess,
	updateAssessment,
	deleteAssessment,
} = assessmentsSlice.actions;
export const assessmentsReduce = assessmentsSlice.reducer;
