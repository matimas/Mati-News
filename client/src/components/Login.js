import React, { useContext } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { makeStyles, Modal, Backdrop, Fade } from '@material-ui/core';
import { authenticationContext } from '../context/authenticationContext';

function Login(props) {
	const { login } = useContext(authenticationContext);
	const classes = makeStyles((theme) => ({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		content: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			height: 250,
			with: 200,
			border: '2px solid rgb(78, 79, 80)',
			padding: 20,
			borderRadius: 30,
			outline: 'none',
			backgroundColor: theme.palette.background.paper,
		},
		loginButton: {
			width: 220,
			height: 50,
			display: 'flex',
			alignItems: 'center',
			color: 'white',
			cursor: 'pointer',
			marginBottom: 15,
			overflow: 'hidden',
			borderRadius: 30,
			border: 0,
			boxShadow: ' 0px 3px 3px rgba(0, 0, 0, 0.5)',
			outline: 'none',
			'&:hover': { opacity: '0.6' },
		},
		loginButtonImg: {
			marginRight: 10,
		},
		btnGoogle: {
			background: '#db3236',
		},
		btnFacebook: {
			background: '#3b5998',
		},
	}))();

	const responseFacebookLogin = (response) => {
		if (!response.accessToken) return;
		const { accessToken, id, name, expiresIn, picture } = response;
		const userInfo = {
			token: accessToken,
			userId: id,
			userName: name,
			expiryDate: Date.now() + expiresIn * 1000,
			picture: picture.data.url,
			type: 'facebook',
		};
		login(userInfo);
	};
	const responseGoogleLogin = (response) => {
		if (!response.accessToken) return;
		const { accessToken, googleId } = response;
		const { name, imageUrl } = response.profileObj;
		const { expires_at } = response.tokenObj;
		const userInfo = {
			token: accessToken,
			userId: googleId,
			userName: name,
			expiryDate: expires_at,
			picture: imageUrl,
			type: 'google',
		};
		login(userInfo);
	};

	return (
		<Modal
			className={classes.modal}
			open={props.showLoginModal}
			onClose={() => props.setShowLoginModal(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{ timeout: 500 }}
		>
			<Fade in={props.showLoginModal}>
				<div className={classes.content}>
					<h2 className='login-header'>Login</h2>
					<FacebookLogin
						appId='457454052520785'
						fields='name,email,picture'
						callback={responseFacebookLogin}
						disableMobileRedirect={true}
						cssClass={classes.loginButton + ' ' + classes.btnFacebook}
						textButton='LOGIN WITH FACEBOOK'
						icon={
							<img
								className={classes.loginButtonImg}
								alt='facebook-icon'
								src='./facebook-icon.ico'
							/>
						}
					/>
					<GoogleLogin
						clientId='673808119262-ftnfi8bk8jo7r5tc3s5jsu5lhq7qu1or.apps.googleusercontent.com'
						onSuccess={responseGoogleLogin}
						buttonText='LOGIN WITH GOOGLE'
						render={(props) => (
							<button
								className={classes.loginButton + ' ' + classes.btnGoogle}
								onClick={props.onClick}
								disabled={props.disabled}
							>
								<img
									className={classes.loginButtonImg}
									alt='google-icon'
									src='./google-icon.ico'
								/>
								LOGIN WITH GOOGLE
							</button>
						)}
					/>
				</div>
			</Fade>
		</Modal>
	);
}

export default Login;
