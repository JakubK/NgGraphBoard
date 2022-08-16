import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  zoom$: Observable<string>;

  constructor(public readonly boardService: BoardService) { 
    this.zoom$ = boardService.zoom$.pipe(
      map(number => number + '%')
    )
  }

  zoomIn() {
    this.boardService.zoomTranslation$.next(10);
  }

  zoomOut() {
    this.boardService.zoomTranslation$.next(-10);
  }
}
