import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService, AuthenticationService } from '../_services';
import { map } from 'rxjs/operators';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    users = [];
    user1;
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    }

    ngOnInit() {
        console.log(this.currentUserSubject.getValue())
        console.log("king")
        const headers = new HttpHeaders().append('Content-Type', 'application/json').append('token',this.currentUserSubject.getValue());
       // this.http.get(`http://localhost:3000/findUsers`,{ headers: headers })
      // const params = new HttpParams().append('username', username).append('password',password);

       this.http.get(`http://localhost:3000/findUsers`, { headers })
       .pipe(map(user => {
           console.log("Calling: find user")
           console.log(JSON.stringify(user))
           this.user1 = user
       })).subscribe(data => {
        console.log("Data:")
        console.log(JSON.stringify(data))
       
    },
    error => {

        console.log(error)
    });;
        console.log("king2")
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}