import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'top-bar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
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
