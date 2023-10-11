import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class FileService {
    constructor(
        private http: HttpClient,
    ) { }

    uploadFile(file: any) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post(`${environment.back}/files`, formData)
    }
};