import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GlobalStyle } from './configs/global/GlobalStyle';
import AppRoutes from './configs/router/AppRoutes';
import { persistor, store } from './store';

function App() {
	return (
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}>
				<AppRoutes />
				<GlobalStyle />
			</PersistGate>
		</Provider>
	);
}

export default App;
