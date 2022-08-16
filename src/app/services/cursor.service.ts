import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CursorMode } from '../models/cursorMode';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  activeCursorMode$$ = new BehaviorSubject<CursorMode>(CursorMode.Pointer);

  constructor() { }
}
