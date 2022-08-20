import { Component, Input, OnInit } from '@angular/core';
import { Edge } from 'src/app/models/edge';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
})
export class EdgeComponent implements OnInit {
  @Input()
  data!: Edge;
  constructor(private readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

  edgeClick() {
    this.boardService.clickedEdges$$.next(this.data);
  }

}
