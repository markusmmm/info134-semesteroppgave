function changeDiv(divID){
  displayNone();
  divID.style.display = "block";

  if(divID.id === "oversikt"){
    finnOversikt();
  }

}

function displayNone(){
  document.getElementById("introduksjon").style.display = "none";
  document.getElementById("oversikt").style.display = "none";
  document.getElementById("detaljer").style.display = "none";
  document.getElementById("sammenligning").style.display = "none";
}

function finnOversikt(){
  var link = "http://wildboy.uib.no/~tpe056/folk/104857.json";
  var  xhr = new XMLHttpRequest();

  xhr.open("GET", link);

  xhr.onreadystatechange = function(){

    if (xhr.readyState === 4 && xhr.status === 200){

      var rtxt = ("Text", xhr.responseText);

      var obj = JSON.parse(rtxt);
      //console.log(obj.elementer);
      //console.log(obj);

      var count = Object.keys(obj.elementer).length;
      console.log(obj.elementer);

      //create list elements with total number of people and kommunenummer.
      //for-løkke som går igjennom alle kommuner og henter ut navn, kommunenummer og befolkning.
      for(var prop in obj.elementer){
        var kommunenummer = obj.elementer[prop].kommunenummer;
        var kommunenavn = prop;
        //befolkning av menn i 2018
        var menn = obj.elementer[prop].Menn[2018];

        //befolkning av kvinner 2018
        var kvinner = obj.elementer[prop].Kvinner[2018];
        var totalBefolkning = menn + kvinner;

        createNode(totalBefolkning, kommunenummer, kommunenavn);

      }


      console.log(kommunenavn);
      console.log(kvinner);
      console.log(menn);
      console.log(totalBefolkning);
      console.log(kommunenummer);
      //console.log(x.Menn[2018]);

    }
  };
  xhr.send();
}

/*
  Creates a textnode and inserts it into the div element.
  TODO: give the variables color?
*/

function createNode(totalBefolkning, kommunenummer, kommunenavn) {

  var node = document.createElement("LI");
  var textnode = document.createTextNode("Kommunenavn: " + kommunenavn +
  ", Kommunenummer: " +kommunenummer + ", Total befolkning: " + totalBefolkning);
  node.appendChild(textnode);

  document.getElementById("oversikt").appendChild(node);
}
