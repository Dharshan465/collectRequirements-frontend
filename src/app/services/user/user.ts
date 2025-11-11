import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserParticipantDetails } from '../../models/user-participant-details';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly API_BASE_URL_REQUEST = 'http://localhost:8080/requests';


  // declaring a Subject to hold selected users
  private selectedUsersSubject = new Subject<UserParticipantDetails[]>();

  //declaring an Observable for components to subscribe to selected users
  selectedUsers$ = this.selectedUsersSubject.asObservable(); 

  constructor(private readonly http: HttpClient) { }

  getAllUserDetails():Observable<UserParticipantDetails[]> {
    return this.http.get<UserParticipantDetails[]>(`${this.API_BASE_URL_REQUEST}/users`);

  }

  notifyUsersSelected(users: UserParticipantDetails[]): void {
    this.selectedUsersSubject.next(users);
  }



}
