var befolkning_url = "http://wildboy.uib.no/~tpe056/folk/104857.json";
var sysselsatte_url = "http://wildboy.uib.no/~tpe056/folk/100145.json";
var utdanning_url = "http://wildboy.uib.no/~tpe056/folk/85432.json";

function changeDiv(divID){
  displayNone();
  divID.style.display = "block";

  if(divID.id === "oversikt"){

    oversiktAlleKommuner();
  }

}
function displayNone(){
  document.getElementById("introduksjon").style.display = "none";
  document.getElementById("oversikt").style.display = "none";
  document.getElementById("detaljer").style.display = "none";
  document.getElementById("sammenligning").style.display = "none";
}




//laster et datasett med gitt url og callback funksjon.
function load(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (typeof callback === "function") {
                callback.apply(xhr);
            }
        }
    };
    xhr.send();
}


//metoden kalles når brukeren trykker på oversikt.
function oversiktAlleKommuner(){
  var alleKommuner = true;
  load(befolkning_url,
      function () {
          var obj  = JSON.parse(this.responseText);

          befolkningsdata(obj, alleKommuner);

      });
}


//Funksjonen kalles når bruker skriver inn kommunenummer.
function kommuneInput(){
  var alleKommuner = false;
  var kommunenummer = document.getElementById('kommune').value;

  load(befolkning_url,
      function () {
          var obj  = JSON.parse(this.responseText);

          befolkningsdata(obj, alleKommuner, kommunenummer);

      });

  load(sysselsatte_url,
      function () {
          var obj  = JSON.parse(this.responseText);
          sysselsetting(obj, kommunenummer);
        });

}

function sysselsetting(obj,kommunenummer){
  console.log(obj);

}

function befolkningsdata(obj, alleKommuner, kommuneInput){

  for(var prop in obj.elementer){
    //looper gjennom alle elementer og finner kommu.
    if(alleKommuner === false){
      var kommunenummer = obj.elementer[prop].kommunenummer;

      if(kommunenummer === kommuneInput){
        var kommunenavn = prop;
        var menn = obj.elementer[prop].Menn[2018];
        var kvinner = obj.elementer[prop].Kvinner[2018];
        var totalBefolkning = menn + kvinner;

        skrivBefolkningsData(totalBefolkning, kommunenummer, kommunenavn, "detaljer");
        break;
      }
    }else{
      var test = [prop, obj.elementer[prop].kommunenummer];
      var kommunenavn = prop;
      var kommunenummer = obj.elementer[prop].kommunenummer;
      var menn = obj.elementer[prop].Menn[2018];
      var kvinner = obj.elementer[prop].Kvinner[2018];
      var totalBefolkning = menn + kvinner;

      skrivBefolkningsData(totalBefolkning, kommunenummer, kommunenavn, "oversikt");

    }
  }
}

/*
  Lager en Liste-node og setter inn befolkningsdata.
  TODO: give the variables color?
*/
function skrivBefolkningsData(totalBefolkning, kommunenummer, kommunenavn, id) {

  var node = document.createElement("LI");
  var textnode = document.createTextNode("Kommunenavn: " + kommunenavn +
  ", Kommunenummer: " +kommunenummer + ", Total befolkning: " + totalBefolkning);
  node.appendChild(textnode);

  document.getElementById(id).appendChild(node);
}
