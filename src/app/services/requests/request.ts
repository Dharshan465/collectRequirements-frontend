import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCounts } from '../../models/request-counts';
import { Observable } from 'rxjs';
import { RequestDetails } from '../../models/request-details';
import { CreateRequest } from '../../models/create-request';

@Injectable({
  providedIn: 'root'
})
export class Request {

  private readonly API_BASE_URL_REQUEST = 'http://localhost:8080/requests';

  constructor(private readonly http: HttpClient) { }

  //API call to get request counts for a specific LC user ID
  getRequestCounts(lcUserId: number) {
    return this.http.get<RequestCounts>(`${this.API_BASE_URL_REQUEST}/counts/${lcUserId}`);
  }

  //API call to get all requests counts for a LnD user ID
  getAllRequestCounts(lndUserId: number) {
    return this.http.get<RequestCounts>(`${this.API_BASE_URL_REQUEST}/all/counts/${lndUserId}`);
  }

  //API call to get all requests for a specific LC user ID
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

  //API call to get all requests for a  LnD user ID
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

  //API to create a new request
  createRequest(payload: CreateRequest): Observable<RequestDetails> {
    return this.http.post<RequestDetails>(`${this.API_BASE_URL_REQUEST}/create`, payload);
  }
}
