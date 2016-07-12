$(document).ready(function(){

//create an 11x11 grid with headers 1-10 and row headers A-J:
    var gamePlayer_Id = getParameterByName('gp');
//    console.log(gamePlayer_Id);

  $.ajax({
        method: "get",
        url: '/api/gp/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
                   // since we are using jQuery, you don't need to parse response
                   data = flattenArray(data.shipLocations);
                   console.log(data);
                   tableCreate(data);

        }
  });//end ajax

    function flattenArray(myArray) {
        var myNewArray = [].concat.apply([], myArray);
        return myNewArray;
    }

     function tableCreate(data) {
         var body = document.getElementsByTagName('body')[0];
         var tbl = document.createElement('table');
//         tbl.style.width = '75%';
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


                    // create string values based on table position
                    var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc

                    function myConcatFunction(j, i) {
                        var str1 = jArray[j];
                        var str2 = i.toString();
                        var res = str1.concat(str2);
                        return res
                    }

                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for shipLocations, mark matching locations blue
                    td.appendChild(document.createTextNode(cellString));
                    if (checkShipLocations(data, cellString) == true) {
                       td.style.backgroundColor = "blue"
                    }

                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

     function checkShipLocations(data, cellString){
        var result = false;
        for (var n = 0; n < data.length; n++) {
            if (data[n] == cellString){
              result = true
            }
        }
        return result;
     }


     function myAlphabetFunction(i) {
         var str = "ABCDEFGHIJKLMNOPQRS";
         var res = str.charAt(i-1);
         return res;
     }

    //from SO example: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


// This is the approach that I am taking for the above:
//  You write a nested loop to draw the table, and as you draw each cell you decide what to put in it, like this
//  - for each row (from 1 to 10)
//    — for each column (from A to J)
//        if cell contains ship return HTML for a ship color block else return HTML for an empty cell


});