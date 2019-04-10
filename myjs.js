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

      for (elements in obj.elementer){
        console.log(elements);
      }




      //console.log(obj.elementer.Halden.kommunenummer);










      //var str = JSON.stringify(obj);

    //var node = document.createElement("LI");
    //  console.log(str)


    //  document.getElementById("oversikt").appendChild(textnode);     // Append <li> to <ul> with id="myList"

      //console.log(obj);

    }
  };
  xhr.send();

}
