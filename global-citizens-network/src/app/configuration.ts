import { Injectable } from '@angular/core';

@Injectable()

//provides configurate to composer rest server
export class Configuration {
    public ApiIP: string = "http://173.193.75.67";
    public ApiPort: string = "31090";
    public Server: string = this.ApiIP+":"+this.ApiPort;
    public ApiUrl: string = "/api/";
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}
