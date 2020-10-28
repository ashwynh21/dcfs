import { AfterViewInit, Component } from "@angular/core";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements AfterViewInit {

  color: ThemePalette = 'primary';
  style = 'tab-1';

  constructor() {}

  ngAfterViewInit(): void {
  }

  public tabbing(index: number) {
    this.style = index === 0 ? 'tab-2' : 'tab-1';
  }
}
