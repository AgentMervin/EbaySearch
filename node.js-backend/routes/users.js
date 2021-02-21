var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors);
var router = express.Router();
var request=require('request');
var url = require("url");
// var querystring = require("querystring");
appKey = 'YanMo-usc571ho-PRD-22eba4255-594551c0';
/* GET users listing. */
router.get('/', function(req, res) {
  var arg = url.parse(req.url, true).query;
  // ar params = querystring.parse(arg);
  // var forms = req.body;
  // console.log(req);
  // console.log(typeof(forms));
  // console.log(forms['sortby']);
  //
  //请求的方式
  console.log("method - " + req.method);

  //请求的url
  console.log("url - " + req.url);

  //获取参数param
  console.log("params - " + arg.keywords);
  buildUrl(arg,res);

});




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
  var Very_good = arg.verygood;
  var Good = arg.good;
  var Acceptable = arg.acceptable;
  var sortOrder="";
  console.log(sortOrder);
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
  if(New || Used || Very_good || Good || Acceptable){
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
    }


  }
  console.log(ebayUrl);



  request(ebayUrl,function(error,response,body){
    var info = check(JSON.parse(body));
    console.log(typeof(body));
    console.log(typeof(info));
    var info_str = JSON.stringify(info);
    res.json(info_str);
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
        if(items[i].listingInfo !== undefined){
          if((items[i].listingInfo[0].bestOfferEnabled !== undefined) && (items[i].listingInfo[0].buyItNowAvailable !== undefined) && (items[i].listingInfo[0].listingType !== undefined) &&
              (items[i].listingInfo[0].gift !== undefined) && (items[i].listingInfo[0].watchCount !== undefined)){
            var listingInfo = true;
          }else{
            var listingInfo = false;
          }
        }else{
          var listingInfo = false;
        }
        // console.log("list");
        // console.log(listingInfo);
        if(title && image && location && price && condition && listingInfo && shippingInfo){
          formedItems.push(items[i]);
          if(formedItems.length ===100){
            body.findItemsAdvancedResponse[0].searchResult[0].item = formedItems;
            body.findItemsAdvancedResponse[0].searchResult[0]["@count"] = formedItems.length;
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


