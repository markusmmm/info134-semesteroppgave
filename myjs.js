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
      for(var prop in obj.elementer){
        var kommunenummer = obj.elementer[prop].kommunenummer;

        var men = obj.elementer[prop].Menn[2018];
        var women = obj.elementer[prop].Kvinner[2018];
        var total = men + women;
        var lastElement = obj.elementer[prop];

      }
      console.log(lastElement);
      
      console.log(women);
      console.log(men);

      console.log(total);


      console.log(kommunenummer);
      //console.log(x.Menn[2018]);



    }
  };
  xhr.send();
}
