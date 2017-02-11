const express = require('express');
const path = require('path');
const app = express();
const io = require('socket.io');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

const server = app.listen(app.get('port'), () => {
  console.log('\nExpress server up and running at http://localhost:%s.\n', app.get('port'));
});

const socketIO = io(server, { origins: '*:*' });

var players = {};

socketIO.on('connection', (socket) => {
	var user = {
	  id: socket.id,
	};
  socketIO.sockets.emit('createPlayers', players);
  socket.emit('connected', user);

  socket.on('move', (data) => {
  	players[socket.id] = {
  		x: data.x,
  		y: data.y
  	};

  	socketIO.sockets.emit('movePlayers', players);

    console.log(players);
  });

  socket.on('disconnect', (data) => {
  	delete players[socket.id];
    socket.disconnect();
  });
});
