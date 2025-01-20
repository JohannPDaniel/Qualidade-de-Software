import { CSSObject, GlobalStyles } from '@mui/material';
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/700.css';


const styles: Record<string, CSSObject> = {
	'*': {
		margin: 0,
		padding: 0,
		boxSizing: 'border-box',
		fontFamily: "'open-sans', sans-serif",
	},

	a: {
		textDecoration: 'none',
		color: 'black',
		fontWeight: 500,

		"&:hover": {
			textDecoration: 'underline',
		}
	},
};

export function GlobalStyle() {
	return <GlobalStyles styles={styles} />;
}
