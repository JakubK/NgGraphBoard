import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  
  constructor(public readonly boardService: BoardService) { 
    
  }

  ngOnInit(): void {
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.boardService.clickedPosition$$.next({x, y});
  }
}
