import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit{
  data = '{}';
  keywords = '';
  selectPage = 1;
  jsonObj: any ;
  items = [];
  errorInfo = '';
  noFoundInfo = '';
  selectedId = -1;
  success = false;
  pages = [];
  detailCard = [];
  pagehiden = [];

  constructor() {
  }

  update(data: string, keywords: string) {
    this.data = data;
    this.keywords = keywords;
    this.selectPage = 1;
    this.errorInfo = '';
    this.noFoundInfo = '';
    this.selectedId = -1;
    this.items = [];
    // console.log(this.data);
    this.jsonObj = JSON.parse(this.data);
    this.detailCard = [];
    // console.log(this.jsonObj.findItemsAdvancedResponse);
    // console.log(this.jsonObj.findItemsAdvancedResponse !== undefined);
    if (this.jsonObj.findItemsAdvancedResponse !== undefined) {
      this.success = this.jsonObj.findItemsAdvancedResponse[0].ack[0] === 'Success';
      console.log(this.success);
      if (this.success) {
        // console.log('get true');
        const items = this.jsonObj.findItemsAdvancedResponse[0].searchResult[0].item;
        console.log(items);
        if (items === undefined || items.length === 0) {
          this.noFoundInfo = 'No exact matches found';
        } else {
          this.parseItem(items);
          this.createDisplayItems();
          console.log('success');
        }
      } else {
        this.errorInfo = this.jsonObj.findItemsAdvancedResponse[0].errorMessage[0].error[0].message[0];
        console.log('error');
      }
    }else{
      console.log('error');
    }
  }



  ngOnInit(): void {
  }
  resetDetails(){
    for (let v = 0; v < this.detailCard.length; v++){
      this.detailCard[v] = false;
    }
  }





  parseItem(items){
    const len = items.length;
    this.detailCard = [];
    for (let i = 0; i < len; i++){
      this.detailCard.push(false);
      const basicinfo = [];
      if (items[i].galleryURL[0] === 'https://thumbs1.ebaystatic.com/pict/04040_0.jpg'){
        basicinfo.push('../../assets/ebayDefault.png');
      }else{
        basicinfo.push(items[i].galleryURL[0]);
      }
      basicinfo.push(items[i].title[0]);
      basicinfo.push('Price: $' + items[i].sellingStatus[0].currentPrice[0].__value__);
      basicinfo.push(items[i].location[0]);
      basicinfo.push(items[i].viewItemURL[0]);
      basicinfo.push(items[i].primaryCategory[0].categoryName[0]);
      basicinfo.push(items[i].condition[0].conditionDisplayName[0]);
      //
      basicinfo.push(items[i].shippingInfo[0].shippingType[0]);
      basicinfo.push(items[i].shippingInfo[0].shippingServiceCost[0].__value__);
      basicinfo.push(items[i].shippingInfo[0].shipToLocations[0]);
      basicinfo.push(items[i].shippingInfo[0].expeditedShipping[0]);
      console.log(items[i].shippingInfo[0].expeditedShipping[0]);
      basicinfo.push(items[i].shippingInfo[0].oneDayShippingAvailable[0]);
      // list info
      basicinfo.push(items[i].listingInfo[0].bestOfferEnabled[0]);
      basicinfo.push(items[i].listingInfo[0].buyItNowAvailable[0]);
      basicinfo.push(items[i].listingInfo[0].listingType[0]);
      basicinfo.push(items[i].listingInfo[0].gift[0]);
      basicinfo.push(items[i].listingInfo[0].watchCount[0]);
      this.items.push(basicinfo);
    }



  }
  createDisplayItems(){
    this.pages = [];
    console.log(this.items.length);
    const maxPage = this.items.length / 5 + 1;
    for (let i = 1; i < maxPage; i++){
      this.pages.push(i);
      this.pagehiden.push(false);
    }
    // this.displayItems = [];
  }
  showInfo(i){
    this.detailCard[i] = true;
    console.log(this.detailCard[i]);
  }
  hideInfo(i){
    this.detailCard[i] = false;
    console.log(this.detailCard[i]);
  }

}

