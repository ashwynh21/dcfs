import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { merge, Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { SelectCompleteAuthenticate } from "../../store/user/authenticate";
import { StartupComponent } from "./beginner/startup/startup.component";
import { PersonalComponent } from "./beginner/personal/personal.component";
import { FinanceComponent } from "./beginner/finance/finance.component";
import { CommitmentComponent } from "./beginner/commitment/commitment.component";
import { CompleteComponent } from "./beginner/complete/complete.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user: Observable<UserModel>
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }

  show(user: UserModel): boolean {
    return !!user && !!user?.bio && (!!user?.debt && user.debt.length > 0) && !!user?.income && !!user?.expenses;
  }
}
