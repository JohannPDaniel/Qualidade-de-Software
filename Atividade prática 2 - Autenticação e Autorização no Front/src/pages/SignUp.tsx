import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	Container,
	FormLabel,
	Grid2,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackBarAlert } from '../components/SnackBarAlert';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showAlert } from '../store/modules/Alert/Alert';
import { studentAsyncThunck } from '../store/modules/students/studentSlice';

interface Errors {
	name: string;
	email: string;
	type: string;
	cpf: string;
	age?: string;
	password: string;
	confirmPassword?: string;
}

export const SignUp = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { loading } = useAppSelector((state) => state.students);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		type: '',
		age: 0,
		cpf: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState<Errors>({
		name: '',
		email: '',
		type: '',
		age: '',
		cpf: '',
		password: '',
		confirmPassword: '',
	});

	function validate(data: typeof formData): Errors {
		return {
			name: data.name ? '' : 'Nome é obrigatório!',
			email: data.email ? '' : 'Email é obrigatório!',
			type: data.type ? '' : 'Tipo é obrigatório!',
			cpf: data.cpf ? '' : 'CPF é obrigatório',
			password: data.password ? '' : 'Senha é obrigatória!',
			confirmPassword:
				data.confirmPassword && data.password !== data.confirmPassword
					? 'As senhas não coincidem!'
					: '',
		};
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[id]: validate({ ...formData, [id]: value })[id as keyof Errors],
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { value } = e.target;

		setFormData((prev) => ({
			...prev,
			type: value, 
		}));

		setErrors((prev) => ({
			...prev,
			type: validate({ ...formData, type: value }).type,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationErrors = validate(formData);
		const hasErrors = Object.values(validationErrors).some((error) => error);

		if (hasErrors) {
			setErrors(validationErrors);

			dispatch(
				showAlert({
					type: 'error',
					message: 'Existem campos inválidos no formulário!',
				})
			);
			return;
		}

		dispatch(
			studentAsyncThunck({
				name: formData.name,
				email: formData.email,
				type: formData.type,
				age: Number(formData.age),
				cpf: formData.cpf,
				password: formData.password,
			})
		);
		setTimeout(() => {
			navigate('/');
		}, 2000);
	};

	return (
		<Grid2 container>
			<Grid2
				size={12}
				sx={{ padding: 4 }}>
				<Container maxWidth='sm'>
					<Grid2
						container
						sx={{
							width: '100%',
							height: 'auto',
							border: '1px solid black',
							borderRadius: 4,
							padding: 4,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Grid2
							size={12}
							component='form'
							onSubmit={handleSubmit}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}>
							<Typography
								variant='h4'
								sx={{ textAlign: 'center' }}>
								Cadastro de Estudantes
							</Typography>

							<Box>
								<FormLabel htmlFor='name'>Nome</FormLabel>
								<TextField
									id='name'
									value={formData.name}
									onChange={handleInputChange}
									size='small'
									type='text'
									fullWidth
									error={!!errors.name}
									helperText={errors.name}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
								/>
							</Box>
							<Box>
								<FormLabel htmlFor='email'>E-mail</FormLabel>
								<TextField
									id='email'
									value={formData.email}
									onChange={handleInputChange}
									size='small'
									type='email'
									fullWidth
									error={!!errors.email}
									helperText={errors.email}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
								/>
							</Box>
							<Box>
								<FormLabel htmlFor='cpf'>CPF</FormLabel>
								<TextField
									id='cpf'
									value={formData.cpf}
									onChange={handleInputChange}
									size='small'
									type='text'
									fullWidth
									error={!!errors.cpf}
									helperText={errors.cpf}
									inputProps={{ maxLength: 11 }}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
								/>
							</Box>
							<Box>
								<FormLabel htmlFor='age'>Idade</FormLabel>
								<TextField
									id='age'
									value={formData.age}
									onChange={handleInputChange}
									size='small'
									type='number'
									fullWidth
									error={!!errors.age}
									helperText={errors.age}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
									inputProps={{
										min: 0,
									}}
								/>
							</Box>
							<Box>
								<InputLabel id='type'>Tipo de Aluno</InputLabel>
								<Select
									id='type'
									value={formData.type}
									onChange={handleSelectChange}
									size='small'
									fullWidth
									error={!!errors.type}>
									<MenuItem value=''>Selecione</MenuItem>
									<MenuItem value='M'>Matriculado</MenuItem>
									<MenuItem value='T'>Tech Helper</MenuItem>
									<MenuItem value='F'>Formado</MenuItem>
								</Select>

								{errors.type && (
									<Typography
										color='error'
										variant='caption'>
										{errors.type}
									</Typography>
								)}
							</Box>

							<Box>
								<FormLabel>Senha</FormLabel>
								<TextField
									id='password'
									value={formData.password}
									onChange={handleInputChange}
									type={showPassword ? 'text' : 'password'}
									size='small'
									fullWidth
									error={!!errors.password}
									helperText={errors.password}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													sx={{ padding: 0 }}
													onClick={() => setShowPassword((prev) => !prev)}>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
								/>
							</Box>

							<Box>
								<FormLabel>Confirmar Senha</FormLabel>
								<TextField
									id='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleInputChange}
									type={showConfirmPassword ? 'text' : 'password'}
									size='small'
									fullWidth
									error={!!errors.confirmPassword}
									helperText={errors.confirmPassword}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													sx={{ padding: 0 }}
													onClick={() =>
														setShowConfirmPassword((prev) => !prev)
													}>
													{showConfirmPassword ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									FormHelperTextProps={{
										sx: { m: '5px 0' },
									}}
								/>
							</Box>

							<Box sx={{ display: 'flex', gap: 2 }}>
								<Button
									color='error'
									variant='contained'
									type='reset'
									fullWidth>
									Cancelar
								</Button>
								<Button
									color='success'
									variant='contained'
									type='submit'
									disabled={loading}
									fullWidth>
									Cadastrar
								</Button>
							</Box>
						</Grid2>
					</Grid2>
				</Container>
			</Grid2>
			<SnackBarAlert />
		</Grid2>
	);
};
