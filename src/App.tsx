import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import CampaignList from './components/CampaignList';

import './App.css';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
		info: {
			main: '#787878',
		},
		background: {
			default: '#f5f5f5',
		},
	},
	typography: {
		h4: {
			fontWeight: 600,
		},
	},
});

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Voucher Campaign Manager
					</Typography>
				</Toolbar>
			</AppBar>
			<Container sx={{ mt: 4, mb: 4 }} >
				<CampaignList />
			</Container>
		</ThemeProvider>
	);
};

export default App;
