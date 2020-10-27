import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ServicesModule } from './services.module';

@Injectable({
  providedIn: ServicesModule
})
export class ScrollService {
  private s: Subject<Event> = new BehaviorSubject<Event>(undefined);

  constructor() { }

  getscroll(): Observable<Event> {
    return this.s.asObservable().pipe(filter(event => !!event));
  }
  setscroll(event: Event) {
    this.s.next(event);
  }
}
