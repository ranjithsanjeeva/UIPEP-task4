import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService, AuthenticationService } from '../_services';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';




@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    users = [];
    user1;
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: HttpClient,
        private userService: UserService
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    }

    ngOnInit() {
        // console.log(this.currentUserSubject.getValue())
        // console.log("king")
        const headers = new HttpHeaders().append('Content-Type', 'application/json').append('token',this.currentUserSubject.getValue());
       // this.http.get(`http://localhost:3000/findUsers`,{ headers: headers })
      // const params = new HttpParams().append('username', username).append('password',password);

       this.http.get(`http://localhost:3000/findUsers`, { headers })
       .pipe(map(data => {
        //    console.log("Calling: find user")
        //    console.log(JSON.stringify(user))
           this.user1 = data
       }, error => {
            console.log(error)
       })).subscribe();;
        console.log("king2")
    }

    deleteUser(id: string) {
    //     // this.userService.delete(id)
    //     //     .pipe(first())
    //     //     .subscribe(() => this.loadAllUsers());

    //     const headers = new HttpHeaders().append('Content-Type', 'application/json')
    //    // this.http.get(`http://localhost:3000/findUsers`,{ headers: headers })
    //    const params = new HttpParams().append('id', this.user1._id)

    //    this.http.delete(`http://localhost:3000`, { headers, params })
    //    .pipe(map(data => {
    //     //    console.log("Calling: find user")
    //         console.log(JSON.stringify(data))
    //     //    this.user1 = data
    //    }, error => {
    //         console.log(error)
    //    })).subscribe();;
    this.http.delete(`http://localhost:3000/`+this.user1._id).subscribe(data => {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      });
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}