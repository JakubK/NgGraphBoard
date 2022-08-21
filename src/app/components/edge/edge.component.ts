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

  getTangent(): number {
    let angle = (Math.atan2(this.data.p1.y - this.data.p2.y, this.data.p1.x - this.data.p2.x) * 180/Math.PI) % 360;
    if(angle < 0)
      angle = 360 + angle;
    if(angle > 180 && angle < 270)
      return Math.abs(180 - angle);
    return angle;
  }

  constructor(private readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

  edgeClick() {
    this.boardService.clickedEdges$$.next(this.data);
  }


}
