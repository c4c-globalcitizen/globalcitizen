/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor (private router: Router, private user:UserService) {

  }

  loginUser(e){
    e.preventDefault();
  	console.log(e);
  	var username = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
    var userType = e.target.elements[2].value;
    console.log("******************************************************");
    console.log("Values Obtained from Form");
    console.log("username: "+username);
    console.log("password: "+password);
    console.log("Usertype :" + userType);
    console.log("******************************************************");
  	if(username == 'admin' && password == 'admin') {
      this.user.setUserLoggedIn();
      //Set the belwo value base on the Selection.
      if(userType == 'Global Citizen'){
        this.router.navigate(['GlobalCitizen']);
      } else if(userType == 'Government') {
        this.router.navigate(['GovOrg']);
      } else {
        this.router.navigate(['AidOrg']);
      }
  		
  	}    
  }

}
