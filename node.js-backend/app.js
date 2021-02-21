var express = require('express');
// var debug = require('debug');
var path = require('path');
var cors = require('cors');
var request=require('request');
var url = require("url");
appKey = 'YanMo-usc571ho-PRD-22eba4255-594551c0';

var app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

app.get('/users', (req, res) => {
  var arg = url.parse(req.url, true).query;
  buildUrl(arg,res);
});

app.get('/details', (req, res) => {
  var arg = url.parse(req.url, true).query;
  getDetails(arg,res);
});

function getDetails(arg,res) {
  var product_id = arg.product_id;
  var detailUrl = "https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=";
  detailUrl += appKey + "&siteid=0&version=967&ItemID=" + product_id + "&IncludeSelector=Description,Details,ItemSpecifics";
  request(detailUrl,function(error,response,body){
    console.log(typeof body);
              res.send(JSON.parse(body));
  });

}
function buildUrl(arg,res) {
  var keywords = arg.keywords;
  console.log(keywords);
  var minprice = arg.minprice;
  var  maxprice = arg.maxprice;
  var ReturnsAcceptedOnly = arg.return_accepted;
  var FreeShippingOnly = arg.free;
  var ExpeditedShippingType = arg.expedited;
  var New = arg.new;
  var Used = arg.used;
  var Unspecified = arg.Unspecified;
  var Very_good = arg.verygood;
  var Good = arg.good;
  var Acceptable = arg.acceptable;
  var sortOrder="";
  console.log(arg.sortby);
  console.log(typeof(ExpeditedShippingType));

  if (arg.sortby === "Best Match"){
    sortOrder = "BestMatch";
  }else if (arg.sortby ==="Price: highest ﬁrst"){
    sortOrder = "CurrentPriceHighest";
  }else if (arg.sortby ==="Price   Shipping: highest ﬁrst"){
    sortOrder = "PricePlusShippingHighest";
  }else{
    sortOrder = "PricePlusShippingLowest";
  }
  var ebayUrl = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=" + appKey + "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&keywords=";
  ebayUrl += keywords + "&paginationInput.entriesPerPage=120" + "&sortOrder=" + sortOrder;
  var i = -1;
  if(minprice !=""){
    i += 1;
    ebayUrl += "&itemFilter(" + i + ").name=MinPrice&itemFilter(" + i
        + ").value=" + minprice + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" +
        i + ").paramValue=USD";
  }
  if(maxprice !=""){
    i += 1;
    ebayUrl += "&itemFilter(" + i + ").name=MaxPrice&itemFilter(" +
        i + ").value=" + maxprice + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" +
        i + ").paramValue=USD";
  }
  if(ReturnsAcceptedOnly === true){
    i += 1;
    ebayUrl += "&itemFilter(" + i + ").name=ReturnsAcceptedOnly&itemFilter(" +
        i + ").value=" + ReturnsAcceptedOnly;
  }
  if(FreeShippingOnly === true){
    i += 1;
    ebayUrl += "&itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value=" + FreeShippingOnly ;
  }
  if(ExpeditedShippingType === true){
    i += 1;
    ebayUrl += "&itemFilter(" + i + ").name=ExpeditedShippingType&itemFilter(" +
        i + ").value=" + "Expedited";
  }
  if(New || Used || Very_good || Good || Acceptable|| Unspecified){
    i += 1;
    var j = 0;
    ebayUrl += "&itemFilter(" + i + ").name=Condition";
    if(New){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + 1000;
      j += 1;
    }

    if(Used){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + 3000;
      j += 1;
    }

    if(Very_good){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + 4000;
      j += 1;
    }
    if(Good){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + 5000;
      j += 1;
    }
    if(Acceptable){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + 6000;
      j += 1;
    }
    if(Unspecified){
      ebayUrl += "&itemFilter(" + i + ").value(" + j + ")=" + "Unspecified";

    }


  }
  console.log(ebayUrl);



  request(ebayUrl,function(error,response,body){
    var info = check(JSON.parse(body));
    console.log(typeof(body));
    console.log(typeof(info));
    var info_str = JSON.stringify(info);
    res.send(JSON.parse(info_str));
  });
}

function check(body) {

  if(body.findItemsAdvancedResponse[0].ack[0] === 'Success'){
    var items = body.findItemsAdvancedResponse[0].searchResult[0].item;
    var formedItems = [];
    if( (items === undefined || items.length === 0)){
      return body;
    }else{
      for (var i=0; i<items.length; i++ ){
        // console.log(i);
        var title = items[i].title !== undefined;
        var image = items[i].galleryURL !== undefined;
        var location = items[i].location !== undefined;
        var price = items[i].sellingStatus !== undefined;
        var condition = items[i].condition !== undefined;
        if(items[i].shippingInfo !== undefined){
          if((items[i].shippingInfo[0].shippingType!==undefined) &&(items[i].shippingInfo[0].shippingServiceCost!==undefined)&&
              (items[i].shippingInfo[0].shipToLocations!==undefined) && (items[i].shippingInfo[0].expeditedShipping!==undefined) && (items[i].shippingInfo[0].oneDayShippingAvailable!==undefined)){
            var shippingInfo = true;
          }else{
            var shippingInfo = false;
          }
        }else {
          var shippingInfo = false;
        }
        // console.log("list");
        // console.log(listingInfo);
        if(title && image && location && price && shippingInfo){
          formedItems.push(items[i]);
          if(formedItems.length ===50){
            body.findItemsAdvancedResponse[0].searchResult[0].item = formedItems;
            body.findItemsAdvancedResponse[0].searchResult[0]["@count"] = formedItems.length;
            return body;
          }

        }


      }
      //console.log(formedItems.length);
      body.findItemsAdvancedResponse[0].searchResult[0].item = formedItems;
      body.findItemsAdvancedResponse[0].searchResult[0]["@count"] = formedItems.length;
      //console.log(body.findItemsAdvancedResponse[0].searchResult[0]["@count"]);
      //console.log(body.findItemsAdvancedResponse[0].searchResult[0].item.length);
      return body;
    }


  }else{
    return body;
  }
}
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
