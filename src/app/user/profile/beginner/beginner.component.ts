import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { UserModel } from "../../../models/user.model";
import { merge, Observable } from "rxjs";
import { StartupComponent } from "./startup/startup.component";
import { PersonalComponent } from "./personal/personal.component";
import { FinanceComponent } from "./finance/finance.component";
import { CommitmentComponent } from "./commitment/commitment.component";

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit, AfterViewInit {
  @Input()
  user: UserModel;
  toggle = true;
  index: Observable<number>;

  @ViewChild('pager') pager: ElementRef<HTMLDivElement>;
  @ViewChild('startup') startup: StartupComponent;
  @ViewChild('personal') personal: PersonalComponent;
  @ViewChild('finance') finance: FinanceComponent;
  @ViewChild('commitment') commitment: CommitmentComponent;

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if(this.user) {
      this.index = merge(
        this.startup.emitter.asObservable(),
        this.personal.emitter.asObservable(),
        this.finance.emitter.asObservable(),
        this.commitment.emitter.asObservable()
      );

      this.index.subscribe(index => this.page(index));
      this.page(0);
    }
  }

  page(index: number) {
    const pager = this.pager.nativeElement as HTMLDivElement;
    const height = pager.children[index].getBoundingClientRect().height;

    pager.setAttribute('style', `max-height: ${height}px;`);
    Array.from(pager.children).forEach(page => {
      page.setAttribute('style', `left: -${index * 100}%;`);
    })
  }
}
