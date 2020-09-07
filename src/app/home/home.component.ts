import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';

@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
 })
export class HomeComponent implements OnInit {
    //users = [];
    registerForm1: FormGroup;
    registerForm2: FormGroup;
    myDetails;
    user;
    post;
    comment;
    submitted = false;
    showCommentVisibity = false;
    // likes;
    // countLike=0;
    share
    // output = document.getElementById("comment")
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
        this.registerForm1 = this.formBuilder.group({
        message: ['', Validators.required] 
        });

        this.registerForm2 = this.formBuilder.group({
            comment: ['', Validators.required] 
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
            this.myDetails=data
        },
        error => {
            console.log(error)
        })
        
        this.displayUser();
        this.displayPost();
        this.displayComment();
        // this.displayLike()
        // this.displayShare()
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    deleteUser(id: string) {
        this.http.delete(`http://localhost:3000/`+ id).subscribe(data => {
            this.authenticationService.logout();
            this.router.navigate(['/login']);
            
        });
    }
    get f() { return this.registerForm1.controls; }

    onPost() {
        
        // stop here if form is invalid
        if (this.registerForm1.invalid) {
            this.submitted = true;
            return;
        }
        this.submitted = false;
        // console.log(this.registerForm.value.message)
        // console.log(this.user1.username)
        // const headers = new HttpHeaders().append('Content-Type', 'application/json');
        // const params = new HttpParams().append('message', this.registerForm.value.message).append('username', this.user1.username);
        this.http.post(`http://localhost:3000/post`, { 
            "message": this.registerForm1.value.message,
            "username": this.myDetails.username,
         }).subscribe(data => {
            //console.log(JSON.stringify(data))

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
            //console.log("JSON.stringify(data1)")
            this.user=data
          })
    }

    displayPost() {
        //console.log("JSON.stringify(data)")
        this.http.get(`http://localhost:3000/post`).subscribe(data => {
            //console.log("SON.stringify(data2)")
            this.post=data
            this.post.map((post)=>{
                post.showCommentBox = false
                post.liked = false
            })
          })
    }


    onCommentClick(user) {
        // this.user3.map((post)=> {

        // })
        user.showCommentBox = ! user.showCommentBox ;
        // this.showCommentVisibity = !this.showCommentVisibity;
        // this.output.style.visibility = "visible";
    }

    onComment(postId,commentowner) {
        //console.log("theking")
        if (this.registerForm2.invalid) {
            return;
        }
        // console.log(this.registerForm2.value.comment)
        // console.log(postId)
        // console.log(commentowner)
        // console.log(this.user1.username)
        // const headers = new HttpHeaders().append('Content-Type', 'application/json');
        // const params = new HttpParams().append('message', this.registerForm.value.message).append('username', this.user1.username);
        this.http.post(`http://localhost:3000/comment`, { 
            "comment": this.registerForm2.value.comment,
            "postId": postId,
            "commentowner": commentowner,
         }).subscribe(data => {
            //console.log(JSON.stringify(data))
            this.ngOnInit()
          })
    }

    displayComment() {
        //console.log("JSON.stringify(data)NANU")
        this.http.get(`http://localhost:3000/comment`).subscribe(data => {
            //console.log("JSON.stringify(data3)")
            this.comment=data
            // this.post.map((post)=>{
            //     post.showCommentBox = false
            // })

          })
    }

    // onLike(user,like) {
    //     console.log("hello")
    //     console.log(like.liked)
    //     like.liked=!like.liked;
    //     console.log(like.liked)
    //     this.http.post(`http://localhost:3000/like`, { 
    //         "liked": like.liked,
    //         "postId": user._id,
    //         "likerId": this.myDetails._id,
    //         "likerUsername": this.myDetails.username,
    //      }).subscribe(data => {
    //         this.ngOnInit()
    //         //console.log(JSON.stringify(data))
            
    //     })
        
    // }
    // displayLike() {
    //     this.http.get(`http://localhost:3000/like`).subscribe(data => {
    //         //console.log(JSON.stringify(data))
    //         this.likes=data
    //         // this.post.map((post)=>{
    //         //     post.showCommentBox = false
    //         // })
    //       })

    // }

    onShare(user) {
        this.http.post(`http://localhost:3000/share`, { 
            "message": user.message,
            "username": this.myDetails.username,
            "postOwner": user.username,
            "postId" : user._id
         }).subscribe(data => {
            //console.log(JSON.stringify(data))

            this.ngOnInit()
          })

    }

    // displayShare() {
    //     //console.log("JSON.stringify(data)")
    //     this.http.get(`http://localhost:3000/share`).subscribe(data => {
    //         //console.log(JSON.stringify(data))
    //         this.share=data
    //       })
    // }
    // private loadAllUsers() {
    //     this.userService.getAll()
    //         .pipe(first())
    //         .subscribe(users => this.users = users);
    // }
}