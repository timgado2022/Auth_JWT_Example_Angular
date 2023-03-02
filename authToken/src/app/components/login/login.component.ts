import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService
  ) { 
      // redirect to home if already logged in
      if (this.authenticationService.userValue) { 
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }
   // convenience getter for easy access to form fields
 //  get f() { return this.loginForm.controls; }
   get f(): { [key: string]: AbstractControl; }
   {
       return this.loginForm.controls;
   }
 
  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.error = '';
      this.loading = true;
      let username = this.loginForm.controls['username'].value; 
      let password =this.loginForm.controls['password'].value; 
 
      this.authenticationService.login(username, password)
          .pipe(first())
          .subscribe({
              next: () => {
                  // get return url from route parameters or default to '/'
                  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                  this.router.navigate([returnUrl]);
              },
              error: error => {
                  this.error = error;
                  this.loading = false;
              }
          });
  }
}
