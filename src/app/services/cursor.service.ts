import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CursorMode } from '../models/cursorMode';
import { Node } from '../models/node';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  activeCursorMode$$ = new BehaviorSubject<CursorMode>(CursorMode.Pointer);
  clickedNodes$$ = new Subject<Node>();


  switchToPointer() {
    if(this.activeCursorMode$$.getValue() === CursorMode.AddNode)
      this.activeCursorMode$$.next(CursorMode.Pointer);
  }
}
