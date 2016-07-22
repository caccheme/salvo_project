$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];

      $.each(data, function(key, val) {
        var date = (new Date(val.date_created + (60*60*1000*key)));

        console.log(val);

        games.push('<li id="' + key + '">Date Created:    ' + date +
        '</li>');
        games.push('<ul><li>Player:    ' + val.players.player + '</li></ul>');
        games.push('<ul><li>Score:    ' + val.players.score + '</li></ul>');

        });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

