import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../_services';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    //users = [];
    user1;
    user2;
    private currentUserSubject: BehaviorSubject<any>;
   

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: HttpClient,
        
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    }

    ngOnInit() {
        // console.log(this.currentUserSubject.getValue())
        // console.log("king")
        const headers = new HttpHeaders().append('Content-Type', 'application/json').append('token',this.currentUserSubject.getValue());
       // this.http.get(`http://localhost:3000/findUsers`,{ headers: headers })
      // const params = new HttpParams().append('username', username).append('password',password);

    //    this.http.get(`http://localhost:3000/findUsers`, { headers })
    //    .pipe(map(data => {
    //     //    console.log("Calling: find user")
    //     //    console.log(JSON.stringify(user))
    //        this.user1 = data
    //    }, error => {
    //         console.log(error)
    //    })).subscribe();;
    this.http.get(`http://localhost:3000/findUsers`, { headers }).subscribe(data => {
        console.log(JSON.stringify(data))
        this.user1=data
      },
      error => {
                console.log(error)
            })
    
        this.displayUser();
    }

    deleteUser(id: string) {

    this.http.delete(`http://localhost:3000/`+ id).subscribe(data => {
        // this.authenticationService.logout();
        // this.router.navigate(['/login']);
        this.displayUser()
      });
    }

    displayUser() {
        this.http.get(`http://localhost:3000/getAllUser`).subscribe(data => {
            console.log(JSON.stringify(data))
            this.user2=data
          })
    }

    // private loadAllUsers() {
    //     this.userService.getAll()
    //         .pipe(first())
    //         .subscribe(users => this.users = users);
    // }
}