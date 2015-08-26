var SocketModel = Backbone.Model.extend({

  initialize: function() {
    this.startingPieces = [];
    var socket = io.connect('http://localhost:3000');

    socket.on('join', function(data) {
      this.startingPieces = data.startingPieces;
    })


    // socket.on('news', function (data) {
    //   console.log(data);
    //   socket.emit('my other event', { my: 'data' });

    // }




  }

});
