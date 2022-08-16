import { Component } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { BoardService } from './board.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  zoom$: Observable<number>;

  constructor(public readonly boardService: BoardService) {
    this.zoom$ = boardService.zoom$.pipe(
      map(zoom => zoom / 100)
    )
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - 24;
    const y = event.clientY - rect.top - 24;
    this.boardService.clickedPosition$$.next({x, y});
  }
}
