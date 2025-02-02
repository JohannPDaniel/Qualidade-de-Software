import { AccountCircle, DarkMode, Logout } from '@mui/icons-material';
import {
	AppBar as AppBarMui,
	Avatar,
	Box,
	Button,
	Container,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/modules/authLogged/authLoggedSlice';

const menuItems = [
	{
		label: 'Profile',
		icon: <AccountCircle />,
	},
	{
		label: 'Dark mode',
		icon: <DarkMode />,
	},
	{
		label: 'Logout',
		icon: <Logout />,
	},
];

export default function AppBar() {
	const dispatch = useAppDispatch();
	const { student } = useAppSelector((state) => state.authLogged);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBarMui
			position='fixed'
			color='info'>
			<Container>
				<Toolbar
					disableGutters
					sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<img
						src='https://www.growdev.com.br/assets/images/logo_growdev.svg'
						style={{ width: '8rem', height: 'auto', borderRadius: 10 }}
					/>

					<Box>
						<Tooltip title='Open settings'>
							<Button onClick={handleOpenUserMenu}>
								<Typography
									textTransform='capitalize'
									component='span'
									variant='body1'
									color='white'
									mr={1}>
									{student.name}
								</Typography>
								<Avatar
									alt='Remy Sharp'
									src='https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg'
								/>
							</Button>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id='menu-appbar'
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}>
							{menuItems.map((item, index) => (
								<MenuItem
									onClick={() => {
										switch (item.label) {
											case 'Logout':
												dispatch(logout());
												break;
											default:
												handleCloseUserMenu();
												break;
										}
									}}
									key={index}>
									<Typography
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 2,
										}}>
										{item.icon}
										{item.label}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBarMui>
	);
}
