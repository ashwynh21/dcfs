import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  signup: FormGroup;

  constructor(private builder: FormBuilder) {
    this.signup = builder.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      access: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

}
