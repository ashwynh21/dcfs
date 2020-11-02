import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { merge, Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { SelectCompleteAuthenticate } from "../store/user/authenticate";
import { StartupComponent } from "./startup/startup.component";
import { PersonalComponent } from "./personal/personal.component";
import { FinanceComponent } from "./finance/finance.component";
import { CommitmentComponent } from "./commitment/commitment.component";
import { CompleteComponent } from "./complete/complete.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: Observable<UserModel>
  toggle = true;
  index: Observable<number>;

  @ViewChild('pager') pager: ElementRef<HTMLDivElement>;
  @ViewChild('startup') startup: StartupComponent;
  @ViewChild('personal') personal: PersonalComponent;
  @ViewChild('finance') finance: FinanceComponent;
  @ViewChild('commitment') commitment: CommitmentComponent;
  @ViewChild('complete') complete: CompleteComponent;


  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }
  ngAfterViewInit(): void {
    this.user.subscribe(user => {
      if(user && !this.show(user)) {
        this.index = merge(
          this.startup.emitter.asObservable(),
          this.personal.emitter.asObservable(),
          this.finance.emitter.asObservable(),
          this.commitment.emitter.asObservable()
        );

        this.index.subscribe(index => this.page(index));
        this.page(0);
      }
    })
  }

  page(index: number) {
    const pager = this.pager.nativeElement as HTMLDivElement;
    const height = pager.children[index].getBoundingClientRect().height;

    pager.setAttribute('style', `max-height: ${height}px;`);
    Array.from(pager.children).forEach(page => {
      page.setAttribute('style', `left: -${index * 100}%;`);
    })
  }

  show(user: UserModel): boolean {
    return !!user && !!user?.bio && (!!user?.debt && user.debt.length > 0) && !!user?.income && !!user?.expenses;
  }
}
