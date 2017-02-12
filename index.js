const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);  
const io = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

server.listen(app.get('port'), () => {
  console.log('\nExpress server up and running at http://localhost:%s.\n', app.get('port'));
});

var players = {};

io.on('connection', (socket) => {
	var user = {
	  id: socket.id,
	};

	socket.emit('connected', user);

	socket.on('newPlayer', (data) => {
		players[data.id] = data;

  	io.sockets.emit('createPlayers', players);
	});

  socket.on('move', (data) => {
  	players[data.id] = data;

  	socket.broadcast.emit('movePlayer', players[data.id]);
  });

  socket.on('sendMessage', (data) => {
    socket.broadcast.emit('messagePlayer', data);
  });

  socket.on('disconnect', (data) => {
  	delete players[socket.id];
  	io.sockets.emit('deletePlayer', {
  		id: socket.id
  	});
    socket.disconnect();
  });
});

