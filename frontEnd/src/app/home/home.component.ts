import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AuthenticateService } from "../service/authenticate.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../authGuard/login.auth';
import { BlogService } from "../service/blog.service";
import { EmailService } from '../service/email.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {
  blogs: Array<String>;
  messageClass: String;
  message: String;
  form: FormGroup;
  @Input() filterBy?: String = "all";

  constructor(
    private bs: BlogService,
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private router: Router,
    private authService: AuthenticateService,
    private loginGuard: AuthGuard) {
    this.createForm();
  }

  ngOnInit() {
    this.getAllblogs();
  }
  ngOnChanges() {
    this.getAllblogs();

  }

  getAllblogs() {
    this.bs.getAllblogs().subscribe(data => {
      this.blogs = data.blogs;
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        this.validateEmail
      ])]
    });
  }

  registerEmail() {
    const user = {
      email: this.form.get('email').value
    }

    this.emailService.getEmail(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'red';
        this.message = data.message;
      } else {
        this.messageClass = 'green';
        this.message = data.message;
       setTimeout(() => {
          this.form.reset();
        }, 4000);
      }
    });
  }
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }




}
