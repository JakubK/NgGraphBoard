import { Component, Input, OnInit } from '@angular/core';
import { Edge } from 'src/app/models/edge';
import { Position } from 'src/app/models/position';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
})
export class EdgeComponent implements OnInit {
  @Input()
  data!: Edge;

  getTextPosition(): Position {
    return {
      x: (this.data.p1.x + this.data.p2.x)/2 + 10,
      y: (this.data.p1.y + this.data.p2.y)/2 - 10
    }
  }

  constructor(private readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

  edgeClick() {
    this.boardService.clickedEdges$$.next(this.data);
  }


}
