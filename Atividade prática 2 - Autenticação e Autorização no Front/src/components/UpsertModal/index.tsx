import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Grid2,
	Modal,
	TextField,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetAssessmentDetail } from '../../store/modules/assessmentDetail/assessmentDetailSlice';
import {
	createAssessmentAsyncThunk,
	updateAssessmentAsyncThunk,
} from '../../store/modules/assessments/assessment.action';
import { resetSuccess } from '../../store/modules/assessments/assessmentsSlice';
import {
	FieldsErrors,
	validateFormAssessment,
} from '../../utils/validators/assessment.validator';
import { style } from './styles';

interface UpsertModalProps {
	open: boolean;
	onClose: () => void;
}

export function UpsertModal({ open, onClose }: UpsertModalProps) {
	const dispatch = useAppDispatch();
	const userLoggedReducer = useAppSelector((state) => state.authLogged);
	const assessmentRedux = useAppSelector((state) => state.assessments);
	const assessmentDetailRedux = useAppSelector(
		({ assessmentDetail }) => assessmentDetail
	);

	const [fieldsErrors, setFieldsErrors] = useState<FieldsErrors>({
		title: '',
		description: '',
		grade: '',
	});

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Extraindo valores do formulário
		const title = event.currentTarget['title-assessment'].value;
		const grade = Number(event.currentTarget['grade-assessment'].value);
		const description = event.currentTarget['desc-assessment'].value;

		// Validação
		const errors = validateFormAssessment(title, description, grade);
		if (Object.keys(errors).length) {
			setFieldsErrors(errors);
			return;
		}

		// Limpando erros, se houver
		setFieldsErrors({} as FieldsErrors);

		// Dados para criar ou editar
		const data = {
			title,
			grade,
			description,
			studentId: userLoggedReducer.student.id,
		};

		if (assessmentDetailRedux.id) {
			// Modo de edição
			// dispatch(updateAssessment({ id: assessmentDetailRedux.id, ...data }));
			dispatch(
				updateAssessmentAsyncThunk({ id: assessmentDetailRedux.id, ...data })
			);
		} else {
			// Modo de criação
			// dispatch(createAssessment(data));
			dispatch(createAssessmentAsyncThunk(data));
		}
	}

	function handleClose() {
		dispatch(resetAssessmentDetail());
		dispatch(resetSuccess());
		onClose();
	}

	useEffect(() => {
		if (assessmentRedux.success && assessmentRedux.message) {
			// Exibe a mensagem por um curto período antes de fechar
			setTimeout(() => {
				onClose();
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assessmentRedux.success, assessmentRedux.message]);

	return (
		<Modal
			open={open} // !!assessmentDetailRedux.id
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<form onSubmit={onSubmit}>
					<Grid2
						container
						spacing={1}>
						<Grid2 size={12}>
							<Typography variant='h6'>
								{assessmentDetailRedux.id ? 'Edit' : 'New'} Assessment
							</Typography>
						</Grid2>

						{/* Campo: Title */}
						<Grid2 size={12}>
							<FormControl
								fullWidth
								error={!!fieldsErrors.title}>
								<FormLabel htmlFor='title-assessment'>Title</FormLabel>
								<TextField
									id='title-assessment'
									name='title-assessment'
									type='text'
									placeholder='My title...'
									variant='outlined'
									fullWidth
									required
									error={!!fieldsErrors.title}
									helperText={fieldsErrors.title}
									defaultValue={assessmentDetailRedux.title || ''}
								/>
							</FormControl>
						</Grid2>

						{/* Campo: Grade */}
						<Grid2 size={12}>
							<FormControl
								fullWidth
								error={!!fieldsErrors.grade}>
								<FormLabel htmlFor='grade-assessment'>Grade</FormLabel>
								<TextField
									id='grade-assessment'
									name='grade-assessment'
									type='number'
									placeholder='10'
									variant='outlined'
									fullWidth
									required
									error={!!fieldsErrors.grade}
									helperText={fieldsErrors.grade}
									defaultValue={assessmentDetailRedux.grade || ''}
									inputProps={{
										step: 0.01,
									}}
								/>
							</FormControl>
						</Grid2>

						{/* Campo: Description */}
						<Grid2
							size={12}
							mb={2}>
							<FormControl
								fullWidth
								error={!!fieldsErrors.description}>
								<FormLabel htmlFor='desc-assessment'>Description</FormLabel>
								<TextField
									id='desc-assessment'
									name='desc-assessment'
									type='text'
									placeholder='My description...'
									variant='outlined'
									fullWidth
									multiline
									rows={3}
									required
									error={!!fieldsErrors.description}
									helperText={fieldsErrors.description}
									defaultValue={assessmentDetailRedux.description || ''}
								/>
							</FormControl>
						</Grid2>

						{/* Botões */}
						<Grid2 size={6}>
							<Button
								variant='contained'
								color='warning'
								fullWidth
								type='reset'
								onClick={handleClose}>
								Cancel
							</Button>
						</Grid2>
						<Grid2 size={6}>
							<Button
								variant='contained'
								fullWidth
								disabled={assessmentRedux.loading}
								type='submit'>
								{assessmentRedux.loading ? 'Awaiting...' : 'Submit'}
							</Button>
						</Grid2>
					</Grid2>
				</form>
			</Box>
		</Modal>
	);
}
