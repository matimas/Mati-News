import React, { useReducer, createContext } from 'react';

const initializeState = {
	isAuthenticated: false,
	userName: '',
	picture: '',
	login: (data) => {},
	logout: () => {},
	setAutoLogout: () => {},
	updateUserAuth: (data) => {},
};

export const authenticationContext = createContext(initializeState);

export const AuthenticationProvider = (props) => {
	const reducer = (state, action) => {
		switch (action.type) {
			case 'login':
				return {
					isAuthenticated: true,
					userName: action.data.userName,
					picture: action.data.picture,
				};
			default:
				return state;
		}
	};
	const [userAuth, dispatch] = useReducer(reducer, initializeState);

	const login = (data) => {
		const { token, userId, userName, picture, expiryDate, type } = data;
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
		localStorage.setItem('userName', userName);
		localStorage.setItem('picture', picture);
		localStorage.setItem('expiryDate', expiryDate);
		localStorage.setItem('type', type);
		window.location.assign('/');
	};
	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		localStorage.removeItem('picture');
		localStorage.removeItem('expiryDate');
		localStorage.removeItem('type');
		window.location.assign('/');
	};
	const setAutoLogout = (autoLogoutTimer) => {
		setTimeout(() => {
			logout();
		}, autoLogoutTimer);
	};
	const updateUserAuth = (data) => {
		const { userName, picture } = data;
		dispatch({ type: 'login', data: { userName, picture } });
	};
	return (
		<authenticationContext.Provider
			value={{
				isAuthenticated: userAuth.isAuthenticated,
				userName: userAuth.userName,
				picture: userAuth.picture,
				login,
				logout,
				setAutoLogout,
				updateUserAuth,
			}}
		>
			{props.children}
		</authenticationContext.Provider>
	);
};
