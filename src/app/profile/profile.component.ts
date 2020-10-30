import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { SelectCompleteAuthenticate } from "../store/user/authenticate";
import { StartupComponent } from "./startup/startup.component";
import { IncomeComponent } from "./income/income.component";
import { PersonalComponent } from "./personal/personal.component";
import { FinanceComponent } from "./finance/finance.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: Observable<UserModel>
  toggle = true;

  @ViewChild('pager') pager: ElementRef<HTMLDivElement>;
  @ViewChild('startup') startup: StartupComponent;
  @ViewChild('personal') personal: PersonalComponent;
  @ViewChild('finance') finance: FinanceComponent;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }
  ngAfterViewInit(): void {
    this.startup.emitter.subscribe(index => {
      this.page(index);
    })
    this.personal.emitter.subscribe(index => {
      this.page(index);
    })
    this.finance.emitter.subscribe(index => {
      this.page(index);
    })
  }

  page(index: number) {
    const pager = this.pager.nativeElement;

    pager.setAttribute('style', `left: -${index * 100}%`);
  }
}
