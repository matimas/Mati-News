import React, { useState, useContext } from 'react';
import {
	AppBar,
	Toolbar,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemIcon,
	Collapse,
	Divider,
	Typography,
	makeStyles,
	useMediaQuery,
} from '@material-ui/core';
import {
	ExitToApp,
	ExpandLess,
	ExpandMore,
	AccountCircle,
	Menu,
	SpeakerNotes,
	StarBorder,
	Public,
	SportsTennis,
	VideogameAsset,
	Business,
	DeveloperMode,
} from '@material-ui/icons';
import { authenticationContext } from '../context/authenticationContext';
import { Link } from 'react-router-dom';

const countryListData = ['us', 'in', 'nl'];

const categoryListData = [
	{ text: 'General', icon: <SpeakerNotes /> },
	{ text: 'Sports', icon: <SportsTennis /> },
	{ text: 'Entertainment', icon: <VideogameAsset /> },
	{ text: 'Business', icon: <Business /> },
	{ text: 'Technology', icon: <DeveloperMode /> },
];

function NavBar(props) {
	const [showSideBar, setShowSideBar] = useState(
		window.innerWidth > 1000 ? true : false,
	);
	const [selectedCategory, setSelectedCategory] = useState('General');
	const [selectedCountry, setSelectedCountry] = useState('us');
	const [showCountryList, setShowCountryList] = useState(false);
	const { logout, isAuthenticated, picture } = useContext(
		authenticationContext,
	);
	const tabletMQ = useMediaQuery('(max-width:1000px)');
	const useStyles = makeStyles((theme) => ({
		appBar: {
			position: 'fixed',
			height: 60,
			zIndex: theme.zIndex.drawer + 1,
		},
		drawer: {
			marginTop: 60,
			width: tabletMQ ? 250 : 300,
			border: tabletMQ ? '' : '2px solid white',
		},
		logo: {
			flexGrow: 1,
			paddingTop: 7,
		},
		listItem: {
			borderRadius: '0px 30px 30px 0px',
		},
		countryList: {
			maxHeight: 250,
			overflow: 'auto',
		},
		nestedListItem: {
			paddingLeft: theme.spacing(12),
			borderRadius: '0px 30px 30px 0px',
		},
	}));

	const handleCategoryListItemClick = (category) => {
		setSelectedCategory(category);
		props.onChangeCategoryConfig(category);
	};

	const handleCountryListItemClick = (country) => {
		setSelectedCountry(country);
		props.onChangeCountryConfig(country);
	};

	const DrawerCountryListItems = () => (
		<List>
			<ListItem
				button
				className={classes.listItem}
				onClick={() => setShowCountryList(!showCountryList)}
			>
				<ListItemIcon>
					<Public />
				</ListItemIcon>
				<ListItemText primary='Country' />
				{showCountryList ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={showCountryList} unmountOnExit>
				<List className={classes.countryList}>
					{countryListData.map((country) => (
						<ListItem
							button
							key={country}
							selected={selectedCountry === country}
							className={classes.nestedListItem}
							onClick={() => handleCountryListItemClick(country)}
						>
							<ListItemIcon>{country}</ListItemIcon>
							<ListItemText />
						</ListItem>
					))}
				</List>
			</Collapse>
		</List>
	);

	const DrawerCategoryListItems = () => (
		<List>
			{categoryListData.map((item) => (
				<ListItem
					button
					key={item.text}
					className={classes.listItem}
					selected={selectedCategory === item.text}
					onClick={() => handleCategoryListItemClick(item.text)}
				>
					<ListItemIcon>{item.icon}</ListItemIcon>
					<ListItemText primary={item.text} />
				</ListItem>
			))}
		</List>
	);

	const DrawerUserListItems = () => (
		<List>
			<ListItem button className={classes.listItem}>
				<ListItemIcon>
					<StarBorder />
				</ListItemIcon>
				<Link
					to='/user-favorites'
					style={{ textDecoration: 'none', color: '#00193B' }}
				>
					<ListItemText primary='Favorites' />
				</Link>
			</ListItem>
			<ListItem button className={classes.listItem} onClick={() => logout()}>
				<ListItemIcon>
					<ExitToApp />
				</ListItemIcon>
				<ListItemText primary='Logout' />
			</ListItem>
		</List>
	);

	const classes = useStyles();

	return (
		<>
			<AppBar color='inherit' className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={() => setShowSideBar(!showSideBar)}
					>
						<Menu />
					</IconButton>
					<Typography className={classes.logo}>
						<img alt='logo' src='./logo.png' className={classes.logo} />
					</Typography>
					{isAuthenticated ? (
						<Avatar alt='user picture' src={picture} />
					) : (
						<IconButton
							color='primary'
							onClick={() => props.setShowLoginModal(true)}
						>
							<AccountCircle fontSize='large' />
						</IconButton>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				open={showSideBar}
				variant='persistent'
				classes={{ paper: classes.drawer }}
			>
				<DrawerCountryListItems />
				<Divider />
				<DrawerCategoryListItems />
				<Divider />
				{isAuthenticated ? <DrawerUserListItems /> : null}
			</Drawer>
		</>
	);
}

export default NavBar;
