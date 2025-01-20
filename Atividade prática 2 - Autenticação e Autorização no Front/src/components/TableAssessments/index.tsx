import { Delete, Edit } from '@mui/icons-material';
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAssessentDetail } from '../../store/modules/assessmentDetail/assessmentDetailSlice';
import {
	deleteAssessmentAsyncThunk,
	findAllAssessmentsAsyncThunk,
} from '../../store/modules/assessments/assessment.action';
import { Assessment } from '../../utils/types/assessment';

export function TableAssessments() {
	const dispatch = useAppDispatch();
	const assessmentAsyncThunk = useAppSelector((state) => state.assessments);

	function handleEdit(asssessment: Assessment) {
		dispatch(setAssessentDetail(asssessment));
		// setTimeout(() => {
		// 	navigate('/detail');
		// }, 500);
	}

	function handleDelete(id: string) {
		if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
			dispatch(deleteAssessmentAsyncThunk(id));
		}
	}

	useEffect(() => {
		dispatch(findAllAssessmentsAsyncThunk());
	}, [dispatch]);

	return (
		<TableContainer>
			<Table
				sx={{ minWidth: 650 }}
				aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 'bold' }}>
							Title
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 'bold' }}>
							Grade
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 'bold' }}>
							Description
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 'bold' }}>
							Created At
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 'bold' }}>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{assessmentAsyncThunk.assessments.map((row, index) => (
						<TableRow
							key={row.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
							<TableCell
								component='th'
								scope='row'>
								{index + 1}
							</TableCell>
							<TableCell align='right'>{row.title}</TableCell>
							<TableCell align='right'>{row.grade}</TableCell>
							<TableCell align='right'>{row.description}</TableCell>
							<TableCell align='right'>
								{new Date(row.createdAt).toLocaleDateString('pt-BR')}
							</TableCell>
							<TableCell align='right'>
								<IconButton
									color='info'
									onClick={() => handleEdit(row)}>
									<Edit />
								</IconButton>
								<IconButton
									onClick={() => handleDelete(row.id)}
									color='error'>
									<Delete />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
