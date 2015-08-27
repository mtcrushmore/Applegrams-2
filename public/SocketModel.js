var SocketModel = Backbone.Model.extend({


  initialize: function() {
    var context = this;

    var socket = io.connect('http://localhost:3000/');
    var userId = null;
    context.startingPieces = null;

    //keeps log of all peels, most recent piece pushed to end
    context.peels = [];

    //keeps log of all splits, most recent pieces pushed to end
    context.splits = [];

    context.peel = function() {
      console.log('client peeling');
      socket.emit('peeling');
    };

    context.split = function(pieceToRemove) {
      console.log('client splitting', pieceToRemove);
      socket.emit('splitting', pieceToRemove);
    };

    //stores unique player ID, used for retrieving peel
    socket.on('userId', function(data) {
      context.userId = data;
      context.trigger('userId', data);
    });

    //array containing starting pieces
    socket.on('joined', function(data) {
      console.log('socketModel recieved board: ', data);
      context.startingPieces = data;
      context.trigger('createBoard', data);
      //trigger show board event
    });

    socket.on('another player has joined', function() {
      console.log('another player joined');
      context.trigger('playerJoined', context);
    });

    socket.on('You Win', function() {
      context.trigger('win', context);
    });

    socket.on('You Lose', function(data) {
      context.trigger('lose', context);
    });

    socket.on('peeled', function(data) {
      console.log('the server peeled');

      context.peels.push(data[userId - 1]);
      //trigger peel event
      context.trigger('peel', context);
    });

    socket.on('peelToWin', function(data) {
      //display "Next peel wins!!!"
      context.trigger('peelToWin', context);
    });

    socket.on('split', function(data) {
      console.log('split was sent back from server');
      context.splits = context.splits.concat(data);
      context.trigger('split', context);
    });

    socket.on('player disconnected', function(data) {
      console.log('other player disconnected');
      context.trigger('playerDisconnected', context);
    });
  }

});
