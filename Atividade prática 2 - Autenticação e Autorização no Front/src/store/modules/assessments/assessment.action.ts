import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ResponseAPI } from '../../../configs/services/api.service';
import {
	createAssessmentService,
	deleteAssessmentService,
	findAllAssessmentsService,
	updateAssessmentService,
} from '../../../configs/services/assessment.service';
import {
	Assessment,
	CreateAssessmentRequest,
} from '../../../utils/types/assessment';
import { showAlert } from '../Alert/Alert';

export const createAssessmentAsyncThunk = createAsyncThunk(
	'assessment/create',
	async (data: CreateAssessmentRequest, { getState, dispatch }) => {
		const { authLogged } = getState() as RootState;
		const response = await createAssessmentService({
			...data,
			token: authLogged.token,
			studentId: authLogged.student.id,
		});

		if (!response.success) {
			dispatch(
				showAlert({
					type: 'error',
					message: response.message,
				})
			);
			return response;
		}

		dispatch(
			showAlert({
				type: 'success',
				message: response.message,
			})
		);

		return response;
	}
);

export const findAllAssessmentsAsyncThunk = createAsyncThunk(
	'assessment/findAll',
	async (_, { getState, dispatch }) => {
		const { authLogged } = getState() as RootState;
		const { token } = authLogged;
		const response = await findAllAssessmentsService(token);

		if (!response.success) {
			dispatch(
				showAlert({
					type: 'error',
					message: response.message,
				})
			);
		}
		return response;
	}
);

export const updateAssessmentAsyncThunk = createAsyncThunk(
	'assessment/update',
	async (
		data: { id: string } & Partial<Assessment>,
		{ getState, dispatch }
	) => {
		const { authLogged } = getState() as RootState;
		const response = await updateAssessmentService({
			...data,
			token: authLogged.token,
		});

		if (!response.success) {
			dispatch(
				showAlert({
					type: 'error',
					message: response.message,
				})
			);
			return response;
		}

		dispatch(
			showAlert({
				type: 'success',
				message: response.message,
			})
		);

		return response;
	}
);

export const deleteAssessmentAsyncThunk = createAsyncThunk<
	ResponseAPI,
	string, 
	{ state: RootState } 
>('assessment/delete', async (id, { getState, dispatch }) => {
	const { authLogged } = getState() as RootState;

	const response = await deleteAssessmentService(id, authLogged.token);

	if (!response.success) {
		dispatch(
			showAlert({
				type: 'error',
				message: response.message,
			})
		);
		throw new Error(response.message);
	}

	dispatch(
		showAlert({
			type: 'success',
			message: response.message,
		})
	);

	return response;
});
