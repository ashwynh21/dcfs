import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  toggle: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.toggle = (this.router.routerState.snapshot.url != '/')
  }
}
