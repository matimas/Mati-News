import React from 'react';
import Home from './pages/Home';
import { AuthenticationProvider } from './context/authenticationContext';

function App() {
	return (
		<div className='app'>
			<AuthenticationProvider>
				<Home />
			</AuthenticationProvider>
		</div>
	);
}

export default App;
