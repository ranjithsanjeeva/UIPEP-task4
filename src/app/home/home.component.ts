import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
 })
export class HomeComponent implements OnInit {
    //users = [];
    registerForm: FormGroup;
    user1;
    user2;
    user3;
    submitted = false;
    //returnUrl: string;
    private currentUserSubject: BehaviorSubject<any>;
   

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: HttpClient,
        
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    }
    
    ngOnInit() {
        this.registerForm = this.formBuilder.group({
        message: ['', Validators.required] 
        });

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
            //console.log(JSON.stringify(data))
            this.user1=data
        },
        error => {
            console.log(error)
        })
        
        this.displayUser();
        this.displayPost()
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    deleteUser(id: string) {
        this.http.delete(`http://localhost:3000/`+ id).subscribe(data => {
            this.authenticationService.logout();
            this.router.navigate(['/login']);
            
        });
    }
    get f() { return this.registerForm.controls; }
    onPost() {
        
        
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.submitted = true;
            return;
        }
        this.submitted = false;
        // console.log(this.registerForm.value.message)
        // console.log(this.user1.username)
        // const headers = new HttpHeaders().append('Content-Type', 'application/json');
        // const params = new HttpParams().append('message', this.registerForm.value.message).append('username', this.user1.username);
        this.http.post(`http://localhost:3000/post`, { 
            "message": this.registerForm.value.message,
            "username": this.user1.username,
         }).subscribe(data => {
            console.log(JSON.stringify(data))
            this.ngOnInit()
          })
    }
    // deleteUsers(id: string) {
    //     this.http.delete(`http://localhost:3000/`+ id).subscribe(data => {
    //         // this.authenticationService.logout();
    //         // this.router.navigate(['/login']);
    //         this.displayUser()
    //     });
    // }

    displayUser() {
        this.http.get(`http://localhost:3000/getAllUser`).subscribe(data => {
            //console.log(JSON.stringify(data))
            this.user2=data
          })
    }

    displayPost() {
        console.log("JSON.stringify(data)")
        this.http.get(`http://localhost:3000/post`).subscribe(data => {
            console.log(JSON.stringify(data))
            this.user3=data
          })
    }

    // private loadAllUsers() {
    //     this.userService.getAll()
    //         .pipe(first())
    //         .subscribe(users => this.users = users);
    // }
}