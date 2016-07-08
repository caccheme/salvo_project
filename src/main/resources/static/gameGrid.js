$(document).ready(function(){

//create an 11x11 grid with headers 1-10 and row headers A-J:

  $.ajax({
        method: "get",
        url: "/api/games",
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
                   // since we are using jQuery, you don't need to parse response
                   tableCreate();
        }
  });//end ajax

     function tableCreate() {
         var body = document.getElementsByTagName('body')[0];
         var tbl = document.createElement('table');
         tbl.style.width = '75%';
         tbl.setAttribute('border', '1');
         tbl.setAttribute('text-align', 'center');
         var tbdy = document.createElement('tbody');
         for (var i = 0; i < 11; i++) {
             var tr = document.createElement('tr');

             for (var j = 0; j < 11; j++) {
                 if (j==0 && i==0){
                    var td = document.createElement('td')
                        td.appendChild(document.createTextNode(""))
                        tr.appendChild(td)
                 }
                 if (j==0 && i!=0) {
                   // output row header A-J for grid
                   var td = document.createElement('td');
                        td.appendChild(document.createTextNode(i))
                            tr.appendChild(td)

                 }
                 if (i==0 && j!=0) {
                 // output column header 1-10 for grid
                    var td = document.createElement('td');
                        td.appendChild(document.createTextNode(myAlphabetFunction(j)))
                           tr.appendChild(td)
                 }
                 // quit making grid after made 11x11
                 if (i == 11 && j == 11) {
                     break
                 }
                 else if (i > 0 && j > 0) {
                     var td = document.createElement('td');
                     //loop through game data and fill in grid where ships are ... still to do
                     //the param obj search should give the gp id value and can use it in this loop

                     td.appendChild(document.createTextNode('data'))

                     tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

     function myAlphabetFunction(i) {
         var str = "ABCDEFGHIJKLMNOPQRS";
         var res = str.charAt(i-1);
         return res;
     }

//from ebook example of how to pass URL parameters (i.e. game.html?gp=1)
    function paramObj(search) {
      var obj = {};
      var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

      search.replace(reg, function(match, param, val) {
        obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
      });

      return obj;
    }


// This is the approach that I am taking for the above:
//  You write a nested loop to draw the table, and as you draw each cell you decide what to put in it, like this
//  - for each row (from 1 to 10)
//    — for each column (from A to J)
//        if cell contains ship return HTML for a ship color block else return HTML for an empty cell


});