var SocketModel = Backbone.Model.extend({

  peel: function() {
    socket.emit('peeling');
  },

  split: function(pieceToRemove) {
    socket.emit('peeling', pieceToRemove);
  },

  initialize: function() {
    var socket = io.connect('http://localhost:3000');
    var userId = null;
    this.startingPieces = null;

    //keeps log of all peels, most recent piece pushed to end
    this.peels = [];

    //keeps log of all splits, most recent pieces pushed to end
    this.splits = [];

    //stores unique player ID, used for retrieving peel
    socket.on('userId', function(data) {
      this.userId = data;
    });

    //array containing starting pieces
    socket.on('joined', function(data) {
      this.startingPieces = data;
      this.trigger('createBoard', this);
      //trigger show board event
    });

    socket.on('another player has joined', function() {
      this.trigger('playerJoined', this);
    });

    socket.on('You Win', function() {
      this.trigger('win', this);
    });

    socket.on('You Lose', function(data) {
      this.trigger('lose', this);
    });

    socket.on('peeled', function(data) {
      this.peels.push(data[userId - 1]);
      //trigger peel event
      this.trigger('peel', this);
    });

    socket.on('peelToWin', function(data) {
      //display "Next peel wins!!!"
      this.trigger('peelToWin', this);
    });

    socket.on('split', function(data) {
      this.splits = this.splits.concat(data);
      this.trigger('split', this);
    });

    socket.on('player disconnected', function(data) {
      this.trigger('playerDisconnected', this);
    });
  }

});
