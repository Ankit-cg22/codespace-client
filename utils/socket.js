import { io } from 'socket.io-client';
import { BACKEND_URL } from './constants';
export const socket = io(BACKEND_URL ,{ transports: ['websocket', 'polling', 'flashsocket'] })


