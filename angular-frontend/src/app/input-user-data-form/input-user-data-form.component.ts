import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {createViewChild} from '@angular/compiler/src/core';

@Component({
  selector: 'app-input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {
  page = 1;
  registered = false;
  submitted = false;
  userForm: FormGroup;
  serviceErrors: any = {};
  searchResult: any = {};
  selectResult = true;
  @ViewChild('result', {static: true}) result;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }

  invalidKeyWord() {
    return this.submitted && this.userForm.controls.keywords.errors != null;
  }

  invalidMinPrice() {
    const minPrice = this.userForm.get('minprice').value;
    const maxPrice = this.userForm.get('maxprice').value;
    let largerZero = false;

    if ((minPrice !== '' && parseFloat(minPrice) < 0.0) || (maxPrice !== '' && parseFloat(maxPrice) < 0.0)) {
      largerZero = true;
    } else if (minPrice !== '' && maxPrice !== '') {
      if (parseFloat(minPrice) > parseFloat(maxPrice)) {
        largerZero = true;
      }
    }
    return this.submitted && largerZero;
  }


  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      keywords: ['', Validators.required],
      minprice: [''],
      maxprice: [''],
      New: [''],
      used: [''],
      verygood: [''],
      good: [''],
      acceptable: [''],
      return: [''],
      freeship: [''],
      expship: [''],
      sortby: ['Best Match']
    });
  }
  Onreset(){
    this.ngOnInit();
    this.result.update('{}', '');
    this.submitted = false;
  }
  onSubmit() {
    this.result.update('{}', '');
    this.submitted = true;
    this.selectResult = true;
    const formUrl = 'https://csci5710hw8-yan.wl.r.appspot.com/users?keywords=' + this.userForm.value.keywords + '&minprice=' + this.userForm.value.minprice + '&maxprice=' + this.userForm.value.maxprice + '&new=' + this.userForm.value.New + '&used=' + this.userForm.value.used + '&verygood=' + this.userForm.value.verygood + '&good=' + this.userForm.value.good + '&acceptable=' + this.userForm.value.acceptable + '&return_accepted=' + this.userForm.value.return + '&free=' +
      this.userForm.value.freeship + '&expedited=' + this.userForm.value.expship + '&sortby=' + this.userForm.value.sortby;

    {
      console.log(this.userForm.value);
      this.http.get(formUrl).subscribe((response: any) => {
        // console.log("hello");
        console.log(response);
        this.searchResult = JSON.parse(response);
        console.log(this.searchResult);
        this.result.update(response, this.userForm.get('keywords').value);
      });
      this.registered = true;
      this.registered = true;
    }
  }

}
