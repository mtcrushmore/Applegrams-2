var express = require('express');
var app = require('express').createServer();
var io = require('socket.io')(app);
var underscore = require('underscore');
app.listen(3000);

var letterPool = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'F', 'F', 'F', 'G', 'G', 'G', 'G', 'H', 'H', 'H', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'L', 'L', 'L', 'M', 'M', 'M', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'P', 'P', 'P', 'Q', 'Q', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'U', 'U', 'U', 'U', 'U', 'U', 'V', 'V', 'V', 'W', 'W', 'W', 'X', 'X', 'Y', 'Y', 'Y', 'Z', 'Z']
var newGameCopy = letterPool.slice();
var playerCount = 0;
var lastPeel = false;

function removePieces(pool, number) {
  //removes # of starting pieces from pool
  var result = [];
  for (var i = 0; i < number; i++) {
    result.push(peel(pool));
  }
  return result;
}

function peel(pool) {
  //removes one piece randomly from the pool
  return pool.splice(_.random(0, pool.length - 1), 1)[0];
}

function split(pool, addedPiece) {
  //adds 1 piece, removes (and returns) 3 pieces randomly from the pool
  var result = removePieces(pool, 3);
  pool.push(addedPiece);
  return result;
}

function peelToWin(pool, players) {
  return pool.length < players ? false : true;
}



app.get('/', function(req, res) {
  //should send all files html, css, and js files to client **need to update
  res.sendfile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
  playerCount++;

  //send each user a unique identifier
  socket.emit('joined', playerCount);

  //once a user connects, send them 7 starting pieces
  socket.emit('joined', removePieces(letterPool, 7));
  //broadcast event to other players
  socket.broadcast.emit('another player has joined');

  socket.on('disconnect', function() {
    //not sure how to handle if someone leaves the game, should this affect peelToWin?
    playerCount--;
    io.emit('player disconnected');
  });

  io.on('peeling', function(socket) {
    //will end the game if peeling event is emitting when pieces < players
    if (lastPeel) {
      socket.emit('youWin');
      io.broadcast.emit('youLose', /*show winning player's board*/ );
    }

    /*send all users 1 piece. I'm not sure if socket IO allows you to emit a unique message to all users,
    as a workaround, I send an array of length = players, each player will grab a specific piece of the array
    based on the unique identifier given upon original connection
    */

    io.emit('peeled', removePieces(letterPool, playerCount));

    //if there are more players than pieces left, alert everyone of last peel!
    if (peelToWin(letterPool, playerCount)) {
      lastPeel = true;
      io.emit('peelToWin', 'Next Peel Wins!!!');
    }

  });

  io.on('spliting', function(socket, incomingPiece) {
    //send user 3 pieces and add back original piece to letter pool
    socket.emit('split', split(letterPool, incomingPiece));

    //if splitting caused pieces > players, reset lastPeel to false
    if (lastPeel && !peelToWin(letterPool, playerCount)) {
      lastPeel = false;
    }
  });

});
