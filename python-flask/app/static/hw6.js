var cards = new Array();
var items;
var info = new Array();
var extendBackup;
var container2=document.createElement("div");
var built = 0;

function validateForm(){
    if (built===1){
        //document.getElementById("card"+0).remove();
        document.getElementById("container2").remove();
        built=0;
    }
    //document.getElementById("container2").style.display="none";
    var keywords = document.getElementById("keywords").value;
    var priceMin = document.getElementById("minprice").value;
    var priceMax = document.getElementById("maxprice").value;
    var newItem = document.getElementById("new").checked;
    var usedItem = document.getElementById("used").checked;
    var verygood = document.getElementById("verygood").checked;
    var good = document.getElementById("good").checked;
    var acceptable = document.getElementById("acceptable").checked;
    var return_accepted = document.getElementById("return_accepted").checked;
    var freeShipping = document.getElementById("free").checked;
    var expeShipping = document.getElementById("expedited").checked;
    var sortby = document.getElementById("sortby").value;


    var min_val = parseInt(document.getElementById("minprice").value);
    var max_val = parseInt(document.getElementById("maxprice").value);

    if ((priceMin !=="" && min_val < 0.0)||(priceMax !=="" && max_val < 0.0)){
        alert("Price Range values cannot be negative! Please try a value greater than or equal to 0.0");
        return false;
    }else if (priceMin !=="" && priceMax !==""){
        if (min_val > max_val){
            alert("Oops! Lower price limit cannot be greater than upper price limit! Please try again.");
        //console.log(min);
        return false;
        }

    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var text=xhttp.responseText;
            var jsonInfo=JSON.parse(text);
            if(jsonInfo.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries[0] === "0"){
                built=1;
                createContainer2();
                //document.getElementById("container2").style.display="block";
                var noFound = document.createElement("p");
                noFound.setAttribute("class","NoFound");
                noFound.innerHTML = "No Results Found";
                document.getElementById("container2").appendChild(noFound);

            }
            else{
                built=1;
                //create card for each item
                displayResult(text);
            }

            console.log(text);
        }
    };

    const formUrl = "/query?keywords="+keywords+"&minprice="+priceMin+"&maxprice="+priceMax+
                     "&new="+newItem+"&used="+usedItem+"&verygood="+verygood+"&good="+good+
                     "&acceptable="+acceptable+"&return_accepted="+return_accepted+"&free="+
                     freeShipping+"&expedited="+expeShipping+"&sortby="+sortby;
    xhttp.open("GET",formUrl);
    xhttp.send();
    //alert("success");
    return true;
}

function createContainer2() {
    var container2=document.createElement("div");
    container2.setAttribute("id","container2")
    document.getElementById("container").appendChild(container2);
}
function displayResult(data){

    createContainer2();

    var jsoncontent = JSON.parse(data);

    //handle results
    var total_result = document.createElement("p");
    total_result.setAttribute("class","result");
    total_result.innerHTML = jsoncontent.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries[0] + " Results found for <i>"+document.getElementById("keywords").value+"</i>";
    document.getElementById("container2").appendChild(total_result);

    var line = document.createElement("hr");
    line.style.width="802px";
    document.getElementById("container2").appendChild(line);
    items = jsoncontent.findItemsAdvancedResponse[0].searchResult[0].item;

    for (var i = 0; i < items.length;i++){
        var basicInfo = "";
        var card = document.createElement("div");
        //card.style.cssText = "border:2px solid; border-radius:10px; width:800px; height:200px; margin-bottom: 3px;background-color: #EFEFEF; margin-left: 100px";
        card.setAttribute("id","card"+i);
        card.setAttribute("class","card");
        card.setAttribute("onclick","extendCard("+i+")");
        var galleryi= "gallery"+i;
        if (items[i].galleryURL[0]==="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
            basicInfo += "<img src = \"img/default.jpg\" class='gallery' onmouseover='setOldImage("+i+")' onmouseout='restore("+i+")' id='"+galleryi+"'>";
            //basicInfo +="<img src=\""+items[i].galleryURL[0]+"\" style='position: absolute; margin-left: -350px; margin-top: 30px; border: 5px grey solid'>";
        }else{
            //basicInfo +="<img src=\""+items[i].galleryURL[0]+"\" class='gallery'>";
            basicInfo +="<img src=\""+items[i].galleryURL[0]+"\" class='gallery' onmouseover='setOldImage("+i+")' onmouseout='restore("+i+")' id='"+galleryi+"'>";
        }
        //add title
        basicInfo +="<p class='card-title' id='card-title"+i+"'>" + items[i].title[0]+ "</p >";
        //add category & redirection
        basicInfo +="<p class='category' id='category' >Category:" + items[i].primaryCategory[0].categoryName[0] + "<a href = \"" + items[i].viewItemURL[0] + "\" target='_blank'><img src = \"img/redirect.png\" class='redirection' id='redirection'+i  width=\"20px\" height=\"20px\"></a >"+"</p>";
        //add redirection
        //basicInfo += "<a href = \"" + items[i].viewItemURL[0] + "\" target='_blank'><img src = \"img/redirect.png\" id='redirection'+i style='position: absolute; margin-left: 110px; margin-top: 60px' width=\"20px\" height=\"20px\"></a >";
        //add condition & itemTopRated
         if(items[i].topRatedListing[0] ==="true"){
            //basicInfo += "<img class='rate' id = 'rate' src = \"img/topRatedImage.png\" width=\"30px\" height=\"30px\">";
             basicInfo += "<p class='condition' id='condition' >Condition:" + items[i].condition[0].conditionDisplayName[0]+"<img class='rate' id = 'rate' src = \"img/topRatedImage.png\" width=\"20px\" height=\"20px\">" + "</p >";
        }else{
             basicInfo += "<p class='condition' id='condition' >Condition:" + items[i].condition[0].conditionDisplayName[0] + "</p >";
         }

         //add Price
         basicInfo += "<p class='price' id='price"+i+"' ><b>Price: $" + items[i].sellingStatus[0].convertedCurrentPrice[0].__value__;
        if(parseFloat(items[i].shippingInfo[0].shippingServiceCost[0].__value__) > 0.0){
            basicInfo += "( + $" + items[i].shippingInfo[0].shippingServiceCost[0].__value__ + "for shipping)</b></p >";
        }
        else{
            basicInfo += "</b></p >";
        }


        card.innerHTML = basicInfo;
        info[i]=basicInfo;
        cards[i]=card;
        if(i<2){
            document.getElementById("container2").appendChild(card);
        }else if(i===2){
            document.getElementById("container2").appendChild(card);
            var myBtn=document.createElement("div");
            //myBtn.setAttribute("onclick",myFunction());
            myBtn.innerHTML= "<button onclick=\"readMore()\" id=\"myBtn\" style='margin-bottom: 10px; border: none'>Read more</button>";
            document.getElementById("container2").appendChild(myBtn);
        }
            //document.getElementById("container").appendChild(card);

    }

}

function readMore() {
    document.getElementById("myBtn").remove();

    for (var i = 3; i < items.length;i++){

        document.getElementById("container2").appendChild(cards[i]);
    }
    var myBtn2=document.createElement("div");
            //myBtn.setAttribute("onclick",myFunction());
            myBtn2.innerHTML= "<button onclick=\"readLess()\" id=\"myBtn2\" style='margin-bottom: 10px; border: none'>Show less</button>";
            document.getElementById("container2").appendChild(myBtn2);

}

function readLess(){
    for (var i = 3; i < 10;i++){
        document.getElementById("card"+i).remove();
    }
    document.getElementById("myBtn2").remove();
    var myBtn=document.createElement("div");
            //myBtn.setAttribute("onclick",myFunction());
            myBtn.innerHTML= "<button onclick=\"readMore()\" id=\"myBtn\">Read more</button>";
            document.getElementById("container2").appendChild(myBtn);

}



function extendCard(i){
     event.cancelBubble=true;
     var card = document.getElementById("card"+i);
     card.style.height="280px";
     var price=document.getElementById("price"+i);
     price.style.marginTop="220px";
     var gallery = document.getElementById("gallery"+i);
     gallery.style.marginTop="70px";
     var title=document.getElementById("card-title"+i).innerHTML;
     document.getElementById("card-title"+i).remove();
     var detailedCard=document.createElement("p");
     detailedCard.setAttribute("class","card-detailed-title");
     detailedCard.innerHTML=title;
     card.appendChild(detailedCard);
     //document.getElementById("card-title"+i).style.overflow="visible";
     //document.getElementById("card-title"+i).style.textOverflowo="initial";
     //document.getElementById("card-title"+i).style.width="300px";
     var priceInfo = "";
     var acceptInfo = "";

         if (items[i].returnsAccepted[0]==="true"){
             acceptInfo+="<p class=\"accepts\">Seller <b>accepts</b> returns</p>";
         }else{
             acceptInfo+="<p class=\"accepts\">Seller <b>does not accept</b> returns</p>";
         }
         //var info = basicInfo+acceptInfo;
         if(parseFloat(items[i].shippingInfo[0].shippingServiceCost[0].__value__) === 0.0){

                 acceptInfo+="<p class=\"ship\">Free Shipping ";


         }else{
                 acceptInfo+="<p class=\"ship\">No Free Shipping ";
         }

         if(items[i].shippingInfo[0].expeditedShipping[0]==="true"){
                 acceptInfo +=" -- Expedited Shipping available</p>";
         }else{
                 acceptInfo += "</p>";
         }

     card.innerHTML+=acceptInfo;
     var exit= document.createElement("img");
     exit.src = "img/exit.jpg";
     exit.setAttribute("class","exit");
     exit.setAttribute("onclick","getOldCard("+i+")");
     card.appendChild(exit);
     priceInfo += "<p ><b>Price: $" + items[i].sellingStatus[0].convertedCurrentPrice[0].__value__;
        if(parseFloat(items[i].shippingInfo[0].shippingServiceCost[0].__value__) > 0.0){
            priceInfo += "( + $" + items[i].shippingInfo[0].shippingServiceCost[0].__value__ + "for shipping) </b> <i> from "+items[i].location[0]+"</i></p >";
        }
        else{
            priceInfo += "<i>from "+items[i].location[0]+"</i></b></p >";
        }

     document.getElementById("price"+i).innerHTML=priceInfo;
        card.setAttribute("onClick", null);

}
function getOldCard(i){
    event.cancelBubble=true;
     var card = document.getElementById("card"+i);
     document.getElementById("card"+i).setAttribute("onclick","extendCard("+i+")");
     card.style.height="200px";
     card.innerHTML=info[i];
     document.getElementsById("exit").remove();

}
function setOldImage(i) {
    var image = document.getElementById("gallery"+i);
    image.style.height="200px";
    image.style.width="160px";
    image.style.border="0";
    image.style.marginTop="0";
    image.style.marginLeft="-360px";
}

function restore(i){
    var image = document.getElementById("gallery"+i);
    image.style.border="5px grey solid";
    image.style.width="120px";
    image.style.height="125px";
    image.style.marginTop="30px";
    image.style.marginLeft="-350px";
}

function clearForm(){
    document.getElementById("searchForm").reset();
    document.getElementById("container2").remove();
    document.getElementsByName("sortby")[0].selectedIndex = document.getElementsByName('sortby')[0].value;
    javascript:location.reload();
    //document.getElementById("myBtn").remove();
     //document.getElementById("myBtn2").remove();
    //document.getElementById("card"+0).remove();
    //document.getElementById("card"+1).remove();
    //document.getElementById("card"+2).remove();
}
