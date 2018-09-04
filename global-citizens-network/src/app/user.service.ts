import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  private userNAme;

  constructor() { 
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(){
    this.isUserLoggedIn = true;
  }

  getUserName() {
    this.getUserName;
  }

  getUserLoggedIn(){
    return this.isUserLoggedIn;
  }

}
