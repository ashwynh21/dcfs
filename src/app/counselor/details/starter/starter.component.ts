import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { UserModel } from "../../../models/user.model";
import { merge, Observable } from "rxjs";
import { BeginComponent } from "./begin/begin.component";
import { ProvideComponent } from "./provide/provide.component";

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements AfterViewInit {
  @Input()
  user: UserModel;
  index: Observable<number>;

  @ViewChild('pager') pager: ElementRef<HTMLDivElement>;
  @ViewChild('begin') begin: BeginComponent;
  @ViewChild('provide') provide: ProvideComponent;

  constructor() { }

  ngAfterViewInit(): void {
    if(this.user) {
      this.index = merge(
        this.begin.emitter.asObservable(),
        this.provide.emitter.asObservable()
      );

      this.index.subscribe(index => this.page(index));
      this.page(0);
    }
  }

  page(index: number) {
    const pager = this.pager.nativeElement as HTMLDivElement;
    console.log(pager);
    const height = pager.children[index].getBoundingClientRect().height;

    pager.setAttribute('style', `max-height: ${height}px;`);
    Array.from(pager.children).forEach(page => {
      page.setAttribute('style', `left: -${index * 100}%;`);
    })
  }

}
