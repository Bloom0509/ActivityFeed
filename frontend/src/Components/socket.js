import { io } from "socket.io-client";


console.log("Initilaizing sockets...")
export const socket = io("http://localhost:3000",
    { transports: ["websocket"]},
);


socket.on("connect",()=>{
    console.log("socket connected",socket.io)
})
socket.on("disconnect",()=>{
    console.log("socket disconnected",socket.io)
})