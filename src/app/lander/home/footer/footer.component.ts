import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  form: FormGroup;

  constructor(private builder: FormBuilder) {
    this.form = builder.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', [Validators.required]],
      message: ['']
    })
  }

  ngOnInit(): void {
  }

}
