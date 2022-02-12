import React from 'react';
import Home from './pages/Home';
import { Switch, Route } from 'react-router-dom';
import UserFavorites from './pages/UserFavorites';
import { AuthenticationProvider } from './context/authenticationContext';

function App() {
	return (
		<div className='app'>
			<AuthenticationProvider>
				<Switch>
					<Route exact path='/'>
						<Home />
					</Route>
					<Route exact path='/user-favorites'>
						<UserFavorites />
					</Route>
				</Switch>
			</AuthenticationProvider>
		</div>
	);
}

export default App;
