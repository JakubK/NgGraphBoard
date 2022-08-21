import { Component } from '@angular/core';
import { CursorMode } from 'src/app/models/cursorMode';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(public readonly boardService: BoardService) { }

  switchCursor(mode: CursorMode) {
    this.boardService.activeCursorMode$$.next(mode);
  }
}
