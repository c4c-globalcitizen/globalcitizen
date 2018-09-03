import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { ProjectPledge } from '../org.global.citizens.net';


// Can be injected into a constructor
@Injectable()
export class DashboardForGovService {
  private NAMESPACE = 'ProjectPledge';

  constructor(private dataService: DataService<ProjectPledge>) {
  };

  public getAll(): Observable<ProjectPledge[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAsset(id: any): Observable<ProjectPledge> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<ProjectPledge> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateAsset(id: any, itemToUpdate: any): Observable<ProjectPledge> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<ProjectPledge> {
    return this.dataService.delete(this.NAMESPACE, id);
  }
}