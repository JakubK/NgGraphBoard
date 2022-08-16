import { Component } from '@angular/core';
import { CursorMode } from 'src/app/models/cursorMode';
import { CursorService } from 'src/app/services/cursor.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(public readonly cursorService: CursorService) { }

  switchCursor(mode: CursorMode) {
    this.cursorService.activeCursorMode$$.next(mode);
  }
}
