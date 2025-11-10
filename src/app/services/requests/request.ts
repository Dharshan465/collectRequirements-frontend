import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCounts } from '../../models/request-counts';
import { Observable } from 'rxjs';
import { RequestDetails } from '../../models/request-details';
import { CreateRequest } from '../../models/create-request';
import { EditRequest } from '../../models/edit-request';

@Injectable({
  providedIn: 'root'
})
export class Request {

  private readonly API_BASE_URL_REQUEST = 'http://localhost:8080/requests';

  constructor(private readonly http: HttpClient) { }

  getRequestCounts(lcUserId: number) {
    return this.http.get<RequestCounts>(`${this.API_BASE_URL_REQUEST}/counts/${lcUserId}`);
  }

  getAllRequestCounts(lndUserId: number) {
    return this.http.get<RequestCounts>(`${this.API_BASE_URL_REQUEST}/all/counts/${lndUserId}`);
  }

  getRequests(
    lcUserId: number,
    status?: string,
    departmentName?: string,
    eventName?: string,
    fromDate?: string, 
    toDate?: string
  ) :Observable<RequestDetails[]> {
    let params = new HttpParams();

    if (status) {
      params = params.append('status', status);
    }
    if (departmentName) {
      params = params.append('departmentName', departmentName);
    }
    if (eventName) {
      params = params.append('eventName', eventName);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
    }
    if (toDate) {
      params = params.append('toDate', toDate);
    }

    return this.http.get<RequestDetails[]>(`${this.API_BASE_URL_REQUEST}/${lcUserId}`, { params });
  }

  getAllRequests(
    lndUserId: number,
    status?: string,
    requestorName?: string,
    departmentName?: string,
    eventName?: string,
    fromDate?: string, 
    toDate?: string
  ) :Observable<RequestDetails[]> {

  let params = new HttpParams();

    if (status) {
      params = params.append('status', status);
    }
    if(requestorName) {
      params = params.append('requestorName', requestorName);
      console.log('Added requestorName to params:', requestorName);
    }
    if (departmentName) {
      params = params.append('departmentName', departmentName);
    }
    if (eventName) {
      params = params.append('eventName', eventName);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
    }
    if (toDate) {
      params = params.append('toDate', toDate);
    }
    console.log('Constructed HTTP params:', params.toString());

    return this.http.get<RequestDetails[]>(`${this.API_BASE_URL_REQUEST}/all/${lndUserId}`, { params });
    
  }

  createRequest(payload: CreateRequest): Observable<RequestDetails> {
    return this.http.post<RequestDetails>(`${this.API_BASE_URL_REQUEST}/create`, payload);
  }

  editRequest(requestId: number, payload: EditRequest): Observable<RequestDetails> {
    console.log('Request Service - editRequest called with:');
    console.log('Request ID:', requestId);
    console.log('Payload:', payload);
    console.log('API URL:', `${this.API_BASE_URL_REQUEST}/edit/${requestId}`);
    
    return this.http.put<RequestDetails>(`${this.API_BASE_URL_REQUEST}/edit/${requestId}`, payload);
  }

  getRequest(requestId: number): Observable<RequestDetails> {
    return this.http.get<RequestDetails>(`${this.API_BASE_URL_REQUEST}/id/${requestId}`);
  }



}
