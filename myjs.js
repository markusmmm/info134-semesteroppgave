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



function sysselsetting(obj,kommuneInput){
  for(var prop in obj.elementer){
    var kommunenummer = obj.elementer[prop].kommunenummer;

    if(kommunenummer === kommuneInput){
      var menn_sysselsatt = obj.elementer[prop].Menn;
    }

  }
}







//Funksjonen kalles når bruker skriver inn kommunenummer.
function kommuneInput(){

  var kommunenummer = document.getElementById('kommune').value;
  var oversikt = new Befolknings_Data(befolkning_url);
  var info = oversikt.returnInfo(kommunenummer);

  document.getElementById('detaljer').appendChild(info);


}

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
Befolknings_Data.prototype.returnNames = function() {
  var kommunenavn_liste = [];
  for(var prop in this.obj.elementer){
    //looper gjennom alle elementer og finner kommu.
      kommunenavn_liste.push(prop);

      }
      return kommunenavn_liste;

};

Befolknings_Data.prototype.returnNumbers = function() {
  var kommunenummer_liste = [];
  for(var prop in this.obj.elementer){
      var kommunenummer = this.obj.elementer[prop].kommunenummer;
      kommunenummer_liste.push(kommunenummer);

      }
      return kommunenummer_liste;
};

//printer i htmldokumentet.
//ID = div hvor der printes.
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

Befolknings_Data.prototype.returnInfo = function(kommunenummer_input) {
  var node = document.createElement("LI");
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){

      var kommunenavn = prop;
      var menn = this.obj.elementer[prop].Menn[2018];
      var kvinner = this.obj.elementer[prop].Kvinner[2018];
      var totalBefolkning = menn + kvinner;

      var textnode = document.createTextNode("Kommunenavn: " + kommunenavn +
      ", Kommunenummer: " +kommunenummer + ", Total befolkning: " + totalBefolkning);

      node.appendChild(textnode);
      return node;

    }else{

    }

    }
    alert("Ugyldig kommunenummer");
};
