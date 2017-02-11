 /// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 

const socket = io();

window.onload = () => {
  const game = new ChatGame.Game(socket);
};
