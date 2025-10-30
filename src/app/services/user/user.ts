import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserParticipantDetails } from '../../models/user-participant-details';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly API_BASE_URL_REQUEST = 'http://localhost:8080/requests';

  private selectedUsersSubject = new Subject<UserParticipantDetails[]>();
  selectedUsers$ = this.selectedUsersSubject.asObservable(); // Expose as Observable

  constructor(private readonly http: HttpClient) { }

  getAllUserDetails():Observable<UserParticipantDetails[]> {
    return this.http.get<UserParticipantDetails[]>(`${this.API_BASE_URL_REQUEST}/users`);

  }

    /**
   * Emits the list of users selected in the modal.
   * @param users The list of UserParticipantDetails objects selected.
   */
  notifyUsersSelected(users: UserParticipantDetails[]): void {
    this.selectedUsersSubject.next(users);
  }



}
