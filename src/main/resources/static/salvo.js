$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];

      $.each(data, function(key, val) {
        var date = (new Date(val.date_created + (60*60*1000*key)));

        games.push('<li id="' + key + '">Date Created:    ' + date + '</li>');
      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});





// //is working at index.html to give same as /games
//  var items = $( "#gamesList" ).load( "/games", function(i) {
//    alert( "Load was performed." );
//  });


    // //example from stackoverlow that I got working
//      var countries = ['United States', 'Canada', 'Argentina', 'Armenia'];
//      var cList = $('ol')
//      $.each(countries, function(i)
//      {
//          var li = $('<li/>')
//          .text(countries[i])
//          .appendTo(cList);
//
//      });

