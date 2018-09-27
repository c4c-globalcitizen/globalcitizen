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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GovOrgService } from './GovOrg.service';
import { ProjectPledgeService } from '../ProjectPledge/ProjectPledge.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-govorg',
  templateUrl: './GovOrg.component.html',
  styleUrls: ['./GovOrg.component.css'],
  providers: [GovOrgService,ProjectPledgeService]
})
export class GovOrgComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private pledge;
  private allPledges;
  private errorMessage;
  private selectedPledges;
  

  govOrgId = new FormControl('', Validators.required);
  fundedPledges = new FormControl('', Validators.required);
  projectPledge = new FormControl('', Validators.required);


  constructor(public serviceGovOrg: GovOrgService, public pledgeService : ProjectPledgeService, fb: FormBuilder) {
    this.myForm = fb.group({
      govOrgId: this.govOrgId,
      fundedPledges: this.fundedPledges,
      projectPledge: this.projectPledge
    });
    this.selectedPledges = []; 
  };

  ngOnInit(): void {
    this.getPledge();
    this.loadAll();
  }

  getPledge(): Promise<any> {
    const tempList = [];
    //alert('getPledge');
    return this.pledgeService.getAll()
    .toPromise()
    .then ((result) => {
      result.forEach(pledge => {
        tempList.push(pledge);
      });
      this.allPledges = tempList;
      //alert(JSON.stringify(this.allPledges));
    }
    )
    .catch((error) => {
     if (error === 'Server error') {
       this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
     } else if (error === '404 - Not Found') {
       this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
     } else {
       this.errorMessage = error;
     }
   });
   }

   getPledgetID(pledge: String) {
     return pledge.substring(pledge.indexOf('#')+1);
   }


   mapGovOrgWithPledge(){
    for(let i=0; i < this.allParticipants.length;i++){
      if(!this.allParticipants[i].fundsRequired || this.allParticipants[i].fundsRequired.value==undefined ) {
        //This is not a proper way to fix this 
        //Need to keep the the fundsRequired as undefined.
        this.allParticipants[i].fundsRequired = null;
      }
      let govPledge = this.getPledgetID(this.allParticipants[i].projectPledge.value);
      for(let i;i<this.allPledges.length;i++) {
        if(govPledge==this.allPledges[i].projectPledge){
          this.selectedPledges.push(this.allPledges[i]);
        }
      }
    }
    //alert("After comparision!");
   // alert(JSON.stringify(this.selectedPledges));
   }

 
  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceGovOrg.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
        this.allParticipants = tempList;
        //alert(JSON.stringify(this.allParticipants));
        this.mapGovOrgWithPledge(); 
      });
    } )
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.global.citizens.net.GovOrg',
      'govOrgId': this.govOrgId.value,
      'fundedPledges': this.fundedPledges.value,
      'projectPledge': this.projectPledge.value
    };

    this.myForm.setValue({
      'govOrgId': null,
      'fundedPledges': null,
      'projectPledge': null
    });

    return this.serviceGovOrg.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'govOrgId': null,
        'fundedPledges': null,
        'projectPledge': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.global.citizens.net.GovOrg',
      'fundedPledges': this.fundedPledges.value,
      'projectPledge': this.projectPledge.value
    };

    return this.serviceGovOrg.updateParticipant(form.get('govOrgId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceGovOrg.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceGovOrg.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'govOrgId': null,
        'fundedPledges': null,
        'projectPledge': null
      };

      if (result.govOrgId) {
        formObject.govOrgId = result.govOrgId;
      } else {
        formObject.govOrgId = null;
      }

      if (result.fundedPledges) {
        formObject.fundedPledges = result.fundedPledges;
        alert('Sunny'+result.fundedPledges);
      } else {
        formObject.fundedPledges = null;
      }

      if (result.projectPledge) {
        formObject.projectPledge = result.projectPledge;
      } else {
        formObject.projectPledge = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'govOrgId': null,
      'fundedPledges': null,
      'projectPledge': null
    });
  }
}
