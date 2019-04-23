var befolkning_url = "http://wildboy.uib.no/~tpe056/folk/104857.json";
var sysselsatte_url = "http://wildboy.uib.no/~tpe056/folk/100145.json";
var utdanning_url = "http://wildboy.uib.no/~tpe056/folk/85432.json";

function changeDiv(divID){
  displayNone();
  divID.style.display = "block";

  if(divID.id === "oversikt"){

    var oversikt = new Befolknings_Data(befolkning_url);
    oversikt.printHtml();

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



function test(){
  var sysselsatte = new Sysselsatte(sysselsatte_url);


}




//TODO BEGGE KJØNN.
//Funksjonen kalles når bruker skriver inn kommunenummer.
function kommuneInput(){

  var kommunenummer = document.getElementById('kommune').value;
  var oversikt = new Befolknings_Data(befolkning_url);
  var sysselsatte = new Sysselsatte(sysselsatte_url);

  var oversikt_info = oversikt.getInfo(kommunenummer);
  var sysselsatte_info = sysselsatte.getInfo(kommunenummer);
  regnUtAntallSysselsatte(oversikt_info, sysselsatte_info);


  //document.getElementById('detaljer').appendChild(oversikt_info);
  //document.getElementById('detaljer').appendChild(sysselsatte_info);


}

function regnUtAntallSysselsatte(oversikt_info, sysselsatte_info){
  var antallMenn = oversikt_info[2];
  var antallKvinner = oversikt_info[3];
  var jobbMenn_prosent = sysselsatte_info[2];
  var jobbKvinner_prosent = sysselsatte_info[3];

  var antallMennJobb = antallMenn * (jobbMenn_prosent/100);
  var antallKvinnerJobb = antallKvinner * (jobbKvinner_prosent/100);

  console.log("antall menn " + antallMennJobb);
  console.log("antall kvinner " + antallKvinnerJobb);


}





function Sysselsatte(url){
  this.url = url;
  var obj;
  this.load();

}

Sysselsatte.prototype.load = function() {
  var ajax = new XMLHttpRequest();

  ajax.open("GET",this.url,false);
  ajax.send();
  if (ajax.readyState == 4) {
    this.obj =  JSON.parse(ajax.responseText);
  } else {
    console.log("GREIDE IKKE Å LASTE DATASETT");
  }

};



Sysselsatte.prototype.getInfo = function(kommunenummer_input) {

  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){

      var kommunenavn = prop;
      var sysselsatte_menn = this.obj.elementer[prop].Menn[2018];
      var sysselsatte_kvinner = this.obj.elementer[prop].Kvinner[2018];
    //  var total_sysselsatte = this.obj.elementer[prop].Begge_kjønn[2018];


      var info_array = [kommunenavn, kommunenummer, sysselsatte_menn, sysselsatte_kvinner];


      return info_array;;

    }

    }
};





// konstruktøren gir initielle verdier
function Befolknings_Data(url) {
// var r = Object.create(range.prototype) <- unødvendig
this.url = url;
var obj;

this.load();

}
Befolknings_Data.prototype.load = function() {
  var ajax = new XMLHttpRequest();

  ajax.open("GET",this.url,false);
  ajax.send();
  if (ajax.readyState == 4) {
    this.obj =  JSON.parse(ajax.responseText);
  } else {
    console.log("GREIDE IKKE Å LASTE DATASETT");
  }

};

Befolknings_Data.prototype.returnObj = function() {
  return this.obj;
};

//returnerer alle kommunenavn
Befolknings_Data.prototype.getNames = function() {
  var kommunenavn_liste = [];
  for(var prop in this.obj.elementer){
    //looper gjennom alle elementer og finner kommu.
      kommunenavn_liste.push(prop);

      }
      return kommunenavn_liste;

};

Befolknings_Data.prototype.getIDs = function() {
  var kommunenummer_liste = [];
  for(var prop in this.obj.elementer){
      var kommunenummer = this.obj.elementer[prop].kommunenummer;
      kommunenummer_liste.push(kommunenummer);

      }
      return kommunenummer_liste;
};

//printer i htmldokumentet.
//ID = div hvor der printes.
//kun metode for befolknings oversikt.
Befolknings_Data.prototype.printHtml = function(){

  for(var prop in this.obj.elementer){

      var kommunenummer = this.obj.elementer[prop].kommunenummer;
      var kommunenavn = prop;
      var menn = this.obj.elementer[prop].Menn[2018];
      var kvinner = this.obj.elementer[prop].Kvinner[2018];
      var totalBefolkning = menn + kvinner;

      var node = document.createElement("LI");
      var textnode = document.createTextNode("Kommunenavn: " + kommunenavn +
      ", Kommunenummer: " +kommunenummer + ", Total befolkning: " + totalBefolkning);

      node.appendChild(textnode);
      document.getElementById('oversikt').appendChild(node);

    }

}

Befolknings_Data.prototype.getInfo = function(kommunenummer_input) {
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){

      var kommunenavn = prop;
      var menn = this.obj.elementer[prop].Menn[2018];
      var kvinner = this.obj.elementer[prop].Kvinner[2018];
      var totalBefolkning = menn + kvinner;


      var info_array = [kommunenavn, kommunenummer, menn, kvinner, totalBefolkning];


      return info_array;;

    }

    }
};
