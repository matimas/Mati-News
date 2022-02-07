import { createContext } from 'react';
import io from 'socket.io-client';

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');
const picture = localStorage.getItem('picture');
const type = localStorage.getItem('type');
console.log('into socket');
const socket = io.connect('/', {
	query: { token, userId, userName, picture, type },
});
const socketContext = createContext(socket);
export default socketContext;
