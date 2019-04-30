//De tre ulike URLene i oppgavesettet
var befolkning_url = "http://wildboy.uib.no/~tpe056/folk/104857.json";
var sysselsatte_url = "http://wildboy.uib.no/~tpe056/folk/100145.json";
var utdanning_url = "http://wildboy.uib.no/~tpe056/folk/85432.json";

//Viser de ulike divene etter brukerklikk
function changeDiv(divID){
  displayNone();
  divID.style.display = "block";

  if(divID.id === "oversikt"){
    var oversikt = new Befolknings_Data(befolkning_url);
    oversikt.printHtml();
  }
}

//Skjuler alle divene hver gang bruker klikker i navigasjonen.
function displayNone(){
  document.getElementById("introduksjon").style.display = "none";
  document.getElementById("oversikt").style.display = "none";
  document.getElementById("detaljer").style.display = "none";
  document.getElementById("sammenligning").style.display = "none";
}



//Funksjonen kalles når bruker skriver inn kommunenummer.
function kommuneInput(){
  var kommunenummer = document.getElementById('kommune').value;

  var oversikt = new Befolknings_Data(befolkning_url);
  var sysselsatte = new Sysselsatte(sysselsatte_url);
  var utdanning = new Utdanning(utdanning_url);

  var oversikt_info = oversikt.getInfo(kommunenummer);
  var sysselsatte_info = sysselsatte.getInfo(kommunenummer);
  var høyereUtdanning_info = utdanning.getHøyereUtdanning(kommunenummer);

  //metode som skriver ut oversikt over kommune(siste år).
  skrivNode(oversikt_info, sysselsatte_info, høyereUtdanning_info);


  //antall menn fra 2007 - 2018
  var antallMenn = oversikt.getAllBefolkning(kommunenummer, false);
  //antall kvinner fra 2007 - 2018
  var antallKvinner = oversikt.getAllBefolkning(kommunenummer, true);

  //grunnskole menn fra 2007 - 2018 (2018 er 0, ettersom det ikke er noe data på dette.)
  var grunnskoleMenn = utdanning.getUtdanning(kommunenummer, false, '01');
  //grunnskole kvinner fra 2007 - 2018 (2018 er 0, ettersom det ikker er noe data på dette)
  var grunnskoleKvinner = utdanning.getUtdanning(kommunenummer, true, '01');

  //regner ut totalen av menn og kvinner med grunnskole utdanning fra 2007-2018. (2018 blir 0, ettersom det ikke er noe data her.)
  var antallGrunnskole = regnAntallUtdanning(grunnskoleMenn, grunnskoleKvinner, antallMenn, antallKvinner);


  var videregåendeMenn = utdanning.getUtdanning(kommunenummer, false, '02a');
  var videregåendeKvinner = utdanning.getUtdanning(kommunenummer, true, '02a');
  var antallVideregående = regnAntallUtdanning(videregåendeMenn, videregåendeKvinner, antallMenn, antallKvinner);


  var fagskoleMenn = utdanning.getUtdanning(kommunenummer, false, '11');
  var fagskoleKvinner = utdanning.getUtdanning(kommunenummer, true, '11');
  var antallFagskole = regnAntallUtdanning(fagskoleMenn, fagskoleKvinner, antallMenn, antallKvinner);


  var universitetMenn_kort = utdanning.getUtdanning(kommunenummer, false, '03a');
  var universitetKvinner_kort = utdanning.getUtdanning(kommunenummer, true, '03a');
  var antallUniversitet_kort = regnAntallUtdanning(universitetMenn_kort, universitetKvinner_kort, antallMenn, antallKvinner);


  var universitetMenn_lang = utdanning.getUtdanning(kommunenummer, false, '04a');
  var universitetKvinner_lang = utdanning.getUtdanning(kommunenummer, true, '04a');
  var antallUniversitet_lang = regnAntallUtdanning(universitetMenn_lang, universitetKvinner_lang, antallMenn, antallKvinner);


  var uoppgittMenn = utdanning.getUtdanning(kommunenummer, false, '09a');
  var uoppgittKvinner = utdanning.getUtdanning(kommunenummer, true, '09a');
  var antalluoppgitt = regnAntallUtdanning(uoppgittMenn, uoppgittKvinner, antallMenn, antallKvinner);



  var totalProsentSysselsatte = sysselsatte.getAllSyselsatte(kommunenummer);

  lagTabell(oversikt_info, antallMenn, antallKvinner, totalProsentSysselsatte, antallGrunnskole, antallVideregående, antallFagskole,
  antallUniversitet_kort, antallUniversitet_lang, antalluoppgitt);

}

function regnAntallUtdanning(utdanningMenn, utdanningKvinner, antallMenn, antallKvinner){
  var antallUtdanning_array = [];

//looper gjennom de 11 årene.
  for(var i = 0; i <= 11; i++){
    //utdanning og antallmenn i gitt år "i";
    var antallMennUtdanning = (utdanningMenn[i]*antallMenn[i])/100;
    var antallKvinnerUtdanning = (utdanningKvinner[i]*antallKvinner[i])/100;
    var total = (antallMennUtdanning+antallKvinnerUtdanning);
    antallUtdanning_array.push(total);
  }
  return antallUtdanning_array;
}

function skrivNode(oversikt_info, sysselsatte_info, høyereUtdanning_info){

  var kommunenavn = oversikt_info[0];
  var kommunenummer = oversikt_info[1];

  var antallMenn = oversikt_info[2];
  var antallKvinner = oversikt_info[3];
  var totalBefolkning = (antallKvinner + antallMenn);

  //regner ut antall menn og kvinner som jobber.

  var antallJobbProsent = sysselsatte_info[4];
  var antallJobb = Math.floor((totalBefolkning * antallJobbProsent)/100);
  //Tar vekk det etter komma.


  var utdanningMenn_kort = høyereUtdanning_info[0];
  var utdanningKvinner_kort = høyereUtdanning_info[1];

  var utdanningMenn_lang = høyereUtdanning_info[2];
  var utdanningKvinner_lang = høyereUtdanning_info[3];

  var utdanningMenn_kort_antall = antallMenn * (utdanningMenn_kort/100);
  var utdanningMenn_lang_antall = antallMenn * (utdanningMenn_lang/100);

  var utdanningKvinner_kort_antall = antallKvinner * (utdanningKvinner_kort/100);
  var utdanningKvinner_lang_antall = antallKvinner * (utdanningKvinner_lang/100);

  var totalUtdanning = Math.round((utdanningMenn_kort_antall+utdanningMenn_lang_antall+
    utdanningKvinner_kort_antall+utdanningKvinner_lang_antall));

  var totalUtdanningProsent = (totalUtdanning*100)/totalBefolkning;

  var node = document.createElement("UL");
  node.setAttribute("id", "listDetaljer");

  var overskrifter = ["Kommunenavn: ", "Kommunenummer: ", "Total Befolkning: ", "Antall sysselatt: ",
"Antall sysselsatt(prosent): ", "Antall høyere utdanning: ", "Antall høyere utdanning(prosent): " ]

  var verdi = [kommunenavn, kommunenummer, totalBefolkning, Math.round(antallJobb), antallJobbProsent.toFixed(1),
    Math.round(totalUtdanning), totalUtdanningProsent.toFixed()];

  for(var i = 0; i < overskrifter.length; i++){
    var listNode = document.createElement("LI");
    var textNode = document.createTextNode(overskrifter[i] + verdi[i]);
    listNode.appendChild(textNode);
    node.appendChild(listNode);

  }

  document.getElementById('detaljer').appendChild(node);

}

function lagTabell(kommuneinfo, antallMenn, antallKvinner, sysselatte, antallGrunnskole, antallVideregående, antallFagskole,
antallUniversitet_kort, antallUniversitet_lang, antalluoppgitt){

  var x = document.createElement("TABLE");
  x.setAttribute("id", "myTable");
  document.body.appendChild(x);


  var y = document.createElement("TR");
  y.setAttribute("id", "myTr");
  document.getElementById("myTable").appendChild(y);


  var overskrifter = ["Årstall","Total befolkning","Antall sysselsatt", "Antall sysselsatt(%)", "Fullført Grunnskole",
"Fullført Grunnskole(%)", "Fullført Videregående", "Fullført videregående(%)", "Fullført fagskole", "Fullført fagskole(%)",
"Fullført kort universitet", "Fullført kort universitet(%)", "Fullført universitet lang", "Fullført universitet lang(%)",
"uoppgitt", "uoppgitt(%)"];


  for(var i = 0; i < overskrifter.length; i++){
    var z = document.createElement("TD");
    var t = document.createTextNode(overskrifter[i]);
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

  }


  for(var i = 0; i <= 11; i++){


    var totalBefolkning = (antallMenn[i] + antallKvinner[i]);

    var bortover = document.createElement("TR");
    bortover.setAttribute("id", "myTr" + i);
    document.getElementById("myTable").appendChild(bortover);

    var årstallTD = document.createElement("TD");
    var årstallNode = document.createTextNode(2007 + i);
    årstallTD.appendChild(årstallNode);
    document.getElementById("myTr" + i).appendChild(årstallTD);


    var totalBefolkningTD = document.createElement("TD");
    var totalBefolkningNode = document.createTextNode(totalBefolkning);
    totalBefolkningTD.appendChild(totalBefolkningNode);
    document.getElementById("myTr" + i).appendChild(totalBefolkningTD);

    var antallSysselsatteTD = document.createElement("TD");
    var antallSysselsatteNode = document.createTextNode(Math.round((sysselatte[i] * totalBefolkning)/100));
    antallSysselsatteTD.appendChild(antallSysselsatteNode);
    document.getElementById("myTr" + i).appendChild(antallSysselsatteTD);

    var antallSysselsatteTDProsent = document.createElement("TD");
    var antallSysselsatteNodeProsent = document.createTextNode(sysselatte[i].toFixed(1));
    antallSysselsatteTDProsent.appendChild(antallSysselsatteNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallSysselsatteTDProsent);

    var antallGrunnskoleTD = document.createElement("TD");
    var antallGrunnskoleNode = document.createTextNode(Math.round(antallGrunnskole[i]));
    antallGrunnskoleTD.appendChild(antallGrunnskoleNode);
    document.getElementById("myTr" + i).appendChild(antallGrunnskoleTD);

    var antallGrunnskoleTDProsent = document.createElement("TD");
    var antallGrunnskoleNodeProsent = document.createTextNode(((antallGrunnskole[i] * 100)/totalBefolkning).toFixed(1));
    antallGrunnskoleTDProsent.appendChild(antallGrunnskoleNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallGrunnskoleTDProsent);

    var antallVideregåendeTD = document.createElement("TD");
    var antallVideregåendeNode = document.createTextNode(Math.round(antallVideregående[i]));
    antallVideregåendeTD.appendChild(antallVideregåendeNode);
    document.getElementById("myTr" + i).appendChild(antallVideregåendeTD);

    var antallVideregåendeTDProsent = document.createElement("TD");
    var antallVideregåendeNodeProsent = document.createTextNode(((antallVideregående[i] * 100)/totalBefolkning).toFixed(1));
    antallVideregåendeTDProsent.appendChild(antallVideregåendeNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallVideregåendeTDProsent);

    var antallFagskoleTD = document.createElement("TD");
    var antallFagskoleNode = document.createTextNode(Math.round(antallFagskole[i]));
    antallFagskoleTD.appendChild(antallFagskoleNode);
    document.getElementById("myTr" + i).appendChild(antallFagskoleTD);

    var antallFagskoleTDProsent = document.createElement("TD");
    var antallFagskoleNodeProsent = document.createTextNode(((antallFagskole[i] * 100)/totalBefolkning).toFixed(1));
    antallFagskoleTDProsent.appendChild(antallFagskoleNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallFagskoleTDProsent);

    var antallUtdanningKortTD = document.createElement("TD");
    var antallUtdanningKortNode = document.createTextNode(Math.round(antallUniversitet_kort[i]));
    antallUtdanningKortTD.appendChild(antallUtdanningKortNode);
    document.getElementById("myTr" + i).appendChild(antallUtdanningKortTD);

    var antallUtdanningKortTDProsent = document.createElement("TD");
    var antallUtdanningKortNodeProsent = document.createTextNode(((antallUniversitet_kort[i] * 100)/totalBefolkning).toFixed(1));
    antallUtdanningKortTDProsent.appendChild(antallUtdanningKortNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallUtdanningKortTDProsent);

    var antallUtdanningLangTD = document.createElement("TD");
    var antallUtdanningLangNode = document.createTextNode(Math.round(antallUniversitet_lang[i]));
    antallUtdanningLangTD.appendChild(antallUtdanningLangNode);
    document.getElementById("myTr" + i).appendChild(antallUtdanningLangTD);

    var antallUtdanningLangTDProsent = document.createElement("TD");
    var antallUtdanningLangNodeProsent = document.createTextNode(((antallUniversitet_lang[i] * 100)/totalBefolkning).toFixed(1));
    antallUtdanningLangTDProsent.appendChild(antallUtdanningLangNodeProsent);
    document.getElementById("myTr" + i).appendChild(antallUtdanningLangTDProsent);

    var antalluoppgittTD = document.createElement("TD");
    var antalluoppgittNode = document.createTextNode(Math.round(antalluoppgitt[i]));
    antalluoppgittTD.appendChild(antalluoppgittNode);
    document.getElementById("myTr" + i).appendChild(antalluoppgittTD);

    var antalluoppgittTDProsent = document.createElement("TD");
    var antalluoppgittNodeProsent = document.createTextNode(((antalluoppgitt[i] * 100)/totalBefolkning).toFixed(1));
    antalluoppgittTDProsent.appendChild(antalluoppgittNodeProsent);
    document.getElementById("myTr" + i).appendChild(antalluoppgittTDProsent);


  }

  document.getElementById('detaljer').appendChild(x);



}

function sammenligningFunksjon(){
  var innledning = document.createElement("div");
  innledning.setAttribute("id", "sammenligningInnledning");
  var innledningsNode = document.createTextNode("Grønn farge markerer størst vekst")
  innledning.appendChild(innledningsNode);
  document.getElementById('sammenligning').appendChild(innledning);

  var kommune1 = document.getElementById('kommune1').value;
  var kommune2 = document.getElementById('kommune2').value;

  var sysselsatte = new Sysselsatte(sysselsatte_url);
  var befolkning = new Befolknings_Data(befolkning_url);



  var kommune1_info = sysselsatte.getMennOgKvinner(kommune1);
  var kommune2_info = sysselsatte.getMennOgKvinner(kommune2);

  var kommune1_navn = befolkning.getName(kommune1);
  var kommune2_navn = befolkning.getName(kommune2);


  var x = document.createElement("TABLE");
  x.setAttribute("id", "myTableSammenligning");
  document.body.appendChild(x);


  var y = document.createElement("TR");
  y.setAttribute("id", "myTrSammenligning");
  document.getElementById("myTableSammenligning").appendChild(y);

  var overskrifter = ["Årstall", kommune1_navn + " menn", kommune2_navn + " menn ",
kommune1_navn + " kvinner", kommune2_navn + " kvinner"];


  for(var i = 0; i < overskrifter.length; i++){
    var z = document.createElement("TD");
    var t = document.createTextNode(overskrifter[i]);
    z.appendChild(t);
    document.getElementById("myTrSammenligning").appendChild(z);

  }

  var startår = 2005;

  var prosent_menn_forrige_år_kommune1 = kommune1_info[0];
  var prosent_menn_forrige_år_kommune2 = kommune2_info[0];

  var prosent_kvinner_forrige_år_kommune1 = kommune1_info[1];
  var prosent_kvinner_forrige_år_kommune2 = kommune2_info[1];

  for(var i = 0; i < kommune1_info.length; i=i+2){

    var bortover = document.createElement("TR");
    bortover.setAttribute("id", "myTrSammenligning" + i);
    document.getElementById("myTableSammenligning").appendChild(bortover);

    var årstallTD = document.createElement("TD");
    var årstallNode = document.createTextNode(startår);
    årstallTD.appendChild(årstallNode);
    document.getElementById("myTrSammenligning" + i).appendChild(årstallTD);


    if(i === 0){
      var kommune1MennTD = document.createElement("TD");
      var kommune1MennNode = document.createTextNode(kommune1_info[i]);
      kommune1MennTD.appendChild(kommune1MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1MennTD);

      var kommune2MennTD = document.createElement("TD");
      var kommune2MennNode = document.createTextNode(kommune2_info[i]);
      kommune2MennTD.appendChild(kommune2MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2MennTD);

      var kommune1KvinnerTD = document.createElement("TD");
      var kommune1KvinnerNode = document.createTextNode(kommune1_info[i+1]);
      kommune1KvinnerTD.appendChild(kommune1KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1KvinnerTD);

      var kommune2KvinnerTD = document.createElement("TD");
      var kommune2KvinnerNode = document.createTextNode(kommune2_info[i+1]);
      kommune2KvinnerTD.appendChild(kommune2KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2KvinnerTD);
      startår++;

      continue;

    }


    var vekst_menn_kommune1 = sjekkProsentVekst(prosent_menn_forrige_år_kommune1, kommune1_info[i]);
    var vekst_menn_kommune2 = sjekkProsentVekst(prosent_menn_forrige_år_kommune2, kommune2_info[i]);

    var vekst_kvinner_kommune1 = sjekkProsentVekst(prosent_kvinner_forrige_år_kommune1, kommune1_info[i]);
    var vekst_kvinner_kommune2 = sjekkProsentVekst(prosent_kvinner_forrige_år_kommune2, kommune2_info[i]);



    if(vekst_menn_kommune1 > vekst_menn_kommune2){
      var kommune1MennTD = document.createElement("TD");
      var kommune1MennNode = document.createTextNode(kommune1_info[i]);
      kommune1MennTD.setAttribute("class", "størstVekst");

      kommune1MennTD.appendChild(kommune1MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1MennTD);

      var kommune2MennTD = document.createElement("TD");
      var kommune2MennNode = document.createTextNode(kommune2_info[i]);
      kommune2MennTD.appendChild(kommune2MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2MennTD);

    } else {

      var kommune1MennTD = document.createElement("TD");
      var kommune1MennNode = document.createTextNode(kommune1_info[i]);
      kommune1MennTD.appendChild(kommune1MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1MennTD);

      var kommune2MennTD = document.createElement("TD");
      var kommune2MennNode = document.createTextNode(kommune2_info[i]);
      kommune2MennTD.setAttribute("class", "størstVekst");

      kommune2MennTD.appendChild(kommune2MennNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2MennTD);
    }

    if(vekst_kvinner_kommune1 > vekst_kvinner_kommune2){
      var kommune1KvinnerTD = document.createElement("TD");
      var kommune1KvinnerNode = document.createTextNode(kommune1_info[i+1]);
      kommune1KvinnerTD.setAttribute("class", "størstVekst");

      kommune1KvinnerTD.appendChild(kommune1KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1KvinnerTD);

      var kommune2KvinnerTD = document.createElement("TD");
      var kommune2KvinnerNode = document.createTextNode(kommune2_info[i+1]);
      kommune2KvinnerTD.appendChild(kommune2KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2KvinnerTD);

    } else{

      var kommune1KvinnerTD = document.createElement("TD");
      var kommune1KvinnerNode = document.createTextNode(kommune1_info[i+1]);
      kommune1KvinnerTD.appendChild(kommune1KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune1KvinnerTD);

      var kommune2KvinnerTD = document.createElement("TD");
      var kommune2KvinnerNode = document.createTextNode(kommune2_info[i+1]);
      kommune2KvinnerTD.setAttribute("class", "størstVekst");

      kommune2KvinnerTD.appendChild(kommune2KvinnerNode);
      document.getElementById("myTrSammenligning" + i).appendChild(kommune2KvinnerTD);
    }


    prosent_menn_forrige_år_kommune1 = kommune1_info[i];
    prosent_menn_forrige_år_kommune2 = kommune2_info[i];

    prosent_kvinner_forrige_år_kommune1 = kommune1_info[i+1];
    prosent_kvinner_forrige_år_kommune2 = kommune2_info[i+1];

    startår++;

  }

  document.getElementById('sammenligning').appendChild(x);

}

//hjelpemetode som sjekker vekstforskjell gitt to ulike prosenter.
function sjekkProsentVekst(prosent1, prosent2){
  var vekst = prosent2 - prosent1;
  return vekst;


}


//Konstruktør utdanning.
function Utdanning(url){
  this.url = url;
  var obj;
  this.load();

}

//load-funksjon som laster inn datasettet. Kjøres når objektet Utdannign opprettes.
Utdanning.prototype.load = function() {
  var ajax = new XMLHttpRequest();

  ajax.open("GET",this.url,false);
  ajax.send();
  if (ajax.readyState == 4) {
    this.obj =  JSON.parse(ajax.responseText);
  } else {
    console.log("GREIDE IKKE Å LASTE DATASETT");
  }
};

//returnerer info om utdanning for gitt kommunenummer.
Utdanning.prototype.getUtdanning = function(kommunenummer_input, kvinner, utdanning){
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){
      var år = 2007;
      var info_array = [];
      for(var i = 0; i < 11; i++){
        if(kvinner){
          var utdanningKvinner = this.obj.elementer[prop][utdanning].Kvinner[(år+i)];
          info_array.push(utdanningKvinner);
        }else{
          var utdanningMenn = this.obj.elementer[prop][utdanning].Menn[(år+i)];
          info_array.push(utdanningMenn);
        }

    }
    // har ikke data på 2018. Legger det inn som 0,
    info_array.push(0);

    return info_array;
    }
  }
}

//returnerer info om menn og kvinner som har høyere utdanning (03a og 04a).
Utdanning.prototype.getHøyereUtdanning = function(kommunenummer_input){

  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){

      var utdanningKortMenn = this.obj.elementer[prop]["03a"].Menn[2017]
      var utdanningKortKvinner = this.obj.elementer[prop]["03a"].Kvinner[2017]

      var utdanningLangMenn = this.obj.elementer[prop]["04a"].Menn[2017];
      var utdanningLangKvinner = this.obj.elementer[prop]["04a"].Kvinner[2017];
      console.log(this.obj.elementer[prop]["03a"]);


      //returnerer variablene i et array i følgende rekkefølge:  Kort utdanning menn, kort utdanning kvinner,
      //lang utdanning menn, lang utdanning kvinner.

      var info_array = [utdanningKortMenn, utdanningKortKvinner, utdanningLangMenn, utdanningLangKvinner];
      return info_array;


    }
  }

};




//Konstruktør sysselatt.
function Sysselsatte(url){
  this.url = url;
  var obj;
  this.load();

}

//Load laster inn dokumentet. Kjøres hver gang objektet opprettes.
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

//Metode som returnerer sysselsatte menn % og kvinner% for alle år fra 2005, i en liste.
Sysselsatte.prototype.getMennOgKvinner = function(kommune_input){
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommune_input){
      var år = 2005;
      var info_array = [];
      for(var i = 0; i <= 13; i++){
        var antallMenn = this.obj.elementer[prop].Menn[år]
        var antallKvinner = this.obj.elementer[prop].Kvinner[år]

        info_array.push(antallMenn);
        info_array.push(antallKvinner);
        år = år + 1;

      }
      return info_array;
    }
  }
}

//Metode som returnerer sysselsatte begge kjønn% for alle år fra 2007, i en liste.
Sysselsatte.prototype.getAllSyselsatte = function(kommune_input){
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommune_input){
      var år = 2007;
      var info_array = [];
      for(var i = 0; i <= 11; i++){
        var antallSysselsatte = this.obj.elementer[prop]['Begge kjønn'][år]
        info_array.push(antallSysselsatte);
        år = år + 1;

      }
      return info_array;
    }
  }
}


//returnerer all info om sysselsetting for et gitt kommunenummer. (returnerer siste år, 2018).
Sysselsatte.prototype.getInfo = function(kommunenummer_input) {

  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommunenummer_input){

      var kommunenavn = prop;
      var sysselsatte_menn = this.obj.elementer[prop].Menn[2018];
      var sysselsatte_kvinner = this.obj.elementer[prop].Kvinner[2018];

      var total_sysselsatte_prosent = this.obj.elementer[prop]['Begge kjønn'][2018];


      var info_array = [kommunenavn, kommunenummer, sysselsatte_menn, sysselsatte_kvinner, total_sysselsatte_prosent];


      return info_array;;

    }

    }
};



//Konstruktør for befolknings objektet.
function Befolknings_Data(url) {

this.url = url;
var obj;

this.load();

}

//Load metoden kjøres hver gang objektet opprettes.
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


//returnerer kommunenavn gitt kommunenummer.
Befolknings_Data.prototype.getName = function(kommunenummer_input) {

  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;

    if(kommunenummer === kommunenummer_input){
      var kommunenavn = prop;
      return kommunenavn;
    }

    }
    return ("NULL");

};

//Returnerer alle kommunenummer i en liste.
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
//Printer oversikt over all befolkning.
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

//Returnerer all info om en gitt kommune fra 2007.
//PARAM: Kvinner er en bolsk variable. Hvis kvinner er false, returnerer den info om menn.
Befolknings_Data.prototype.getAllBefolkning = function(kommune_input, kvinner){
  for(var prop in this.obj.elementer){
    var kommunenummer = this.obj.elementer[prop].kommunenummer;
    if(kommunenummer === kommune_input){
      var år = 2007;
      var info_array = [];
      for(var i = 0; i <= 11; i++){
        if(kvinner === false){
          var menn = this.obj.elementer[prop].Menn[år]
          info_array.push(menn);
          år = år + 1;
        }else{
          var kvinner = this.obj.elementer[prop].Kvinner[år]
          info_array.push(kvinner);
          år = år + 1;

        }
      }
      return info_array;
    }
  }

}

//Returnerer info om en kommune, gitt kommunenummer. For siste år, 2018.
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
