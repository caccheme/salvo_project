$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];

      $.each(data, function(key, val) {
        var date = (new Date(val.date_created + (60*60*1000*key)));

        games.push('<li id="' + key + '">Date Created:    ' + date +
        '</li>');
        $.each(val.players, function(k,v) {
          games.push('<ul><li id=" player' + key + '">Player email:    ' + v.email + '</li></ul>');
        });

      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

