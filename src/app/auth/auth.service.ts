import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ilogin, Iregister } from './interface';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000'
  cache = {}
  constructor(private http: HttpClient) { }

  loginUser(data: Ilogin): Observable<any> {
    return this.http
      .post<Ilogin>(this.url + '/auth/signin', data)
      .pipe(catchError(this.handleError));
  }


   registerUser(data: Iregister): Observable<any> {
    return this.http
      .post<Iregister>(this.url + '/auth/signup', data)
      .pipe(catchError(this.handleError));
  }

  getLoggedInUser(): Observable<any> {
    if(this.cache['userId']){
      return of(this.cache['userId'])
    }
    return this.http
      .get<any>(this.url + '/user/loggedIn')
      .pipe(
        tap(x => {
            this.cache['userId'] = x
        }),
        catchError(this.handleError)
      );
  }



  handleError(err: HttpErrorResponse) {
    let message = '';

    if (err.error instanceof ErrorEvent) {
      console.log(err, 'from an instance');
      message = `an error occured: ${err.error.message}`;
    } else {
      console.log(err, 'from not an instance');
      message = err.error;
    }

    return throwError(message);
  }

}
