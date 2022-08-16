import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CursorMode } from '../models/cursorMode';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  activeCursorMode$$ = new BehaviorSubject<CursorMode>(CursorMode.Pointer);

  constructor() { }

  switchToPointer() {
    if(this.activeCursorMode$$.getValue() === CursorMode.AddNode)
      this.activeCursorMode$$.next(CursorMode.Pointer);
  }
}
