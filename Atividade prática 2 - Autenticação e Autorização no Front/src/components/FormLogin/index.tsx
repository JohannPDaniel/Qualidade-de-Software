import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid2,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showAlert } from '../../store/modules/Alert/Alert';
import { loginAsyncThunk } from '../../store/modules/authLogged/authLoggedSlice';

interface ErrorField {
	email?: string;
	password?: string;
}

export const FormLogin = () => {
	const dispatch = useAppDispatch();
	const userLoggedRedux = useAppSelector((state) => state.authLogged);
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<ErrorField>({
		email: '',
		password: '',
	});
	function handleImplements() {
		dispatch(
			showAlert({
				type: 'warning',
				message: 'Not implemented',
			})
		);
	}

	function validate(email: string, password: string) {
		if (!email) {
			setErrors({ email: 'Email is required !!!' });
			return;
		}
		if (!password) {
			setErrors({ password: 'Password is required !!!' });
			return;
		}
		setErrors({});
	}

	function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const email = e.currentTarget.email.value;
		const password = e.currentTarget.password.value;
		const remember = e.currentTarget.remember.checked;

		validate(email, password);

		dispatch(loginAsyncThunk({ email, password, remember }));
		// dispatch(login({ email, password, remember }));
	}

	useEffect(() => {
		if (userLoggedRedux.success && userLoggedRedux.token) {
			setTimeout(() => {
				navigate('/home');
			}, 500);
		}
	}, [userLoggedRedux, navigate]);

	return (
		<Grid2
			container
			component='form'
			onSubmit={handleLogin}
			spacing={2}>
			<Grid2 size={12}>
				<Typography variant='h4'>Sign in</Typography>
			</Grid2>
			<Grid2 size={12}>
				<FormControl
					fullWidth
					error={!!errors.email}>
					<FormLabel htmlFor='email'>E-mail</FormLabel>
					<TextField
						id='email'
						placeholder='your@email.com'
						name='email'
						type='email'
						error={!!errors.email}
						helperText={errors.email}
						onChange={(e) => {
							if (e.target.value) {
								setErrors({ ...errors, email: '' });
							}
						}}
					/>
				</FormControl>
			</Grid2>
			<Grid2 size={12}>
				<FormControl
					fullWidth
					error={!!errors.password}>
					<FormLabel htmlFor='password'>Password</FormLabel>
					<TextField
						id='password'
						placeholder='*******'
						name='password'
						type={showPassword ? 'text' : 'password'}
						variant='outlined'
						error={!!errors.password}
						helperText={errors.password}
						onChange={(e) => {
							if (e.target.value) {
								setErrors({ ...errors, password: '' });
							}
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label={
											showPassword
												? 'hide the password'
												: 'display the password'
										}
										onClick={() => setShowPassword((prev) => !prev)}
										edge='end'>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</FormControl>
			</Grid2>
			<Grid2 size={12}>
				<FormControlLabel
					control={<Checkbox />}
					name='remember'
					label='Remember me'
				/>
			</Grid2>
			<Grid2 size={12}>
				<Button
					variant='contained'
					type='submit'
					fullWidth>
					Sign in
				</Button>
			</Grid2>
			<Grid2
				size={12}
				textAlign='center'>
				<Link
					to='#'
					onClick={handleImplements}>
					Forgot your password?
				</Link>
			</Grid2>
		</Grid2>
	);
};
