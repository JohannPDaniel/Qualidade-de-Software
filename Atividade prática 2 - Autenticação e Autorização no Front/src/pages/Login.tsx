import { Facebook, Google } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	Container,
	Divider,
	Grid2,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FormLogin } from '../components/FormLogin';
import { SnackBarAlert } from '../components/SnackBarAlert';
import { useAppDispatch } from '../store/hooks';
import { showAlert } from '../store/modules/Alert/Alert';
export const Login = () => {
	const dispatch = useAppDispatch();
	function handleImplements() {
		dispatch(
			showAlert({
				type: 'warning',
				message: 'Not implemented',
			})
		);
	}
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background:
					'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)',
			}}>
			<Container maxWidth='xs'>
				<Card
					elevation={4}
					sx={{ p: 4 }}>
					<Grid2
						container
						spacing={2}>
						<Grid2 size={12}>
							<img
								src='https://www.growdev.com.br/assets/images/logo_growdev.svg'
								alt='Logo Growdev'
								width='120'
							/>
						</Grid2>
						<Grid2 size={12}>
							<FormLogin />
						</Grid2>
						<Grid2 size={12}>
							<Divider>Or</Divider>
						</Grid2>
						<Grid2 size={12}>
							<Button
								startIcon={<Google />}
								variant='outlined'
								onClick={handleImplements}
								fullWidth>
								Sign in with Google
							</Button>
						</Grid2>
						<Grid2 size={12}>
							<Button
								startIcon={<Facebook />}
								variant='outlined'
								onClick={handleImplements}
								fullWidth>
								Sign in with Facebook
							</Button>
						</Grid2>
						<Grid2
							size={12}
							textAlign='center'>
							<Typography>
								Don't have account? <Link to='/signup'>Sign up</Link>
							</Typography>
						</Grid2>
					</Grid2>
				</Card>
			</Container>

			<SnackBarAlert />
		</Box>
	);
};
