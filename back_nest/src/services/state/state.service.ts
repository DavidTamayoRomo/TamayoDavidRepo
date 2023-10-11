import { Injectable  } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { lastValueFrom } from 'rxjs';

@Injectable()
export class StateService {
    constructor(
        private httpService: HttpService,
        private configService:ConfigService
    ){}

    getUrlStatus():string{
        return this.configService.get<string>('URL_API_FAKE','no existe')
    }

    async getStatusCodeById(id:number){
        const {data}= await lastValueFrom(this.httpService.get(`${this.getUrlStatus()}/serviceStatus/${id}`));
        return data;    
    }

}
