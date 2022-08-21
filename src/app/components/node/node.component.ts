import { Component, Input } from '@angular/core';
import { Node } from 'src/app/models/node';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: '[node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input()
  data!: Node;

  constructor(private readonly boardService: BoardService) { }

  nodeClick(e: MouseEvent): void {
    this.boardService.clickedNodes$$.next(this.data);
    e.stopPropagation();
  }
}
