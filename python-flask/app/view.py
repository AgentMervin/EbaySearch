from flask import Flask, request, jsonify, make_response
import requests
import json

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/static')
appKey = 'YanMo-usc571ho-PRD-22eba4255-594551c0'
string_a = ''


@app.route('/img/default.jpg', methods=['GET', 'POST'])
def upload_defalut():
    return app.send_static_file('img/default.jpg')


@app.route('/img/redirect.png', methods=['GET', 'POST'])
def upload_redirct():
    return app.send_static_file('img/redirect.png')


@app.route('/img/topRatedImage.png', methods=['GET', 'POST'])
def upload_top():
    return app.send_static_file('img/topRatedImage.png')

@app.route('/img/exit.jpg', methods=['GET', 'POST'])
def upload_exit():
    return app.send_static_file('img/exit.jpg')


@app.route('/img/eBayLogo.png', methods=['GET', 'POST'])
def upload_ebay_logo():
    return app.send_static_file('img/eBayLogo.png')


@app.route('/j08/hw6.js', methods=['GET', 'POST'])
def upload_js():
    return app.send_static_file('hw6.js')


@app.route('/j08/style.css', methods=['GET', 'POST'])
def upload_css():
    return app.send_static_file('style.css')


@app.route('/search08', methods=['GET', 'POST'])
def form():
    return app.send_static_file('index.html')


@app.route('/query', methods=['GET', 'POST'])
def search():
    keywords = request.args.get("keywords")
    priceMin = request.args.get("minprice")
    priceMax = request.args.get("maxprice")
    newItem = None if (request.args.get("new") == "false") else "1000"
    usedItem = None if (request.args.get("used") == "false") else "3000"
    print(newItem)
    print("hello world")
    verygood = None if (request.args.get("verygood") == "false") else "4000"
    print(verygood)
    print("hello world")
    good = None if (request.args.get("good") == "false") else "5000"
    acceptable = None if (request.args.get("acceptable") == "false") else "6000"
    return_accepted = "false" if request.args.get("return_accepted") == "false" else "true"
    freeShipping = "false" if request.args.get("free") == "false" else "true"
    expeShipping = "false" if request.args.get("expedited") == "false" else "Expedited"
    sortOrder = request.args.get("sortby")
    print(sortOrder)
    if sortOrder == "Best Match":
        sortOrder = "BestMatch"
    elif sortOrder == "Price: highest first":
        sortOrder = "CurrentPriceHighest"
    elif (sortOrder == "Price   Shipping: highest first"):
        sortOrder = "PricePlusShippingHighest"
    else:
        sortOrder = "PricePlusShippingLowest"

    ebayUrl = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=" + appKey + "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&keywords="
    ebayUrl += keywords + "&paginationInput.entriesPerPage=30" + "&sortOrder=" + sortOrder

    i = -1
    #print(priceMin)
    if (priceMin != ""):
        i += 1
        ebayUrl += "&itemFilter(" + str(i) + ").name=MinPrice&itemFilter(" + str(
            i) + ").value=" + priceMin + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(
            i) + ").paramValue=USD"
    if (priceMax != ""):
        i += 1
        ebayUrl += "&itemFilter(" + str(i) + ").name=MaxPrice&itemFilter(" + str(
            i) + ").value=" + priceMax + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(
            i) + ").paramValue=USD"
    if return_accepted == "true":
        i += 1
        ebayUrl += "&itemFilter(" + str(i) + ").name=ReturnsAcceptedOnly&itemFilter(" + str(
            i) + ").value=" + return_accepted
    if freeShipping == "true":
        i += 1
        ebayUrl += "&itemFilter(" + str(i) + ").name=FreeShippingOnly&itemFilter(" + str(i) + ").value=" + freeShipping
    if expeShipping == "Expedited":
        i += 1
        ebayUrl += "&itemFilter(" + str(i) + ").name=ExpeditedShippingType&itemFilter(" + str(
            i) + ").value=" + expeShipping
    if newItem or usedItem or verygood or good or acceptable:
        i += 1
        j = 0
        ebayUrl += "&itemFilter(" + str(i) + ").name=Condition"
        if newItem:
            ebayUrl += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=" + newItem
            j += 1
        if usedItem:
            ebayUrl += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=" + usedItem
            j += 1
        if verygood:
            ebayUrl += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=" + verygood
            j += 1
        if good:
            ebayUrl += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=" + good
            j += 1
        if acceptable:
            ebayUrl += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=" + acceptable
            j += 1

    print(ebayUrl)
    r = requests.get(ebayUrl)
    wholeInfo=filter_item(r.json())
    resp = make_response(wholeInfo)  # 请求处理成功后，返回'OK'到html中显示
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET'  # 响应POST
    # global string_a
    # string_a = json.dumps(r.json())
    return resp

def filter_item(text):
    ackContent = text["findItemsAdvancedResponse"][0]["ack"][0]
    if ackContent != "Success":
        return json.loads("We can't find the items")
    else:
        if text["findItemsAdvancedResponse"][0]["paginationOutput"][0]["totalEntries"][0]=="0":
            return text;
        else:
            items = text["findItemsAdvancedResponse"][0]["searchResult"][0]["item"]
            j = 1
            formedItems = []
            for i in range(len(items)):
                title = "title" in items[i].keys()
                redirection = "viewItemURL" in items[i].keys()
                condition ="condition" in items[i].keys()
                topRated = "topRatedListing" in items[i].keys()
                accept="returnsAccepted" in items[i].keys()
                shippingService="shippingServiceCost" in items[i]["shippingInfo"][0].keys()
                expeditedService="expeditedShipping" in items[i]["shippingInfo"][0].keys()
                price = "convertedCurrentPrice" in items[i]["sellingStatus"][0].keys()
                shippingCost = "shippingServiceCost" in items[i]["shippingInfo"][0].keys()
                if (title and redirection and condition and topRated and accept and shippingCost and shippingService and price and expeditedService ):
                    formedItems.append(items[i])
                    if (len(formedItems) == 10):
                        text["findItemsAdvancedResponse"][0]["searchResult"][0]["item"] = formedItems
                        text["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"] = 10
                        return text
            text["findItemsAdvancedResponse"][0]["searchResult"][0]["item"] = formedItems
            text["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"] = len(formedItems)
            return text

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080,debug=True)
