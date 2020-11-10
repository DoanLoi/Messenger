import {host} from "./linkHost"
import io from 'socket.io-client';
 
export const socket = io(host);

